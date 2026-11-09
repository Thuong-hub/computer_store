/*
 * Gọn trang Khuyến mãi admin (file bổ sung, không sửa promotions.js):
 *  1. Chia 3 tab: Mã giảm giá / Ưu đãi sản phẩm / Black Friday -> mỗi lần chỉ hiện 1 phần.
 *  2. Phân trang cho 2 bảng (10 / 20 / 50 dòng mỗi trang).
 *  3. Danh sách sản phẩm Black Friday nằm trong khung cuộn, có ô tìm kiếm và lọc "chỉ hiện đã chọn".
 */
(function () {
    "use strict";

    const TAB_KEY = "adminPromotionTab";
    const pagers = {};

    function $(id) {
        return document.getElementById(id);
    }

    /* ---------- 1. Tabs ---------- */
    function setupTabs() {
        const main = document.querySelector(".admin-main") || document.querySelector("main");
        const toolbar = document.querySelector(".admin-promotion-toolbar");
        const productPanel = document.querySelector(".product-promotion-panel");
        const bfPanel = document.querySelector(".black-friday-panel");
        if (!main || !toolbar || !productPanel || !bfPanel) return;

        const couponList = toolbar.nextElementSibling;
        const tabs = [
            { key: "coupons", label: "Mã giảm giá", panels: [toolbar, couponList] },
            { key: "products", label: "Ưu đãi sản phẩm", panels: [productPanel] },
            { key: "blackfriday", label: "Black Friday", panels: [bfPanel] }
        ];

        const nav = document.createElement("div");
        nav.className = "promo-tabs";
        nav.setAttribute("role", "tablist");
        toolbar.insertAdjacentElement("beforebegin", nav);

        function select(key) {
            tabs.forEach(tab => {
                tab.button.classList.toggle("active", tab.key === key);
                tab.button.setAttribute("aria-selected", String(tab.key === key));
                tab.panels.forEach(panel => panel && panel.classList.toggle("promo-tab-hidden", tab.key !== key));
            });
            try { localStorage.setItem(TAB_KEY, key); } catch (e) { /* bỏ qua */ }
        }

        tabs.forEach(tab => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "promo-tab";
            button.setAttribute("role", "tab");
            button.textContent = tab.label;
            button.addEventListener("click", () => select(tab.key));
            nav.appendChild(button);
            tab.button = button;
        });

        let initial = "coupons";
        try { initial = localStorage.getItem(TAB_KEY) || initial; } catch (e) { /* bỏ qua */ }
        const hash = window.location.hash.replace("#", "");
        if (tabs.some(tab => tab.key === hash)) initial = hash;
        if (!tabs.some(tab => tab.key === initial)) initial = "coupons";
        select(initial);
    }

    /* ---------- 2. Phân trang bảng ---------- */
    function setupPager(tbodyId) {
        const tbody = $(tbodyId);
        const wrapper = tbody && tbody.closest(".admin-table-wrapper");
        if (!tbody || !wrapper) return;

        let page = 1;
        let size = 10;

        const pager = document.createElement("div");
        pager.className = "compact-pager";
        pager.innerHTML = `
            <span class="compact-pager-info"></span>
            <div class="compact-pager-controls">
                <button type="button" class="admin-secondary-button" data-act="prev">‹ Trước</button>
                <span class="compact-pager-page"></span>
                <button type="button" class="admin-secondary-button" data-act="next">Sau ›</button>
                <select aria-label="Số dòng mỗi trang">
                    <option value="10">10 / trang</option>
                    <option value="20">20 / trang</option>
                    <option value="50">50 / trang</option>
                </select>
            </div>`;
        wrapper.insertAdjacentElement("afterend", pager);

        const info = pager.querySelector(".compact-pager-info");
        const label = pager.querySelector(".compact-pager-page");
        const prev = pager.querySelector('[data-act="prev"]');
        const next = pager.querySelector('[data-act="next"]');
        const select = pager.querySelector("select");

        function dataRows() {
            return Array.from(tbody.rows).filter(row => !(row.cells.length === 1 && row.cells[0].colSpan > 1));
        }

        function apply() {
            const rows = dataRows();
            const total = rows.length;
            const pages = Math.max(1, Math.ceil(total / size));
            if (page > pages) page = pages;
            const from = (page - 1) * size;

            rows.forEach((row, index) => {
                row.classList.toggle("is-paged-out", index < from || index >= from + size);
            });

            pager.hidden = total <= 10;
            info.textContent = total ? `Hiển thị ${from + 1}–${Math.min(from + size, total)} / ${total}` : "";
            label.textContent = `Trang ${page}/${pages}`;
            prev.disabled = page <= 1;
            next.disabled = page >= pages;
        }

        prev.addEventListener("click", () => { page -= 1; apply(); });
        next.addEventListener("click", () => { page += 1; apply(); });
        select.addEventListener("change", () => { size = Number(select.value) || 10; page = 1; apply(); });

        new MutationObserver(apply).observe(tbody, { childList: true });
        pagers[tbodyId] = { reset() { page = 1; } };
        apply();
    }

    // Đổi bộ lọc / từ khóa -> về trang 1 (chạy ở capture nên trước khi bảng được vẽ lại)
    function setupPagerResets() {
        document.addEventListener("click", event => {
            if (event.target.closest(".admin-promotion-filter")) pagers.adminPromotionTableBody?.reset();
            if (event.target.closest(".product-promotion-filter")) pagers.productPromotionTableBody?.reset();
        }, true);
        document.addEventListener("input", event => {
            if (event.target.id === "adminPromotionSearch") pagers.adminPromotionTableBody?.reset();
            if (event.target.id === "productPromotionSearch") pagers.productPromotionTableBody?.reset();
        }, true);
    }

    /* ---------- 3. Danh sách sản phẩm Black Friday ---------- */
    function setupBlackFridayList() {
        const list = $("blackFridayProducts");
        if (!list) return;

        const bar = document.createElement("div");
        bar.className = "bf-list-filter";
        bar.innerHTML = `
            <input type="search" id="bfListSearch" placeholder="Tìm theo tên, mã hoặc danh mục sản phẩm..." aria-label="Tìm sản phẩm Black Friday">
            <label class="bf-only-selected"><input type="checkbox" id="bfOnlySelected"> Chỉ hiện sản phẩm đã chọn</label>
            <span class="bf-visible-count" id="bfVisibleCount"></span>`;
        list.insertAdjacentElement("beforebegin", bar);

        const search = $("bfListSearch");
        const only = $("bfOnlySelected");
        const count = $("bfVisibleCount");

        function apply() {
            const query = search.value.trim().toLowerCase();
            const rows = Array.from(list.querySelectorAll(".black-friday-product-row"));
            let visible = 0;
            rows.forEach(row => {
                const checked = Boolean(row.querySelector(".black-friday-product-check")?.checked);
                const show = (!query || row.textContent.toLowerCase().includes(query)) && (!only.checked || checked);
                row.classList.toggle("is-filtered-out", !show);
                if (show) visible += 1;
            });
            count.textContent = rows.length ? `Hiển thị ${visible}/${rows.length} sản phẩm` : "";
        }

        search.addEventListener("input", apply);
        only.addEventListener("change", apply);
        list.addEventListener("change", apply);
        // Các nút "Chọn tất cả / theo danh mục / ..." đổi trạng thái tick bằng code, không bắn sự kiện change
        document.querySelector(".black-friday-quick-tools")?.addEventListener("click", () => setTimeout(apply, 0));
        new MutationObserver(apply).observe(list, { childList: true });
        apply();
    }

    function init() {
        if (document.querySelector(".promo-tabs")) return; // tránh khởi tạo 2 lần
        setupTabs();
        setupPager("adminPromotionTableBody");
        setupPager("productPromotionTableBody");
        setupPagerResets();
        setupBlackFridayList();
    }

    document.addEventListener("DOMContentLoaded", init);
})();
