let pcBuilds = [];

let currentBuildId = null;

let currentBuildItems = [];

let currentComponentCategory = null;

let componentProducts = [];

let replacingBuildItem = null;

let componentCompatibilityCache = new Map();

let componentCompatibilityQueue = [];

let componentCompatibilityInProgress = 0;

let componentCompatibilitySession = 0;

const builderSpecCache = new Map();

// Bộ lọc trong cửa sổ chọn linh kiện
let componentFilter = { keyword: "", brand: "", sort: "", hideIncompatible: false };

// Danh sách sản phẩm dùng chung giữa các lần mở cửa sổ (tránh tải lại toàn bộ catalog mỗi lần bấm "Chọn")
const PRODUCTS_CACHE_TTL_MS = 60 * 1000;
let productsCache = { time: 0, promise: null };

// Kết quả kiểm tra tương thích theo cặp sản phẩm (phụ thuộc thông số sản phẩm, không phụ thuộc cấu hình đang build)
const COMPATIBILITY_CACHE_TTL_MS = 5 * 60 * 1000;
const compatibilityResultCache = new Map();

const builderStorageConnections = new Map();

let activeBoardSlotLimits = null;

let lastBuilderSlotUsage = { ram: 0, m2: 0, sata: 0 };



 
 
 

document.addEventListener(
    "DOMContentLoaded",
    async () => {

         
        if (!window.api.getToken()) {

            const currentPage =
                window.location.href;


            window.location.href =
                `/pages/login.html?redirect=${encodeURIComponent(currentPage)}`;

            return;
        }


        setupMobileBuilderMenu();

        setupSearch();

        setupCreateBuildModal();

        setupComponentModal();

        setupCheckBuild();

        setupAddBuildToCart();

        setupBuildActions();

        await updateCartCount();

        await loadPcBuilds();
    }
);


 
 
 

async function loadPcBuilds() {

    const buildList =
        document.getElementById(
            "buildList"
        );


    buildList.innerHTML = `
        <div class="build-list-loading">
            Đang tải cấu hình...
        </div>
    `;


    try {

        const response =
            await window.api.getPcBuilds();


        pcBuilds =
            Array.isArray(response)
                ? response
                : [];


         
        if (pcBuilds.length === 0) {

            currentBuildId = null;

            renderBuildList();

            resetCurrentBuild();

            return;
        }


         
        const currentStillExists =
            pcBuilds.some(
                build =>
                    Number(build.buildId)
                    ===
                    Number(currentBuildId)
            );


         
        if (!currentStillExists) {

            currentBuildId =
                pcBuilds[0].buildId;
        }


        renderBuildList();


        await selectPcBuild(
            currentBuildId
        );


    } catch (error) {

        console.error(
            "Load PC Builds error:",
            error
        );


        buildList.innerHTML = `
            <div class="build-list-loading">
                Không thể tải cấu hình.
            </div>
        `;


        showBuilderMessage(
            error.message
            || "Không thể tải danh sách PC Build.",
            "error"
        );
    }
}


 
 
 

function renderBuildList() {

    const container =
        document.getElementById(
            "buildList"
        );


    if (pcBuilds.length === 0) {

        container.innerHTML = `
            <div class="build-list-loading">

                Bạn chưa có cấu hình PC nào.

            </div>
        `;

        return;
    }


    container.innerHTML =
        pcBuilds
            .map(build => {

                const active =
                    Number(build.buildId)
                    ===
                    Number(currentBuildId);


                return `
                    <div
                        class="build-card
                        ${active ? "active" : ""}"
                        data-build-id="${build.buildId}"
                    >

                        <span class="build-card-name">
                            ${escapeHtml(
                                build.buildName
                                || "PC Build"
                            )}
                        </span>

                        <span class="build-card-price">
                            ${formatCurrency(
                                build.totalPrice
                                || 0
                            )}
                        </span>

                    </div>
                `;

            })
            .join("");


    document
        .querySelectorAll(
            ".build-card"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                async () => {

                    const buildId =
                        Number(
                            card.dataset.buildId
                        );


                    await selectPcBuild(
                        buildId
                    );
                }
            );
        });
}


 
 
 

async function selectPcBuild(buildId) {

    try {

        currentBuildId =
            Number(buildId);


        const [
            build,
            items
        ] =
            await Promise.all([

                window.api.getPcBuild(
                    currentBuildId
                ),

                window.api.getPcBuildItems(
                    currentBuildId
                )

            ]);


         
         
         

        document.getElementById(
            "currentBuildName"
        ).textContent =
            build.buildName
            || "PC Build";


        document.getElementById(
            "currentBuildId"
        ).textContent =
            `Mã cấu hình #${build.buildId}`;


         
         
         

        const buildItems =
            Array.isArray(items)
                ? items
                : [];


        currentBuildItems =
            buildItems;

        await refreshBuilderSlotLimits();
        lastBuilderSlotUsage = await getBuilderSlotUsage();

        renderBuildItems(
            buildItems
        );


        updateChooseComponentButtons(
            buildItems
        );

        const itemCount =
            buildItems.length;


        const totalQuantity =
            buildItems.reduce(
                (total, item) =>
                    total
                    +
                    Number(
                        item.quantity
                        || 0
                    ),
                0
            );


        document.getElementById(
            "builderItemCount"
        ).textContent =
            itemCount;


        document.getElementById(
            "builderQuantity"
        ).textContent =
            totalQuantity;


        document.getElementById(
            "builderTotalPrice"
        ).textContent =
            formatCurrency(
                build.totalPrice
                || 0
            );


         
         
         

        resetBuildStatus();


         
         
         

         
         

        document.getElementById(
            "renameBuildButton"
        ).disabled = false;


        document.getElementById(
            "deleteBuildButton"
        ).disabled = false;


        document.getElementById(
            "checkBuildButton"
        ).disabled = false;


        document.getElementById(
            "addBuildToCartButton"
        ).disabled = true;



         
        renderBuildList();


    } catch (error) {

        console.error(
            "Select PC Build error:",
            error
        );


        showBuilderMessage(
            error.message
            || "Không thể tải cấu hình.",
            "error"
        );
    }
}


 
 
 

function setupCreateBuildModal() {

    const modal =
        document.getElementById(
            "createBuildModal"
        );


    const input =
        document.getElementById(
            "buildNameInput"
        );


    const openTopButton =
        document.getElementById(
            "createBuildButton"
        );



    const closeButton =
        document.getElementById(
            "closeCreateBuildModal"
        );


    const cancelButton =
        document.getElementById(
            "cancelCreateBuildButton"
        );


    const confirmButton =
        document.getElementById(
            "confirmCreateBuildButton"
        );


    const backdrop =
        modal.querySelector(
            ".builder-modal-backdrop"
        );


    function openModal() {

        modal.hidden = false;

        input.value = "";


        setTimeout(
            () => {
                input.focus();
            },
            50
        );
    }


    function closeModal() {

        modal.hidden = true;

        input.value = "";
    }


    openTopButton.addEventListener(
        "click",
        openModal
    );



    closeButton.addEventListener(
        "click",
        closeModal
    );


    cancelButton.addEventListener(
        "click",
        closeModal
    );


    backdrop.addEventListener(
        "click",
        closeModal
    );


    confirmButton.addEventListener(
        "click",
        createNewPcBuild
    );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                createNewPcBuild();
            }
        }
    );
}


 
 
 

async function createNewPcBuild() {

    const input =
        document.getElementById(
            "buildNameInput"
        );


    const button =
        document.getElementById(
            "confirmCreateBuildButton"
        );


    const modal =
        document.getElementById(
            "createBuildModal"
        );


    const buildName =
        input.value.trim();


    if (!buildName) {

        showBuilderMessage(
            "Vui lòng nhập tên cấu hình.",
            "error"
        );

        input.focus();

        return;
    }


    try {

        button.disabled = true;

        button.textContent =
            "Đang tạo...";


        const createdBuild =
            await window.api.createPcBuild(
                buildName
            );


         
        currentBuildId =
            createdBuild.buildId;


        modal.hidden = true;


        showBuilderMessage(
            "Tạo cấu hình PC thành công.",
            "success"
        );


        await loadPcBuilds();


    } catch (error) {

        console.error(
            "Create PC Build error:",
            error
        );


        showBuilderMessage(
            error.message
            || "Không thể tạo cấu hình.",
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Tạo cấu hình";
    }
}


 
 
 

function resetCurrentBuild() {

    document.getElementById(
        "currentBuildName"
    ).textContent =
        "Chưa chọn cấu hình";


    document.getElementById(
        "currentBuildId"
    ).textContent =
        "Hãy tạo hoặc chọn một PC Build.";


    document.getElementById(
        "builderItemCount"
    ).textContent =
        "0";


    document.getElementById(
        "builderQuantity"
    ).textContent =
        "0";


    document.getElementById(
        "builderTotalPrice"
    ).textContent =
        formatCurrency(0);


    resetBuildStatus();

    resetComponentSlots();


    document
        .querySelectorAll(
            ".choose-component-button"
        )
        .forEach(button => {

            button.disabled = true;
        });


    document.getElementById(
        "renameBuildButton"
    ).disabled = true;


    document.getElementById(
        "deleteBuildButton"
    ).disabled = true;


    document.getElementById(
        "checkBuildButton"
    ).disabled = true;


    document.getElementById(
        "addBuildToCartButton"
    ).disabled = true;
}


 
 
 

function resetBuildStatus() {

    setBuildStatus(
        "buildValidation",
        "Chưa kiểm tra",
        "neutral"
    );


    setBuildStatus(
        "buildCompatibility",
        "Chưa kiểm tra",
        "neutral"
    );


    setBuildStatus(
        "buildReady",
        "Chưa sẵn sàng",
        "neutral"
    );
}


 
 
 

function setBuildStatus(
    id,
    message,
    type
) {

    const element =
        document.getElementById(id);


    element.textContent =
        message;


    element.className =
        `builder-status ${type}`;
}


 
 
 

async function updateCartCount() {

    const element =
        document.getElementById(
            "cartCount"
        );


    if (!element) {
        return;
    }


    try {

        const cart =
            await window.api.getCartItems();


        element.textContent =
            cart.totalQuantity ?? 0;


    } catch (error) {

        element.textContent = "0";
    }
}


 
 
 

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const button =
        document.getElementById(
            "searchButton"
        );


    if (!input || !button) {
        return;
    }


    function search() {

        const keyword =
            input.value.trim();


        if (!keyword) {
            return;
        }


        window.location.href =
            `/pages/products.html?keyword=${encodeURIComponent(keyword)}`;
    }


    button.addEventListener(
        "click",
        search
    );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                search();
            }
        }
    );
}


 
 
 

function showBuilderMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "builderMessage"
        );


    element.textContent =
        message;


    element.className =
        `builder-message ${type}`;


    setTimeout(
        () => {

            element.textContent = "";

            element.className =
                "builder-message";

        },
        3500
    );
}


 
 
 

function formatCurrency(value) {

    const number =
        Number(value || 0);


    return new Intl.NumberFormat(
        "vi-VN"
    ).format(number)
    + " ₫";
}


 
 
 

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

 
 
 

 
 
 

function getSpecInteger(specs, name) {
    const item = specs.find(spec =>
        String(spec.specName || "").toUpperCase() === name
    );

    if (!item || !/^\d+$/.test(String(item.specValue || "").trim())) {
        return null;
    }

    return Number(item.specValue);
}

async function getBuilderProductSpecs(productId) {
    const key = Number(productId);
    if (!builderSpecCache.has(key)) {
        const pending = window.api.getProductSpecs(key)
            .then(result => Array.isArray(result) ? result : [])
            .catch(error => {
                builderSpecCache.delete(key);
                throw error;
            });
        builderSpecCache.set(key, pending);
    }
    return builderSpecCache.get(key);
}

function getStorageConnection(product, specs) {
    const category = normalizeCategory(product.categoryName || product.category?.name || getProductCategoryName(product));
    if (category === "HDD") {
        return "SATA";
    }
    if (category !== "SSD") {
        return null;
    }
    const connection = String(specs.find(spec =>
        String(spec.specName).toUpperCase() === "INTERFACE"
    )?.specValue || "").toUpperCase();
    const name = String(product.productName || product.name || "").toUpperCase();
    if (/NVME|M\.2|PCIE/.test(connection) || /NVME|M\.2/.test(name)) {
        return "M2";
    }
    if (connection.includes("SATA") || name.includes("SATA")) {
        return "SATA";
    }
    return null;
}

async function refreshBuilderSlotLimits() {
    activeBoardSlotLimits = null;
    const board = getCurrentComponent("MAINBOARD");
    if (!board) {
        return;
    }
    try {
        const specs = await getBuilderProductSpecs(board.productId);
        activeBoardSlotLimits = {
            ram: getSpecInteger(specs, "RAM_SLOTS"),
            m2: getSpecInteger(specs, "M2_SLOTS"),
            sata: getSpecInteger(specs, "SATA_PORTS")
        };
        await Promise.all(currentBuildItems.filter(item =>
            ["RAM", "SSD", "HDD"].includes(normalizeCategory(item.categoryName))
        ).map(item => getBuilderProductSpecs(item.productId).catch(() => [])));
    } catch (error) {
        activeBoardSlotLimits = null;
    }
}

function getCachedSpecs(productId) {
    return builderSpecCache.get(Number(productId)) || Promise.resolve([]);
}

async function getBuilderSlotUsage(excludedBuildItemId = null) {
    const usage = { ram: 0, m2: 0, sata: 0 };
    for (const item of currentBuildItems) {
        if (excludedBuildItemId !== null &&
            Number(item.buildItemId) === Number(excludedBuildItemId)) {
            continue;
        }
        const category = normalizeCategory(item.categoryName);
        const specs = await getCachedSpecs(item.productId);
        if (category === "RAM") {
            usage.ram += Number(item.quantity) * Math.max(1, getSpecInteger(specs, "MODULE_COUNT") || 1);
        } else {
            const connection = getStorageConnection(item, specs);
            builderStorageConnections.set(Number(item.productId), connection);
            if (connection === "M2") {
                usage.m2 += Number(item.quantity);
            } else if (connection === "SATA") {
                usage.sata += Number(item.quantity);
            }
        }
    }
    return usage;
}

async function checkBuilderSlotAllowance(product, quantity = 1, excludedBuildItemId = null) {
    const category = normalizeCategory(product.categoryName || product.category?.name || getProductCategoryName(product));
    const specs = await getBuilderProductSpecs(product.productId);
    let type = null;
    let units = quantity;
    let slotName = "";

    if (category === "RAM") {
        type = "ram";
        units *= Math.max(1, getSpecInteger(specs, "MODULE_COUNT") || 1);
        slotName = "khe RAM";
    } else {
        const connection = getStorageConnection(product, specs);
        type = connection === "M2" ? "m2" : connection === "SATA" ? "sata" : null;
        slotName = type === "m2" ? "khe M.2" : "cổng SATA";
    }

    if (!type) {
        return { state: "unknown", message: "Chưa có thông số giao tiếp ổ đĩa để tính số khe." };
    }
    if (!getCurrentComponent("MAINBOARD")) {
        return { state: "unknown", message: "Chọn Mainboard để biết số khe có thể sử dụng." };
    }
    const limit = activeBoardSlotLimits?.[type];
    if (limit === null || limit === undefined) {
        return { state: "unknown", message: `Mainboard chưa có thông tin số ${slotName}.` };
    }
    const usage = await getBuilderSlotUsage(excludedBuildItemId);
    const target = usage[type] + units;
    return {
        state: target > limit ? "incompatible" : "compatible",
        message: `${slotName}: ${target}/${limit} ${type === "ram" ? "thanh" : "ổ"}` +
            (target > limit ? ". Đã vượt giới hạn Mainboard." : ". Còn đủ vị trí lắp đặt.")
    };
}

function getPlusDisabled(item, usage) {
    const category = normalizeCategory(item.categoryName);
    if (category === "RAM") {
        return activeBoardSlotLimits?.ram != null && usage.ram >= activeBoardSlotLimits.ram;
    }
    if (category === "SSD" || category === "HDD") {
        const connection = builderStorageConnections.get(Number(item.productId)) ||
            (category === "HDD" ? "SATA" : /NVME|M\.2/i.test(item.productName || "") ? "M2" : null);
        const key = connection === "M2" ? "m2" : connection === "SATA" ? "sata" : null;
        return key && activeBoardSlotLimits?.[key] != null && usage[key] >= activeBoardSlotLimits[key];
    }
    return false;
}

function getSlotIndicator(item, usage) {
    const category = normalizeCategory(item.categoryName);
    const key = category === "RAM" ? "ram" : "";
    if (key && activeBoardSlotLimits?.[key] != null) {
        return `<div class="build-slot-indicator">RAM: ${usage.ram}/${activeBoardSlotLimits.ram} khe</div>`;
    }
    if ((category === "SSD" || category === "HDD") && activeBoardSlotLimits) {
        return `<div class="build-slot-indicator">M.2: ${usage.m2}/${activeBoardSlotLimits.m2 ?? "?"} · SATA: ${usage.sata}/${activeBoardSlotLimits.sata ?? "?"}</div>`;
    }
    return "";
}

function renderBuildItems(items) {

    resetComponentSlots();


    if (!Array.isArray(items)) {
        return;
    }


    items.forEach(item => {

        const category =
            normalizeCategory(
                item.categoryName
            );


        const slotId =
            getSlotIdByCategory(
                category
            );


        if (!slotId) {
            return;
        }


        const slot =
            document.getElementById(
                slotId
            );


        if (!slot) {
            return;
        }


        const allowQuantity =
            canAdjustQuantity(
                category
            );


        slot.innerHTML = `
            <div
                class="selected-component"
                data-build-item-id="${item.buildItemId}"
            >

                <div class="selected-component-image">

                    <img
                        src="${normalizeImage(
                            item.imageUrl
                        )}"

                        alt="${escapeHtml(
                            item.productName
                        )}"
                    >

                </div>


                <div class="selected-component-info">

                    <div class="selected-component-name">

                        ${escapeHtml(
                            item.productName
                        )}

                    </div>


                    <div class="selected-component-price">

                        ${formatCurrency(
                            item.price
                        )}

                        × ${item.quantity}

                    </div>
                    ${getSlotIndicator(item, lastBuilderSlotUsage)}


                    ${
                        allowQuantity

                        ? `
                            <div
                                class="build-quantity-control"
                            >

                                <button
                                    type="button"
                                    class="build-qty-button decrease-build-item"
                                    data-item-id="${item.buildItemId}"
                                    data-quantity="${item.quantity}"
                                >
                                    −
                                </button>


                                <span class="build-qty-value">
                                    ${item.quantity}
                                </span>


                                <button
                                    type="button"
                                    class="build-qty-button increase-build-item"
                                    data-item-id="${item.buildItemId}"
                                    data-quantity="${item.quantity}"
                                    ${getPlusDisabled(item, lastBuilderSlotUsage) ? 'disabled title="Đã sử dụng hết khe trên Mainboard"' : ''}
                                >
                                    +
                                </button>

                            </div>
                        `

                        : ""
                    }

                </div>


                <button
                    type="button"

                    class="remove-build-item-button"

                    data-item-id="${item.buildItemId}"

                    data-product-name="${escapeHtml(
                        item.productName
                    )}"
                >
                    ×
                </button>

            </div>
        `;
    });


    setupBuildItemActions();
}

 
 
 

function canAdjustQuantity(category) {

    return (
        category === "RAM"
        ||
        category === "SSD"
        ||
        category === "HDD"
        ||
        category === "COOLING"
    );
}

 
 
 

function normalizeCategory(category) {

    return String(
        category || ""
    )
        .trim()
        .toUpperCase();
}


function getSlotIdByCategory(category) {

    switch (category) {

        case "CPU":
            return "slotCPU";


        case "MAINBOARD":
            return "slotMainboard";


        case "RAM":
            return "slotRAM";


        case "GPU":
            return "slotGPU";


        case "SSD":
        case "HDD":
            return "slotStorage";


        case "PSU":
            return "slotPSU";


        case "CASE":
            return "slotCase";


        case "COOLING":
            return "slotCooling";


        default:
            return null;
    }
}

 
 
 

function resetComponentSlots() {

    setEmptySlot(
        "slotCPU",
        "Chưa chọn CPU",
        "Chọn bộ xử lý cho cấu hình."
    );


    setEmptySlot(
        "slotMainboard",
        "Chưa chọn Mainboard",
        "Mainboard phải phù hợp với CPU."
    );


    setEmptySlot(
        "slotRAM",
        "Chưa chọn RAM",
        "Chọn loại RAM tương thích Mainboard."
    );


    setEmptySlot(
        "slotGPU",
        "Chưa chọn GPU",
        "Chọn card đồ họa."
    );


    setEmptySlot(
        "slotStorage",
        "Chưa chọn ổ lưu trữ",
        "Chọn SSD hoặc HDD."
    );


    setEmptySlot(
        "slotPSU",
        "Chưa chọn PSU",
        "Công suất phải phù hợp GPU."
    );


    setEmptySlot(
        "slotCase",
        "Chưa chọn Case",
        "Kiểm tra kích thước Mainboard và GPU."
    );


    setEmptySlot(
        "slotCooling",
        "Chưa chọn tản nhiệt",
        "Linh kiện không bắt buộc."
    );
}


function setEmptySlot(
    id,
    title,
    description
) {

    const slot =
        document.getElementById(id);


    if (!slot) {
        return;
    }


    slot.innerHTML = `
        <div class="empty-component">

            <span class="empty-icon">
                +
            </span>


            <div>

                <strong>
                    ${escapeHtml(title)}
                </strong>

                <p>
                    ${escapeHtml(description)}
                </p>

            </div>

        </div>
    `;
}

 
 
 

function normalizeImage(imageUrl) {

    if (!imageUrl) {
        return "/images/products/no-image.png";
    }


    let path =
        String(imageUrl)
            .trim()
            .replaceAll("\\", "/");


     
    if (
        path.startsWith("http://")
        ||
        path.startsWith("https://")
    ) {
        return path;
    }


     
    if (
        path.startsWith(
            "/images/products/"
        )
    ) {
        return path;
    }


     
     
    if (
        path.startsWith(
            "images/products/"
        )
    ) {
        return `/${path}`;
    }


     
     
    if (
        path.startsWith(
            "static/images/products/"
        )
    ) {

        return path.replace(
            "static/images/products/",
            "/images/products/"
        );
    }


     
     
    if (
        path.startsWith(
            "/static/images/products/"
        )
    ) {

        return path.replace(
            "/static/images/products/",
            "/images/products/"
        );
    }


     
     
    const fileName =
        path.split("/").pop();


    return `/images/products/${fileName}`;
}

 
 
 

 
 
 

function updateChooseComponentButtons(
    items
) {

    document
        .querySelectorAll(
            ".choose-component-button"
        )
        .forEach(button => {

            const category =
                normalizeCategory(
                    button.dataset.category
                );


            const existingItem =
                findBuildItemByCategory(
                    category,
                    items
                );


            if (existingItem) {

                button.disabled = false;

                button.textContent =
                    getReplaceButtonText(
                        category
                    );

                button.classList.add(
                    "replace-mode"
                );

            } else {

                button.disabled = false;

                button.textContent =
                    getChooseButtonText(
                        category
                    );

                button.classList.remove(
                    "replace-mode"
                );
            }
        });
}


function getChooseButtonText(category) {

    switch (category) {

        case "CPU":
            return "Chọn CPU";

        case "MAINBOARD":
            return "Chọn Mainboard";

        case "RAM":
            return "Chọn RAM";

        case "GPU":
            return "Chọn GPU";

        case "STORAGE":
            return "Chọn lưu trữ";

        case "PSU":
            return "Chọn PSU";

        case "CASE":
            return "Chọn Case";

        case "COOLING":
            return "Chọn Cooling";

        default:
            return "Chọn";
    }
}

 
 
 

function setupComponentModal() {

    const modal =
        document.getElementById(
            "componentModal"
        );


    const closeButton =
        document.getElementById(
            "closeComponentModal"
        );


    const backdrop =
        modal.querySelector(
            ".builder-modal-backdrop"
        );


    const searchInput =
        document.getElementById(
            "componentSearchInput"
        );


     
     
     

    document
        .querySelectorAll(
            ".choose-component-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    if (
                        button.disabled
                    ) {
                        return;
                    }


                   const category =
                    normalizeCategory(
                        button.dataset.category
                    );


                    replacingBuildItem =
                        findBuildItemByCategory(
                            category
                    );


                    await openComponentModal(
                        category
                    );
                }
            );
        });


     
     
     

    function closeModal() {

    modal.hidden = true;

    currentComponentCategory =
        null;

    componentProducts =
        [];

    replacingBuildItem =
        null;

    componentCompatibilitySession += 1;

    componentCompatibilityQueue = [];

    componentCompatibilityCache.clear();

    searchInput.value =
        "";

    resetComponentFilters();
}


    closeButton.addEventListener(
        "click",
        closeModal
    );


    backdrop.addEventListener(
        "click",
        closeModal
    );


     
     
     

    let searchTimer = null;

    searchInput.addEventListener(
        "input",
        () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                componentFilter.keyword = searchInput.value;
                renderComponentList();
            }, 200);
        }
    );

    document.getElementById("componentBrandFilter")?.addEventListener("change", event => {
        componentFilter.brand = event.target.value;
        renderComponentList();
    });

    document.getElementById("componentSortSelect")?.addEventListener("change", event => {
        componentFilter.sort = event.target.value;
        renderComponentList();
    });

    document.getElementById("componentHideIncompatible")?.addEventListener("change", event => {
        componentFilter.hideIncompatible = event.target.checked;
        renderComponentList();
    });
}

 
 
 

async function openComponentModal(
    category
) {

    if (!currentBuildId) {

        showBuilderMessage(
            "Vui lòng chọn cấu hình PC trước.",
            "error"
        );

        return;
    }


    currentComponentCategory =
        normalizeCategory(
            category
        );

    componentCompatibilitySession += 1;

    const checkSession = componentCompatibilitySession;

    componentCompatibilityQueue = [];

    componentCompatibilityCache.clear();

    const modal =
        document.getElementById(
            "componentModal"
        );


    const title =
        document.getElementById(
            "componentModalTitle"
        );


    const list =
        document.getElementById(
            "componentProductList"
        );


    const searchInput =
        document.getElementById(
            "componentSearchInput"
        );


   title.textContent =
    replacingBuildItem

        ? getReplaceModalTitle(
            currentComponentCategory
        )

        : getComponentModalTitle(
            currentComponentCategory
        );


    searchInput.value =
        "";


    modal.hidden =
        false;


    list.innerHTML = `
        <div class="component-modal-empty">
            Đang tải sản phẩm...
        </div>
    `;


    try {

        const products =
            await getCachedProducts();


        if (checkSession !== componentCompatibilitySession) {
            return;
        }

        const allProducts =
            Array.isArray(products)
                ? products
                : [];


        componentProducts =
            allProducts.filter(
                product => {

                     
                    const active =
                        String(
                            product.status
                            || "ACTIVE"
                        ).toUpperCase()
                        ===
                        "ACTIVE";


                     
                    const inStock =
                        Number(
                            product.stockQuantity
                            || 0
                        ) > 0;


                    return (
                        active
                        &&
                        inStock
                        &&
                        isProductForCategory(
                            product,
                            currentComponentCategory
                        )
                    );
                }
            );


        if (["RAM", "STORAGE"].includes(currentComponentCategory)) {
            await Promise.all(componentProducts.map(product =>
                getBuilderProductSpecs(product.productId).catch(() => [])
            ));
        }

        if (checkSession !== componentCompatibilitySession) {
            return;
        }

        resetComponentFilters();

        populateComponentBrandFilter();

        renderComponentList();


    } catch (error) {

        if (checkSession !== componentCompatibilitySession) {
            return;
        }

        console.error(
            "Load component products error:",
            error
        );


        list.innerHTML = `
            <div class="component-modal-empty">
                Không thể tải sản phẩm.
            </div>
        `;
    }
}

 
 
 

/* ---------- Bộ lọc trong cửa sổ chọn linh kiện ---------- */

function getCachedProducts() {
    const now = Date.now();
    if (!productsCache.promise || now - productsCache.time > PRODUCTS_CACHE_TTL_MS) {
        productsCache = {
            time: now,
            promise: window.api.getProducts().catch(error => {
                productsCache = { time: 0, promise: null };
                throw error;
            })
        };
    }
    return productsCache.promise;
}

function normalizeSearchText(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replaceAll("đ", "d")
        .replaceAll("Đ", "D")
        .toLowerCase()
        .trim();
}

function getComponentBrandName(product) {
    return product.brand?.name || product.brandName || "";
}

function resetComponentFilters() {
    componentFilter = { keyword: "", brand: "", sort: "", hideIncompatible: false };

    const brand = document.getElementById("componentBrandFilter");
    const sort = document.getElementById("componentSortSelect");
    const hide = document.getElementById("componentHideIncompatible");
    if (brand) brand.value = "";
    if (sort) sort.value = "";
    if (hide) hide.checked = false;
}

function populateComponentBrandFilter() {
    const select = document.getElementById("componentBrandFilter");
    if (!select) return;

    const counts = new Map();
    componentProducts.forEach(product => {
        const name = getComponentBrandName(product);
        if (name) counts.set(name, (counts.get(name) || 0) + 1);
    });

    select.innerHTML =
        `<option value="">Tất cả thương hiệu</option>` +
        [...counts.entries()]
            .sort((a, b) => a[0].localeCompare(b[0], "vi"))
            .map(([name, count]) => `<option value="${escapeHtml(name)}">${escapeHtml(name)} (${count})</option>`)
            .join("");
    select.value = "";
}

function getVisibleComponentProducts() {
    const tokens = normalizeSearchText(componentFilter.keyword).split(/\s+/).filter(Boolean);

    const visible = componentProducts.filter(product => {
        if (componentFilter.brand && getComponentBrandName(product) !== componentFilter.brand) {
            return false;
        }

        if (tokens.length > 0) {
            const text = normalizeSearchText(`${product.name || ""} ${getComponentBrandName(product)}`);
            if (!tokens.every(token => text.includes(token))) return false;
        }

        if (componentFilter.hideIncompatible &&
            componentCompatibilityCache.get(Number(product.productId))?.state === "incompatible") {
            return false;
        }

        return true;
    });

    switch (componentFilter.sort) {
        case "price-asc":
            visible.sort((a, b) => Number(a.price) - Number(b.price));
            break;
        case "price-desc":
            visible.sort((a, b) => Number(b.price) - Number(a.price));
            break;
        case "name-asc":
            visible.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "vi"));
            break;
        default:
            break;
    }

    return visible;
}

function renderComponentList() {
    renderComponentProducts(getVisibleComponentProducts());
}

function requestCompatibility(path) {
    const hit = compatibilityResultCache.get(path);
    if (hit && Date.now() - hit.time < COMPATIBILITY_CACHE_TTL_MS) {
        return hit.promise;
    }

    const promise = window.api.request(path);
    compatibilityResultCache.set(path, { time: Date.now(), promise });
    promise.catch(() => compatibilityResultCache.delete(path));
    return promise;
}


function getProductCategoryName(
    product
) {

     
    if (
        product.category
        &&
        product.category.name
    ) {

        return normalizeCategory(
            product.category.name
        );
    }


     
    switch (
        Number(
            product.categoryId
        )
    ) {

        case 1:
            return "CPU";

        case 2:
            return "GPU";

        case 3:
            return "RAM";

        case 4:
            return "MAINBOARD";

        case 5:
            return "SSD";

        case 6:
            return "HDD";

        case 7:
            return "PSU";

        case 8:
            return "CASE";

        case 9:
            return "COOLING";

        default:
            return "";
    }
}


function isProductForCategory(
    product,
    wantedCategory
) {

    const productCategory =
        getProductCategoryName(
            product
        );


    if (
        wantedCategory === "STORAGE"
    ) {

        return (
            productCategory === "SSD"
            ||
            productCategory === "HDD"
        );
    }


    return (
        productCategory
        ===
        wantedCategory
    );
}

function getComponentModalTitle(
    category
) {

    switch (category) {

        case "CPU":
            return "Chọn CPU";

        case "MAINBOARD":
            return "Chọn Mainboard";

        case "RAM":
            return "Chọn RAM";

        case "GPU":
            return "Chọn Card đồ họa";

        case "STORAGE":
            return "Chọn SSD / HDD";

        case "PSU":
            return "Chọn nguồn PSU";

        case "CASE":
            return "Chọn Case";

        case "COOLING":
            return "Chọn tản nhiệt";

        default:
            return "Chọn linh kiện";
    }
}

 
 
 

function getCurrentComponent(category) {

    return currentBuildItems.find(item =>
        normalizeCategory(item.categoryName) === category
    ) || null;
}


function getProductCompatibilityChecks(product) {

    const category = getProductCategoryName(product);

    const productId = Number(product.productId);

    const cpu = getCurrentComponent("CPU");

    const mainboard = getCurrentComponent("MAINBOARD");

    const ram = getCurrentComponent("RAM");

    const gpu = getCurrentComponent("GPU");

    const psu = getCurrentComponent("PSU");

    const pcCase = getCurrentComponent("CASE");

    const checks = [];

    function addCheck(name, path) {
        checks.push({ name, path });
    }

    if (category === "CPU" && mainboard) {
        addCheck(
            "CPU – Mainboard",
            `/api/compatibility/cpu-mainboard?cpuId=${productId}&mainboardId=${Number(mainboard.productId)}`
        );
    }

    if (category === "MAINBOARD") {
        if (cpu) {
            addCheck(
                "CPU – Mainboard",
                `/api/compatibility/cpu-mainboard?cpuId=${Number(cpu.productId)}&mainboardId=${productId}`
            );
        }

        if (ram) {
            addCheck(
                "Mainboard – RAM",
                `/api/compatibility/mainboard-ram?mainboardId=${productId}&ramId=${Number(ram.productId)}`
            );
        }

        if (pcCase) {
            addCheck(
                "Mainboard – Case",
                `/api/compatibility/mainboard-case?mainboardId=${productId}&caseId=${Number(pcCase.productId)}`
            );
        }
    }

    if (category === "RAM" && mainboard) {
        addCheck(
            "Mainboard – RAM",
            `/api/compatibility/mainboard-ram?mainboardId=${Number(mainboard.productId)}&ramId=${productId}`
        );
    }

    if (category === "GPU") {
        if (psu) {
            addCheck(
                "GPU – PSU",
                `/api/compatibility/gpu-psu?gpuId=${productId}&psuId=${Number(psu.productId)}`
            );
        }

        if (pcCase) {
            addCheck(
                "GPU – Case",
                `/api/compatibility/gpu-case?gpuId=${productId}&caseId=${Number(pcCase.productId)}`
            );
        }
    }

    if (category === "PSU" && gpu) {
        addCheck(
            "GPU – PSU",
            `/api/compatibility/gpu-psu?gpuId=${Number(gpu.productId)}&psuId=${productId}`
        );
    }

    if (category === "CASE") {
        if (mainboard) {
            addCheck(
                "Mainboard – Case",
                `/api/compatibility/mainboard-case?mainboardId=${Number(mainboard.productId)}&caseId=${productId}`
            );
        }

        if (gpu) {
            addCheck(
                "GPU – Case",
                `/api/compatibility/gpu-case?gpuId=${Number(gpu.productId)}&caseId=${productId}`
            );
        }
    }

    return checks;
}


function getNoComparisonMessage(product) {

    const category = getProductCategoryName(product);

    switch (category) {
        case "CPU":
            return "Chưa chọn Mainboard để đối chiếu socket.";
        case "MAINBOARD":
            return "Hãy chọn CPU, RAM hoặc Case để kiểm tra với Mainboard.";
        case "RAM":
            return "Chưa chọn Mainboard để đối chiếu loại RAM.";
        case "GPU":
            return "Chưa chọn PSU hoặc Case để đối chiếu GPU.";
        case "PSU":
            return "Chưa chọn GPU để kiểm tra công suất PSU.";
        case "CASE":
            return "Chưa chọn Mainboard hoặc GPU để kiểm tra kích thước Case.";
        default:
            return "Chưa có quy tắc kiểm tra tự động cho linh kiện này.";
    }
}


function getComponentCompatibilityText(state) {

    switch (state) {
        case "compatible":
            return "✓ Tương thích theo tiêu chí đã kiểm tra";
        case "incompatible":
            return "✕ Không tương thích";
        case "unknown":
            return "! Chưa đủ dữ liệu để xác nhận";
        default:
            return "… Đang kiểm tra tương thích";
    }
}


async function checkCandidateMainboardSlots(product) {
    const specs = await getBuilderProductSpecs(product.productId);
    const limits = {
        ram: getSpecInteger(specs, "RAM_SLOTS"),
        m2: getSpecInteger(specs, "M2_SLOTS"),
        sata: getSpecInteger(specs, "SATA_PORTS")
    };
    const usage = await getBuilderSlotUsage();
    const rules = [
        { key: "ram", label: "khe RAM" },
        { key: "m2", label: "khe M.2" },
        { key: "sata", label: "cổng SATA" }
    ];
    const exceeded = rules.find(rule =>
        limits[rule.key] != null && usage[rule.key] > limits[rule.key]
    );
    if (exceeded) {
        return {
            state: "incompatible",
            message: `Mainboard mới chỉ có ${limits[exceeded.key]} ${exceeded.label}, nhưng cấu hình đang dùng ${usage[exceeded.key]}.`
        };
    }
    if (rules.some(rule => limits[rule.key] == null)) {
        return {
            state: "unknown",
            message: "Chưa có đủ dữ liệu RAM/M.2/SATA của Mainboard mới."
        };
    }
    return {
        state: "compatible",
        message: `Khe RAM ${usage.ram}/${limits.ram} · M.2 ${usage.m2}/${limits.m2} · SATA ${usage.sata}/${limits.sata}.`
    };
}

function mergeSlotCompatibility(result, slot) {
    if (slot.state === "incompatible") {
        return { state: "incompatible", message: slot.message };
    }
    if (result.state === "incompatible") {
        return result;
    }
    return {
        state: result.state === "compatible" && slot.state === "compatible" ? "compatible" : "unknown",
        message: `${result.message} • ${slot.message}`
    };
}

function queueComponentCompatibilityChecks(products) {

    const session = componentCompatibilitySession;

    products.forEach(product => {
        const id = Number(product.productId);

        if (componentCompatibilityCache.has(id)) {
            return;
        }

        const checks = getProductCompatibilityChecks(product);

        if (checks.length === 0) {
            componentCompatibilityCache.set(id, {
                state: "checking",
                message: "Đang kiểm tra số khe còn trống."
            });
            const excludedId = replacingBuildItem?.buildItemId ?? null;
            const targetQuantity = replacingBuildItem?.quantity ?? 1;
            const slotCheck = ["RAM", "SSD", "HDD"].includes(getProductCategoryName(product))
                ? checkBuilderSlotAllowance(product, targetQuantity, excludedId)
                : getProductCategoryName(product) === "MAINBOARD"
                    ? checkCandidateMainboardSlots(product)
                    : Promise.resolve({ state: "unknown", message: "Chưa có phép đối chiếu số khe." });
            slotCheck.catch(() => ({
                state: "unknown",
                message: "Không tải được thông số số khe."
            })).then(slot => {
                if (session !== componentCompatibilitySession) {
                    return;
                }
                const result = mergeSlotCompatibility({
                    state: "unknown",
                    message: getNoComparisonMessage(product)
                }, slot);
                componentCompatibilityCache.set(id, result);
                updateComponentCompatibilityCard(id);
                updateComponentCompatibilitySummary();
            });
            return;
        }

        componentCompatibilityCache.set(id, {
            state: "checking",
            message: `Đang kiểm tra ${checks.map(check => check.name).join(", ")}.`
        });

        componentCompatibilityQueue.push({ id, checks, session });
    });

    updateComponentCompatibilitySummary();

    runComponentCompatibilityQueue();
}


function runComponentCompatibilityQueue() {

    while (
        componentCompatibilityInProgress < 4 &&
        componentCompatibilityQueue.length > 0
    ) {
        const job = componentCompatibilityQueue.shift();

        if (job.session !== componentCompatibilitySession) {
            continue;
        }

        componentCompatibilityInProgress += 1;

        Promise.all(job.checks.map(async check => {
            try {
                const response = await requestCompatibility(check.path);

                if (typeof response?.compatible !== "boolean") {
                    return {
                        state: "unknown",
                        message: `${check.name}: Không đọc được kết quả kiểm tra.`
                    };
                }

                return {
                    state: response.compatible ? "compatible" : "incompatible",
                    message: response.message || check.name,
                    name: check.name
                };
            } catch (error) {
                return {
                    state: "unknown",
                    message: `${check.name}: ${error.message || "Không kiểm tra được thông số."}`
                };
            }
        }))
            .then(results => {
                if (job.session !== componentCompatibilitySession) {
                    return;
                }

                const invalid = results.filter(result => result.state === "incompatible");

                const unknown = results.filter(result => result.state === "unknown");

                let result;

                if (invalid.length > 0) {
                    result = {
                        state: "incompatible",
                        message: invalid.map(item => item.message).join(" • ")
                    };
                } else if (unknown.length > 0) {
                    result = {
                        state: "unknown",
                        message: unknown.map(item => item.message).join(" • ")
                    };
                } else {
                    result = {
                        state: "compatible",
                        message: `Đã đối chiếu: ${results.map(item => item.name).join(", ")}.`
                    };
                }

                const product = componentProducts.find(candidate =>
                    Number(candidate.productId) === Number(job.id)
                );
                if (product && ["RAM", "SSD", "HDD", "MAINBOARD"].includes(getProductCategoryName(product))) {
                    const slotPromise = getProductCategoryName(product) === "MAINBOARD"
                        ? checkCandidateMainboardSlots(product)
                        : checkBuilderSlotAllowance(
                            product,
                            replacingBuildItem?.quantity ?? 1,
                            replacingBuildItem?.buildItemId ?? null
                        );
                    slotPromise.catch(() => ({
                        state: "unknown",
                        message: "Không tải được thông số số khe."
                    })).then(slot => {
                        if (job.session !== componentCompatibilitySession) return;
                        componentCompatibilityCache.set(job.id, mergeSlotCompatibility(result, slot));
                        updateComponentCompatibilityCard(job.id);
                        updateComponentCompatibilitySummary();
                    });
                } else {
                    componentCompatibilityCache.set(job.id, result);
                    updateComponentCompatibilityCard(job.id);
                    updateComponentCompatibilitySummary();
                }
            })
            .finally(() => {
                componentCompatibilityInProgress -= 1;
                runComponentCompatibilityQueue();
            });
    }
}


function updateComponentCompatibilityCard(productId) {

    const card = document.querySelector(
        `.component-product-card[data-product-id="${productId}"]`
    );

    if (!card) {
        return;
    }

    const result = componentCompatibilityCache.get(productId);

    if (!result) {
        return;
    }

    if (componentFilter.hideIncompatible && result.state === "incompatible") {
        const list = card.parentElement;
        card.remove();
        if (list && !list.querySelector(".component-product-card")) {
            list.innerHTML = `<div class="component-modal-empty">Không có sản phẩm trong danh sách.</div>`;
        }
        return;
    }

    const compatibility = card.querySelector(".component-compatibility");

    if (compatibility) {
        compatibility.className = `component-compatibility component-compatibility-${result.state}`;
        compatibility.querySelector(".component-compatibility-label").textContent =
            getComponentCompatibilityText(result.state);
        compatibility.querySelector(".component-compatibility-message").textContent =
            result.message;
    }

    const button = card.querySelector(".select-product-button:not(.current-product-button)");

    if (button) {
        button.disabled = result.state === "incompatible" || result.state === "checking";
        button.textContent = result.state === "incompatible" ? "Không thể chọn" : "Chọn";
    }
}


function updateComponentCompatibilitySummary() {

    const summary = document.getElementById("componentCompatibilityOverview");

    if (!summary) {
        return;
    }

    const totals = {
        compatible: 0,
        incompatible: 0,
        unknown: 0,
        checking: 0
    };

    componentProducts.forEach(product => {
        const result = componentCompatibilityCache.get(Number(product.productId));
        totals[result?.state || "checking"] += 1;
    });

    summary.textContent =
        `Đối chiếu với cấu hình đang chọn: ${totals.compatible} tương thích · ` +
        `${totals.incompatible} không tương thích · ${totals.unknown} chưa đủ dữ liệu` +
        (totals.checking ? ` · ${totals.checking} đang kiểm tra` : "");
}


function renderComponentProducts(products) {

    const container = document.getElementById("componentProductList");

    if (!Array.isArray(products) || products.length === 0) {
        container.innerHTML = `
            <div class="component-modal-empty">
                Không có sản phẩm trong danh sách.
            </div>
        `;
        updateComponentCompatibilitySummary();
        return;
    }

    container.innerHTML = products.map(product => {
        const id = Number(product.productId);

        const selected = replacingBuildItem &&
            Number(replacingBuildItem.productId) === id;

        const result = componentCompatibilityCache.get(id) || {
            state: "checking",
            message: "Đang lấy thông tin tương thích."
        };

        const disabled = selected || result.state === "incompatible" || result.state === "checking";

        return `
            <div class="component-product-card" data-product-id="${id}">
                <div class="component-product-image">
                    <img src="${escapeHtml(normalizeImage(product.imageUrl))}" alt="${escapeHtml(product.name)}" loading="lazy">
                </div>

                <div class="component-product-info">
                    <div class="component-product-name">${escapeHtml(product.name)}</div>
                    <div class="component-product-stock">Còn ${Number(product.stockQuantity)} sản phẩm</div>
                    <div class="component-compatibility component-compatibility-${result.state}">
                        <span class="component-compatibility-label">${getComponentCompatibilityText(result.state)}</span>
                        <span class="component-compatibility-message">${escapeHtml(result.message)}</span>
                    </div>
                </div>

                <div class="component-product-price">${formatCurrency(product.price)}</div>

                <button
                    type="button"
                    class="select-product-button${selected ? " current-product-button" : ""}"
                    ${selected ? "" : `data-product-id="${id}"`}
                    ${disabled ? "disabled" : ""}
                >${selected ? "Đang dùng" : result.state === "incompatible" ? "Không thể chọn" : "Chọn"}</button>
            </div>
        `;
    }).join("");

    container.querySelectorAll(".select-product-button[data-product-id]").forEach(button => {
        button.addEventListener("click", async () => {
            const productId = Number(button.dataset.productId);
            const result = componentCompatibilityCache.get(productId);

            if (!result || result.state === "checking" || result.state === "incompatible") {
                return;
            }

            await addSelectedProduct(productId, button);
        });
    });

    queueComponentCompatibilityChecks(componentProducts);
}


async function addSelectedProduct(
    productId,
    button
) {

    if (!currentBuildId) {
        return;
    }


    const oldItem =
        replacingBuildItem
            ? { ...replacingBuildItem }
            : null;


    try {

        button.disabled = true;

        button.textContent =
            oldItem
                ? "Đang thay..."
                : "Đang thêm...";


        invalidateBuildCheckState();


         
         
         

        if (oldItem) {

             
            await window.api.deletePcBuildItem(
                currentBuildId,
                oldItem.buildItemId
            );


            try {

                 
                await window.api.addPcBuildItem(
                    currentBuildId,
                    productId,

                    Number(
                        oldItem.quantity
                        || 1
                    )
                );


            } catch (addError) {

                console.error(
                    "New component rejected:",
                    addError
                );


                 
                 
                 

                try {

                    await window.api.addPcBuildItem(
                        currentBuildId,
                        oldItem.productId,

                        Number(
                            oldItem.quantity
                            || 1
                        )
                    );


                } catch (rollbackError) {

                    console.error(
                        "Rollback old component failed:",
                        rollbackError
                    );
                }


                throw addError;
            }


            showBuilderMessage(
                "Thay linh kiện thành công.",
                "success"
            );


        } else {

             
             
             

            await window.api.addPcBuildItem(
                currentBuildId,
                productId,
                1
            );


            showBuilderMessage(
                "Đã thêm linh kiện vào cấu hình.",
                "success"
            );
        }


        document.getElementById(
            "componentModal"
        ).hidden =
            true;


        replacingBuildItem =
            null;


        await loadPcBuilds();


    } catch (error) {

        console.error(
            "Add/Replace PC Build item error:",
            error
        );


        showBuilderMessage(
            error.message
            || "Không thể cập nhật linh kiện.",
            "error"
        );


        replacingBuildItem =
            null;


         
         
        await loadPcBuilds();


    } finally {

        button.disabled =
            false;

        button.textContent =
            "Chọn";
    }
}

 
 
 

function setupCheckBuild() {

    const button =
        document.getElementById(
            "checkBuildButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        checkCurrentBuild
    );
}


async function checkCurrentBuild() {

    if (!currentBuildId) {

        showBuilderMessage(
            "Vui lòng chọn cấu hình PC.",
            "error"
        );

        return;
    }


    const checkButton =
        document.getElementById(
            "checkBuildButton"
        );


    const cartButton =
        document.getElementById(
            "addBuildToCartButton"
        );


    try {

        checkButton.disabled = true;

        checkButton.textContent =
            "Đang kiểm tra...";


        cartButton.disabled = true;


        setBuildStatus(
            "buildValidation",
            "Đang kiểm tra...",
            "neutral"
        );


        setBuildStatus(
            "buildCompatibility",
            "Đang kiểm tra...",
            "neutral"
        );


        setBuildStatus(
            "buildReady",
            "Đang kiểm tra...",
            "neutral"
        );


        const [
            validation,
            compatibility,
            ready
        ] =
            await Promise.all([

                window.api.validatePcBuild(
                    currentBuildId
                ),

                window.api.checkPcBuildCompatibility(
                    currentBuildId
                ),

                window.api.checkPcBuildReady(
                    currentBuildId
                )

            ]);


        renderValidationResult(
            validation
        );


        renderCompatibilityResult(
            validation,
            compatibility
        );


        renderReadyResult(
            ready
        );


         
         
        cartButton.disabled =
            !ready.ready;


        if (ready.ready) {

            showBuilderMessage(
                "Cấu hình đã đầy đủ và tương thích.",
                "success"
            );

        } else {

            showBuilderMessage(
                "Cấu hình chưa sẵn sàng.",
                "error"
            );
        }


    } catch (error) {

        console.error(
            "Check PC Build error:",
            error
        );


        resetBuildStatus();


        cartButton.disabled = true;


        showBuilderMessage(
            error.message
            || "Không thể kiểm tra cấu hình.",
            "error"
        );


    } finally {

        checkButton.disabled = false;

        checkButton.textContent =
            "Kiểm tra cấu hình";
    }
}

 
 
 

function renderValidationResult(
    validation
) {

    if (validation.valid) {

        setBuildStatus(
            "buildValidation",
            validation.message
            || "Đã đủ linh kiện bắt buộc",
            "success"
        );

        return;
    }


    const missing =
        Array.isArray(
            validation.missingComponents
        )
        ?
        validation.missingComponents
        : [];


    let message =
        validation.message
        || "Cấu hình chưa đầy đủ";


    if (missing.length > 0) {

        message +=
            `: ${missing.join(", ")}`;
    }


    setBuildStatus(
        "buildValidation",
        message,
        "warning"
    );
}


 
 
 

function renderCompatibilityResult(
    validation,
    compatibility
) {

    const itemCount =
        Array.isArray(currentBuildItems)
            ? currentBuildItems.length
            : 0;


     
     
     

    if (itemCount === 0) {

        setBuildStatus(
            "buildCompatibility",
            "Chưa có linh kiện để kiểm tra",
            "neutral"
        );

        return;
    }


     
     
     

    if (!compatibility.compatible) {

        const issues =
            Array.isArray(
                compatibility.issues
            )
                ? compatibility.issues
                : [];


        let message =
            compatibility.message
            || "Có linh kiện không tương thích";


        if (issues.length > 0) {

            message +=
                `: ${issues.join(" • ")}`;
        }


        setBuildStatus(
            "buildCompatibility",
            message,
            "error"
        );

        return;
    }


     
     
     
     
     

    if (!validation.valid) {

        setBuildStatus(
            "buildCompatibility",
            "Các linh kiện đã chọn hiện chưa phát hiện xung đột",
            "warning"
        );

        return;
    }


     
     
     

    setBuildStatus(
        "buildCompatibility",
        compatibility.message
        || "Tất cả linh kiện đều tương thích",
        "success"
    );
}


 
 
 

function renderReadyResult(
    ready
) {

    if (ready.ready) {

        setBuildStatus(
            "buildReady",
            ready.message
            || "Sẵn sàng",
            "success"
        );

        return;
    }


    setBuildStatus(
        "buildReady",
        ready.message
        || "Chưa sẵn sàng",
        "warning"
    );
}

 
 
 

function setupAddBuildToCart() {

    const button =
        document.getElementById(
            "addBuildToCartButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        addCurrentBuildToCart
    );
}


async function addCurrentBuildToCart() {

    if (!currentBuildId) {

        showBuilderMessage(
            "Vui lòng chọn cấu hình.",
            "error"
        );

        return;
    }


    const button =
        document.getElementById(
            "addBuildToCartButton"
        );


    try {

        button.disabled = true;

        button.textContent =
            "Đang thêm...";


        await window.api.addPcBuildToCart(
            currentBuildId
        );


        await updateCartCount();


        showBuilderMessage(
            "Đã thêm toàn bộ cấu hình vào giỏ hàng.",
            "success"
        );


        button.textContent =
            "Đã thêm vào giỏ hàng";


    } catch (error) {

        console.error(
            "Add Build To Cart error:",
            error
        );


        button.disabled = false;

        button.textContent =
            "Thêm cả bộ vào giỏ hàng";


        showBuilderMessage(
            error.message
            || "Không thể thêm cấu hình vào giỏ hàng.",
            "error"
        );
    }
}

 
 
 

function setupBuildActions() {

    const renameButton =
        document.getElementById(
            "renameBuildButton"
        );


    const deleteButton =
        document.getElementById(
            "deleteBuildButton"
        );


    if (renameButton) {

        renameButton.addEventListener(
            "click",
            renameCurrentBuild
        );
    }


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            deleteCurrentBuild
        );
    }
}


 
 
 

async function renameCurrentBuild() {

    if (!currentBuildId) {
        return;
    }


    const currentBuild =
        pcBuilds.find(
            build =>
                Number(build.buildId)
                ===
                Number(currentBuildId)
        );


    const oldName =
        currentBuild?.buildName
        || "";


    const newName =
        window.prompt(
            "Nhập tên mới cho cấu hình:",
            oldName
        );


     
    if (newName === null) {
        return;
    }


    const buildName =
        newName.trim();


    if (!buildName) {

        showBuilderMessage(
            "Tên cấu hình không được để trống.",
            "error"
        );

        return;
    }


    if (buildName === oldName) {
        return;
    }


    try {

        await window.api.updatePcBuild(
            currentBuildId,
            buildName
        );


        showBuilderMessage(
            "Đổi tên cấu hình thành công.",
            "success"
        );


        await loadPcBuilds();


    } catch (error) {

        console.error(
            "Rename PC Build error:",
            error
        );


        showBuilderMessage(
            error.message
            || "Không thể đổi tên cấu hình.",
            "error"
        );
    }
}


 
 
 

async function deleteCurrentBuild() {

    if (!currentBuildId) {
        return;
    }


    const currentBuild =
        pcBuilds.find(
            build =>
                Number(build.buildId)
                ===
                Number(currentBuildId)
        );


    const buildName =
        currentBuild?.buildName
        || "PC Build";


    const confirmed =
        window.confirm(
            `Bạn có chắc muốn xóa cấu hình "${buildName}"?\n\n`
            +
            "Các linh kiện trong PC Build này cũng sẽ bị xóa khỏi cấu hình."
        );


    if (!confirmed) {
        return;
    }


    const deletedBuildId =
        currentBuildId;


    try {

        await window.api.deletePcBuild(
            deletedBuildId
        );


         
        currentBuildId = null;

        currentBuildItems = [];


        showBuilderMessage(
            "Xóa cấu hình thành công.",
            "success"
        );


        await loadPcBuilds();


    } catch (error) {

        console.error(
            "Delete PC Build error:",
            error
        );


        showBuilderMessage(
            error.message
            || "Không thể xóa cấu hình.",
            "error"
        );
    }
}

 
 
 

function setupBuildItemActions() {

     
     
     

    document
        .querySelectorAll(
            ".increase-build-item"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const itemId =
                        Number(
                            button.dataset.itemId
                        );


                    const currentQuantity =
                        Number(
                            button.dataset.quantity
                        );


                    await changeBuildItemQuantity(
                        itemId,
                        currentQuantity + 1
                    );
                }
            );
        });


     
     
     

    document
        .querySelectorAll(
            ".decrease-build-item"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const itemId =
                        Number(
                            button.dataset.itemId
                        );


                    const currentQuantity =
                        Number(
                            button.dataset.quantity
                        );


                    if (currentQuantity <= 1) {

                        showBuilderMessage(
                            "Số lượng tối thiểu là 1. Nếu không cần linh kiện này, hãy bấm nút × để xóa.",
                            "error"
                        );

                        return;
                    }


                    await changeBuildItemQuantity(
                        itemId,
                        currentQuantity - 1
                    );
                }
            );
        });


     
     
     

    document
        .querySelectorAll(
            ".remove-build-item-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const itemId =
                        Number(
                            button.dataset.itemId
                        );


                    const productName =
                        button.dataset.productName
                        || "linh kiện";


                    await removeBuildItem(
                        itemId,
                        productName
                    );
                }
            );
        });
}

 
 
 

async function changeBuildItemQuantity(
    buildItemId,
    quantity
) {

    if (!currentBuildId) {
        return;
    }


    try {
        const targetItem = currentBuildItems.find(item => Number(item.buildItemId) === Number(buildItemId));
        if (targetItem && ["RAM", "SSD", "HDD"].includes(normalizeCategory(targetItem.categoryName))) {
            const slot = await checkBuilderSlotAllowance(targetItem, quantity, buildItemId);
            if (slot.state === "incompatible") {
                showBuilderMessage(slot.message, "error");
                return;
            }
        }
        invalidateBuildCheckState();
        await window.api.updatePcBuildItem(
            currentBuildId,
            buildItemId,
            quantity
        );


        showBuilderMessage(
            "Đã cập nhật số lượng linh kiện.",
            "success"
        );


         
         
         
         
         
        await loadPcBuilds();


    } catch (error) {

        console.error(
            "Update build item quantity error:",
            error
        );


        showBuilderMessage(
            error.message
            || "Không thể cập nhật số lượng.",
            "error"
        );
    }
}

 
 
 

async function removeBuildItem(
    buildItemId,
    productName
) {

    if (!currentBuildId) {
        return;
    }


    const confirmed =
        window.confirm(
            `Bạn có chắc muốn xóa "${productName}" khỏi cấu hình?`
        );


    if (!confirmed) {
        return;
    }


    try {
        invalidateBuildCheckState();
        await window.api.deletePcBuildItem(
            currentBuildId,
            buildItemId
        );


        showBuilderMessage(
            "Đã xóa linh kiện khỏi cấu hình.",
            "success"
        );


        await loadPcBuilds();


    } catch (error) {

        console.error(
            "Delete build item error:",
            error
        );


        showBuilderMessage(
            error.message
            || "Không thể xóa linh kiện.",
            "error"
        );
    }
}

function findBuildItemByCategory(
    category,
    items = currentBuildItems
) {

    if (!Array.isArray(items)) {
        return null;
    }


    return (
        items.find(item => {

            const itemCategory =
                normalizeCategory(
                    item.categoryName
                );


            if (category === "STORAGE") {

                return (
                    itemCategory === "SSD"
                    ||
                    itemCategory === "HDD"
                );
            }


            return (
                itemCategory === category
            );

        })
        || null
    );
}

function getReplaceButtonText(
    category
) {

    switch (category) {

        case "CPU":
            return "Thay CPU";

        case "MAINBOARD":
            return "Thay Mainboard";

        case "RAM":
            return "Thay RAM";

        case "GPU":
            return "Thay GPU";

        case "STORAGE":
            return "Thay lưu trữ";

        case "PSU":
            return "Thay PSU";

        case "CASE":
            return "Thay Case";

        case "COOLING":
            return "Thay Cooling";

        default:
            return "Thay";
    }
}

function getReplaceModalTitle(
    category
) {

    switch (category) {

        case "CPU":
            return "Thay CPU";

        case "MAINBOARD":
            return "Thay Mainboard";

        case "RAM":
            return "Thay RAM";

        case "GPU":
            return "Thay Card đồ họa";

        case "STORAGE":
            return "Thay SSD / HDD";

        case "PSU":
            return "Thay nguồn PSU";

        case "CASE":
            return "Thay Case";

        case "COOLING":
            return "Thay tản nhiệt";

        default:
            return "Thay linh kiện";
    }
}

 
 
 

function invalidateBuildCheckState() {

    resetBuildStatus();


    const cartButton =
        document.getElementById(
            "addBuildToCartButton"
        );


    if (cartButton) {

        cartButton.disabled =
            true;

        cartButton.textContent =
            "Thêm cả bộ vào giỏ hàng";
    }
}

function setupMobileBuilderMenu() {
    const button = document.getElementById("pcBuilderMenuButton");
    const menu = document.getElementById("pcBuilderMobileMenu");

    if (!button || !menu) {
        return;
    }

    function closeMenu() {
        menu.hidden = true;
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Mở menu điều hướng");
    }

    button.addEventListener("click", () => {
        const willOpen = menu.hidden;
        menu.hidden = !willOpen;
        button.setAttribute("aria-expanded", String(willOpen));
        button.setAttribute("aria-label", willOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng");
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !menu.hidden) {
            closeMenu();
            button.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 767 && !menu.hidden) {
            closeMenu();
        }
    });
}
