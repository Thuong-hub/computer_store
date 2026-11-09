let adminOrders = [];
let invoiceRequests = [];
let invoiceRequestFilter = "PENDING";

let currentAdminOrderStatus =
    "ALL";



document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!checkAdminAccess()) {
            return;
        }


        setupAdminUser();

        setupAdminLogout();

        setupOrderFilters();

        setupOrderSearch();

        setupInvoiceRequestControls();
        await loadAdminOrders();
        await loadAdminInvoiceRequests();
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



function setupAdminLogout() {

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



async function loadAdminOrders() {

    const body =
        document.getElementById(
            "adminOrderTableBody"
        );


    body.innerHTML = `
        <tr>
            <td
                colspan="7"
                class="admin-table-empty"
            >
                Đang tải đơn hàng...
            </td>
        </tr>
    `;


    try {

        const response =
            await window.api.getAdminOrders();


        adminOrders =
            Array.isArray(response)
                ? response
                : [];


        renderAdminOrders();


    } catch (error) {

        console.error(
            "Load admin orders error:",
            error
        );


        body.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="admin-table-empty"
                >
                    Không thể tải đơn hàng.
                </td>
            </tr>
        `;


        showAdminOrderMessage(
            error.message
            || "Không thể tải danh sách đơn hàng."
        );
    }
}



function renderAdminOrders() {

    const body =
        document.getElementById(
            "adminOrderTableBody"
        );


    const keyword =
        document.getElementById(
            "adminOrderSearch"
        )
        .value
        .trim()
        .toLowerCase();


    const filtered =
        adminOrders.filter(order => {

            const matchesStatus =
                currentAdminOrderStatus
                ===
                "ALL"
                ||
                String(order.status)
                    .toUpperCase()
                ===
                currentAdminOrderStatus;


            const searchText =
                [
                    order.orderId,
                    order.recipientName,
                    order.phone,
                    order.shippingAddress
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
                matchesStatus
                &&
                matchesSearch
            );
        });


    document.getElementById(
        "adminOrderCount"
    ).textContent =
        `${filtered.length} đơn`;


    if (filtered.length === 0) {

        body.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="admin-table-empty"
                >
                    Không có đơn hàng phù hợp.
                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML =
        filtered
            .map(order => {

                const currentStatus =
                    String(
                        order.status
                        || ""
                    ).toUpperCase();

                const nextStatus =
                    currentStatus === "PENDING"
                        ? null
                        : getNextStatus(
                            order.status
                        );


                return `
                    <tr>

                        <td>
                            <strong>
                                #${order.orderId}
                            </strong>
                        </td>


                        <td>
                            ${escapeHtml(
                                order.recipientName
                                || ""
                            )}
                        </td>


                        <td>
                            ${escapeHtml(
                                order.phone
                                || ""
                            )}
                        </td>


                        <td>
                            <strong>
                                ${formatCurrency(
                                    order.totalAmount
                                )}
                            </strong>

                            ${
                                order.promotionCode
                                    ? `
                                        <br>
                                        <small>
                                            ${escapeHtml(
                                                order.promotionCode
                                            )}
                                            · giảm
                                            ${formatCurrency(
                                                order.discountAmount
                                                || 0
                                            )}
                                        </small>
                                    `
                                    : ""
                            }
                        </td>


                        <td>
                            ${formatDate(
                                order.createdAt
                            )}
                        </td>


                        <td>

                            <span
                                class="
                                    admin-order-status
                                    ${String(
                                        order.status
                                    ).toLowerCase()}
                                "
                            >
                                ${getStatusText(
                                    order.status
                                )}
                            </span>

                        </td>


                        <td>

                            <div
                                class="admin-order-actions"
                            >

                                <button
                                    type="button"
                                    class="admin-order-view"

                                    data-order-id="${order.orderId}"
                                >
                                    Chi tiết
                                </button>


                                <button
                                    type="button"
                                    class="admin-order-print"
                                    data-order-id="${order.orderId}"
                                    aria-label="In hóa đơn đơn hàng #${order.orderId}"
                                    title="Xem trước và in hóa đơn A4"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M7 8V3h10v5"></path>
                                        <rect x="4" y="8" width="16" height="10" rx="2"></rect>
                                        <path d="M7 15h10v6H7z"></path>
                                        <path d="M17 11.5h.01"></path>
                                    </svg>
                                    <span>In hóa đơn</span>
                                </button>


                                ${
                                    nextStatus

                                    ? `
                                        <button
                                            type="button"
                                            class="admin-order-next"

                                            data-order-id="${order.orderId}"

                                            data-next-status="${nextStatus}"
                                        >
                                            ${getNextStatusButtonText(
                                                nextStatus
                                            )}
                                        </button>
                                    `

                                    : ""
                                }

                            </div>

                        </td>

                    </tr>
                `;

            })
            .join("");


    setupOrderActionButtons();
}



function setupOrderFilters() {

    document
        .querySelectorAll(
            ".admin-filter-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".admin-filter-button"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );
                        });


                    button.classList.add(
                        "active"
                    );


                    currentAdminOrderStatus =
                        button.dataset.status;


                    renderAdminOrders();
                }
            );
        });
}



function setupOrderSearch() {

    document.getElementById(
        "adminOrderSearch"
    ).addEventListener(
        "input",
        renderAdminOrders
    );
}



function setupOrderActionButtons() {

    document
        .querySelectorAll(
            ".admin-order-view"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const orderId =
                        button.dataset.orderId;


                    window.location.href =
                        `/pages/admin/order-detail.html?id=${orderId}`;
                }
            );
        });


    document
        .querySelectorAll(
            ".admin-order-print"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const orderId = Number(button.dataset.orderId);
                    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
                        showAdminOrderMessage("Mã đơn hàng không hợp lệ.");
                        return;
                    }
                    const invoiceUrl = `/pages/invoice.html?id=${orderId}&source=admin`;
                    window.open(invoiceUrl, "_blank", "noopener,noreferrer");
                }
            );
        });


    document
        .querySelectorAll(
            ".admin-order-next"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const orderId =
                        Number(
                            button.dataset.orderId
                        );


                    const nextStatus =
                        button.dataset.nextStatus;


                    await changeAdminOrderStatus(
                        orderId,
                        nextStatus
                    );
                }
            );
        });
}



async function changeAdminOrderStatus(
    orderId,
    nextStatus
) {

    const confirmed =
        window.confirm(
            `Chuyển đơn hàng #${orderId} sang "${getStatusText(nextStatus)}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await window.api.updateAdminOrderStatus(
            orderId,
            nextStatus
        );


        showAdminOrderMessage(
            "Cập nhật trạng thái đơn hàng thành công.",
            "success"
        );


        await loadAdminOrders();


    } catch (error) {

        console.error(
            "Update order status error:",
            error
        );


        showAdminOrderMessage(
            error.message
            || "Không thể cập nhật trạng thái.",
            "error"
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


function getNextStatusButtonText(
    status
) {

    switch (status) {

        case "CONFIRMED":
            return "Xác nhận";

        case "SHIPPING":
            return "Giao hàng";

        case "COMPLETED":
            return "Hoàn thành";

        default:
            return "Cập nhật";
    }
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



function formatDate(value) {

    if (!value) {
        return "--";
    }


    const date =
        new Date(value);


    return date.toLocaleString(
        "vi-VN"
    );
}



function formatCurrency(value) {

    return new Intl.NumberFormat(
        "vi-VN"
    ).format(
        Number(value || 0)
    )
    + " ₫";
}



function showAdminOrderMessage(
    message,
    type = "error"
) {

    const element =
        document.getElementById(
            "adminMessage"
        );


    element.textContent =
        message;


    element.className =
        `admin-message ${type}`;
}



function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


async function loadAdminInvoiceRequests() {
    const table = document.getElementById("invoiceRequestTableBody");
    if (!table) {
        return;
    }

    table.innerHTML = '<tr><td colspan="6" class="admin-table-empty">Đang tải yêu cầu...</td></tr>';

    try {
        const result = await window.api.getAdminInvoicePrintRequests();
        invoiceRequests = Array.isArray(result) ? result : [];
        renderAdminInvoiceRequests();
    } catch (error) {
        table.innerHTML = '<tr><td colspan="6" class="admin-table-empty">Không thể tải danh sách yêu cầu.</td></tr>';
        showInvoiceRequestMessage(error.message || "Không thể tải yêu cầu in hóa đơn.", true);
    }
}

function renderAdminInvoiceRequests() {
    const table = document.getElementById("invoiceRequestTableBody");
    if (!table) {
        return;
    }

    const pendingCount = invoiceRequests.filter(request => request.status === "PENDING").length;
    document.getElementById("invoiceRequestCount").textContent = `${pendingCount} yêu cầu chờ`;

    const filtered = invoiceRequests.filter(request =>
        invoiceRequestFilter === "ALL" || request.status === invoiceRequestFilter
    );

    if (filtered.length === 0) {
        table.innerHTML = '<tr><td colspan="6" class="admin-table-empty">Không có yêu cầu phù hợp.</td></tr>';
        return;
    }

    const ordersById = new Map(adminOrders.map(order => [Number(order.orderId), order]));

    table.innerHTML = filtered.map(request => {
        const order = ordersById.get(Number(request.orderId));
        const isPending = request.status === "PENDING";
        const customer = order ? order.recipientName : `Khách #${request.userId}`;
        const total = order ? formatCurrency(order.totalAmount) : "—";
        const date = request.requestedAt ? formatDate(request.requestedAt) : "—";

        return `
            <tr>
                <td><strong>#${Number(request.orderId)}</strong></td>
                <td>${escapeHtml(customer || "Khách hàng")}</td>
                <td><strong>${escapeHtml(total)}</strong></td>
                <td>${escapeHtml(date)}</td>
                <td>
                    <span class="invoice-request-status ${isPending ? "pending" : "processed"}">
                        ${isPending ? "Chờ in" : "Đã xử lý"}
                    </span>
                </td>
                <td>
                    <div class="invoice-request-actions">
                        <button type="button" class="invoice-request-print" data-order-id="${Number(request.orderId)}">
                            In hóa đơn
                        </button>
                        ${isPending ? `
                            <button type="button" class="invoice-request-complete" data-request-id="${Number(request.requestId)}">
                                Đã in / xử lý
                            </button>
                        ` : `<span class="invoice-request-done">Hoàn tất</span>`}
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function setupInvoiceRequestControls() {
    const panel = document.getElementById("invoiceRequestsPanel");
    if (!panel) {
        return;
    }

    panel.querySelectorAll(".invoice-request-filter").forEach(button => {
        button.addEventListener("click", () => {
            invoiceRequestFilter = button.dataset.filter;
            panel.querySelectorAll(".invoice-request-filter").forEach(item => {
                item.classList.toggle("active", item === button);
            });
            renderAdminInvoiceRequests();
        });
    });

    document.getElementById("invoiceRequestsReload").addEventListener("click", async () => {
        await loadAdminInvoiceRequests();
    });

    document.getElementById("invoiceRequestTableBody").addEventListener("click", async event => {
        const printButton = event.target.closest(".invoice-request-print");
        if (printButton) {
            const orderId = Number(printButton.dataset.orderId);
            if (Number.isSafeInteger(orderId) && orderId > 0) {
                window.open(`/pages/invoice.html?id=${orderId}&source=admin`, "_blank", "noopener,noreferrer");
            }
            return;
        }

        const completeButton = event.target.closest(".invoice-request-complete");
        if (!completeButton) {
            return;
        }

        const requestId = Number(completeButton.dataset.requestId);
        if (!Number.isSafeInteger(requestId) || requestId <= 0) {
            return;
        }

        const confirmed = window.confirm("Bạn đã in hoặc lưu PDF hóa đơn thành công và muốn đánh dấu yêu cầu đã xử lý?");
        if (!confirmed) {
            return;
        }

        completeButton.disabled = true;
        try {
            await window.api.completeAdminInvoicePrintRequest(requestId);
            showInvoiceRequestMessage("Đã đánh dấu yêu cầu in hóa đơn là đã xử lý.", false);
            await loadAdminInvoiceRequests();
        } catch (error) {
            completeButton.disabled = false;
            showInvoiceRequestMessage(error.message || "Không thể cập nhật yêu cầu.", true);
        }
    });
}

function showInvoiceRequestMessage(message, isError) {
    const element = document.getElementById("invoiceRequestMessage");
    if (!element) {
        return;
    }
    element.textContent = message;
    element.classList.toggle("error", Boolean(isError));
}
