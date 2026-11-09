let allOrders = [];
let currentStatus = "ALL";
let orderRefreshTimer = null;


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


        setupOrdersMobileNav();

        setupSearch();

        setupFilters();

        setupOrderEvents();

        await updateCartCount();

        await loadOrders();
        startOrderRefresh();
    }
);



async function loadOrders() {

    const list =
        document.getElementById(
            "ordersList"
        );


    const empty =
        document.getElementById(
            "emptyOrders"
        );


    try {

        list.innerHTML = `
            <div class="orders-loading">
                Đang tải đơn hàng...
            </div>
        `;


        const response =
            await window.api.getMyOrders();


        allOrders =
            Array.isArray(response)
                ? response
                : [];


        renderOrders();


    } catch (error) {

        console.error(
            "Load orders error:",
            error
        );


        list.innerHTML = "";


        empty.hidden = true;


        showOrdersMessage(
            error.message
            || "Không thể tải đơn hàng.",
            "error"
        );
    }
}



function startOrderRefresh() {

    if (orderRefreshTimer) {
        return;
    }

    orderRefreshTimer = setInterval(
        async () => {
            const hasPendingBankTransfer = allOrders.some(
                order => String(order.status || "").toUpperCase() === "PENDING"
            );

            if (!hasPendingBankTransfer) {
                return;
            }

            try {
                const response = await window.api.getMyOrders();
                allOrders = Array.isArray(response) ? response : [];
                renderOrders();
            } catch (error) {
                console.error("Order status refresh error:", error);
            }
        },
        5000
    );
}


function renderOrders() {

    const list =
        document.getElementById(
            "ordersList"
        );


    const empty =
        document.getElementById(
            "emptyOrders"
        );


    let orders =
        [...allOrders];



    if (currentStatus !== "ALL") {

        orders =
            orders.filter(
                order =>
                    String(
                        order.status || ""
                    ).toUpperCase()
                    === currentStatus
            );
    }



    if (orders.length === 0) {

        list.innerHTML = "";

        empty.hidden = false;

        return;
    }


    empty.hidden = true;


    list.innerHTML =
        orders
            .map(order =>
                createOrderCard(order)
            )
            .join("");


    highlightNewestOrder();
}



function createOrderCard(order) {

    const status =
        String(
            order.status || "PENDING"
        ).toUpperCase();


    const orderId =
        order.orderId;


    const recipientName =
        order.recipientName
        || "Không có thông tin";


    const phone =
        order.phone
        || "Không có";


    const address =
        order.shippingAddress
        || "Không có";


    const total =
        order.totalAmount
        ?? 0;


    const createdAt =
        formatDateTime(
            order.createdAt
        );

    const promotionCode =
        order.promotionCode
        || "";

    const discountAmount =
        Number(
            order.discountAmount
            || 0
        );


    return `
        <article
            class="order-card"
            data-order-id="${orderId}"
        >

            <div class="order-card-header">

                <div>

                    <div class="order-number">
                        Đơn hàng #${orderId}
                    </div>

                    <div class="order-date">
                        ${escapeHtml(createdAt)}
                    </div>

                </div>


                <span
                    class="order-status ${getStatusClass(status)}"
                >
                    ${getStatusText(status)}
                </span>

            </div>


            <div class="order-card-body">

                <div class="order-info">

                    <div class="order-info-item">

                        <span>
                            Người nhận
                        </span>

                        <strong>
                            ${escapeHtml(recipientName)}
                        </strong>

                    </div>


                    <div class="order-info-item">

                        <span>
                            Số điện thoại
                        </span>

                        <strong>
                            ${escapeHtml(phone)}
                        </strong>

                    </div>


                    <div class="order-info-item">

                        <span>
                            Địa chỉ giao hàng
                        </span>

                        <strong>
                            ${escapeHtml(address)}
                        </strong>

                    </div>

                </div>


                <div class="order-total">

                    <span>
                        Tổng tiền
                    </span>

                    <strong>
                        ${formatCurrency(total)}
                    </strong>

                    ${
                        promotionCode
                            ? `
                                <small>
                                    Mã ${escapeHtml(promotionCode)}
                                    · giảm ${formatCurrency(discountAmount)}
                                </small>
                            `
                            : ""
                    }

                </div>

            </div>


            <div class="order-actions">

                <button
                    type="button"
                    class="order-detail-button"
                    data-action="detail"
                    data-id="${orderId}"
                >
                    Xem chi tiết
                </button>


                ${
                    status === "PENDING"

                    ? `
                        <button
                            type="button"
                            class="order-cancel-button"
                            data-action="cancel"
                            data-id="${orderId}"
                        >
                            Hủy đơn
                        </button>
                    `

                    : ""
                }

            </div>

        </article>
    `;
}



function setupFilters() {

    const buttons =
        document.querySelectorAll(
            ".order-filter-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    currentStatus =
                        button.dataset.status;


                    renderOrders();
                }
            );
        }
    );
}



function setupOrderEvents() {

    const list =
        document.getElementById(
            "ordersList"
        );


    list.addEventListener(
        "click",
        async event => {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) {
                return;
            }


            const orderId =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset.action;



            if (action === "detail") {

                window.location.href =
                    `/pages/order-detail.html?id=${orderId}`;

                return;
            }



            if (action === "cancel") {

                await handleCancelOrder(
                    orderId,
                    button
                );
            }
        }
    );
}



async function handleCancelOrder(
    orderId,
    button
) {

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


        const response =
            await window.api.cancelOrder(
                orderId
            );


        showOrdersMessage(
            response.message
            || "Hủy đơn hàng thành công.",
            "success"
        );


        await loadOrders();


    } catch (error) {

        console.error(
            "Cancel order error:",
            error
        );


        showOrdersMessage(
            error.message
            || "Không thể hủy đơn hàng.",
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Hủy đơn";
    }
}



function highlightNewestOrder() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const orderId =
        params.get(
            "orderId"
        );


    if (!orderId) {
        return;
    }


    const card =
        document.querySelector(
            `.order-card[data-order-id="${orderId}"]`
        );


    if (!card) {
        return;
    }


    card.classList.add(
        "new-order"
    );


    card.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
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

        console.error(
            "Cart count error:",
            error
        );


        element.textContent =
            "0";
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

    switch (status) {

        case "PENDING":
            return "pending";

        case "CONFIRMED":
            return "confirmed";

        case "SHIPPING":
            return "shipping";

        case "COMPLETED":
            return "completed";

        case "CANCELLED":
            return "cancelled";

        default:
            return "";
    }
}



function formatDateTime(value) {

    if (!value) {

        return "Không có thời gian";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;
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



function showOrdersMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "ordersMessage"
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
        3500
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


function setupOrdersMobileNav() {
    const toggle = document.getElementById("ordersMobileMenuToggle");
    const menu = document.getElementById("ordersMobileMenu");

    if (!toggle || !menu) {
        return;
    }

    function closeMenu() {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Mở menu");
        menu.classList.remove("orders-nav-open");
    }

    toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
        menu.classList.toggle("orders-nav-open", open);
    });

    menu.addEventListener("click", event => {
        if (event.target.closest("a")) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", event => {
        if (!toggle.contains(event.target) && !menu.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 767) {
            closeMenu();
        }
    });
}
