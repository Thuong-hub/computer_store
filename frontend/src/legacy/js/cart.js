

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


        setupSearch();

        setupClearCart();

        setupCheckout();

        setupCartEvents();


        await loadCart();
    }
);



async function loadCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const emptyCart =
        document.getElementById(
            "emptyCart"
        );


    try {

        cartItems.innerHTML = `
            <div class="cart-loading">
                Đang tải giỏ hàng...
            </div>
        `;


        const cart =
            await window.api.getCartItems();


        const items =
            Array.isArray(cart.items)
                ? cart.items
                : [];


        

        if (items.length === 0) {

            cartItems.innerHTML = "";

            emptyCart.hidden = false;

            updateCartSummary(
                0,
                0
            );

            updateHeaderCartCount(
                0
            );

            updateCartButtons(
                true
            );

            return;
        }


       

        emptyCart.hidden = true;


        renderCartItems(items);


        updateCartSummary(
            cart.totalQuantity ?? 0,
            cart.totalPrice ?? 0
        );


        updateHeaderCartCount(
            cart.totalQuantity ?? 0
        );


        updateCartButtons(
            false
        );


        await applyCartQuote();


    } catch (error) {

        console.error(
            "Load cart error:",
            error
        );


        cartItems.innerHTML = `
            <div class="cart-loading">
                Không thể tải giỏ hàng.
            </div>
        `;


        showCartMessage(
            error.message
            || "Không thể tải giỏ hàng.",
            "error"
        );
    }
}




function renderCartItems(items) {

    const container =
        document.getElementById(
            "cartItems"
        );


    container.innerHTML =
        items
            .map(item =>
                createCartItem(item)
            )
            .join("");
}




function createCartItem(item) {

    const image =
        normalizeImageUrl(
            item.imageUrl
        );


    return `
        <div
            class="cart-item"
            data-cart-item-id="${item.cartItemId}"
            data-product-id="${item.productId}"
        >

            <!-- PRODUCT -->
            <div class="cart-product">

                <a
                    class="cart-product-image"
                    href="/pages/product-detail.html?id=${item.productId}"
                >

                    <img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(item.productName)}"
                        onerror="
                            this.onerror=null;
                            this.src='/images/products/no-image.png';
                        "
                    >

                </a>


                <div class="cart-product-info">

                    <a
                        href="/pages/product-detail.html?id=${item.productId}"
                        class="cart-product-name"
                    >
                        ${escapeHtml(item.productName)}
                    </a>


                    <div class="cart-product-code">

                        Mã sản phẩm:
                        #${item.productId}

                    </div>

                </div>

            </div>


            <!-- PRICE -->
            <div class="cart-price">

                ${formatCurrency(item.price)}

            </div>


            <!-- QUANTITY -->
            <div class="cart-quantity">

                <button
                    type="button"
                    class="quantity-minus"
                    data-id="${item.cartItemId}"
                    data-quantity="${item.quantity}"
                >
                    −
                </button>


                <input
                    type="number"
                    class="quantity-input"
                    data-id="${item.cartItemId}"
                    value="${item.quantity}"
                    min="1"
                >


                <button
                    type="button"
                    class="quantity-plus"
                    data-id="${item.cartItemId}"
                    data-quantity="${item.quantity}"
                >
                    +
                </button>

            </div>


            <!-- SUBTOTAL -->
            <div class="cart-subtotal">

                ${formatCurrency(item.subtotal)}

            </div>


            <!-- DELETE -->
            <button
                type="button"
                class="remove-cart-item"
                data-id="${item.cartItemId}"
                title="Xóa sản phẩm"
            >
                ×
            </button>

        </div>
    `;
}




function setupCartEvents() {

    const container =
        document.getElementById(
            "cartItems"
        );


    container.addEventListener(
        "click",
        async event => {

            

            const minusButton =
                event.target.closest(
                    ".quantity-minus"
                );


            if (minusButton) {

                const cartItemId =
                    Number(
                        minusButton.dataset.id
                    );


                const input =
                    container.querySelector(
                        `.quantity-input[data-id="${cartItemId}"]`
                    );


                const currentQuantity =
                    Number(input.value);


                if (currentQuantity <= 1) {

                    showCartMessage(
                        "Số lượng tối thiểu là 1.",
                        "error"
                    );

                    return;
                }


                await changeQuantity(
                    cartItemId,
                    currentQuantity - 1
                );

                return;
            }


            

            const plusButton =
                event.target.closest(
                    ".quantity-plus"
                );


            if (plusButton) {

                const cartItemId =
                    Number(
                        plusButton.dataset.id
                    );


                const input =
                    container.querySelector(
                        `.quantity-input[data-id="${cartItemId}"]`
                    );


                const currentQuantity =
                    Number(input.value);


                await changeQuantity(
                    cartItemId,
                    currentQuantity + 1
                );

                return;
            }


           

            const removeButton =
                event.target.closest(
                    ".remove-cart-item"
                );


            if (removeButton) {

                const cartItemId =
                    Number(
                        removeButton.dataset.id
                    );


                await removeCartItem(
                    cartItemId
                );
            }
        }
    );


   

    container.addEventListener(
        "change",
        async event => {

            if (
                !event.target.classList
                    .contains(
                        "quantity-input"
                    )
            ) {

                return;
            }


            const input =
                event.target;


            const cartItemId =
                Number(
                    input.dataset.id
                );


            let quantity =
                Number(
                    input.value
                );


            if (
                !Number.isInteger(quantity)
                ||
                quantity < 1
            ) {

                quantity = 1;

                input.value = 1;
            }


            await changeQuantity(
                cartItemId,
                quantity
            );
        }
    );
}



async function changeQuantity(
    cartItemId,
    quantity
) {

    try {

        await window.api.updateCartItem(
            cartItemId,
            quantity
        );


        showCartMessage(
            "Đã cập nhật số lượng.",
            "success"
        );


        await loadCart();


    } catch (error) {

        console.error(
            "Update cart error:",
            error
        );


        showCartMessage(
            error.message
            || "Không thể cập nhật số lượng.",
            "error"
        );


        
        await loadCart();
    }
}




async function removeCartItem(
    cartItemId
) {

    const confirmed =
        window.confirm(
            "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await window.api.deleteCartItem(
                cartItemId
            );


        showCartMessage(
            response.message
            || "Đã xóa sản phẩm.",
            "success"
        );


        await loadCart();


    } catch (error) {

        console.error(
            "Delete cart item error:",
            error
        );


        showCartMessage(
            error.message
            || "Không thể xóa sản phẩm.",
            "error"
        );
    }
}




function setupClearCart() {

    const button =
        document.getElementById(
            "clearCartButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async () => {

            const confirmed =
                window.confirm(
                    "Bạn có chắc muốn xóa toàn bộ sản phẩm trong giỏ?"
                );


            if (!confirmed) {
                return;
            }


            try {

                button.disabled = true;


                const response =
                    await window.api.clearCart();


                showCartMessage(
                    response.message
                    || "Đã xóa toàn bộ giỏ hàng.",
                    "success"
                );


                await loadCart();


            } catch (error) {

                console.error(
                    "Clear cart error:",
                    error
                );


                showCartMessage(
                    error.message
                    || "Không thể xóa giỏ hàng.",
                    "error"
                );


            } finally {

                button.disabled = false;
            }
        }
    );
}



function updateCartSummary(
    totalQuantity,
    totalPrice
) {

    document.getElementById(
        "summaryQuantity"
    ).textContent =
        totalQuantity;


    document.getElementById(
        "summarySubtotal"
    ).textContent =
        formatCurrency(
            totalPrice
        );


    document.getElementById(
        "summaryTotal"
    ).textContent =
        formatCurrency(
            totalPrice
        );


    const description =
        document.getElementById(
            "cartDescription"
        );


    if (totalQuantity > 0) {

        description.textContent =
            `Bạn đang có ${totalQuantity} sản phẩm trong giỏ hàng.`;

    } else {

        description.textContent =
            "Giỏ hàng của bạn hiện đang trống.";
    }
}




function updateHeaderCartCount(
    totalQuantity
) {

    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (!cartCount) {
        return;
    }


    cartCount.textContent =
        totalQuantity;
}




function updateCartButtons(
    isEmpty
) {

    const clearButton =
        document.getElementById(
            "clearCartButton"
        );


    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    if (clearButton) {

        clearButton.disabled =
            isEmpty;
    }


    if (checkoutButton) {

        checkoutButton.disabled =
            isEmpty;
    }
}



function setupCheckout() {

    const button =
        document.getElementById(
            "checkoutButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            window.location.href =
                "/pages/checkout.html";
        }
    );
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




function showCartMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "cartMessage"
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


    setTimeout(
        () => {

            element.textContent = "";

            element.classList.remove(
                "success",
                "error"
            );

        },
        3000
    );
}




function normalizeImageUrl(
    imageUrl
) {

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



function formatCurrency(
    value
) {

    const number =
        Number(value || 0);


    return new Intl.NumberFormat(
        "vi-VN",
        {
            style: "currency",
            currency: "VND"
        }
    ).format(number);
}




function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* ===== Hiển thị giá sale / VIP trong giỏ hàng (lấy từ server, khớp với checkout) ===== */

function cartSaleLabel(type) {
    switch (String(type || "").toUpperCase()) {
        case "BLACK_FRIDAY": return "BLACK FRIDAY";
        case "BESTSELLER": return "BESTSELLER";
        case "SALE": return "SALE";
        case "NEW_PRODUCT": return "SẢN PHẨM MỚI";
        default: return "ƯU ĐÃI";
    }
}

function cartPercentText(value) {
    const n = Number(value || 0);
    return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "");
}

function cartLineBadge(quote, line) {
    switch (line.appliedSource) {
        case "PRODUCT":
            return `${cartSaleLabel(line.saleType)} -${line.salePercent}%`;
        case "MEMBERSHIP":
            if (quote.memberType === "VIP") return "";
            return `KHÁCH MỚI -${cartPercentText(line.finalPercent)}%`;
        case "COUPON":
            return `MÃ ${quote.promotionCode} -${cartPercentText(line.finalPercent)}%`;
        default:
            return "";
    }
}

function cartDiscountLabel(quote) {
    switch (quote.source) {
        case "PRODUCT": return "Giảm giá sản phẩm";
        case "MEMBERSHIP":
            return quote.memberType === "VIP"
                ? `Ưu đãi VIP ${quote.memberPercent}% trên tổng đơn`
                : `Ưu đãi khách mới (${quote.memberPercent}%)`;
        case "COUPON": return `Mã ${quote.promotionCode}`;
        default: return "Giảm giá";
    }
}

async function applyCartQuote() {
    let quote;
    try {
        quote = await window.api.request("/api/pricing/cart-quote");
    } catch (error) {
        console.warn("Cart quote unavailable:", error);
        return;
    }
    if (!quote) return;

    (quote.lines || []).forEach(line => {
        const row = document.querySelector(`.cart-item[data-product-id="${Number(line.productId)}"]`);
        if (!row) return;
        const unit = row.querySelector(".cart-price");
        const subtotal = row.querySelector(".cart-subtotal");
        const finalSubtotal = Number(line.finalSubtotal ?? line.originalSubtotal);
        const original = Number(line.originalSubtotal);
        const badge = cartLineBadge(quote, line);
        if (!badge || finalSubtotal >= original) return;

        if (unit && quote.source === "PRODUCT") {
            unit.innerHTML = `<strong class="sale-current-price">${formatCurrency(line.salePrice)}</strong>
                <div class="cart-original-price">${formatCurrency(line.originalPrice)}</div>`;
        }
        if (subtotal) {
            subtotal.innerHTML = `<strong>${formatCurrency(finalSubtotal)}</strong>
                <div class="sale-line-note">${escapeHtml(badge)}</div>`;
        }
    });

    const discount = Number(quote.discountAmount || 0);
    const row = document.getElementById("cartDiscountRow");
    if (row) row.hidden = discount <= 0;
    const label = document.getElementById("cartDiscountLabel");
    if (label) label.textContent = cartDiscountLabel(quote);
    const amount = document.getElementById("cartDiscountAmount");
    if (amount) amount.textContent = `-${formatCurrency(discount)}`;

    const subtotalEl = document.getElementById("summarySubtotal");
    if (subtotalEl) subtotalEl.textContent = formatCurrency(quote.originalAmount);
    const totalEl = document.getElementById("summaryTotal");
    if (totalEl) totalEl.textContent = formatCurrency(quote.totalAmount);
}
