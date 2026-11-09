/*
 * Trang danh sách sản phẩm – bộ lọc kiểu Phong Vũ.
 *
 *  - Lọc đa chọn: Danh mục, Thương hiệu, Thông số (Socket, Loại RAM...), Tình trạng.
 *  - Khoảng giá có ô nhập + thanh trượt 2 đầu, lọc theo GIÁ BÁN THỰC TẾ (đã trừ khuyến mãi).
 *  - Mỗi lựa chọn hiển thị số sản phẩm tương ứng (đếm theo các bộ lọc còn lại).
 *  - Chip bộ lọc đang chọn + "Xóa tất cả".
 *  - Toàn bộ bộ lọc được lưu trên URL (chia sẻ link / tải lại trang vẫn giữ nguyên).
 *  - Tìm kiếm không phân biệt dấu tiếng Việt, tự lọc khi gõ (debounce).
 *
 * Toàn bộ mã nằm trong IIFE để không đụng tên biến global với các script legacy khác
 * (api.js, header-auth.js, support-chat.js... cùng chạy chung 1 scope global).
 */
(function () {
    "use strict";

    // ------------------------------------------------------------------ hằng số
    const PRODUCTS_PER_PAGE = 12;
    const OPTIONS_VISIBLE = 5;          // số lựa chọn hiện sẵn, còn lại nằm sau "Xem thêm"
    const MAX_SPEC_VALUES = 12;         // thông số có quá nhiều giá trị khác nhau thì không đưa vào bộ lọc
    const PRICE_STEP = 100000;
    const SEARCH_DEBOUNCE_MS = 250;
    const LIST_SEPARATOR = "|";

    const SORTS = ["", "price-asc", "price-desc", "name-asc", "name-desc", "newest", "discount-desc"];

    // Dự phòng khi API danh mục lỗi
    const CATEGORY_MAP = {
        1: "CPU", 2: "GPU", 3: "RAM", 4: "Mainboard", 5: "SSD", 6: "HDD", 7: "PSU",
        8: "Case", 9: "Cooling", 10: "Laptop", 11: "Monitor", 12: "Keyboard", 13: "Mouse", 14: "Headset"
    };

    const SPEC_LABELS = {
        SOCKET: "Socket",
        RAM_TYPE: "Loại RAM",
        FORM_FACTOR: "Kích thước (Form factor)",
        SUPPORTED_FORM_FACTOR: "Form factor hỗ trợ",
        INTERFACE: "Chuẩn giao tiếp",
        WATTAGE: "Công suất",
        RECOMMENDED_PSU: "PSU khuyến nghị",
        GPU_LENGTH: "Chiều dài card",
        MAX_GPU_LENGTH: "Hỗ trợ card tối đa",
        MODULE_COUNT: "Số thanh RAM",
        RAM_SLOTS: "Số khe RAM",
        M2_SLOTS: "Số khe M.2",
        SATA_PORTS: "Số cổng SATA",
        CAPACITY: "Dung lượng",
        SPEED: "Tốc độ",
        CORES: "Số nhân",
        THREADS: "Số luồng",
        VRAM: "Dung lượng VRAM",
        CHIPSET: "Chipset",
        SIZE: "Kích thước",
        RESOLUTION: "Độ phân giải",
        REFRESH_RATE: "Tần số quét"
    };

    // ------------------------------------------------------------------ trạng thái
    const state = {
        keyword: "",
        categories: new Set(),   // tên danh mục chuẩn (đúng như API trả về)
        brands: new Set(),
        specs: new Map(),        // specName -> Set(nhãn giá trị)
        min: null,               // null = không giới hạn
        max: null,
        inStock: false,
        onSale: false,
        sort: "",
        page: 1
    };

    let allProducts = [];
    let filteredProducts = [];
    let categoryList = [];                 // [{ categoryId, name }]
    let saleProductPrices = new Map();     // productId -> { effectivePrice, discountPercent, discountType }
    let priceMax = PRICE_STEP;             // cận trên của thanh trượt
    let specGroups = [];                   // [{ name, label, values: [] }] cho danh mục đang chọn
    let specIndex = new Map();             // productId -> Map(specName -> nhãn giá trị)
    let activeSpecCategoryId = null;
    let specRequestToken = 0;

    const specCache = new Map();           // categoryId -> specIndex
    const searchCache = new Map();         // productId -> chuỗi tìm kiếm đã bỏ dấu
    const collapsedGroups = new Set();
    const expandedGroups = new Set();

    let initialized = false;
    let searchTimer = null;
    let keywordTokens = [];

    // ------------------------------------------------------------------ tiện ích
    const $ = id => document.getElementById(id);

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function normalizeText(value) {
        return String(value ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replaceAll("đ", "d")
            .replaceAll("Đ", "D")
            .toLowerCase()
            .trim();
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value) || 0);
    }

    function formatVnd(value) {
        return `${Math.round(Number(value) || 0).toLocaleString("vi-VN")}đ`;
    }

    function parseMoney(text) {
        const digits = String(text ?? "").replace(/\D/g, "");
        return digits ? Number(digits) : null;
    }

    function splitList(value) {
        return String(value || "").split(LIST_SEPARATOR).map(item => item.trim()).filter(Boolean);
    }

    function compareNatural(a, b) {
        return String(a).localeCompare(String(b), "vi", { numeric: true, sensitivity: "base" });
    }

    function saleTypeLabel(type) {
        switch (String(type || "").toUpperCase()) {
            case "BLACK_FRIDAY": return "BLACK FRIDAY";
            case "BESTSELLER": return "BESTSELLER";
            case "SALE": return "SALE";
            case "NEW_PRODUCT": return "SẢN PHẨM MỚI";
            default: return "ƯU ĐÃI";
        }
    }

    function normalizeImageUrl(imageUrl) {
        if (!imageUrl) {
            return null;
        }
        const path = String(imageUrl).replaceAll("\\", "/").trim();
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }
        if (path.startsWith("/images/products/")) {
            return path;
        }
        if (path.startsWith("images/products/")) {
            return `/${path}`;
        }
        if (path.startsWith("/static/images/products/")) {
            return path.replace("/static/images/products/", "/images/products/");
        }
        if (path.startsWith("static/images/products/")) {
            return path.replace("static/images/products/", "/images/products/");
        }
        return `/images/products/${path.split("/").pop()}`;
    }

    // ------------------------------------------------------------------ truy cập dữ liệu sản phẩm
    function productId(product) {
        return Number(product.productId ?? product.id);
    }

    function categoryNameOf(product) {
        if (product.categoryName) return product.categoryName;
        if (product.category && product.category.name) return product.category.name;
        if (product.categoryId) {
            const fromList = categoryList.find(c => Number(c.categoryId) === Number(product.categoryId));
            return fromList?.name || CATEGORY_MAP[product.categoryId] || "Khác";
        }
        return "Khác";
    }

    const brandById = new Map();

    function brandNameOf(product) {
        if (product.brandName) return product.brandName;
        if (product.brand && product.brand.name) return product.brand.name;
        if (product.brandId && brandById.has(Number(product.brandId))) {
            return brandById.get(Number(product.brandId));
        }
        return "";
    }

    function basePrice(product) {
        return Number(product.price || 0);
    }

    function effectivePrice(product) {
        const sale = saleProductPrices.get(productId(product));
        const value = Number(sale?.effectivePrice);
        return Number.isFinite(value) && value > 0 && Number(sale?.discountPercent) > 0 ? value : basePrice(product);
    }

    function discountPercent(product) {
        return Number(saleProductPrices.get(productId(product))?.discountPercent || 0);
    }

    function inStock(product) {
        return Number(product.stockQuantity || 0) > 0;
    }

    function searchText(product) {
        const id = productId(product);
        if (!searchCache.has(id)) {
            searchCache.set(id, normalizeText(
                `${product.name || ""} ${brandNameOf(product)} ${categoryNameOf(product)} ${product.description || ""}`
            ));
        }
        return searchCache.get(id);
    }

    // ------------------------------------------------------------------ lọc
    /**
     * @param skip nhóm bỏ qua khi lọc (để đếm số lượng cho chính nhóm đó):
     *   "category" | "brand" | "price" | "stock" | "sale" | "spec:<TÊN>"
     */
    function matches(product, skip) {
        if (keywordTokens.length > 0) {
            const text = searchText(product);
            if (!keywordTokens.every(token => text.includes(token))) return false;
        }

        if (skip !== "category" && state.categories.size > 0 && !state.categories.has(categoryNameOf(product))) {
            return false;
        }

        if (skip !== "brand" && state.brands.size > 0 && !state.brands.has(brandNameOf(product))) {
            return false;
        }

        if (skip !== "price") {
            const price = effectivePrice(product);
            if (state.min !== null && price < state.min) return false;
            if (state.max !== null && price > state.max) return false;
        }

        if (skip !== "stock" && state.inStock && !inStock(product)) return false;
        if (skip !== "sale" && state.onSale && discountPercent(product) <= 0) return false;

        if (state.specs.size > 0) {
            const specs = specIndex.get(productId(product));
            for (const [name, values] of state.specs) {
                if (skip === `spec:${name}`) continue;
                const value = specs?.get(name);
                if (!value || !values.has(value)) return false;
            }
        }

        return true;
    }

    function sortProducts(products) {
        switch (state.sort) {
            case "price-asc":
                products.sort((a, b) => effectivePrice(a) - effectivePrice(b));
                break;
            case "price-desc":
                products.sort((a, b) => effectivePrice(b) - effectivePrice(a));
                break;
            case "name-asc":
                products.sort((a, b) => compareNatural(a.name, b.name));
                break;
            case "name-desc":
                products.sort((a, b) => compareNatural(b.name, a.name));
                break;
            case "newest":
                products.sort((a, b) => {
                    const diff = String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
                    return diff !== 0 ? diff : productId(b) - productId(a);
                });
                break;
            case "discount-desc":
                products.sort((a, b) => discountPercent(b) - discountPercent(a));
                break;
            default:
                break;
        }
    }

    function applyFilters(resetPage = true) {
        if (resetPage) {
            state.page = 1;
        }
        keywordTokens = normalizeText(state.keyword).split(/\s+/).filter(Boolean);
        filteredProducts = allProducts.filter(product => matches(product));
        sortProducts(filteredProducts);
        renderAll();
    }

    // ------------------------------------------------------------------ tải dữ liệu
    async function loadCategories() {
        try {
            const data = await window.api.getCategories();
            const list = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
            categoryList = list
                .filter(category => category && category.name)
                .sort((a, b) => Number(a.categoryId || 0) - Number(b.categoryId || 0));
        } catch (error) {
            console.error("Load categories error:", error);
            categoryList = [];
        }
    }

    async function loadBrands() {
        try {
            const data = await window.api.getBrands();
            const list = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
            list.forEach(brand => {
                if (brand && brand.name) brandById.set(Number(brand.brandId), brand.name);
            });
        } catch (error) {
            console.warn("Không tải được thương hiệu", error);
        }
    }

    async function loadProducts() {
        const data = await window.api.getProducts();
        allProducts = Array.isArray(data) ? data
            : Array.isArray(data?.content) ? data.content
                : Array.isArray(data?.products) ? data.products
                    : [];
    }

    async function loadSalePrices() {
        try {
            const prices = await window.api.request("/api/pricing/products");
            saleProductPrices = new Map((prices || []).map(item => [Number(item.productId), item]));
        } catch (error) {
            console.warn("Không tải được giá khuyến mãi", error);
        }
    }

    /** Nạp thông số của 1 danh mục (1 request cho cả danh mục, có cache). */
    async function loadSpecsForCategory(categoryId) {
        if (specCache.has(categoryId)) {
            return specCache.get(categoryId);
        }
        const index = new Map();
        try {
            const rows = await window.api.request(`/api/products/specs?categoryId=${encodeURIComponent(categoryId)}`);
            (Array.isArray(rows) ? rows : []).forEach(row => {
                const name = String(row.specName || "").trim().toUpperCase();
                const value = String(row.specValue || "").trim();
                if (!name || !value) return;
                const unit = String(row.specUnit || "").trim();
                const label = unit && !value.toLowerCase().endsWith(unit.toLowerCase()) ? `${value} ${unit}` : value;
                const id = Number(row.productId);
                if (!index.has(id)) index.set(id, new Map());
                index.get(id).set(name, label);
            });
        } catch (error) {
            // Backend cũ chưa có endpoint -> bỏ qua, vẫn lọc được theo danh mục/thương hiệu/giá
            console.warn("Không tải được thông số sản phẩm", error);
        }
        specCache.set(categoryId, index);
        return index;
    }

    /** Đồng bộ nhóm "Thông số" với danh mục đang chọn (chỉ hiện khi chọn đúng 1 danh mục). */
    async function syncSpecGroups() {
        const token = ++specRequestToken;

        if (state.categories.size !== 1) {
            specGroups = [];
            specIndex = new Map();
            activeSpecCategoryId = null;
            state.specs.clear();
            return;
        }

        const [categoryName] = [...state.categories];
        const category = categoryList.find(item => item.name === categoryName);
        if (!category) {
            specGroups = [];
            specIndex = new Map();
            state.specs.clear();
            return;
        }

        const categoryId = Number(category.categoryId);
        const index = await loadSpecsForCategory(categoryId);
        if (token !== specRequestToken) {
            return; // người dùng đã đổi danh mục trong lúc chờ
        }

        activeSpecCategoryId = categoryId;
        specIndex = index;

        const valuesByName = new Map();
        allProducts
            .filter(product => categoryNameOf(product) === categoryName)
            .forEach(product => {
                specIndex.get(productId(product))?.forEach((label, name) => {
                    if (!valuesByName.has(name)) valuesByName.set(name, new Set());
                    valuesByName.get(name).add(label);
                });
            });

        specGroups = [...valuesByName.entries()]
            .filter(([, values]) => values.size >= 2 && values.size <= MAX_SPEC_VALUES)
            .map(([name, values]) => ({
                name,
                label: SPEC_LABELS[name] || prettifySpecName(name),
                values: [...values].sort(compareNatural)
            }))
            .sort((a, b) => compareNatural(a.label, b.label));

        // Bỏ các lựa chọn không còn tồn tại
        [...state.specs.keys()].forEach(name => {
            const group = specGroups.find(item => item.name === name);
            if (!group) {
                state.specs.delete(name);
                return;
            }
            const kept = new Set([...state.specs.get(name)].filter(value => group.values.includes(value)));
            if (kept.size === 0) state.specs.delete(name);
            else state.specs.set(name, kept);
        });
    }

    function prettifySpecName(name) {
        const text = String(name).replaceAll("_", " ").toLowerCase();
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    // ------------------------------------------------------------------ URL <-> trạng thái
    function readStateFromUrl() {
        const params = new URLSearchParams(window.location.search);

        state.keyword = (params.get("keyword") || params.get("q") || "").trim();

        const knownCategories = new Map(categoryList.map(item => [item.name.toLowerCase(), item.name]));
        state.categories = new Set(
            splitList(params.get("category"))
                .map(name => knownCategories.get(name.toLowerCase()) || null)
                .filter(Boolean)
        );

        const knownBrands = new Map();
        allProducts.forEach(product => {
            const name = brandNameOf(product);
            if (name) knownBrands.set(name.toLowerCase(), name);
        });
        state.brands = new Set(
            splitList(params.get("brand"))
                .map(name => knownBrands.get(name.toLowerCase()) || null)
                .filter(Boolean)
        );

        const min = Number.parseInt(params.get("min") || "", 10);
        const max = Number.parseInt(params.get("max") || "", 10);
        state.min = Number.isFinite(min) && min > 0 ? min : null;
        state.max = Number.isFinite(max) && max > 0 ? max : null;

        state.inStock = params.get("instock") === "1";
        state.onSale = params.get("sale") === "1";

        const sort = params.get("sort") || "";
        state.sort = SORTS.includes(sort) ? sort : "";

        state.page = Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1);

        state.specs = new Map();
        params.forEach((value, key) => {
            if (!key.startsWith("spec.")) return;
            const values = splitList(value);
            if (values.length > 0) state.specs.set(key.slice(5).toUpperCase(), new Set(values));
        });
    }

    function writeStateToUrl() {
        const params = new URLSearchParams();

        if (state.keyword) params.set("keyword", state.keyword);
        if (state.categories.size) params.set("category", [...state.categories].join(LIST_SEPARATOR));
        if (state.brands.size) params.set("brand", [...state.brands].join(LIST_SEPARATOR));
        if (state.min !== null) params.set("min", String(state.min));
        if (state.max !== null) params.set("max", String(state.max));
        if (state.inStock) params.set("instock", "1");
        if (state.onSale) params.set("sale", "1");
        state.specs.forEach((values, name) => {
            if (values.size) params.set(`spec.${name}`, [...values].join(LIST_SEPARATOR));
        });
        if (state.sort) params.set("sort", state.sort);
        if (state.page > 1) params.set("page", String(state.page));

        const query = params.toString();
        window.history.replaceState({}, "", query ? `/pages/products.html?${query}` : "/pages/products.html");
    }

    // ------------------------------------------------------------------ render: tổng
    function renderAll() {
        renderProducts();          // chỉnh state.page nếu vượt quá số trang
        renderHeading();
        renderChips();
        renderFacets();
        renderPriceControls();
        renderMobileToggle();
        writeStateToUrl();
    }

    function renderHeading() {
        const heading = $("productsHeading");
        if (heading) {
            heading.textContent = state.categories.size === 1 ? [...state.categories][0] : "Tất cả sản phẩm";
        }
        const count = $("productCount");
        if (count) {
            count.textContent = `${filteredProducts.length} sản phẩm`;
        }
    }

    function renderMobileToggle() {
        const label = document.querySelector("#mobileFilterToggle > span:first-child");
        if (!label) return;
        const total = activeFilterCount();
        label.textContent = total > 0 ? `Bộ lọc sản phẩm (${total})` : "Bộ lọc sản phẩm";
    }

    function activeFilterCount() {
        let total = state.categories.size + state.brands.size;
        state.specs.forEach(values => { total += values.size; });
        if (state.min !== null || state.max !== null) total += 1;
        if (state.inStock) total += 1;
        if (state.onSale) total += 1;
        return total;
    }

    // ------------------------------------------------------------------ render: chip bộ lọc đang chọn
    function renderChips() {
        const container = $("activeFilters");
        if (!container) return;

        const chips = [];
        const add = (group, value, label) => chips.push({ group, value, label });

        if (state.keyword) add("keyword", "", `Từ khóa: ${state.keyword}`);
        state.categories.forEach(name => add("category", name, name));
        state.brands.forEach(name => add("brand", name, name));
        state.specs.forEach((values, specName) => {
            const label = SPEC_LABELS[specName] || prettifySpecName(specName);
            values.forEach(value => add(`spec:${specName}`, value, `${label}: ${value}`));
        });
        if (state.min !== null || state.max !== null) {
            const from = state.min !== null ? formatVnd(state.min) : "0đ";
            const to = state.max !== null ? formatVnd(state.max) : "không giới hạn";
            add("price", "", `Giá: ${from} – ${to}`);
        }
        if (state.inStock) add("stock", "", "Còn hàng");
        if (state.onSale) add("sale", "", "Đang giảm giá");

        if (chips.length === 0) {
            container.hidden = true;
            container.innerHTML = "";
            return;
        }

        container.hidden = false;
        container.innerHTML = `
            <span class="pf-chips-label">Đang lọc:</span>
            ${chips.map(chip => `
                <button type="button" class="pf-chip"
                        data-chip-group="${escapeHtml(chip.group)}"
                        data-chip-value="${escapeHtml(chip.value)}"
                        aria-label="Bỏ lọc ${escapeHtml(chip.label)}">
                    <span>${escapeHtml(chip.label)}</span>
                    <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" /></svg>
                </button>
            `).join("")}
            <button type="button" class="pf-chip-clear" data-chip-group="__all">Xóa tất cả</button>
        `;
    }

    async function removeChip(group, value) {
        if (group === "__all") {
            await clearFilters();
            return;
        }

        if (group === "keyword") {
            state.keyword = "";
            const input = $("searchInput");
            if (input) input.value = "";
        } else if (group === "category") {
            state.categories.delete(value);
            await syncSpecGroups();
        } else if (group === "brand") {
            state.brands.delete(value);
        } else if (group === "price") {
            state.min = null;
            state.max = null;
        } else if (group === "stock") {
            state.inStock = false;
        } else if (group === "sale") {
            state.onSale = false;
        } else if (group.startsWith("spec:")) {
            const name = group.slice(5);
            const values = state.specs.get(name);
            if (values) {
                values.delete(value);
                if (values.size === 0) state.specs.delete(name);
            }
        }

        applyFilters();
    }

    // ------------------------------------------------------------------ render: các nhóm lọc
    const CHEVRON = `<svg class="pf-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 6.25 8 10.75l4.5-4.5" /></svg>`;

    function buildOptions(items, selectedSet, countMap, keepOrder) {
        // items: [{ value, label }]
        const options = items.map(item => ({
            ...item,
            count: countMap.get(item.value) || 0,
            selected: selectedSet.has(item.value)
        }));
        if (!keepOrder) {
            options.sort((a, b) => b.count - a.count || compareNatural(a.label, b.label));
        }
        return options;
    }

    function countBy(skip, valueFn) {
        const counts = new Map();
        allProducts.forEach(product => {
            if (!matches(product, skip)) return;
            const value = valueFn(product);
            if (value === null || value === undefined || value === "") return;
            counts.set(value, (counts.get(value) || 0) + 1);
        });
        return counts;
    }

    function groupHtml(id, title, options) {
        if (options.length === 0) return "";

        const isCollapsed = collapsedGroups.has(id);
        const isExpanded = expandedGroups.has(id);

        let visible = options;
        let hiddenCount = 0;
        if (!isExpanded && options.length > OPTIONS_VISIBLE) {
            visible = options.filter((option, index) => index < OPTIONS_VISIBLE || option.selected);
            hiddenCount = options.length - visible.length;
        }

        const optionsHtml = visible.map(option => {
            const disabled = option.count === 0 && !option.selected;
            return `
                <label class="pf-option${disabled ? " is-disabled" : ""}">
                    <input type="checkbox"
                           data-fid="${escapeHtml(id)}::${escapeHtml(option.value)}"
                           data-group="${escapeHtml(id)}"
                           data-value="${escapeHtml(option.value)}"
                           ${option.selected ? "checked" : ""}
                           ${disabled ? "disabled" : ""}>
                    <span class="pf-box" aria-hidden="true"></span>
                    <span class="pf-label">${escapeHtml(option.label)}</span>
                    <span class="pf-count">${option.count}</span>
                </label>
            `;
        }).join("");

        const moreHtml = hiddenCount > 0
            ? `<button type="button" class="pf-more" data-more="${escapeHtml(id)}">Xem thêm (${hiddenCount})</button>`
            : (isExpanded && options.length > OPTIONS_VISIBLE
                ? `<button type="button" class="pf-more" data-more="${escapeHtml(id)}">Thu gọn</button>`
                : "");

        return `
            <section class="pf-group${isCollapsed ? " pf-collapsed" : ""}" data-group-id="${escapeHtml(id)}">
                <button type="button" class="pf-group-head" data-toggle="${escapeHtml(id)}" aria-expanded="${isCollapsed ? "false" : "true"}">
                    <span>${escapeHtml(title)}</span>${CHEVRON}
                </button>
                <div class="pf-group-body">
                    <div class="pf-options">${optionsHtml}</div>
                    ${moreHtml}
                </div>
            </section>
        `;
    }

    function renderFacets() {
        const container = $("facetGroups");
        if (!container) return;

        // Giữ focus bàn phím sau khi vẽ lại
        const focusedId = document.activeElement?.closest?.("#facetGroups") ? document.activeElement.dataset?.fid : null;

        // Danh mục
        const categoryCounts = countBy("category", categoryNameOf);
        const categoryOptions = buildOptions(
            categoryList.map(category => ({ value: category.name, label: category.name })),
            state.categories,
            categoryCounts,
            true
        );

        // Thương hiệu
        const brandCounts = countBy("brand", brandNameOf);
        const brandNames = new Set([...allProducts.map(brandNameOf).filter(Boolean), ...state.brands]);
        const brandOptions = buildOptions(
            [...brandNames].map(name => ({ value: name, label: name })),
            state.brands,
            brandCounts,
            false
        ).sort((a, b) => compareNatural(a.label, b.label));

        // Thông số (chỉ khi chọn đúng 1 danh mục)
        const specHtml = specGroups.map(group => {
            const counts = countBy(`spec:${group.name}`, product => specIndex.get(productId(product))?.get(group.name));
            const selected = state.specs.get(group.name) || new Set();
            const options = buildOptions(
                group.values.map(value => ({ value, label: value })),
                selected,
                counts,
                true
            );
            return groupHtml(`spec:${group.name}`, group.label, options);
        }).join("");

        // Tình trạng
        const stockCount = allProducts.filter(product => matches(product, "stock") && inStock(product)).length;
        const saleCount = allProducts.filter(product => matches(product, "sale") && discountPercent(product) > 0).length;
        const availabilityOptions = [
            { value: "instock", label: "Còn hàng", count: stockCount, selected: state.inStock },
            { value: "onsale", label: "Đang giảm giá", count: saleCount, selected: state.onSale }
        ];

        container.innerHTML =
            groupHtml("category", "Danh mục", categoryOptions) +
            groupHtml("brand", "Thương hiệu", brandOptions) +
            specHtml +
            groupHtml("avail", "Tình trạng", availabilityOptions);

        if (focusedId) {
            container.querySelector(`[data-fid="${CSS.escape(focusedId)}"]`)?.focus({ preventScroll: true });
        }
    }

    function onFacetChange(input) {
        const group = input.dataset.group;
        const value = input.dataset.value;
        const checked = input.checked;

        const toggle = set => (checked ? set.add(value) : set.delete(value));

        if (group === "category") {
            toggle(state.categories);
            return syncSpecGroups().then(() => applyFilters());
        }
        if (group === "brand") {
            toggle(state.brands);
        } else if (group === "avail") {
            if (value === "instock") state.inStock = checked;
            if (value === "onsale") state.onSale = checked;
        } else if (group.startsWith("spec:")) {
            const name = group.slice(5);
            if (!state.specs.has(name)) state.specs.set(name, new Set());
            toggle(state.specs.get(name));
            if (state.specs.get(name).size === 0) state.specs.delete(name);
        }
        applyFilters();
        return Promise.resolve();
    }

    // ------------------------------------------------------------------ khoảng giá
    function renderPriceControls() {
        const minInput = $("minPrice");
        const maxInput = $("maxPrice");
        const minRange = $("priceRangeMin");
        const maxRange = $("priceRangeMax");
        if (!minInput || !maxInput || !minRange || !maxRange) return;

        minRange.max = String(priceMax);
        maxRange.max = String(priceMax);

        const lower = state.min !== null ? Math.min(state.min, priceMax) : 0;
        const upper = state.max !== null ? Math.min(state.max, priceMax) : priceMax;

        minRange.value = String(lower);
        maxRange.value = String(upper);

        // Không ghi đè khi người dùng đang gõ
        if (document.activeElement !== minInput) minInput.value = formatVnd(lower);
        if (document.activeElement !== maxInput) maxInput.value = formatVnd(upper);

        paintRangeFill();
    }

    function paintRangeFill() {
        const fill = $("priceRangeFill");
        const minRange = $("priceRangeMin");
        const maxRange = $("priceRangeMax");
        if (!fill || !minRange || !maxRange || priceMax <= 0) return;

        const left = (Number(minRange.value) / priceMax) * 100;
        const right = (Number(maxRange.value) / priceMax) * 100;
        fill.style.left = `${left}%`;
        fill.style.width = `${Math.max(0, right - left)}%`;
    }

    function commitPrice(min, max) {
        let lower = Math.max(0, min ?? 0);
        let upper = Math.min(priceMax, max ?? priceMax);
        if (lower > upper) {
            [lower, upper] = [upper, lower];
        }
        state.min = lower > 0 ? lower : null;
        state.max = upper < priceMax ? upper : null;
        applyFilters();
    }

    function setupPriceEvents() {
        const minInput = $("minPrice");
        const maxInput = $("maxPrice");
        const minRange = $("priceRangeMin");
        const maxRange = $("priceRangeMax");
        if (!minInput || !maxInput || !minRange || !maxRange) return;

        // Kéo thanh trượt: cập nhật tức thì phần hiển thị, chỉ lọc khi thả tay
        const onSlide = changed => {
            let lower = Number(minRange.value);
            let upper = Number(maxRange.value);
            if (lower > upper) {
                if (changed === "min") { lower = upper; minRange.value = String(lower); }
                else { upper = lower; maxRange.value = String(upper); }
            }
            minInput.value = formatVnd(lower);
            maxInput.value = formatVnd(upper);
            paintRangeFill();
        };

        minRange.addEventListener("input", () => onSlide("min"));
        maxRange.addEventListener("input", () => onSlide("max"));
        const commitSlider = () => commitPrice(Number(minRange.value), Number(maxRange.value));
        minRange.addEventListener("change", commitSlider);
        maxRange.addEventListener("change", commitSlider);

        // Nhập tay: Enter hoặc rời ô để áp dụng
        const commitText = () => {
            const typedMin = parseMoney(minInput.value);
            const typedMax = parseMoney(maxInput.value);
            commitPrice(typedMin, typedMax);
        };
        [minInput, maxInput].forEach(input => {
            input.addEventListener("focus", () => input.select());
            input.addEventListener("keydown", event => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    commitText();
                    input.blur();
                }
            });
            input.addEventListener("change", commitText);
        });
    }

    function computePriceBounds() {
        const highest = allProducts.reduce((max, product) => Math.max(max, effectivePrice(product)), 0);
        priceMax = Math.max(PRICE_STEP, Math.ceil(highest / PRICE_STEP) * PRICE_STEP);
    }

    // ------------------------------------------------------------------ render: danh sách sản phẩm
    function renderProducts() {
        const grid = $("productsGrid");
        const empty = $("emptyProducts");
        if (!grid || !empty) return;

        empty.hidden = filteredProducts.length !== 0;

        const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
        state.page = Math.max(1, Math.min(state.page, totalPages || 1));

        const offset = (state.page - 1) * PRODUCTS_PER_PAGE;
        const visible = filteredProducts.slice(offset, offset + PRODUCTS_PER_PAGE);

        grid.innerHTML = visible.map(createProductCard).join("");
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const nav = $("productsPagination");
        if (!nav) return;

        if (totalPages <= 1) {
            nav.hidden = true;
            nav.innerHTML = "";
            return;
        }

        const current = state.page;
        nav.hidden = false;

        let buttons = `<button type="button" data-page="${current - 1}" ${current === 1 ? "disabled" : ""} aria-label="Trang trước">‹</button>`;
        for (let page = 1; page <= totalPages; page++) {
            if (page === 1 || page === totalPages || Math.abs(page - current) <= 2) {
                buttons += `<button type="button" data-page="${page}" ${page === current ? 'class="active" aria-current="page"' : ""}>${page}</button>`;
            } else if ((page === 2 && current > 4) || (page === totalPages - 1 && current < totalPages - 3)) {
                buttons += `<span aria-hidden="true">…</span>`;
            }
        }
        buttons += `<button type="button" data-page="${current + 1}" ${current === totalPages ? "disabled" : ""} aria-label="Trang tiếp">›</button>`;

        nav.innerHTML = `<div class="pagination-buttons">${buttons}</div>`;
    }

    function changeProductPage(page) {
        const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
        if (page < 1 || page > totalPages || page === state.page) return;

        state.page = page;
        renderProducts();
        writeStateToUrl();
        document.querySelector(".products-toolbar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function createProductCard(product) {
        const id = productId(product);
        const name = product.name || "Sản phẩm";
        const price = basePrice(product);
        const sale = saleProductPrices.get(id);
        const percent = Number(sale?.discountPercent || 0);
        const effective = percent > 0 ? Number(sale?.effectivePrice ?? price) : price;
        const stock = Number(product.stockQuantity || 0);
        const imageUrl = normalizeImageUrl(product.imageUrl);
        const brand = brandNameOf(product);
        const detailUrl = `/pages/product-detail.html?id=${encodeURIComponent(id)}`;

        const image = imageUrl
            ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" loading="lazy"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
               <div class="product-no-image" style="display:none;">NO IMAGE</div>`
            : `<div class="product-no-image">NO IMAGE</div>`;

        const priceHtml = percent > 0
            ? `<span class="sale-current-price">${formatCurrency(effective)}</span>
               <del class="sale-original-price">${formatCurrency(price)}</del>
               <span class="sale-product-badge">${saleTypeLabel(sale?.discountType)} -${percent}%</span>`
            : formatCurrency(price);

        return `
            <article class="product-card">
                <a href="${detailUrl}" class="product-image">${image}</a>
                <div class="product-info">
                    <p class="product-category">${escapeHtml(categoryNameOf(product))}${brand ? ` · ${escapeHtml(brand)}` : ""}</p>
                    <a class="product-name" href="${detailUrl}">${escapeHtml(name)}</a>
                    <p class="product-stock ${stock > 0 ? "in-stock" : "out-of-stock"}">
                        ${stock > 0 ? `Còn ${stock} sản phẩm` : "Hết hàng"}
                    </p>
                    <div class="product-price">${priceHtml}</div>
                    <div class="product-actions">
                        <a href="${detailUrl}">Xem chi tiết</a>
                    </div>
                </div>
            </article>
        `;
    }

    // ------------------------------------------------------------------ xóa lọc
    async function clearFilters() {
        state.keyword = "";
        state.categories.clear();
        state.brands.clear();
        state.specs.clear();
        state.min = null;
        state.max = null;
        state.inStock = false;
        state.onSale = false;
        state.sort = "";
        state.page = 1;

        const searchInput = $("searchInput");
        if (searchInput) searchInput.value = "";
        const sortSelect = $("sortSelect");
        if (sortSelect) sortSelect.value = "";

        await syncSpecGroups();
        applyFilters();
    }

    // ------------------------------------------------------------------ sự kiện
    function setupEvents() {
        const searchInput = $("searchInput");
        const searchButton = $("searchButton");
        const sortSelect = $("sortSelect");
        const facetGroups = $("facetGroups");
        const sidebar = $("productFilterSidebar");

        const runSearch = () => {
            clearTimeout(searchTimer);
            const keyword = (searchInput?.value || "").trim();
            if (keyword === state.keyword) return;
            state.keyword = keyword;
            applyFilters();
        };

        searchButton?.addEventListener("click", runSearch);
        searchInput?.addEventListener("keydown", event => {
            if (event.key === "Enter") runSearch();
        });
        searchInput?.addEventListener("input", () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(runSearch, SEARCH_DEBOUNCE_MS);
        });

        sortSelect?.addEventListener("change", () => {
            state.sort = SORTS.includes(sortSelect.value) ? sortSelect.value : "";
            applyFilters();
        });

        facetGroups?.addEventListener("change", event => {
            const input = event.target.closest("input[type='checkbox'][data-group]");
            if (input) onFacetChange(input);
        });

        // Thu/mở nhóm + "Xem thêm"
        sidebar?.addEventListener("click", event => {
            const head = event.target.closest("[data-toggle]");
            if (head) {
                const id = head.dataset.toggle;
                const section = head.closest(".pf-group");
                const nowCollapsed = !collapsedGroups.has(id);
                if (nowCollapsed) collapsedGroups.add(id); else collapsedGroups.delete(id);
                section?.classList.toggle("pf-collapsed", nowCollapsed);
                head.setAttribute("aria-expanded", String(!nowCollapsed));
                return;
            }

            const more = event.target.closest("[data-more]");
            if (more) {
                const id = more.dataset.more;
                if (expandedGroups.has(id)) expandedGroups.delete(id); else expandedGroups.add(id);
                renderFacets();
            }
        });

        $("clearFilter")?.addEventListener("click", clearFilters);
        $("emptyClearFilter")?.addEventListener("click", clearFilters);

        $("activeFilters")?.addEventListener("click", event => {
            const chip = event.target.closest("[data-chip-group]");
            if (chip) removeChip(chip.dataset.chipGroup, chip.dataset.chipValue || "");
        });

        $("productsPagination")?.addEventListener("click", event => {
            const button = event.target.closest("button[data-page]");
            if (button && !button.disabled) changeProductPage(Number(button.dataset.page));
        });

        setupPriceEvents();
    }

    // ------------------------------------------------------------------ khởi tạo
    async function init() {
        if (initialized) return;
        initialized = true;

        const grid = $("productsGrid");

        try {
            await Promise.all([loadCategories(), loadBrands(), loadProducts(), loadSalePrices()]);
        } catch (error) {
            console.error("Load products error:", error);
            if (grid) grid.innerHTML = `<p>Không thể tải danh sách sản phẩm.</p>`;
            return;
        }

        // Nếu API danh mục lỗi: suy ra từ chính danh sách sản phẩm
        if (categoryList.length === 0) {
            const seen = new Map();
            allProducts.forEach(product => {
                const name = categoryNameOf(product);
                if (!seen.has(name)) seen.set(name, { categoryId: product.categoryId, name });
            });
            categoryList = [...seen.values()].sort((a, b) => Number(a.categoryId || 0) - Number(b.categoryId || 0));
        }

        computePriceBounds();
        readStateFromUrl();

        const searchInput = $("searchInput");
        if (searchInput) searchInput.value = state.keyword;
        const sortSelect = $("sortSelect");
        if (sortSelect) sortSelect.value = state.sort;

        // Chỉ hiện nhóm "Thông số" khi URL đang chọn đúng 1 danh mục; giá trị không hợp lệ bị loại bỏ
        await syncSpecGroups();

        setupEvents();
        applyFilters(false);
    }

    document.addEventListener("DOMContentLoaded", init);
})();
