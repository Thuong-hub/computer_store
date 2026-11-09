"use strict";

let invoiceLoaded = false;

document.addEventListener("DOMContentLoaded", async () => {
    const printButton = document.getElementById("printInvoiceButton");
    printButton.addEventListener("click", () => {
        if (invoiceLoaded) {
            window.print();
        }
    });

    const params = new URLSearchParams(window.location.search);
    const orderId = Number(params.get("id"));
    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        showInvoiceMessage("Mã đơn hàng không hợp lệ.", true);
        return;
    }

    if (!window.api || !window.api.getToken()) {
        window.location.replace("/pages/login.html");
        return;
    }

    const returnLink = document.getElementById("returnToOrder");
    returnLink.href = "/pages/admin/orders.html";
    returnLink.querySelector("span:last-child").textContent = "Quay lại quản lý đơn";

    let currentUser = {};
    try {
        currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
        currentUser = {};
    }

    if (String(currentUser.role || "").toUpperCase() !== "ADMIN") {
        showInvoiceMessage("Chỉ Admin được xem và in hóa đơn. Khách hàng vui lòng gửi yêu cầu từ Chi tiết đơn hàng.", true);
        return;
    }

    try {
        const orderGetter = window.api.getAdminOrderDetail;
        const paymentGetter = window.api.getAdminOrderPayment;

        if (typeof orderGetter !== "function" || typeof paymentGetter !== "function") {
            throw new Error("Không tìm thấy API hóa đơn phù hợp. Vui lòng kiểm tra api.js.");
        }

        const order = await orderGetter(orderId);
        if (!order || Number(order.orderId) !== orderId) {
            throw new Error("Dữ liệu đơn hàng không hợp lệ.");
        }

        const [paymentResult, userResult] = await Promise.allSettled([
            paymentGetter(orderId),
            Promise.resolve(null)
        ]);

        const payment = paymentResult.status === "fulfilled" ? paymentResult.value : null;
        const user = userResult.status === "fulfilled" ? userResult.value : null;

        document.getElementById("invoiceContent").innerHTML = renderInvoice(order, payment, user);
        document.getElementById("invoiceContent").hidden = false;
        document.getElementById("invoiceMessage").hidden = true;
        printButton.disabled = false;
        document.title = `Hoa don don hang ${orderId} - ComputerStore`;
        invoiceLoaded = true;
    } catch (error) {
        const message = error && error.message ? error.message : "Không thể tải hóa đơn.";
        showInvoiceMessage(message, true);
    }
});

function showInvoiceMessage(message, isError = false) {
    const box = document.getElementById("invoiceMessage");
    box.textContent = message;
    box.hidden = false;
    box.classList.toggle("invoice-alert-error", isError);
}

function renderInvoice(order, payment, user) {
    const items = Array.isArray(order.items)
        ? order.items
        : Array.isArray(order.orderItems) ? order.orderItems : [];

    const paid = String(payment?.paymentStatus || "").toUpperCase() === "PAID";
    const hasPayment = Boolean(payment && payment.paymentStatus);
    const paymentText = hasPayment
        ? paymentStatusText(payment.paymentStatus)
        : "Chưa xác minh";
    const paymentMethod = paymentMethodText(payment?.paymentMethod);
    const status = orderStatusText(order.status);
    const paymentClass = paid ? "state-paid" : "state-pending";
    const subTotalFromItems = items.reduce((sum, item) => {
        return sum + nonNegative(item.subtotal ?? nonNegative(item.price) * nonNegative(item.quantity));
    }, 0);
    const originalAmount = order.originalAmount == null
        ? subTotalFromItems
        : nonNegative(order.originalAmount);
    const discountAmount = nonNegative(order.discountAmount);
    const totalAmount = nonNegative(order.totalAmount);
    const shippingDifference = Math.round(totalAmount - originalAmount + discountAmount);
    const shippingText = shippingDifference === 0
        ? "Miễn phí"
        : shippingDifference > 0 ? money(shippingDifference) : "Theo đơn hàng";
    const recipientName = printable(order.recipientName || user?.fullName);
    const recipientPhone = printable(order.phone);
    const recipientAddress = printable(order.shippingAddress);
    const email = printable(order.email || order.customerEmail || user?.email);
    const note = printable(order.note);
    const invoiceLabel = `CS-${String(order.orderId).padStart(6, "0")}`;
    const printTime = dateTime(new Date());
    const itemRows = items.length > 0 ? items.map((item, index) => `
        <tr>
            <td class="table-number">${index + 1}</td>
            <td>
                <div class="product-cell">
                    <span class="item-thumb">${renderImage(item)}</span>
                    <div>
                        <div class="product-name">${esc(item.productName || "Sản phẩm")}</div>
                        <div class="product-sku">Mã sản phẩm: #${esc(item.productId ?? "-")}</div>
                    </div>
                </div>
            </td>
            <td class="table-center">${nonNegative(item.quantity)}</td>
            <td class="table-right">${money(item.price)}</td>
            <td class="table-right table-bold">${money(item.subtotal ?? nonNegative(item.price) * nonNegative(item.quantity))}</td>
        </tr>
    `).join("") : `<tr><td class="empty-row" colspan="5">Không có sản phẩm trong đơn hàng.</td></tr>`;

    return `
        <div class="document-brand">
            <div>
                <div class="brand-title">COMPUTER<span>STORE</span></div>
                <p>LINH KIỆN MÁY TÍNH &amp; XÂY DỰNG CẤU HÌNH PC</p>
            </div>
            <div class="document-type">PHIẾU BÁN HÀNG<br><small>ĐỒ ÁN</small></div>
        </div>
        <div class="red-rule"></div>

        <section class="invoice-intro">
            <div>
                <h1>HÓA ĐƠN BÁN HÀNG</h1>
                <p class="intro-caption">Thông tin giao dịch và xác nhận đơn hàng tại ComputerStore</p>
            </div>
            <dl class="invoice-identifiers">
                <div><dt>Số phiếu</dt><dd>${invoiceLabel}</dd></div>
                <div><dt>Mã đơn hàng</dt><dd>#${esc(order.orderId)}</dd></div>
                <div><dt>Ngày đặt</dt><dd>${dateTime(order.createdAt)}</dd></div>
                <div><dt>Ngày in</dt><dd>${printTime}</dd></div>
            </dl>
        </section>

        <section class="info-panels">
            <div class="info-panel">
                <h2>THÔNG TIN KHÁCH HÀNG</h2>
                <dl>
                    <div><dt>Người nhận</dt><dd>${recipientName}</dd></div>
                    <div><dt>Điện thoại</dt><dd>${recipientPhone}</dd></div>
                    <div><dt>Email</dt><dd>${email}</dd></div>
                </dl>
            </div>
            <div class="info-panel">
                <h2>GIAO HÀNG &amp; THANH TOÁN</h2>
                <dl>
                    <div><dt>Địa chỉ</dt><dd>${recipientAddress}</dd></div>
                    <div><dt>Phương thức</dt><dd>${paymentMethod}</dd></div>
                    <div><dt>Đơn hàng</dt><dd>${status}</dd></div>
                    <div><dt>Thanh toán</dt><dd><span class="payment-state ${paymentClass}">${paymentText}</span></dd></div>
                </dl>
            </div>
        </section>

        <section class="product-section">
            <h2>CHI TIẾT SẢN PHẨM</h2>
            <div class="table-scroller">
                <table class="product-table">
                    <thead><tr><th>STT</th><th>SẢN PHẨM</th><th>SL</th><th>ĐƠN GIÁ</th><th>THÀNH TIỀN</th></tr></thead>
                    <tbody>${itemRows}</tbody>
                </table>
            </div>
        </section>

        <section class="bill-footer">
            <div class="bill-details">
                <div class="bill-heading">THÔNG TIN ĐƠN HÀNG</div>
                <div class="bill-field"><span>Mã khuyến mãi</span><strong>${printable(order.promotionCode)}</strong></div>
                <div class="bill-field"><span>Mã giao dịch</span><strong>${printable(payment?.transactionCode)}</strong></div>
                <div class="bill-field"><span>Ngày thanh toán</span><strong>${payment?.paidAt ? dateTime(payment.paidAt) : "Chưa xác nhận"}</strong></div>
                <div class="bill-note"><strong>Ghi chú</strong><p>${note}</p></div>
            </div>
            <div class="totals">
                <div><span>Tạm tính</span><strong>${money(originalAmount)}</strong></div>
                <div><span>Giảm giá</span><strong class="discount">-${money(discountAmount)}</strong></div>
                <div><span>Phí vận chuyển</span><strong>${shippingText}</strong></div>
                <div class="grand-total"><span>TỔNG THANH TOÁN</span><strong>${money(totalAmount)}</strong></div>
            </div>
        </section>

        <section class="invoice-message">
            <h2>LƯU Ý</h2>
            <p>Vui lòng đối chiếu sản phẩm và số lượng khi nhận hàng. Trạng thái thanh toán thể hiện theo thông tin đã ghi nhận trong hệ thống.</p>
            <p>Đây là phiếu bán hàng phục vụ đồ án ComputerStore, không phải hóa đơn điện tử thuế.</p>
        </section>

        <section class="signatures">
            <div><strong>Người mua hàng</strong><span>(Ký và ghi rõ họ tên)</span><div class="signature-line"></div></div>
            <div><strong>Người bán hàng</strong><span>(Ký và ghi rõ họ tên)</span><div class="signature-line"></div></div>
        </section>

        <div class="invoice-bottom">
            <strong>COMPUTER<span>STORE</span></strong>
            <span>Cảm ơn quý khách đã mua sắm tại ComputerStore!</span>
        </div>
    `;
}

function renderImage(item) {
    const url = localProductImage(item.imageUrl);
    if (!url) {
        return `<span class="image-fallback">PC</span>`;
    }
    return `<img src="${esc(url)}" alt="" loading="eager" onerror="this.replaceWith(document.createTextNode('PC'))">`;
}

function localProductImage(value) {
    const raw = String(value || "").replaceAll("\\", "/").trim();
    if (!raw || raw.includes("..") || raw.startsWith("//") || /[\u0000-\u001f?#]/.test(raw)) {
        return "";
    }
    if (raw.startsWith("/images/")) {
        return raw;
    }
    if (raw.startsWith("images/")) {
        return `/${raw}`;
    }
    if (/^[a-z0-9_-]+\.(png|jpg|jpeg|webp|gif)$/i.test(raw)) {
        return `/images/products/${raw}`;
    }
    return "";
}

function printable(value) {
    const text = String(value ?? "").trim();
    return text ? esc(text) : "—";
}

function esc(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function nonNegative(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(number, 0) : 0;
}

function money(value) {
    return `${new Intl.NumberFormat("vi-VN", {maximumFractionDigits: 0}).format(nonNegative(value))} đ`;
}

function dateTime(value) {
    if (!value) {
        return "—";
    }
    const time = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(time.getTime())) {
        return "—";
    }
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(time);
}

function paymentMethodText(value) {
    const method = String(value || "").toUpperCase();
    if (method === "COD") {
        return "Thanh toán khi nhận hàng (COD)";
    }
    if (method === "BANK_TRANSFER") {
        return "Chuyển khoản VietQR";
    }
    return "Chưa xác minh";
}

function paymentStatusText(value) {
    const status = String(value || "").toUpperCase();
    if (status === "PAID") {
        return "Đã thanh toán";
    }
    if (status === "PENDING") {
        return "Chưa thanh toán";
    }
    if (status === "FAILED") {
        return "Thanh toán thất bại";
    }
    if (status === "CANCELLED") {
        return "Đã hủy thanh toán";
    }
    return "Chưa xác minh";
}

function orderStatusText(value) {
    const status = String(value || "").toUpperCase();
    const statusMap = {
        PENDING: "Chờ xử lý",
        CONFIRMED: "Đã xác nhận",
        SHIPPING: "Đang giao",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy"
    };
    return statusMap[status] || printable(value);
}
