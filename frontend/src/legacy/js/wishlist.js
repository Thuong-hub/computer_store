document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!window.api.getToken()) {

            window.location.href =
                `/pages/login.html?redirect=${encodeURIComponent(window.location.href)}`;

            return;
        }

        setupWishlistSearch();

        await updateWishlistCartCount();

        await loadWishlist();
    }
);


async function loadWishlist() {

    const grid =
        document.getElementById(
            "wishlistGrid"
        );

    const empty =
        document.getElementById(
            "wishlistEmpty"
        );

    const count =
        document.getElementById(
            "wishlistCount"
        );

    try {

        const items =
            await window.api.request(
                "/api/wishlist"
            );

        const wishlistItems =
            Array.isArray(items)
                ? items
                : [];

        count.textContent =
            `${wishlistItems.length} sản phẩm`;

        if (
            wishlistItems.length
            === 0
        ) {

            grid.innerHTML = "";

            grid.hidden = true;

            empty.hidden = false;

            return;
        }

        grid.hidden = false;

        empty.hidden = true;

        grid.innerHTML =
            wishlistItems
                .map(
                    item =>
                        createWishlistCard(
                            item
                        )
                )
                .join("");

        setupWishlistActions();

    } catch (error) {

        grid.innerHTML = "";

        count.textContent =
            "0 sản phẩm";

        showWishlistMessage(
            error.message
            ||
            "Không thể tải danh sách yêu thích.",
            "error"
        );
    }
}


function createWishlistCard(item) {

    const productId =
        Number(
            item.productId
            || 0
        );

    const name =
        item.productName
        ||
        "Sản phẩm";

    const price =
        Number(
            item.price
            || 0
        );

    const stock =
        Number(
            item.stockQuantity
            || 0
        );

    const image =
        normalizeWishlistImage(
            item.imageUrl
        );

    return `
        <article class="wishlist-card">

            <a
                href="/pages/product-detail.html?id=${productId}"
                class="wishlist-image"
            >
                <img
                    src="${escapeWishlistHtml(image)}"
                    alt="${escapeWishlistHtml(name)}"
                    onerror="this.onerror=null;this.src='/images/products/no-image.png';"
                >
            </a>

            <div class="wishlist-info">

                <a
                    href="/pages/product-detail.html?id=${productId}"
                    class="wishlist-name"
                >
                    ${escapeWishlistHtml(name)}
                </a>

                <div class="wishlist-stock ${
                    stock > 0
                        ? "in-stock"
                        : "out-of-stock"
                }">
                    ${
                        stock > 0
                            ? `Còn ${stock} sản phẩm`
                            : "Hết hàng"
                    }
                </div>

                <strong class="wishlist-price">
                    ${formatWishlistCurrency(price)}
                </strong>

                <div class="wishlist-actions">

                    <a
                        href="/pages/product-detail.html?id=${productId}"
                        class="wishlist-detail-button"
                    >
                        Xem chi tiết
                    </a>

                    <button
                        type="button"
                        class="wishlist-cart-button"
                        data-product-id="${productId}"
                        ${stock <= 0 ? "disabled" : ""}
                    >
                        ${
                            stock > 0
                                ? "Thêm vào giỏ"
                                : "Hết hàng"
                        }
                    </button>

                    <button
                        type="button"
                        class="wishlist-remove-button"
                        data-product-id="${productId}"
                    >
                        Xóa
                    </button>

                </div>

            </div>

        </article>
    `;
}


function setupWishlistActions() {

    document
        .querySelectorAll(
            ".wishlist-remove-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const productId =
                            Number(
                                button.dataset.productId
                            );

                        if (!productId) {
                            return;
                        }

                        try {

                            button.disabled = true;

                            await window.api.request(
                                `/api/wishlist/${productId}`,
                                {
                                    method: "DELETE"
                                }
                            );

                            showWishlistMessage(
                                "Đã xóa sản phẩm khỏi danh sách yêu thích.",
                                "success"
                            );

                            await loadWishlist();

                        } catch (error) {

                            button.disabled = false;

                            showWishlistMessage(
                                error.message
                                ||
                                "Không thể xóa sản phẩm.",
                                "error"
                            );
                        }
                    }
                );
            }
        );

    document
        .querySelectorAll(
            ".wishlist-cart-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const productId =
                            Number(
                                button.dataset.productId
                            );

                        if (!productId) {
                            return;
                        }

                        try {

                            button.disabled = true;

                            await window.api.addToCart(
                                productId,
                                1
                            );

                            await updateWishlistCartCount();

                            showWishlistMessage(
                                "Đã thêm sản phẩm vào giỏ hàng.",
                                "success"
                            );

                        } catch (error) {

                            showWishlistMessage(
                                error.message
                                ||
                                "Không thể thêm vào giỏ hàng.",
                                "error"
                            );

                        } finally {

                            button.disabled = false;
                        }
                    }
                );
            }
        );
}


async function updateWishlistCartCount() {

    const count =
        document.getElementById(
            "cartCount"
        );

    if (!count) {
        return;
    }

    try {

        const cart =
            await window.api.getCartItems();

        count.textContent =
            cart.totalQuantity
            ??
            (
                Array.isArray(
                    cart.items
                )
                    ? cart.items.reduce(
                        (sum, item) =>
                            sum
                            +
                            Number(
                                item.quantity
                                || 0
                            ),
                        0
                    )
                    : 0
            );

    } catch (error) {

        count.textContent =
            "0";
    }
}


function setupWishlistSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );

    const button =
        document.getElementById(
            "searchButton"
        );

    if (
        !input
        ||
        !button
    ) {
        return;
    }

    const search =
        () => {

            const keyword =
                input.value.trim();

            if (!keyword) {
                return;
            }

            window.location.href =
                `/pages/products.html?keyword=${encodeURIComponent(keyword)}`;
        };

    button.addEventListener(
        "click",
        search
    );

    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key
                === "Enter"
            ) {
                search();
            }
        }
    );
}


function normalizeWishlistImage(imageUrl) {

    if (!imageUrl) {
        return "/images/products/no-image.png";
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
            "/static/images/products/"
        )
    ) {
        return path.replace(
            "/static/images/products/",
            "/images/products/"
        );
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

    return `/images/products/${path.split("/").pop()}`;
}


function showWishlistMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "wishlistMessage"
        );

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.className =
        `wishlist-message ${type || ""}`;

    setTimeout(
        () => {

            element.textContent =
                "";

            element.className =
                "wishlist-message";
        },
        2500
    );
}


function formatWishlistCurrency(value) {

    return new Intl.NumberFormat(
        "vi-VN",
        {
            style: "currency",
            currency: "VND"
        }
    ).format(
        Number(value || 0)
    );
}


function escapeWishlistHtml(value) {

    return String(
        value
        ?? ""
    )
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
