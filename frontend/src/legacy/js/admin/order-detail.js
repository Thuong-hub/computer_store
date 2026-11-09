let currentAdminOrder = null;

let currentAdminPayment = null;



document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!checkAdminAccess()) {
            return;
        }


        setupLogout();


        const params =
            new URLSearchParams(
                window.location.search
            );


        const orderId =
            Number(
                params.get("id")
            );


        if (!orderId) {

            showMessage(
                "Không tìm thấy mã đơn hàng."
            );

            return;
        }


        await loadAdminOrderDetail(
            orderId
        );
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



async function loadAdminOrderDetail(
    orderId
) {

    try {

        const results =
            await Promise.allSettled([

                window.api.getAdminOrderDetail(
                    orderId
                ),

                window.api.getAdminOrderPayment(
                    orderId
                )

            ]);


        if (
            results[0].status
            !==
            "fulfilled"
        ) {

            throw results[0].reason;
        }


        currentAdminOrder =
            results[0].value;


        currentAdminPayment =
            results[1].status
            ===
            "fulfilled"
                ? results[1].value
                : null;


        renderOrder(
            currentAdminOrder
        );


        renderPayment(
            currentAdminPayment
        );


    } catch (error) {

        console.error(
            error
        );


        showMessage(
            error.message
            || "Không thể tải chi tiết đơn hàng."
        );
    }
}



function renderOrder(order) {

    document.getElementById(
        "adminOrderTitle"
    ).textContent =
        `Đơn hàng #${order.orderId}`;


    document.getElementById(
        "adminOrderCreatedAt"
    ).textContent =
        formatDate(
            order.createdAt
        );


    const statusElement =
        document.getElementById(
            "adminOrderStatus"
        );


    statusElement.textContent =
        getStatusText(
            order.status
        );


    statusElement.className =
        `admin-order-status ${String(
            order.status
        ).toLowerCase()}`;


    setText(
        "detailRecipient",
        order.recipientName
    );


    setText(
        "detailPhone",
        order.phone
    );


    setText(
        "detailAddress",
        order.shippingAddress
    );


    setText(
        "detailNote",
        order.note || "Không có"
    );


    setText(
        "summaryOrderId",
        `#${order.orderId}`
    );


    setText(
        "summaryTotal",
        formatCurrency(
            order.totalAmount
        )
    );

    renderPromotionSummary(
        order
    );


    const items =
        Array.isArray(order.items)
            ? order.items

            : Array.isArray(
                order.orderItems
            )
                ? order.orderItems

                : [];


    renderItems(
        items
    );


    renderNextAction(
        order
    );
}



function renderPromotionSummary(order) {

    let container =
        document.getElementById(
            "adminPromotionSummary"
        );

    const totalElement =
        document.getElementById(
            "summaryTotal"
        );

    const totalRow =
        totalElement
            ?.closest(
                ".admin-summary-row"
            );

    if (!container) {
        container =
            document.createElement(
                "div"
            );

        container.id =
            "adminPromotionSummary";

        totalRow
            ?.parentNode
            ?.insertBefore(
                container,
                totalRow
            );
    }

    if (!container) {
        return;
    }

    const promotionCode =
        order.promotionCode
        || "";

    if (!promotionCode) {
        container.innerHTML = "";
        return;
    }

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

    container.innerHTML = `
        <div class="admin-summary-row">
            <span>Giá trước giảm</span>
            <strong>
                ${formatCurrency(
                    originalAmount
                )}
            </strong>
        </div>

        <div class="admin-summary-row">
            <span>Mã giảm giá</span>
            <strong class="admin-promotion-code-value">
                ${escapeHtml(
                    promotionCode
                )}
            </strong>
        </div>

        <div class="admin-summary-row">
            <span>Được giảm</span>
            <strong class="admin-promotion-discount-value">
                -${formatCurrency(
                    discountAmount
                )}
            </strong>
        </div>
    `;
}


function renderItems(items) {

    const container =
        document.getElementById(
            "adminOrderItems"
        );


    if (!items.length) {

        container.innerHTML =
            `<p class="admin-table-empty">
                Không có sản phẩm.
            </p>`;

        return;
    }


    container.innerHTML =
        items
            .map(item => `

                <div class="admin-order-item">

                    <img
                        src="${normalizeImage(
                            item.imageUrl
                        )}"
                        alt="${escapeHtml(
                            item.productName
                        )}"
                    >


                    <div>

                        <div class="admin-order-item-name">
                            ${escapeHtml(
                                item.productName
                            )}
                        </div>

                        <div class="admin-order-item-meta">
                            ${formatCurrency(
                                item.price
                            )}
                            ×
                            ${item.quantity}
                        </div>

                    </div>


                    <div class="admin-order-item-price">
                        SL: ${item.quantity}
                    </div>


                    <div class="admin-order-item-subtotal">
                        ${Number(item.discountAmount || 0) > 0
                            ? `<strong>${formatCurrency(item.finalSubtotal ?? item.subtotal)}</strong>
                               <div class="item-discount-old">${formatCurrency(item.subtotal)}</div>
                               <div class="item-discount-note">${escapeHtml(item.discountLabel || "Ưu đãi")}</div>`
                            : formatCurrency(item.subtotal)}
                    </div>

                </div>

            `)
            .join("");
}



function renderNextAction(order) {

    const container =
        document.getElementById(
            "adminOrderNextAction"
        );

    const isWaitingBankTransfer =
        String(
            currentAdminPayment
                ?.paymentMethod
            || ""
        ).toUpperCase()
        === "BANK_TRANSFER"
        &&
        String(
            currentAdminPayment
                ?.paymentStatus
            || ""
        ).toUpperCase()
        === "PENDING"
        &&
        String(
            order.status
            || ""
        ).toUpperCase()
        === "PENDING";

    if (isWaitingBankTransfer) {
        container.innerHTML = `
            <div class="admin-payment-waiting">
                Xác nhận đã nhận chuyển khoản trước khi xử lý đơn hàng.
            </div>
        `;
        return;
    }

    const next =
        getNextStatus(
            order.status
        );

    if (!next) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
        <button
            class="admin-next-status-button"
            id="adminNextStatusButton"
        >
            ${getNextButtonText(next)}
        </button>
    `;

    document.getElementById(
        "adminNextStatusButton"
    ).addEventListener(
        "click",
        async () => {

            const confirmed =
                window.confirm(
                    `Chuyển đơn #${order.orderId} sang "${getStatusText(next)}"?`
                );

            if (!confirmed) {
                return;
            }

            try {
                await window.api.updateAdminOrderStatus(
                    order.orderId,
                    next
                );

                await loadAdminOrderDetail(
                    order.orderId
                );
            } catch (error) {
                showMessage(
                    error.message
                    || "Không thể cập nhật trạng thái."
                );
            }
        }
    );
}



function renderPayment(payment) {

    const container =
        document.getElementById(
            "adminPaymentInfo"
        );

    if (!payment) {
        container.innerHTML =
            "Không có thông tin thanh toán.";
        return;
    }

    const method =
        String(
            payment.paymentMethod
            || ""
        ).toUpperCase();

    const paid =
        String(
            payment.paymentStatus
            || ""
        ).toUpperCase()
        === "PAID";

    const methodText =
        method === "BANK_TRANSFER"
            ? "Chuyển khoản TPBank"
            : method === "COD"
                ? "Thanh toán khi nhận hàng"
                : method;

    container.innerHTML = `
        <div class="admin-payment-row">
            <span>Phương thức</span>
            <strong>
                ${escapeHtml(
                    methodText
                )}
            </strong>
        </div>

        <div class="admin-payment-row">
            <span>Trạng thái</span>
            <strong class="${
                paid
                    ? "payment-paid"
                    : "payment-pending"
            }">
                ${
                    paid
                        ? "Đã thanh toán"
                        : method === "BANK_TRANSFER"
                            ? "Chờ đối soát chuyển khoản"
                            : "Chưa thanh toán"
                }
            </strong>
        </div>

        <div class="admin-payment-row">
            <span>Số tiền</span>
            <strong>
                ${formatCurrency(
                    payment.amount
                )}
            </strong>
        </div>

        ${
            paid
                ? `
                    <div class="admin-payment-row">
                        <span>Thanh toán lúc</span>
                        <strong>
                            ${formatDate(
                                payment.paidAt
                            )}
                        </strong>
                    </div>
                `
                : ""
        }

        ${
            canMarkPaid(payment)
                ? `
                    <button
                        type="button"
                        id="markPaidButton"
                        class="admin-paid-button"
                    >
                        ${
                            method === "BANK_TRANSFER"
                                ? "Xác nhận đã nhận chuyển khoản"
                                : "Xác nhận COD đã thanh toán"
                        }
                    </button>
                `
                : ""
        }
    `;

    const button =
        document.getElementById(
            "markPaidButton"
        );

    if (button) {
        button.addEventListener(
            "click",
            markPaymentPaid
        );
    }
}


function canMarkPaid(payment) {

    if (!currentAdminOrder) {
        return false;
    }

    const method =
        String(
            payment.paymentMethod
            || ""
        ).toUpperCase();

    const paymentStatus =
        String(
            payment.paymentStatus
            || ""
        ).toUpperCase();

    const orderStatus =
        String(
            currentAdminOrder.status
            || ""
        ).toUpperCase();

    if (paymentStatus !== "PENDING") {
        return false;
    }

    if (method === "BANK_TRANSFER") {
        return (
            orderStatus !== "CANCELLED"
            &&
            orderStatus !== "COMPLETED"
        );
    }

    if (method === "COD") {
        return (
            orderStatus === "COMPLETED"
        );
    }

    return false;
}






async function markPaymentPaid() {

    const method =
        String(
            currentAdminPayment
                ?.paymentMethod
            || ""
        ).toUpperCase();

    const confirmed =
        window.confirm(
            method === "BANK_TRANSFER"
                ? "Xác nhận cửa hàng đã nhận đúng tiền chuyển khoản?"
                : "Xác nhận đơn COD này đã thanh toán?"
        );

    if (!confirmed) {
        return;
    }

    try {
        await window.api.markAdminOrderPaid(
            currentAdminOrder.orderId
        );

        await loadAdminOrderDetail(
            currentAdminOrder.orderId
        );
    } catch (error) {
        showMessage(
            error.message
            || "Không thể xác nhận thanh toán."
        );
    }
}



function getNextStatus(status) {

    switch (
        String(status || "")
            .toUpperCase()
    ) {

        case "PENDING":
            return "CONFIRMED";

        case "CONFIRMED":
            return "SHIPPING";

        case "SHIPPING":
            return "COMPLETED";

        default:
            return null;
    }
}


function getNextButtonText(status) {

    if (status === "CONFIRMED") {
        return "Xác nhận đơn hàng";
    }

    if (status === "SHIPPING") {
        return "Chuyển sang đang giao";
    }

    if (status === "COMPLETED") {
        return "Đánh dấu hoàn thành";
    }

    return "Cập nhật";
}


function getStatusText(status) {

    switch (
        String(status || "")
            .toUpperCase()
    ) {

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
            return status || "";
    }
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


function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {
        element.textContent =
            value ?? "--";
    }
}


function formatCurrency(value) {

    return new Intl.NumberFormat(
        "vi-VN"
    ).format(
        Number(value || 0)
    )
    + " ₫";
}


function formatDate(value) {

    if (!value) {
        return "--";
    }


    return new Date(
        value
    ).toLocaleString(
        "vi-VN"
    );
}


function showMessage(message) {

    const element =
        document.getElementById(
            "adminMessage"
        );


    element.textContent =
        message;


    element.className =
        "admin-message error";
}


function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
