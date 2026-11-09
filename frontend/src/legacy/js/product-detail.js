function saleTypeLabel(type) {
    switch (String(type || "").toUpperCase()) {
        case "BLACK_FRIDAY": return "BLACK FRIDAY";
        case "BESTSELLER": return "BESTSELLER";
        case "SALE": return "SALE";
        case "NEW_PRODUCT": return "SẢN PHẨM MỚI";
        default: return "ƯU ĐÃI";
    }
}

const CATEGORY_MAP = {
    1: "CPU",
    2: "GPU",
    3: "RAM",
    4: "Mainboard",
    5: "SSD",
    6: "HDD",
    7: "PSU",
    8: "Case",
    9: "Cooling",
    10: "Laptop",
    11: "Monitor",
    12: "Keyboard",
    13: "Mouse",
    14: "Headset"
};

let currentProduct = null;
let currentReviewUser = null;
let selectedReviewRating = 0;

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setupQuantityButtons();

        setupSearch();

        setupAddToCart();

        setupWishlistButton();

        await loadProductDetail();

        await refreshWishlistButton();

        await updateCartCount();
    }
);

async function loadProductDetail() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const productId =
        params.get("id");

    if (!productId) {

        showProductError(
            "Không tìm thấy mã sản phẩm."
        );

        return;
    }

    try {

        currentProduct =
            await window.api.getProductById(
                productId
            );

        renderProduct(
            currentProduct
        );
        try {
            const prices = await window.api.request("/api/pricing/products");
            const sale = prices.find(p => Number(p.productId) === Number(productId));
            if (sale && Number(sale.discountPercent) > 0) {
                const priceElement = document.getElementById("productPrice");
                priceElement.innerHTML = `<span class="sale-current-price">${formatCurrency(sale.effectivePrice)}</span>
                    <del class="sale-original-price">${formatCurrency(currentProduct.price)}</del>
                    <span class="sale-product-badge">${saleTypeLabel(sale.discountType)} -${sale.discountPercent}%</span>`;
            }
        } catch (error) {
            console.warn("Không tải được giảm giá sản phẩm", error);
        }

        await loadProductSpecs(
            productId
        );

        await loadProductReviews(
            productId
        );

    } catch (error) {

        console.error(
            "Load product detail error:",
            error
        );

        showProductError(
            error.message ||
            "Không thể tải sản phẩm."
        );
    }
}

function renderProduct(product) {

    const productId =
        product.productId ??
        product.id;

    const name =
        product.name ||
        "Sản phẩm";

    const price =
        Number(
            product.price || 0
        );

    const stock =
        Number(
            product.stockQuantity || 0
        );

    const description =
        product.description?.trim()
        ||
        "Sản phẩm hiện chưa có mô tả chi tiết.";

    const category =
        getCategoryName(product);

    const imageUrl =
        normalizeImageUrl(
            product.imageUrl
        );

    document.title =
        `${name} - Computer Store`;

    setText(
        "breadcrumbProductName",
        name
    );

    setText(
        "productCategory",
        category
    );

    setText(
        "productName",
        name
    );

    setText(
        "productPrice",
        formatCurrency(price)
    );

    setText(
        "productDescription",
        description
    );

    renderProductImage(
        imageUrl,
        name
    );

    renderStock(stock);

    const quantityInput =
        document.getElementById(
            "quantityInput"
        );

    if (quantityInput) {

        quantityInput.value = 1;

        quantityInput.max =
            stock > 0
                ? stock
                : 1;
    }

    const addCartButton =
        document.getElementById(
            "addToCartButton"
        );

    if (addCartButton) {

        addCartButton.disabled =
            stock <= 0;

        addCartButton.textContent =
            stock > 0
                ? "Thêm vào giỏ hàng"
                : "Hết hàng";
    }

    const builderButton =
        document.querySelector(
            ".detail-builder-button"
        );

    if (builderButton) {

        builderButton.href =
            `/pages/pc-builder.html?productId=${productId}`;
    }
}

function renderProductImage(
    imageUrl,
    productName
) {

    const container =
        document.getElementById(
            "productImageContainer"
        );

    if (!container) {
        return;
    }

    if (!imageUrl) {

        container.innerHTML = `
            <div class="detail-loading">
                NO IMAGE
            </div>
        `;

        return;
    }

    container.innerHTML = `
        <img
            src="${imageUrl}"
            alt="${escapeHtml(productName)}"

            onerror="
                this.style.display='none';
                this.nextElementSibling.style.display='flex';
            "
        >

        <div
            class="detail-loading"
            style="display:none;"
        >
            NO IMAGE
        </div>
    `;
}

function renderStock(stock) {

    const element =
        document.getElementById(
            "productStock"
        );

    if (!element) {
        return;
    }

    if (stock > 0) {

        element.textContent =
            `Còn ${stock} sản phẩm`;

        element.classList.remove(
            "out-of-stock"
        );

    } else {

        element.textContent =
            "Hết hàng";

        element.classList.add(
            "out-of-stock"
        );
    }
}

function setupQuantityButtons() {

    const input =
        document.getElementById(
            "quantityInput"
        );

    const decrease =
        document.getElementById(
            "decreaseQuantity"
        );

    const increase =
        document.getElementById(
            "increaseQuantity"
        );

    if (
        !input ||
        !decrease ||
        !increase
    ) {
        return;
    }

    decrease.addEventListener(
        "click",
        () => {

            let quantity =
                Number(input.value || 1);

            if (quantity > 1) {

                quantity--;

                input.value =
                    quantity;
            }
        }
    );

    increase.addEventListener(
        "click",
        () => {

            let quantity =
                Number(input.value || 1);

            const stock =
                Number(
                    currentProduct
                        ?.stockQuantity
                    || 0
                );

            if (
                stock > 0 &&
                quantity < stock
            ) {

                quantity++;

                input.value =
                    quantity;
            }
        }
    );

    input.addEventListener(
        "change",
        () => {

            let quantity =
                Number(input.value);

            const stock =
                Number(
                    currentProduct
                        ?.stockQuantity
                    || 0
                );

            if (
                !Number.isInteger(quantity)
                ||
                quantity < 1
            ) {

                quantity = 1;
            }

            if (
                stock > 0 &&
                quantity > stock
            ) {

                quantity =
                    stock;
            }

            input.value =
                quantity;
        }
    );
}

function getCategoryName(product) {

    if (product.categoryName) {

        return product.categoryName;
    }

    if (
        product.category &&
        product.category.name
    ) {

        return product.category.name;
    }

    if (product.categoryId) {

        return (
            CATEGORY_MAP[
                product.categoryId
            ]
            ||
            "Khác"
        );
    }

    return "Khác";
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
                search();
            }
        }
    );
}

function showProductError(message) {

    setText(
        "productName",
        "Không thể tải sản phẩm"
    );

    setText(
        "productStock",
        message
    );

    setText(
        "productPrice",
        "0 ₫"
    );

    setText(
        "productDescription",
        message
    );

    const image =
        document.getElementById(
            "productImageContainer"
        );

    if (image) {

        image.innerHTML = `
            <div class="detail-loading">
                PRODUCT NOT FOUND
            </div>
        `;
    }

    const button =
        document.getElementById(
            "addToCartButton"
        );

    if (button) {

        button.disabled = true;
    }
}

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;
    }
}

function normalizeImageUrl(imageUrl) {

    if (!imageUrl) {
        return null;
    }

    const path =
        String(imageUrl)
            .replaceAll("\\", "/")
            .trim();

    if (
        path.startsWith("http://")
        ||
        path.startsWith("https://")
    ) {
        return path;
    }

    if (
        path.startsWith("/images/products/")
    ) {
        return path;
    }

    if (
        path.startsWith("images/products/")
    ) {
        return `/${path}`;
    }

    if (
        path.startsWith("/static/images/products/")
    ) {
        return path.replace(
            "/static/images/products/",
            "/images/products/"
        );
    }

    if (
        path.startsWith("static/images/products/")
    ) {
        return path.replace(
            "static/images/products/",
            "/images/products/"
        );
    }

    return `/images/products/${path.split("/").pop()}`;
}

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "vi-VN",
        {
            style: "currency",
            currency: "VND"
        }
    ).format(value);
}

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}

async function loadProductSpecs(productId) {

    const container =
        document.getElementById(
            "productSpecs"
        );

    if (!container) {
        return;
    }

    try {

        const specs =
            await window.api.getProductSpecs(
                productId
            );

        if (
            !Array.isArray(specs)
            ||
            specs.length === 0
        ) {

            container.innerHTML = `
                <p>
                    Sản phẩm chưa có thông số kỹ thuật.
                </p>
            `;

            return;
        }

        renderProductSpecs(specs);

    } catch (error) {

        console.error(
            "Load specs error:",
            error
        );

        container.innerHTML = `
            <p>
                Không thể tải thông số kỹ thuật.
            </p>
        `;
    }
}

function renderProductSpecs(specs) {

    const container =
        document.getElementById(
            "productSpecs"
        );

    if (!container) {
        return;
    }

    const rows =
        specs
            .map(spec => {

                const name =
                    formatSpecName(
                        spec.specName
                    );

                const value =
                    spec.specValue || "";

                const unit =
                    spec.specUnit
                        ? ` ${spec.specUnit}`
                        : "";

                return `
                    <tr>

                        <td>
                            ${escapeHtml(name)}
                        </td>

                        <td>
                            ${escapeHtml(value)}
                            ${escapeHtml(unit)}
                        </td>

                    </tr>
                `;
            })
            .join("");

    container.innerHTML = `
        <table class="specs-table">

            <tbody>
                ${rows}
            </tbody>

        </table>
    `;
}

function formatSpecName(specName) {

    if (!specName) {
        return "Thông số";
    }

    return String(specName)
        .replaceAll("_", " ")
        .trim();
}

function setupAddToCart() {

    const button =
        document.getElementById(
            "addToCartButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        async () => {

            if (!currentProduct) {

                showMessage(
                    "Sản phẩm chưa được tải.",
                    "error"
                );

                return;
            }

            const token =
                window.api.getToken();

            if (!token) {

                showMessage(
                    "Bạn cần đăng nhập trước khi thêm vào giỏ hàng.",
                    "error"
                );

                setTimeout(() => {

                    const currentPage =
                        window.location.href;

                    window.location.href =
                        `/pages/login.html?redirect=${encodeURIComponent(currentPage)}`;

                }, 1000);

                return;
            }

            const input =
                document.getElementById(
                    "quantityInput"
                );

            const quantity =
                Number(
                    input?.value || 1
                );

            const productId =
                currentProduct.productId
                ??
                currentProduct.id;

            const stock =
                Number(
                    currentProduct.stockQuantity
                    || 0
                );

            if (stock <= 0) {

                showMessage(
                    "Sản phẩm đã hết hàng.",
                    "error"
                );

                return;
            }

            if (
                quantity < 1
                ||
                quantity > stock
            ) {

                showMessage(
                    "Số lượng không hợp lệ.",
                    "error"
                );

                return;
            }

            try {

                button.disabled = true;

                button.textContent =
                    "Đang thêm...";

                const response =
                    await window.api.addToCart(
                        productId,
                        quantity
                    );

                showMessage(
                    response.message
                    ||
                    "Thêm vào giỏ hàng thành công.",
                    "success"
                );

                await updateCartCount();

            } catch (error) {

                console.error(
                    "Add cart error:",
                    error
                );

                if (
                    error.message
                        .includes("403")
                ) {

                    showMessage(
                        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
                        "error"
                    );

                    localStorage.removeItem(
                        "token"
                    );

                } else {

                    showMessage(
                        error.message
                        ||
                        "Không thể thêm vào giỏ hàng.",
                        "error"
                    );
                }

            } finally {

                button.disabled =
                    stock <= 0;

                button.textContent =
                    stock > 0
                        ? "Thêm vào giỏ hàng"
                        : "Hết hàng";
            }
        }
    );
}

async function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    if (!cartCount) {
        return;
    }

    const token =
        window.api.getToken();

    if (!token) {

        cartCount.textContent = "0";

        return;
    }

    try {

        const cart =
            await window.api.getCartItems();

        cartCount.textContent =
            cart.totalQuantity ?? 0;

    } catch (error) {

        console.error(
            "Load cart count error:",
            error
        );

        cartCount.textContent =
            "0";
    }
}

function showMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "productMessage"
        );

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.classList.remove(
        "success",
        "error"
    );

    if (type) {

        element.classList.add(
            type
        );
    }
}

async function loadProductReviews(productId) {

    const container =
        document.getElementById(
            "productReviews"
        );

    if (!container) {
        return;
    }

    try {

        currentReviewUser = null;

        if (
            window.api.getToken()
        ) {

            try {

                currentReviewUser =
                    await window.api.getCurrentUser();

            } catch (error) {

                currentReviewUser = null;
            }
        }

        const reviews =
            await window.api.request(
                `/api/products/${productId}/reviews`
            );

        renderProductReviews(
            productId,
            Array.isArray(reviews)
                ? reviews
                : []
        );

    } catch (error) {

        container.innerHTML = `
            <div class="review-empty">
                Không thể tải đánh giá sản phẩm.
            </div>
        `;
    }
}


function renderProductReviews(
    productId,
    reviews
) {

    const container =
        document.getElementById(
            "productReviews"
        );

    if (!container) {
        return;
    }

    const currentUserId =
        Number(
            currentReviewUser?.userId
            ?? currentReviewUser?.id
            ?? 0
        );

    const currentUsername =
        String(
            currentReviewUser?.username
            || ""
        );

    const ownReview =
        reviews.find(
            review =>
                (
                    currentUserId > 0
                    &&
                    Number(review.userId)
                    === currentUserId
                )
                ||
                (
                    currentUsername
                    &&
                    String(review.username)
                    === currentUsername
                )
        )
        || null;

    const average =
        reviews.length > 0
            ? reviews.reduce(
                (sum, review) =>
                    sum
                    + Number(
                        review.rating
                        || 0
                    ),
                0
            )
            / reviews.length
            : 0;

    const formHtml =
        currentReviewUser
            ? renderReviewForm(
                ownReview
            )
            : `
                <div class="review-login-box">
                    <strong>
                        Bạn muốn đánh giá sản phẩm?
                    </strong>
                    <span>
                        Hãy đăng nhập để gửi đánh giá sau khi đơn hàng đã hoàn thành.
                    </span>
                    <a href="/pages/login.html">
                        Đăng nhập
                    </a>
                </div>
            `;

    const listHtml =
        reviews.length > 0
            ? reviews
                .map(
                    review =>
                        renderReviewItem(
                            review,
                            ownReview
                        )
                )
                .join("")
            : `
                <div class="review-empty">
                    Chưa có đánh giá nào cho sản phẩm này.
                </div>
            `;

    container.innerHTML = `
        <div class="review-summary">
            <div class="review-average">
                <strong>
                    ${average.toFixed(1)}
                </strong>
                <div>
                    <div class="review-summary-stars">
                        ${renderReviewStars(
                            Math.round(
                                average
                            )
                        )}
                    </div>
                    <span>
                        ${reviews.length} đánh giá
                    </span>
                </div>
            </div>
        </div>

        ${formHtml}

        <div
            id="reviewMessage"
            class="review-message"
        ></div>

        <div class="review-list">
            ${listHtml}
        </div>
    `;

    if (currentReviewUser) {

        setupReviewForm(
            productId,
            ownReview
        );
    }
}


function renderReviewForm(
    ownReview
) {

    return `
        <div class="review-form-box">

            <div class="review-form-heading">

                <div>
                    <strong>
                        ${
                            ownReview
                                ? "Đánh giá của bạn"
                                : "Viết đánh giá"
                        }
                    </strong>

                    <span>
                        Chỉ tài khoản đã mua sản phẩm và có đơn hàng hoàn thành mới được đánh giá.
                    </span>
                </div>

            </div>

            <div class="review-rating-field">

                <span>
                    Số sao
                </span>

                <div
                    id="reviewStarInput"
                    class="review-star-input"
                >
                    ${[1, 2, 3, 4, 5]
                        .map(
                            rating => `
                                <button
                                    type="button"
                                    class="review-star-button"
                                    data-rating="${rating}"
                                    aria-label="${rating} sao"
                                >
                                    ★
                                </button>
                            `
                        )
                        .join("")}
                </div>

            </div>

            <div class="review-comment-field">

                <label for="reviewComment">
                    Nội dung đánh giá
                </label>

                <textarea
                    id="reviewComment"
                    maxlength="1000"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                >${escapeHtml(
                    ownReview?.comment
                    || ""
                )}</textarea>

            </div>

            <div class="review-form-actions">

                <button
                    type="button"
                    id="submitReviewButton"
                    class="review-submit-button"
                >
                    ${
                        ownReview
                            ? "Cập nhật đánh giá"
                            : "Gửi đánh giá"
                    }
                </button>

                ${
                    ownReview
                        ? `
                            <button
                                type="button"
                                id="deleteReviewButton"
                                class="review-delete-button"
                            >
                                Xóa đánh giá
                            </button>
                        `
                        : ""
                }

            </div>

        </div>
    `;
}


function renderReviewItem(
    review,
    ownReview
) {

    const isOwn =
        ownReview
        &&
        Number(
            review.reviewId
        )
        ===
        Number(
            ownReview.reviewId
        );

    return `
        <article class="review-item">

            <div class="review-item-top">

                <div>

                    <strong class="review-username">
                        ${escapeHtml(
                            review.username
                            || "Người dùng"
                        )}
                    </strong>

                    ${
                        isOwn
                            ? `
                                <span class="review-owner-badge">
                                    Đánh giá của bạn
                                </span>
                            `
                            : ""
                    }

                </div>

                <span class="review-date">
                    ${formatReviewDate(
                        review.createdAt
                    )}
                </span>

            </div>

            <div class="review-stars">
                ${renderReviewStars(
                    review.rating
                )}
            </div>

            <p class="review-comment">
                ${escapeHtml(
                    review.comment
                    || "Không có nội dung."
                )}
            </p>

        </article>
    `;
}


function setupReviewForm(
    productId,
    ownReview
) {

    selectedReviewRating =
        Number(
            ownReview?.rating
            || 0
        );

    updateReviewStarInput();

    document
        .querySelectorAll(
            ".review-star-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        selectedReviewRating =
                            Number(
                                button.dataset.rating
                            );

                        updateReviewStarInput();
                    }
                );
            }
        );

    const submitButton =
        document.getElementById(
            "submitReviewButton"
        );

    submitButton?.addEventListener(
        "click",
        async () => {

            const comment =
                document.getElementById(
                    "reviewComment"
                )
                ?.value
                .trim()
                || "";

            if (
                selectedReviewRating < 1
                ||
                selectedReviewRating > 5
            ) {

                showReviewMessage(
                    "Vui lòng chọn từ 1 đến 5 sao.",
                    "error"
                );

                return;
            }

            if (!comment) {

                showReviewMessage(
                    "Vui lòng nhập nội dung đánh giá.",
                    "error"
                );

                return;
            }

            try {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    ownReview
                        ? "Đang cập nhật..."
                        : "Đang gửi...";

                await window.api.request(
                    `/api/products/${productId}/reviews`,
                    {
                        method:
                            ownReview
                                ? "PUT"
                                : "POST",
                        body:
                            JSON.stringify({
                                rating:
                                    selectedReviewRating,
                                comment
                            })
                    }
                );

                await loadProductReviews(
                    productId
                );

                showReviewMessage(
                    ownReview
                        ? "Cập nhật đánh giá thành công."
                        : "Gửi đánh giá thành công.",
                    "success"
                );

            } catch (error) {

                showReviewMessage(
                    error.message
                    || "Không thể lưu đánh giá.",
                    "error"
                );

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    ownReview
                        ? "Cập nhật đánh giá"
                        : "Gửi đánh giá";
            }
        }
    );

    const deleteButton =
        document.getElementById(
            "deleteReviewButton"
        );

    deleteButton?.addEventListener(
        "click",
        async () => {

            const confirmed =
                window.confirm(
                    "Bạn có chắc muốn xóa đánh giá này?"
                );

            if (!confirmed) {
                return;
            }

            try {

                deleteButton.disabled =
                    true;

                await window.api.request(
                    `/api/products/${productId}/reviews`,
                    {
                        method: "DELETE"
                    }
                );

                await loadProductReviews(
                    productId
                );

                showReviewMessage(
                    "Xóa đánh giá thành công.",
                    "success"
                );

            } catch (error) {

                showReviewMessage(
                    error.message
                    || "Không thể xóa đánh giá.",
                    "error"
                );

                deleteButton.disabled =
                    false;
            }
        }
    );
}


function updateReviewStarInput() {

    document
        .querySelectorAll(
            ".review-star-button"
        )
        .forEach(
            button => {

                const rating =
                    Number(
                        button.dataset.rating
                    );

                button.classList.toggle(
                    "active",
                    rating
                    <= selectedReviewRating
                );
            }
        );
}


function renderReviewStars(rating) {

    const value =
        Math.max(
            0,
            Math.min(
                5,
                Number(
                    rating
                    || 0
                )
            )
        );

    return [1, 2, 3, 4, 5]
        .map(
            star =>
                `<span class="${
                    star <= value
                        ? "filled"
                        : ""
                }">★</span>`
        )
        .join("");
}


function showReviewMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "reviewMessage"
        );

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.className =
        `review-message ${type || ""}`;
}


function formatReviewDate(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "vi-VN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(date);
}

function setupWishlistButton() {

    const button =
        document.getElementById(
            "wishlistButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        async () => {

            if (!currentProduct) {

                showMessage(
                    "Sản phẩm chưa được tải.",
                    "error"
                );

                return;
            }

            const token =
                window.api.getToken();

            if (!token) {

                showMessage(
                    "Bạn cần đăng nhập để sử dụng danh sách yêu thích.",
                    "error"
                );

                setTimeout(
                    () => {

                        window.location.href =
                            `/pages/login.html?redirect=${encodeURIComponent(window.location.href)}`;
                    },
                    700
                );

                return;
            }

            const productId =
                currentProduct.productId
                ??
                currentProduct.id;

            const isSaved =
                button.dataset.saved
                === "true";

            try {

                button.disabled = true;

                if (isSaved) {

                    await window.api.request(
                        `/api/wishlist/${productId}`,
                        {
                            method: "DELETE"
                        }
                    );

                    showMessage(
                        "Đã xóa sản phẩm khỏi danh sách yêu thích.",
                        "success"
                    );

                } else {

                    await window.api.request(
                        `/api/wishlist/${productId}`,
                        {
                            method: "POST"
                        }
                    );

                    showMessage(
                        "Đã thêm sản phẩm vào danh sách yêu thích.",
                        "success"
                    );
                }

                await refreshWishlistButton();

            } catch (error) {

                showMessage(
                    error.message
                    ||
                    "Không thể cập nhật danh sách yêu thích.",
                    "error"
                );

            } finally {

                button.disabled = false;
            }
        }
    );
}


async function refreshWishlistButton() {

    const button =
        document.getElementById(
            "wishlistButton"
        );

    if (
        !button
        ||
        !currentProduct
    ) {
        return;
    }

    const token =
        window.api.getToken();

    if (!token) {

        button.dataset.saved =
            "false";

        button.textContent =
            "♡ Thêm vào yêu thích";

        button.classList.remove(
            "saved"
        );

        return;
    }

    const productId =
        Number(
            currentProduct.productId
            ??
            currentProduct.id
        );

    try {

        const items =
            await window.api.request(
                "/api/wishlist"
            );

        const saved =
            Array.isArray(items)
            &&
            items.some(
                item =>
                    Number(
                        item.productId
                    )
                    === productId
            );

        button.dataset.saved =
            String(saved);

        button.textContent =
            saved
                ? "♥ Đã yêu thích"
                : "♡ Thêm vào yêu thích";

        button.classList.toggle(
            "saved",
            saved
        );

    } catch (error) {

        button.dataset.saved =
            "false";

        button.textContent =
            "♡ Thêm vào yêu thích";

        button.classList.remove(
            "saved"
        );
    }
}
