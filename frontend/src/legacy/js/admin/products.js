let adminProducts = [];

let adminCategories = [];

let adminBrands = [];

let currentProductFilter ="ALL";

let editingProductId = null;

 
 
 

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!checkAdminAccess()) {
            return;
        }


        setupAdminUser();

        setupLogout();

        setupProductFilter();

        setupProductSearch();

        setupAddProductButton();

        setupProductModal();

        await loadProductOptions();

        await loadAdminProducts();
    }
);


 
 
 

function checkAdminAccess() {

    const token =
        window.api.getToken();


    if (!token) {

        window.location.href =
            "/pages/login.html";

        return false;
    }


    let user = {};


    try {

        user =
            JSON.parse(
                localStorage.getItem("user")
                || "{}"
            );

    } catch {
        user = {};
    }


    if (
        String(user.role || "")
            .toUpperCase()
        !==
        "ADMIN"
    ) {

        window.location.href = "/";

        return false;
    }


    return true;
}


 
 
 

function setupAdminUser() {

    let user = {};


    try {

        user =
            JSON.parse(
                localStorage.getItem("user")
                || "{}"
            );

    } catch {
        user = {};
    }


    const displayName =
        user.fullName
        ||
        user.username
        ||
        "Admin";


    document.getElementById(
        "adminName"
    ).textContent =
        displayName;


    document.querySelector(
        ".admin-avatar"
    ).textContent =
        displayName
            .charAt(0)
            .toUpperCase();
}


 
 
 

function setupLogout() {

    document.getElementById(
        "adminLogoutButton"
    ).addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "/pages/login.html";
        }
    );
}


 
 
 

async function loadAdminProducts() {

    const body =
        document.getElementById(
            "adminProductTableBody"
        );


    body.innerHTML = `
        <tr>

            <td
                colspan="8"
                class="admin-table-empty"
            >
                Đang tải sản phẩm...
            </td>

        </tr>
    `;


    try {

       const response = await window.api.getAdminProducts();


        adminProducts =
            Array.isArray(response)
                ? response
                : [];


        renderAdminProducts();


    } catch (error) {

        console.error(
            "Load products error:",
            error
        );


        body.innerHTML = `
            <tr>

                <td
                    colspan="8"
                    class="admin-table-empty"
                >
                    Không thể tải sản phẩm.
                </td>

            </tr>
        `;
    }
}


 
 
 

function renderAdminProducts() {

    const body =
        document.getElementById(
            "adminProductTableBody"
        );


    const keyword =
        document.getElementById(
            "adminProductSearch"
        )
        .value
        .trim()
        .toLowerCase();


    const filtered =
        adminProducts.filter(product => {

            const status =
                String(
                    product.status || "ACTIVE"
                ).toUpperCase();


            const stock =
                Number(
                    product.stockQuantity || 0
                );


            let matchesFilter = status !== "DELETED";

            if (currentProductFilter === "DELETED") {
                matchesFilter = status === "DELETED";
            }


            if (
                currentProductFilter
                ===
                "ACTIVE"
            ) {

                matchesFilter =
                    status === "ACTIVE"
                    &&
                    stock > 0;
            }


            if (
                currentProductFilter
                ===
                "INACTIVE"
            ) {

                matchesFilter =
                    status === "INACTIVE";
            }


            if (
                currentProductFilter
                ===
                "LOW_STOCK"
            ) {

                matchesFilter =
                    status === "ACTIVE"
                    &&
                    stock > 0
                    &&
                    stock <= 5;
            }


            if (
                currentProductFilter
                ===
                "OUT_OF_STOCK"
            ) {

                matchesFilter =
                    status === "ACTIVE"
                    &&
                    stock === 0;
            }


            const searchText =
                [
                    product.productId,
                    product.name,
                    product.category?.name,
                    product.brand?.name
                ]
                    .join(" ")
                    .toLowerCase();


            const matchesSearch =
                !keyword
                ||
                searchText.includes(
                    keyword
                );


            return (
                matchesFilter
                &&
                matchesSearch
            );
        });


    document.getElementById(
        "adminProductCount"
    ).textContent =
        `${filtered.length} sản phẩm`;


    if (filtered.length === 0) {

        body.innerHTML = `
            <tr>

                <td
                    colspan="8"
                    class="admin-table-empty"
                >
                    Không có sản phẩm phù hợp.
                </td>

            </tr>
        `;

        return;
    }


    body.innerHTML =
        filtered
            .map(product => {

                const status =
                    String(
                        product.status || "ACTIVE"
                    ).toUpperCase();


                const stock =
                    Number(
                        product.stockQuantity || 0
                    );


                const category =
                    product.category?.name
                    || `#${product.categoryId}`;


                const brand =
                    product.brand?.name
                    || `#${product.brandId}`;


                return `

                    <tr>

                        <td>
                            #${product.productId}
                        </td>


                        <td>

                            <div class="admin-product-info">

                                <img
                                    class="admin-product-image"

                                    src="${normalizeImage(
                                        product.imageUrl
                                    )}"

                                    alt="${escapeHtml(
                                        product.name
                                    )}"
                                >


                                <div class="admin-product-name">

                                    <strong>
                                        ${escapeHtml(
                                            product.name
                                        )}
                                    </strong>

                                    <span>
                                        ID: ${product.productId}
                                    </span>

                                </div>

                            </div>

                        </td>


                        <td>
                            ${escapeHtml(category)}
                        </td>


                        <td>
                            ${escapeHtml(brand)}
                        </td>


                        <td>

                            <strong>
                                ${formatCurrency(
                                    product.price
                                )}
                            </strong>

                        </td>


                        <td>

                            <span
                                class="
                                    admin-stock
                                    ${
                                        stock <= 5
                                            ? "low"
                                            : "normal"
                                    }
                                "
                            >
                                ${stock}
                            </span>

                        </td>


                        <td>

                            <span
                                class="
                                    admin-product-status
                                    ${
                                        status === "INACTIVE" || status === "DELETED"
                                            ? "inactive"
                                            : stock === 0
                                                ? "inactive"
                                                : "active"
                                    }
                                "
                            >
                                ${
                                    status === "DELETED"
                                        ? "Đã xóa"
                                        : status === "INACTIVE"
                                        ? "Ngừng bán"
                                        : stock === 0
                                            ? "Hết hàng"
                                            : "Đang bán"
                                }
                            </span>

                        </td>


                        <td>

<div class="admin-product-actions">

    ${status !== "DELETED" ? `
        <button
            type="button"
            class="admin-product-edit"
            data-product-id="${product.productId}"
        >
            Sửa
        </button>
    ` : ""}

    ${status === "ACTIVE" ? `
        <button
            type="button"
            class="admin-product-stop"
            data-product-id="${product.productId}"
            data-product-name="${escapeHtml(product.name)}"
        >
            Ngừng bán
        </button>
    ` : `
        <button
            type="button"
            class="admin-product-restore"
            data-product-id="${product.productId}"
            data-product-name="${escapeHtml(product.name)}"
        >
            Khôi phục
        </button>
    `}

    ${status !== "DELETED" ? `
        <button
            type="button"
            class="admin-product-remove"
            data-product-id="${product.productId}"
            data-product-name="${escapeHtml(product.name)}"
        >
            Xóa
        </button>
    ` : ""}

</div>

                        </td>

                    </tr>
                `;

            })
            .join("");


    setupProductActions();
}


 
 
 

function setupProductFilter() {

    document
        .querySelectorAll(
            ".admin-product-filter"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".admin-product-filter"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );
                        });


                    button.classList.add(
                        "active"
                    );


                    currentProductFilter =
                        button.dataset.filter;


                    renderAdminProducts();
                }
            );
        });
}


 
 
 

function setupProductSearch() {

    document.getElementById(
        "adminProductSearch"
    ).addEventListener(
        "input",
        renderAdminProducts
    );
}


 
 
 

function setupProductActions() {

     
     
     

    document
        .querySelectorAll(
            ".admin-product-edit"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openEditProductModal(
                        Number(
                            button.dataset.productId
                        )
                    );
                }
            );
        });


     
     
     

    document
        .querySelectorAll(
            ".admin-product-stop"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const productId =
                        Number(
                            button.dataset.productId
                        );


                    const productName =
                        button.dataset.productName;


                    const confirmed =
                        window.confirm(
                            `Ngừng bán sản phẩm "${productName}"?`
                        );


                    if (!confirmed) {
                        return;
                    }


                    try {

                        await window.api.deleteProduct(
                            productId
                        );


                        showProductMessage(
                            "Đã chuyển sản phẩm sang trạng thái ngừng bán.",
                            "success"
                        );


                        await loadAdminProducts();


                    } catch (error) {

                        console.error(
                            "Disable product error:",
                            error
                        );


                        showProductMessage(
                            error.message
                            || "Không thể ngừng bán sản phẩm.",
                            "error"
                        );
                    }
                }
            );
        });


     
     
     

    document
        .querySelectorAll(".admin-product-remove")
        .forEach(button => {
            button.addEventListener("click", async () => {
                const productId = Number(button.dataset.productId);
                const productName = button.dataset.productName;
                const confirmed = window.confirm(
                    `Xóa sản phẩm "${productName}" khỏi danh sách bán hàng?\n` +
                    "Sản phẩm sẽ chuyển vào mục Đã xóa. Lịch sử đơn hàng vẫn được giữ."
                );

                if (!confirmed) {
                    return;
                }

                button.disabled = true;

                try {
                    await window.api.archiveProduct(productId);
                    showProductMessage("Đã xóa sản phẩm. Có thể khôi phục tại mục Đã xóa.", "success");
                    await loadAdminProducts();
                } catch (error) {
                    showProductMessage(error.message || "Không thể xóa sản phẩm.", "error");
                    button.disabled = false;
                }
            });
        });

    document
        .querySelectorAll(
            ".admin-product-restore"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const productId =
                        Number(
                            button.dataset.productId
                        );


                    const productName =
                        button.dataset.productName;


                    const confirmed =
                        window.confirm(
                            `Khôi phục sản phẩm "${productName}"?`
                        );


                    if (!confirmed) {
                        return;
                    }


                    try {

                        await window.api.restoreProduct(
                            productId
                        );


                        showProductMessage(
                            "Khôi phục sản phẩm thành công.",
                            "success"
                        );


                        await loadAdminProducts();


                    } catch (error) {

                        console.error(
                            "Restore product error:",
                            error
                        );


                        showProductMessage(
                            error.message
                            || "Không thể khôi phục sản phẩm.",
                            "error"
                        );
                    }
                }
            );
        });
}


 
 
 

function setupAddProductButton() {

    document.getElementById(
        "addProductButton"
    ).addEventListener(
        "click",
        openCreateProductModal
    );
}


 
 
 

function normalizeImage(imageUrl) {

    if (!imageUrl) {

        return "/images/products/no-image.png";
    }


    let path =
        String(imageUrl)
            .replaceAll("\\", "/");


    if (
        path.startsWith("http://")
        ||
        path.startsWith("https://")
        ||
        path.startsWith("/")
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


    return `/images/products/${
        path.split("/").pop()
    }`;
}


 
 
 

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "vi-VN"
    ).format(
        Number(value || 0)
    )
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

 
 
 

async function loadProductOptions() {

    try {

        const [
            categories,
            brands
        ] = await Promise.all([

            window.api.getCategories(),

            window.api.getBrands()

        ]);


        adminCategories =
            Array.isArray(categories)
                ? categories
                : [];


        adminBrands =
            Array.isArray(brands)
                ? brands
                : [];


        renderProductOptions();


    } catch (error) {

        console.error(
            "Load category/brand error:",
            error
        );
    }
}


function renderProductOptions() {

    const categorySelect =
        document.getElementById(
            "productCategory"
        );


    const brandSelect =
        document.getElementById(
            "productBrand"
        );


    categorySelect.innerHTML = `
        <option value="">
            -- Chọn danh mục --
        </option>

        ${
            adminCategories
                .map(category => `
                    <option
                        value="${category.categoryId}"
                    >
                        ${escapeHtml(
                            category.name
                        )}
                    </option>
                `)
                .join("")
        }
    `;


    brandSelect.innerHTML = `
        <option value="">
            -- Chọn thương hiệu --
        </option>

        ${
            adminBrands
                .map(brand => `
                    <option
                        value="${brand.brandId}"
                    >
                        ${escapeHtml(
                            brand.name
                        )}
                    </option>
                `)
                .join("")
        }
    `;
}

 
 
 

function setupProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    const closeButton =
        document.getElementById(
            "closeProductModal"
        );


    const cancelButton =
        document.getElementById(
            "cancelProductButton"
        );


    const overlay =
        modal.querySelector(
            ".admin-modal-overlay"
        );


    closeButton.addEventListener(
        "click",
        closeProductModal
    );


    cancelButton.addEventListener(
        "click",
        closeProductModal
    );


    overlay.addEventListener(
        "click",
        closeProductModal
    );


    document.getElementById(
        "productForm"
    ).addEventListener(
        "submit",
        saveProduct
    );
}


function openCreateProductModal() {

    editingProductId = null;


    document.getElementById(
        "productModalTitle"
    ).textContent =
        "Thêm sản phẩm";


    document.getElementById(
        "productForm"
    ).reset();


    document.getElementById(
        "productStatus"
    ).value =
        "ACTIVE";

    // Sản phẩm mới được tạo với tồn kho bằng 0.
    document.getElementById("productStock").value = 0;
    document.getElementById("productStockManageLink").hidden = true;
    document.getElementById("productStockHint").textContent =
        "Sản phẩm mới có tồn kho 0. Sau khi tạo, nhập hàng tại Tổng kho. ";

    document.getElementById(
        "productModal"
    ).hidden =
        false;
}


function openEditProductModal(
    productId
) {

    const product =
        adminProducts.find(
            item =>
                Number(item.productId)
                ===
                Number(productId)
        );


    if (!product) {
        return;
    }


    editingProductId =
        product.productId;


    document.getElementById(
        "productModalTitle"
    ).textContent =
        `Sửa sản phẩm #${product.productId}`;


    document.getElementById(
        "productName"
    ).value =
        product.name || "";


    document.getElementById(
        "productCategory"
    ).value =
        product.categoryId || "";


    document.getElementById(
        "productBrand"
    ).value =
        product.brandId || "";


    document.getElementById(
        "productPrice"
    ).value =
        product.price || 0;


    document.getElementById(
        "productStock"
    ).value =
        product.stockQuantity ?? 0;

    const stockLink = document.getElementById("productStockManageLink");
    stockLink.hidden = false;
    stockLink.href = `/pages/admin/inventory.html?productId=${encodeURIComponent(product.productId)}`;
    document.getElementById("productStockHint").textContent =
        "Tồn kho không chỉnh tại đây. Nhấn liên kết để nhập/xuất hoặc điều chỉnh. ";


    document.getElementById(
        "productStatus"
    ).value =
        product.status || "ACTIVE";


    document.getElementById(
        "productImage"
    ).value =
        getImageFilename(
            product.imageUrl
        );


    document.getElementById(
        "productDescription"
    ).value =
        product.description || "";


    document.getElementById(
        "productModal"
    ).hidden =
        false;
}


function closeProductModal() {

    document.getElementById(
        "productModal"
    ).hidden =
        true;


    editingProductId = null;
}

 
 
 

async function saveProduct(event) {

    event.preventDefault();


    const button =
        document.getElementById(
            "saveProductButton"
        );


    const product = {

        categoryId:
            Number(
                document.getElementById(
                    "productCategory"
                ).value
            ),

        brandId:
            Number(
                document.getElementById(
                    "productBrand"
                ).value
            ),

        name:
            document.getElementById(
                "productName"
            ).value.trim(),

        description:
            document.getElementById(
                "productDescription"
            ).value.trim(),

        price:
            Number(
                document.getElementById(
                    "productPrice"
                ).value
            ),

        imageUrl:
            document.getElementById(
                "productImage"
            ).value.trim(),

        status:
            document.getElementById(
                "productStatus"
            ).value
    };


    if (
        !product.categoryId
        ||
        !product.brandId
        ||
        !product.name
    ) {

        alert(
            "Vui lòng nhập đầy đủ thông tin bắt buộc."
        );

        return;
    }


    if (product.price < 0) {

        alert(
            "Giá sản phẩm không hợp lệ."
        );

        return;
    }



    // Chỉ khi tạo sản phẩm mới mới truyền tồn kho mặc định 0.
    // Khi sửa sản phẩm không gửi stockQuantity để tránh ghi đè dữ liệu kho.
    if (!editingProductId) {
        product.stockQuantity = 0;
    }

    try {

        button.disabled = true;


        if (editingProductId) {

            button.textContent =
                "Đang cập nhật...";


            await window.api.updateProduct(
                editingProductId,
                product
            );


        } else {

            button.textContent =
                "Đang thêm...";


            await window.api.createProduct(
                product
            );
        }


        closeProductModal();


        await loadAdminProducts();


    } catch (error) {

        console.error(
            "Save product error:",
            error
        );


        alert(
            error.message
            || "Không thể lưu sản phẩm."
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Lưu sản phẩm";
    }
}

function getImageFilename(imageUrl) {

    if (!imageUrl) {
        return "";
    }


    return String(imageUrl)
        .replaceAll("\\", "/")
        .split("/")
        .pop();
}

function showProductMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "adminMessage"
        );


    element.textContent =
        message;


    element.className =
        `admin-message ${type}`;


    setTimeout(
        () => {

            element.textContent = "";

            element.className =
                "admin-message";

        },
        3500
    );
}