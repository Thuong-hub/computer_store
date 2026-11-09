document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const token =
            window.api.getToken();

        if (!token) {

            window.location.href =
                "/pages/login.html";

            return;
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

            return;
        }

        setupAdminUser(user);

        setupAdminLogout();

        await loadAdminDashboard();
    }
);

function setupAdminUser(user) {

    const name =
        document.getElementById(
            "adminName"
        );

    const avatar =
        document.querySelector(
            ".admin-avatar"
        );

    const displayName =
        user.fullName
        ||
        user.username
        ||
        "Administrator";

    if (name) {

        name.textContent =
            displayName;
    }

    if (avatar) {

        avatar.textContent =
            displayName
                .charAt(0)
                .toUpperCase();
    }
}

function setupAdminLogout() {

    const button =
        document.getElementById(
            "adminLogoutButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
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

async function loadAdminDashboard() {

    try {

        const dashboard =
            await window.api.getAdminDashboard();

        setText(
            "totalProducts",
            dashboard.totalProducts
        );

        setText(
            "totalUsers",
            dashboard.totalUsers
        );

        setText(
            "totalOrders",
            dashboard.totalOrders
        );

        setText(
            "pendingOrders",
            dashboard.pendingOrders
        );

        setText(
            "confirmedOrders",
            dashboard.confirmedOrders
        );

        setText(
            "shippingOrders",
            dashboard.shippingOrders
        );

        setText(
            "completedOrders",
            dashboard.completedOrders
        );

        setText(
            "cancelledOrders",
            dashboard.cancelledOrders
        );

        setText(
            "totalRevenue",
            formatCurrency(
                dashboard.totalRevenue
            )
        );

        setText(
            "todayRevenue",
            formatCurrency(
                dashboard.todayRevenue
            )
        );

        setText(
            "thisMonthRevenue",
            formatCurrency(
                dashboard.thisMonthRevenue
            )
        );

    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );

        showAdminMessage(
            error.message
            || "Không thể tải Dashboard."
        );

        if (
            error.message
            &&
            (
                error.message.includes("403")
                ||
                error.message.includes("401")
            )
        ) {

            setTimeout(
                () => {

                    window.location.href =
                        "/pages/login.html";

                },
                1200
            );
        }
    }
}

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent =
        value ?? 0;
}

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "vi-VN"
    ).format(
        Number(value || 0)
    )
    + " ₫";
}

function showAdminMessage(message) {

    const element =
        document.getElementById(
            "adminMessage"
        );

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.className =
        "admin-message error";
}