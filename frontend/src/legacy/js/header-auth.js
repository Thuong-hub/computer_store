document.addEventListener("DOMContentLoaded", () => {
    setupMobileNavigation();
    updateHeaderAuth();
    refreshHeaderCartBadge();
});

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        refreshHeaderCartBadge();
    }
});

window.addEventListener("pageshow", event => {
    if (event.persisted) {
        refreshHeaderCartBadge();
    }
});

window.addEventListener("storage", event => {
    if (event.key === "token" || event.key === "user") {
        refreshHeaderCartBadge();
    }
});

document.addEventListener("cart:updated", refreshHeaderCartBadge);

function setupMobileNavigation() {
    const toggle = document.getElementById("mobileMenuButton");
    const nav = document.getElementById("mobilePrimaryNav");

    if (!toggle || !nav) {
        return;
    }

    function closeMenu() {
        nav.classList.remove("mobile-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Mở menu điều hướng");
    }

    toggle.addEventListener("click", () => {
        const willOpen = !nav.classList.contains("mobile-open");
        nav.classList.toggle("mobile-open", willOpen);
        toggle.setAttribute("aria-expanded", String(willOpen));
        toggle.setAttribute("aria-label", willOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng");
    });

    nav.addEventListener("click", event => {
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
        if (!nav.contains(event.target) && !toggle.contains(event.target)) {
            closeMenu();
        }
    });
}

function updateHeaderAuth() {
    const loginLink = document.getElementById("loginLink")
        || document.querySelector('a[href="/pages/login.html"]');

    if (!loginLink) {
        return;
    }

    const mobileAccount = document.getElementById("mobileNavAccount");
    const mobileWishlist = document.getElementById("mobileWishlistLink");
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    function createMobileLink(label, href) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        return link;
    }

    function showGuest() {
        loginLink.textContent = "Đăng nhập";
        loginLink.href = "/pages/login.html";

        if (mobileWishlist) {
            mobileWishlist.href = "/pages/login.html";
        }

        if (mobileAccount) {
            mobileAccount.replaceChildren(
                createMobileLink("Đăng nhập", "/pages/login.html"),
                createMobileLink("Đăng ký", "/pages/register.html")
            );
        }
    }

    if (!token || !userString) {
        showGuest();
        return;
    }

    try {
        const user = JSON.parse(userString);
        const displayName = user.fullName || user.username || "Tài khoản";

        loginLink.textContent = `👤 ${displayName}`;
        loginLink.href = "/pages/profile.html";
        loginLink.title = displayName;
        loginLink.classList.add("header-profile-link");

        if (mobileWishlist) {
            mobileWishlist.href = "/pages/wishlist.html";
        }

        const isAdmin = String(user.role || "").toUpperCase() === "ADMIN";

        if (isAdmin && !document.getElementById("adminHeaderLink")) {
            const adminLink = document.createElement("a");
            adminLink.id = "adminHeaderLink";
            adminLink.href = "/pages/admin/index.html";
            adminLink.textContent = "← Về trang Admin";
            adminLink.className = "header-auth-link";
            loginLink.insertAdjacentElement("afterend", adminLink);
        }

        if (!document.getElementById("wishlistHeaderLink")) {
            const wishlistLink = document.createElement("a");
            wishlistLink.id = "wishlistHeaderLink";
            wishlistLink.href = "/pages/wishlist.html";
            wishlistLink.textContent = "Yêu thích";
            wishlistLink.className = "header-auth-link";
            (document.getElementById("adminHeaderLink") || loginLink).insertAdjacentElement("afterend", wishlistLink);
        }

        if (!document.getElementById("ordersHeaderLink")) {
            const ordersLink = document.createElement("a");
            ordersLink.id = "ordersHeaderLink";
            ordersLink.href = "/pages/orders.html";
            ordersLink.textContent = "Đơn hàng";
            ordersLink.className = "header-auth-link";
            document.getElementById("wishlistHeaderLink").insertAdjacentElement("afterend", ordersLink);
        }

        if (!document.getElementById("logoutButton")) {
            const logoutButton = document.createElement("button");
            logoutButton.id = "logoutButton";
            logoutButton.type = "button";
            logoutButton.className = "header-logout-button";
            logoutButton.textContent = "Đăng xuất";
            logoutButton.addEventListener("click", logout);
            document.getElementById("ordersHeaderLink").insertAdjacentElement("afterend", logoutButton);
        }

        if (mobileAccount) {
            const logoutButton = document.createElement("button");
            logoutButton.type = "button";
            logoutButton.textContent = "Đăng xuất";
            logoutButton.addEventListener("click", logout);

            mobileAccount.replaceChildren(
                createMobileLink(`Tài khoản: ${displayName}`, "/pages/profile.html"),
                ...(isAdmin ? [createMobileLink("← Về trang Admin", "/pages/admin/index.html")] : []),
                createMobileLink("Yêu thích", "/pages/wishlist.html"),
                createMobileLink("Đơn hàng", "/pages/orders.html"),
                logoutButton
            );
        }
    } catch (error) {
        console.error("User data error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showGuest();
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
}

async function refreshHeaderCartBadge() {
    const cartBadge = document.getElementById("cartCount");

    if (!cartBadge) {
        return;
    }

    if (!localStorage.getItem("token")) {
        cartBadge.textContent = "0";
        return;
    }

    if (!window.api || typeof window.api.getCartItems !== "function") {
        return;
    }

    try {
        const cart = await window.api.getCartItems();
        const fallbackQuantity = Array.isArray(cart?.items)
            ? cart.items.reduce((total, item) => total + Number(item.quantity || 0), 0)
            : 0;
        const quantity = Number(cart?.totalQuantity ?? fallbackQuantity);

        cartBadge.textContent = String(
            Number.isFinite(quantity) && quantity > 0
                ? Math.floor(quantity)
                : 0
        );
    } catch (error) {
        console.error("Không thể cập nhật số lượng giỏ hàng:", error);
    }
}
