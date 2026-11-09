function saleTypeLabel(type) {
    switch (String(type || "").toUpperCase()) {
        case "BLACK_FRIDAY": return "BLACK FRIDAY";
        case "BESTSELLER": return "BESTSELLER";
        case "SALE": return "SALE";
        case "NEW_PRODUCT": return "SẢN PHẨM MỚI";
        default: return "ƯU ĐÃI";
    }
}

let checkoutSubtotalAmount = 0;
let checkoutDiscountAmount = 0;
let checkoutTotalAmount = 0;
let appliedPromotionCode = "";
let checkoutMembershipQuote = null;
let checkoutServerQuote = null;

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

        setupPromotionButton();

        setupPaymentMethods();

        setupPlaceOrder();

        await fillUserInformation();

        await loadCheckoutCart();
    }
);



async function loadCheckoutCart() {

    const container =
        document.getElementById(
            "checkoutItems"
        );


    try {

        container.innerHTML = `
            <div class="checkout-loading">
                Đang tải sản phẩm...
            </div>
        `;


        const cart =
            await window.api.getCartItems();


        const items =
            Array.isArray(cart.items)
                ? cart.items
                : [];


        if (items.length === 0) {

            container.innerHTML = `
                <div class="checkout-loading">
                    Giỏ hàng đang trống.
                </div>
            `;


            updateCheckoutSummary(
                0,
                0
            );


            updateHeaderCartCount(
                0
            );


            disablePlaceOrder();


            return;
        }


        renderCheckoutItems(
            items
        );


        updateCheckoutSummary(
            cart.totalQuantity ?? 0,
            cart.totalPrice ?? 0
        );
        updateHeaderCartCount(
            cart.totalQuantity ?? 0
        );

        try {
            await refreshServerSaleQuote();
        } catch (pricingError) {
            console.error("Load sale pricing error:", pricingError);
            checkoutServerQuote = null;
            disablePlaceOrder();
            showCheckoutMessage(
                (pricingError.message || "Không thể tải giá thanh toán.")
                    + " Vui lòng tải lại trang để tiếp tục đặt hàng.",
                "error"
            );
        }


    } catch (error) {

        console.error(
            "Load checkout cart error:",
            error
        );


        container.innerHTML = `
            <div class="checkout-loading">
                Không thể tải đơn hàng.
            </div>
        `;


        showCheckoutMessage(
            error.message
            || "Không thể tải giỏ hàng.",
            "error"
        );
    }
}



function renderCheckoutItems(items) {

    const container =
        document.getElementById(
            "checkoutItems"
        );


    container.innerHTML =
        items
            .map(item =>
                createCheckoutItem(item)
            )
            .join("");
}



function createCheckoutItem(item) {

    const image =
        normalizeImageUrl(
            item.imageUrl
        );


    return `
        <div class="checkout-item" data-product-id="${item.productId}">

            <a
                href="/pages/product-detail.html?id=${item.productId}"
                class="checkout-item-image"
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


            <div class="checkout-item-info">

                <a
                    href="/pages/product-detail.html?id=${item.productId}"
                    class="checkout-item-name"
                >
                    ${escapeHtml(item.productName)}
                </a>


                <div class="checkout-item-quantity">

                    ${formatCurrency(item.price)}
                    ×
                    ${item.quantity}

                </div>

            </div>


            <div class="checkout-item-price">

                ${formatCurrency(item.subtotal)}

            </div>

        </div>
    `;
}



function updateCheckoutSummary(
    totalQuantity,
    totalPrice
) {

    checkoutSubtotalAmount = Number(totalPrice || 0);
    checkoutMembershipQuote = null;
    checkoutDiscountAmount = 0;
    checkoutTotalAmount = checkoutSubtotalAmount;

    document.getElementById("checkoutQuantity").textContent =
        totalQuantity;

    document.getElementById("checkoutSubtotal").textContent =
        formatCurrency(checkoutSubtotalAmount);

    document.getElementById("checkoutTotal").textContent =
        formatCurrency(checkoutTotalAmount);

    const discountRow =
        document.getElementById("discountRow");

    const discountElement =
        document.getElementById("checkoutDiscount");

    if (discountRow) {
        discountRow.hidden = true;
    }

    if (discountElement) {
        discountElement.textContent = formatCurrency(0);
    }

}


async function fillUserInformation() {

    let user = null;

    try {

        user =
            await window.api.getCurrentUser();

    } catch (error) {

        try {

            user =
                JSON.parse(
                    localStorage.getItem("user")
                    || "null"
                );

        } catch (parseError) {

            user = null;
        }
    }

    if (!user) {
        return;
    }

    const recipientInput =
        document.getElementById(
            "recipientName"
        );

    const phoneInput =
        document.getElementById(
            "phone"
        );

    const addressInput =
        document.getElementById(
            "shippingAddress"
        );

    if (recipientInput) {

        recipientInput.value =
            user.fullName
            || user.username
            || "";
    }

    if (phoneInput) {

        phoneInput.value =
            user.phone
            || "";
    }

    if (addressInput) {

        addressInput.value =
            user.address
            || "";
    }
}



function updateHeaderCartCount(
    totalQuantity
) {

    const element =
        document.getElementById(
            "cartCount"
        );


    if (!element) {
        return;
    }


    element.textContent =
        totalQuantity;
}



function disablePlaceOrder() {

    const button =
        document.getElementById(
            "placeOrderButton"
        );


    if (button) {

        button.disabled =
            true;
    }
}



function formatPercentValue(value) {
    const n = Number(value || 0);
    return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "");
}

function sourceBadge(quote, line) {
    const percent = formatPercentValue(line.finalPercent);
    switch (line.appliedSource) {
        case "PRODUCT":
            return `${saleTypeLabel(line.saleType)} -${line.salePercent}%`;
        case "MEMBERSHIP":
            if (quote.memberType === "VIP") return "";
            return `KHÁCH MỚI -${percent}%`;
        case "COUPON":
            return `MÃ ${quote.promotionCode} -${percent}%`;
        default:
            return "";
    }
}

function discountRowLabel(quote) {
    switch (quote.source) {
        case "PRODUCT": {
            const types = [...new Set((quote.lines || [])
                .filter(l => Number(l.salePercent) > 0)
                .map(l => String(l.saleType || "").toUpperCase()))];
            const names = { BLACK_FRIDAY: "Black Friday", SALE: "Sale",
                BESTSELLER: "Bestseller", NEW_PRODUCT: "Sản phẩm mới" };
            return types.length === 1
                ? `Giảm giá ${names[types[0]] || "sản phẩm"}`
                : "Khuyến mãi sản phẩm";
        }
        case "MEMBERSHIP":
            return quote.memberType === "VIP"
                ? `Ưu đãi VIP ${quote.memberPercent}% trên tổng đơn`
                : `Ưu đãi khách mới (${quote.memberPercent}%)`;
        case "COUPON":
            return `Mã ${quote.promotionCode}`;
        default:
            return "Giảm giá";
    }
}

async function refreshServerSaleQuote(code = "") {
    const query = code ? `?promotionCode=${encodeURIComponent(code)}` : "";
    const quote = await window.api.request(`/api/pricing/cart-quote${query}`);
    checkoutServerQuote = quote;
    checkoutSubtotalAmount = Number(quote.originalAmount || 0);
    checkoutDiscountAmount = Number(quote.discountAmount || 0);
    checkoutTotalAmount = Number(quote.totalAmount || 0);

    document.getElementById("checkoutSubtotal").textContent = formatCurrency(checkoutSubtotalAmount);
    document.getElementById("checkoutTotal").textContent = formatCurrency(checkoutTotalAmount);
    const row = document.getElementById("discountRow");
    const discount = document.getElementById("checkoutDiscount");
    if (row) row.hidden = checkoutDiscountAmount <= 0;
    if (discount) discount.textContent = `-${formatCurrency(checkoutDiscountAmount)}`;

    const offerMessage = document.getElementById("memberOfferMessage");
    if (offerMessage) {
        offerMessage.textContent = quote.source === "NONE"
            ? "Không có ưu đãi khả dụng."
            : `${quote.description}. Chỉ áp dụng một loại ưu đãi tốt nhất, không cộng dồn.`;
    }

    const discountLabel = document.getElementById("checkoutDiscountLabel");
    if (discountLabel) discountLabel.textContent = discountRowLabel(quote);

    const currentLines = quote.lines || [];
    currentLines.forEach(line => {
        const rowElement = document.querySelector(`.checkout-item[data-product-id="${Number(line.productId)}"]`);
        if (!rowElement) return;
        const priceElement = rowElement.querySelector(".checkout-item-price");
        if (!priceElement) return;
        const finalSubtotal = Number(line.finalSubtotal ?? line.originalSubtotal);
        const original = Number(line.originalSubtotal);
        const badge = sourceBadge(quote, line);
        if (badge && finalSubtotal < original) {
            priceElement.innerHTML = `<strong>${formatCurrency(finalSubtotal)}</strong>
                <div class="sale-line-note">${escapeHtml(badge)}</div>`;
        } else {
            priceElement.textContent = formatCurrency(original);
        }
    });
    return quote;
}

function setupPromotionButton() {

    const button =
        document.getElementById("applyPromotionButton");

    const input =
        document.getElementById("promotionCode");

    const message =
        document.getElementById("promotionMessage");

    if (!button || !input || !message) {
        return;
    }

    input.addEventListener(
        "input",
        () => {
            if (
                appliedPromotionCode
                &&
                input.value.trim().toUpperCase()
                !== appliedPromotionCode
            ) {
                resetPromotionPreview();
            }
        }
    );

    button.addEventListener(
        "click",
        async () => {

            const code =
                input.value.trim().toUpperCase();

            input.value = code;

            if (!code) {
                resetPromotionPreview();
                message.textContent =
                    "Bạn chưa nhập mã giảm giá.";
                return;
            }

            try {
                button.disabled = true;
                button.textContent =
                    "Đang kiểm tra...";

                const response = await refreshServerSaleQuote(code);
                appliedPromotionCode = code;
                message.textContent = response.source === "COUPON"
                    ? `Đã áp dụng ${code}, giảm ${formatCurrency(response.discountAmount)}.`
                    : `Mã ${code} hợp lệ nhưng ${response.description}.`;
            
            } catch (error) {
                resetPromotionPreview();

                message.textContent =
                    error.message
                    || "Mã giảm giá không hợp lệ.";
            } finally {
                button.disabled = false;
                button.textContent = "Áp dụng";
            }
        }
    );
}


async function resetPromotionPreview() {
    appliedPromotionCode = "";
    checkoutServerQuote = null;
    document.getElementById("promotionMessage").textContent = "";
    try {
        await refreshServerSaleQuote();
    } catch (error) {
        showCheckoutMessage(error.message || "Không tải được giá ưu đãi", "error");
    }
}

function setupPaymentMethods() {

    const options =
        document.querySelectorAll(
            'input[name="paymentMethod"]'
        );

    options.forEach(
        option => {

            option.addEventListener(
                "change",
                updatePaymentMethodView
            );
        }
    );

    updatePaymentMethodView();
}


function updatePaymentMethodView() {

    const selected =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        )?.value;

    const panel =
        document.getElementById(
            "bankTransferPanel"
        );

    const button =
        document.getElementById(
            "placeOrderButton"
        );

    if (panel) {
        panel.hidden =
            selected !== "BANK_TRANSFER";

        if (!panel.hidden) {
                }
    }

    if (button && !button.disabled) {
        button.textContent =
            selected === "BANK_TRANSFER"
                ? "Đặt đơn & mở QR"
                : "Đặt hàng";
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



function showCheckoutMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "checkoutMessage"
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


function setupPlaceOrder() {

    const button =
        document.getElementById(
            "placeOrderButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async () => {

            const recipientName =
                document.getElementById(
                    "recipientName"
                ).value.trim();


            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();


            const shippingAddress =
                document.getElementById(
                    "shippingAddress"
                ).value.trim();


            const note =
                document.getElementById(
                    "note"
                ).value.trim();


            const promotionCode =
                document.getElementById(
                    "promotionCode"
                ).value
                    .trim()
                    .toUpperCase();


            if (promotionCode && appliedPromotionCode !== promotionCode) {
                showCheckoutMessage("Bạn cần nhấn Áp dụng để xác nhận mã giảm giá trước khi đặt hàng.", "error");
                return;
            }

            const paymentMethod =
                document.querySelector(
                    'input[name="paymentMethod"]:checked'
                )?.value;



            if (!recipientName) {

                showCheckoutMessage(
                    "Vui lòng nhập họ tên người nhận.",
                    "error"
                );

                return;
            }


            if (!phone) {

                showCheckoutMessage(
                    "Vui lòng nhập số điện thoại.",
                    "error"
                );

                return;
            }


            if (!/^0\d{9,10}$/.test(phone)) {

                showCheckoutMessage(
                    "Số điện thoại không hợp lệ.",
                    "error"
                );

                return;
            }


            if (!shippingAddress) {

                showCheckoutMessage(
                    "Vui lòng nhập địa chỉ giao hàng.",
                    "error"
                );

                return;
            }


            if (!paymentMethod) {

                showCheckoutMessage(
                    "Vui lòng chọn phương thức thanh toán.",
                    "error"
                );

                return;
            }



            const orderData = {

                recipientName,

                phone,

                shippingAddress,

                note:
                    note || null,

                paymentMethod,

                promotionCode:
                    promotionCode || null
            };


            try {

                button.disabled = true;

                button.textContent =
                    paymentMethod === "BANK_TRANSFER"
                        ? "Đang gửi xác nhận..."
                        : "Đang đặt hàng...";


                const response =
                    await window.api.checkoutOrder(
                        orderData
                    );


                showCheckoutMessage(
                    paymentMethod === "BANK_TRANSFER"
                        ? "Đã tạo đơn chuyển khoản. Mã thanh toán và QR riêng cho đơn hàng đã được tạo."
                        : (
                            response.message
                            || "Đặt hàng thành công."
                        ),
                    "success"
                );


                const cartCount =
                    document.getElementById(
                        "cartCount"
                    );


                if (cartCount) {

                    cartCount.textContent =
                        "0";
                }


                setTimeout(
                    () => {

                        window.location.href =
                            paymentMethod === "BANK_TRANSFER"
                                ? `/pages/order-detail.html?id=${response.orderId}`
                                : `/pages/orders.html?orderId=${response.orderId}`;

                    },
                    1200
                );


            } catch (error) {

                console.error(
                    "Checkout error:",
                    error
                );


                showCheckoutMessage(
                    error.message
                    || "Đặt hàng thất bại.",
                    "error"
                );


            } finally {

                button.disabled = false;
                updatePaymentMethodView();
            }
        }
    );
}
