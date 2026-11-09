let paymentRefreshTimer = null;
let previousPaymentStatus = null;


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!window.api.getToken()) {

            window.location.href =
                "/pages/login.html";

            return;
        }


        setupDetailMobileNav();

        setupSearch();

        await updateCartCount();

        await loadOrderDetail();
    }
);



async function loadOrderDetail() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const orderId =
        Number(
            params.get("id")
        );

    const container =
        document.getElementById(
            "orderDetailContent"
        );

    if (!orderId) {
        showMessage(
            "Không tìm thấy mã đơn hàng."
        );

        container.innerHTML = "";
        return;
    }

    try {
        const order =
            await window.api.getOrderDetail(
                orderId
            );

        let payment = null;

        try {
            payment =
                await window.api.getOrderPayment(
                    orderId
                );
        } catch (paymentError) {
            console.error(
                "Load payment error:",
                paymentError
            );
        }

        const currentPaymentStatus =
            String(
                payment?.paymentStatus
                || ""
            ).toUpperCase();

        if (
            previousPaymentStatus === "PENDING"
            && currentPaymentStatus === "PAID"
        ) {
            showMessage(
                "SePay đã xác nhận chuyển khoản thành công. Đơn hàng đã được chuyển sang chuẩn bị hàng.",
                "success"
            );
        }

        previousPaymentStatus =
            currentPaymentStatus || previousPaymentStatus;

        renderOrderDetail(
            order,
            payment
        );

        updatePaymentRefresh(
            payment
        );

    } catch (error) {
        console.error(
            "Load order detail error:",
            error
        );

        container.innerHTML = "";

        showMessage(
            error.message
            || "Không thể tải chi tiết đơn hàng."
        );
    }
}


function updatePaymentRefresh(payment) {

    const waiting =
        String(
            payment?.paymentMethod
            || ""
        ).toUpperCase()
        === "BANK_TRANSFER"
        &&
        String(
            payment?.paymentStatus
            || ""
        ).toUpperCase()
        === "PENDING";

    if (waiting) {
        if (!paymentRefreshTimer) {
            paymentRefreshTimer =
                setInterval(
                    loadOrderDetail,
                    5000
                );
        }
        return;
    }

    if (paymentRefreshTimer) {
        clearInterval(
            paymentRefreshTimer
        );

        paymentRefreshTimer = null;
    }
}



function renderOrderDetail(
    order,
    payment
) {

    const container =
        document.getElementById(
            "orderDetailContent"
        );

    const status =
        String(
            order.status || ""
        ).toUpperCase();

    const items =
        Array.isArray(order.items)
            ? order.items
            : Array.isArray(order.orderItems)
                ? order.orderItems
                : [];

    const productsHtml =
        items.length > 0
            ? items
                .map(item =>
                    createProductItem(item)
                )
                .join("")
            : `
                <p>
                    Không có sản phẩm trong đơn hàng.
                </p>
            `;

    const paymentMethod =
        String(
            payment?.paymentMethod
            || ""
        ).toUpperCase();

    const paymentStatus =
        String(
            payment?.paymentStatus
            || ""
        ).toUpperCase();

    const isBankTransfer =
        paymentMethod === "BANK_TRANSFER";

    const isPaid =
        paymentStatus === "PAID";

    const bankStateHtml =
        isBankTransfer
            ? `
                <div class="bank-payment-state ${isPaid ? "success" : "waiting"}">
                    <strong>
                        ${isPaid
                            ? "Thanh toán chuyển khoản thành công"
                            : "Đang chờ SePay xác nhận chuyển khoản"}
                    </strong>
                    <span>
                        ${isPaid
                            ? "Đơn hàng đã chuyển sang chuẩn bị hàng."
                            : "Trang sẽ tự cập nhật ngay khi SePay xác nhận giao dịch."}
                    </span>
                </div>
            `
            : "";

    const paymentCode =
        `CS${String(order.orderId).padStart(6, "0")}`;

    const bankQrUrl =
        `https://img.vietqr.io/image/970423-0123456789-compact2.png?amount=${encodeURIComponent(Math.round(Number(payment?.amount || order.totalAmount || 0)))}&addInfo=${encodeURIComponent(paymentCode + " COMPUTERSTORE")}&accountName=${encodeURIComponent("NGUYEN VAN A")}`;

    const bankQrHtml =
        isBankTransfer && !isPaid
            ? `
                <div class="sepay-payment-box">
                    <div class="sepay-payment-header">
                        <div>
                            <span class="section-label">SEPAY PAYMENT</span>
                            <h3>Quét QR để thanh toán</h3>
                            <p>SePay sẽ tự động xác nhận khi giao dịch đúng số tiền và đúng mã thanh toán.</p>
                        </div>
                        <span class="sepay-live-badge">TỰ ĐỘNG</span>
                    </div>

                    <div class="sepay-payment-grid">
                        <div class="sepay-qr-wrap">
                            <img
                                src="${bankQrUrl}"
                                alt="QR thanh toán đơn hàng"
                            >
                        </div>

                        <div class="sepay-payment-info">
                            <div>
                                <span>Ngân hàng</span>
                                <strong>TPBank</strong>
                            </div>

                            <div>
                                <span>Số tài khoản</span>
                                <strong>0123456789</strong>
                            </div>

                            <div>
                                <span>Chủ tài khoản</span>
                                <strong>NGUYEN VAN A</strong>
                            </div>

                            <div>
                                <span>Số tiền</span>
                                <strong>${formatCurrency(payment?.amount || order.totalAmount)}</strong>
                            </div>

                            <div>
                                <span>Mã thanh toán</span>
                                <strong class="sepay-payment-code">${paymentCode}</strong>
                            </div>

                            <p>
                                Nội dung chuyển khoản nên giữ nguyên mã <strong>${paymentCode}</strong>.
                            </p>
                        </div>
                    </div>

                    <div class="sepay-payment-waiting">
                        Đang chờ SePay xác nhận giao dịch. Trang tự kiểm tra trạng thái mỗi 5 giây.
                    </div>
                </div>
            `
            : "";

    const originalAmount =
        Number(
            order.originalAmount
            ?? order.totalAmount
            ?? 0
        );

    const discountAmount =
        Number(
            order.discountAmount
            || 0
        );

    const promotionCode =
        order.promotionCode
        || "";

    const promotionHtml =
        promotionCode
            ? `
                <div class="detail-summary-row">
                    <span>Giá trước giảm</span>
                    <strong>
                        ${formatCurrency(
                            originalAmount
                        )}
                    </strong>
                </div>

                <div class="detail-summary-row">
                    <span>Mã giảm giá</span>
                    <strong class="promotion-code">
                        ${escapeHtml(
                            promotionCode
                        )}
                    </strong>
                </div>

                <div class="detail-summary-row">
                    <span>Được giảm</span>
                    <strong class="promotion-discount">
                        -${formatCurrency(
                            discountAmount
                        )}
                    </strong>
                </div>
            `
            : "";

    container.innerHTML = `
        <div class="detail-order-header">

            <div>
                <p class="section-label">
                    ORDER DETAIL
                </p>

                <h1>
                    Đơn hàng #${order.orderId}
                </h1>

                <div class="detail-order-date">
                    ${formatDateTime(order.createdAt)}
                </div>
            </div>

            <span
                class="detail-status ${getStatusClass(status)}"
            >
                ${getStatusText(status)}
            </span>

        </div>

        <div class="order-detail-grid">

            <div class="detail-main">

                <section class="detail-card">

                    <h2>
                        Thông tin thanh toán
                    </h2>

                    ${bankStateHtml}

                    ${bankQrHtml}

                    ${
                        payment
                            ? `
                                <div class="payment-detail-grid">

                                    <div class="payment-detail-item">
                                        <span>Phương thức</span>
                                        <strong>
                                            ${getPaymentMethodText(
                                                payment.paymentMethod
                                            )}
                                        </strong>
                                    </div>

                                    <div class="payment-detail-item">
                                        <span>Trạng thái</span>
                                        <strong
                                            class="payment-status
                                            ${getPaymentStatusClass(
                                                payment.paymentStatus
                                            )}"
                                        >
                                            ${getPaymentStatusText(
                                                payment.paymentStatus
                                            )}
                                        </strong>
                                    </div>

                                    <div class="payment-detail-item">
                                        <span>Số tiền</span>
                                        <strong>
                                            ${formatCurrency(
                                                payment.amount
                                            )}
                                        </strong>
                                    </div>

                                    <div class="payment-detail-item">
                                        <span>Mã giao dịch</span>
                                        <strong>
                                            ${escapeHtml(
                                                payment.transactionCode
                                                || (
                                                    isBankTransfer
                                                    && isPaid
                                                        ? "Đã đối soát thủ công"
                                                        : "Không có"
                                                )
                                            )}
                                        </strong>
                                    </div>

                                    <div class="payment-detail-item">
                                        <span>Thời gian tạo</span>
                                        <strong>
                                            ${formatDateTime(
                                                payment.createdAt
                                            )}
                                        </strong>
                                    </div>

                                    <div class="payment-detail-item">
                                        <span>Thời gian thanh toán</span>
                                        <strong>
                                            ${
                                                payment.paidAt
                                                    ? formatDateTime(
                                                        payment.paidAt
                                                    )
                                                    : "Chưa xác nhận"
                                            }
                                        </strong>
                                    </div>

                                </div>
                            `
                            : `
                                <p class="payment-unavailable">
                                    Không thể tải thông tin thanh toán.
                                </p>
                            `
                    }

                </section>

                <section class="detail-card">

                    <h2>
                        Sản phẩm
                    </h2>

                    <div class="detail-products">
                        ${productsHtml}
                    </div>

                </section>

            </div>

            <aside class="detail-summary">

                <h2>
                    Tổng kết đơn hàng
                </h2>

                <div class="detail-summary-row">
                    <span>Mã đơn hàng</span>
                    <strong>
                        #${order.orderId}
                    </strong>
                </div>

                <div class="detail-summary-row">
                    <span>Trạng thái</span>
                    <strong>
                        ${getStatusText(status)}
                    </strong>
                </div>

                ${promotionHtml}

                <div class="detail-summary-divider"></div>

                <div class="detail-summary-total">
                    <span>Tổng thanh toán</span>
                    <strong>
                        ${formatCurrency(
                            order.totalAmount
                        )}
                    </strong>
                </div>

                <div class="detail-invoice-request" id="detailInvoiceRequest">
                    <button
                        type="button"
                        id="detailInvoiceRequestButton"
                        class="detail-print-button"
                        data-id="${order.orderId}"
                        ${status === "CANCELLED" ? "disabled" : ""}
                    >
                        <span class="detail-print-button-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 12l7 7 9-14"></path>
                            </svg>
                        </span>
                        <span class="detail-print-button-text">
                            <strong>Yêu cầu in hóa đơn</strong>
                            <small>Gửi yêu cầu đến quản trị viên</small>
                        </span>
                        <span class="detail-print-button-arrow" aria-hidden="true">→</span>
                    </button>
                    <p class="detail-invoice-request-status" id="detailInvoiceRequestStatus" role="status" aria-live="polite"></p>
                </div>

                <a
                    href="/pages/orders.html"
                    class="back-orders-button"
                >
                    ← Quay lại đơn hàng
                </a>

                ${
                    status === "PENDING"
                        ? `
                            <button
                                type="button"
                                id="detailCancelButton"
                                class="detail-cancel-button"
                                data-id="${order.orderId}"
                            >
                                Hủy đơn hàng
                            </button>
                        `
                        : ""
                }

            </aside>

        </div>
    `;

    setupCancelButton();
    setupInvoiceRequestButton(order.orderId, status);
}



function createProductItem(item) {

    const image =
        normalizeImageUrl(
            item.imageUrl
        );


    return `
        <div class="detail-product">

            <a
                href="/pages/product-detail.html?id=${item.productId}"
                class="detail-product-image"
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


            <div>

                <a
                    href="/pages/product-detail.html?id=${item.productId}"
                    class="detail-product-name"
                >
                    ${escapeHtml(item.productName)}
                </a>


                <div class="detail-product-meta">

                    ${formatCurrency(item.price)}
                    ×
                    ${item.quantity}

                </div>

            </div>


            <div class="detail-product-subtotal">

                ${Number(item.discountAmount || 0) > 0
                    ? `<strong>${formatCurrency(item.finalSubtotal ?? item.subtotal)}</strong>
                       <div class="item-discount-old">${formatCurrency(item.subtotal)}</div>
                       <div class="item-discount-note">${escapeHtml(item.discountLabel || "Ưu đãi")}</div>`
                    : formatCurrency(item.subtotal)}

            </div>

        </div>
    `;
}



function setupCancelButton() {

    const button =
        document.getElementById(
            "detailCancelButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async () => {

            const orderId =
                Number(
                    button.dataset.id
                );


            const confirmed =
                window.confirm(
                    `Bạn có chắc muốn hủy đơn hàng #${orderId}?`
                );


            if (!confirmed) {
                return;
            }


            try {

                button.disabled = true;

                button.textContent =
                    "Đang hủy...";


                await window.api.cancelOrder(
                    orderId
                );


                await loadOrderDetail();


            } catch (error) {

                showMessage(
                    error.message
                    || "Không thể hủy đơn hàng."
                );


            } finally {

                button.disabled = false;

                button.textContent =
                    "Hủy đơn hàng";
            }
        }
    );
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



function getStatusText(status) {

    switch (status) {

        case "PENDING":
            return "Chờ xử lý";

        case "CONFIRMED":
            return "Đang chuẩn bị hàng";

        case "SHIPPING":
            return "Đang giao";

        case "COMPLETED":
            return "Hoàn thành";

        case "CANCELLED":
            return "Đã hủy";

        default:
            return status;
    }
}


function getStatusClass(status) {

    return String(status)
        .toLowerCase();
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



function normalizeImageUrl(imageUrl) {

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

    if (path.startsWith("/images/products/")) {
        return path;
    }

    if (path.startsWith("images/products/")) {
        return `/${path}`;
    }

    if (path.startsWith("/static/images/products/")) {
        return path.replace(
            "/static/images/products/",
            "/images/products/"
        );
    }

    if (path.startsWith("static/images/products/")) {
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
    ).format(
        Number(value || 0)
    );
}


function formatDateTime(value) {

    if (!value) {
        return "";
    }


    const date =
        new Date(value);


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


function showMessage(message, type = "error") {

    const element =
        document.getElementById(
            "orderDetailMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.classList.remove(
        "error",
        "success"
    );


    element.classList.add(
        type
    );
}


function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function getPaymentMethodText(method) {

    const value =
        String(
            method || ""
        ).toUpperCase();


    switch (value) {

        case "COD":
            return "Thanh toán khi nhận hàng";

        case "BANK_TRANSFER":
            return "Chuyển khoản TPBank · SePay";

        default:
            return value || "Không xác định";
    }
}


function getPaymentStatusText(status) {

    const value =
        String(
            status || ""
        ).toUpperCase();


    switch (value) {

        case "PENDING":
            return "Chưa thanh toán";

        case "PAID":
            return "Đã thanh toán";

        default:
            return value || "Không xác định";
    }
}


function getPaymentStatusClass(status) {

    const value =
        String(
            status || ""
        ).toUpperCase();


    if (value === "PAID") {
        return "paid";
    }


    return "pending";
}


function setupDetailMobileNav() {
    const button = document.getElementById("detailMobileMenuToggle");
    const nav = document.getElementById("detailMobileMenu");

    if (!button || !nav) {
        return;
    }

    const close = () => {
        nav.classList.remove("detail-nav-open");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Mở menu");
    };

    button.addEventListener("click", event => {
        event.stopPropagation();
        const opening = !nav.classList.contains("detail-nav-open");
        nav.classList.toggle("detail-nav-open", opening);
        button.setAttribute("aria-expanded", String(opening));
        button.setAttribute("aria-label", opening ? "Đóng menu" : "Mở menu");
    });

    nav.addEventListener("click", event => {
        if (event.target.closest("a")) {
            close();
        }
    });

    document.addEventListener("click", event => {
        if (!nav.contains(event.target) && !button.contains(event.target)) {
            close();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            close();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 767) {
            close();
        }
    });
}


async function setupInvoiceRequestButton(orderId, orderStatus) {
    const button = document.getElementById("detailInvoiceRequestButton");
    const status = document.getElementById("detailInvoiceRequestStatus");

    if (!button || !status) {
        return;
    }

    if (orderStatus === "CANCELLED") {
        status.textContent = "Đơn đã hủy không thể yêu cầu in hóa đơn.";
        return;
    }

    const updateStatus = (request) => {
        if (!request) {
            button.disabled = false;
            status.textContent = "Admin sẽ nhận yêu cầu và in hóa đơn khi xử lý.";
            return;
        }

        button.disabled = true;
        const label = button.querySelector(".detail-print-button-text strong");
        const description = button.querySelector(".detail-print-button-text small");

        if (request.status === "PROCESSED") {
            label.textContent = "Đã xử lý yêu cầu in";
            description.textContent = "Admin đã xác nhận xử lý yêu cầu";
            status.textContent = "Yêu cầu in hóa đơn đã được Admin xử lý.";
        } else {
            label.textContent = "Đã gửi yêu cầu";
            description.textContent = "Đang chờ Admin in hóa đơn";
            status.textContent = "Yêu cầu đã được gửi thành công. Vui lòng chờ Admin xử lý.";
        }
    };

    button.disabled = true;
    status.textContent = "Đang kiểm tra trạng thái yêu cầu...";

    try {
        const request = await window.api.getInvoicePrintRequest(orderId);
        if (!button.isConnected) {
            return;
        }
        updateStatus(request);
    } catch (error) {
        if (!button.isConnected) {
            return;
        }
        status.textContent = error.message || "Không thể kiểm tra yêu cầu in hóa đơn.";
        button.disabled = false;
    }

    button.addEventListener("click", async () => {
        button.disabled = true;
        status.textContent = "Đang gửi yêu cầu in hóa đơn...";

        try {
            const request = await window.api.createInvoicePrintRequest(orderId);
            updateStatus(request);
        } catch (error) {
            status.textContent = error.message || "Không thể gửi yêu cầu. Vui lòng thử lại.";
            button.disabled = false;
        }
    });
}
