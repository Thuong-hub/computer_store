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

        setupProfileMobileNav();

        setupSearch();

        setupUpdateProfile();

        setupChangePassword();

        setupEmailChange();

        await updateCartCount();

        await loadProfile();
        await loadMembershipProfile();
    }
);

async function loadProfile() {

    const loading =
        document.getElementById(
            "profileLoading"
        );

    const info =
        document.getElementById(
            "profileInfo"
        );

    try {

        const user =
            await window.api.getCurrentUser();

        loading.hidden = true;

        info.hidden = false;

        setText(
            "profileUserId",
            user.customerCode || "--"
        );

        setText(
            "profileUsername",
            user.username
        );

        setText(
            "profileFullName",
            user.fullName || "Chưa cập nhật"
        );

        setText(
            "profileEmail",
            user.email || "Chưa cập nhật"
        );

        setText(
            "profilePhone",
            user.phone || "Chưa cập nhật"
        );

        setText(
            "profileAddress",
            user.address || "Chưa cập nhật"
        );

        setText(
            "profileRole",
            getRoleText(user.role)
        );

        setText(
            "sidebarName",
            user.fullName
            || user.username
        );

        setText(
            "sidebarUsername",
            `@${user.username}`
        );

        setText(
            "sidebarRole",
            getRoleText(user.role)
        );

        const avatar =
            document.getElementById(
                "profileAvatarText"
            );

        avatar.textContent =
            getAvatarLetter(
                user.fullName
                || user.username
            );

        document.getElementById(
            "editFullName"
        ).value =
            user.fullName || "";

        document.getElementById(
            "editEmail"
        ).value =
            user.email || "";

        document.getElementById(
            "editPhone"
        ).value =
            user.phone || "";

        document.getElementById(
            "editAddress"
        ).value =
            user.address || "";

    } catch (error) {

        console.error(
            "Load profile error:",
            error
        );

        loading.hidden = true;

        showProfileMessage(
            error.message
            || "Không thể tải thông tin tài khoản."
        );
    }
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

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value ?? "-";
    }
}

function getAvatarLetter(name) {

    const value =
        String(name || "")
            .trim();

    if (!value) {
        return "U";
    }

    return value
        .charAt(0)
        .toUpperCase();
}

function getRoleText(role) {

    const value =
        String(
            role || ""
        ).toUpperCase();

    if (value === "ADMIN") {
        return "Quản trị viên";
    }

    if (value === "USER") {
        return "Khách hàng";
    }

    return value || "Không xác định";
}

function showProfileMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "profileMessage"
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

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

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

function setupUpdateProfile() {

    const button =
        document.getElementById(
            "updateProfileButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        async () => {

            const fullName =
                document.getElementById(
                    "editFullName"
                ).value.trim();

            const phone =
                document.getElementById(
                    "editPhone"
                ).value.trim();

            const address =
                document.getElementById(
                    "editAddress"
                ).value.trim();

            if (!fullName) {

                showProfileMessage(
                    "Họ tên không được để trống.",
                    "error"
                );

                return;
            }

            try {

                button.disabled = true;

                button.textContent =
                    "Đang cập nhật...";

                const response =
                    await window.api.updateProfile({
                        fullName,
                        phone:
                            phone || null,
                        address:
                            address || null
                    });

                const oldUser =
                    JSON.parse(
                        localStorage.getItem("user")
                        || "{}"
                    );

                const newUser = {
                    ...oldUser,

                    userId:
                        response.userId,

                    username:
                        response.username,

                    email:
                        response.email,

                    fullName:
                        response.fullName,

                    role:
                        response.role
                };

                localStorage.setItem(
                    "user",
                    JSON.stringify(newUser)
                );

                showProfileMessage(
                    response.message
                    || "Cập nhật thông tin thành công.",
                    "success"
                );

                await loadProfile();

                if (
                    typeof updateHeaderAuth
                    ===
                    "function"
                ) {

                    updateHeaderAuth();
                }

            } catch (error) {

                console.error(
                    "Update profile error:",
                    error
                );

                showProfileMessage(
                    error.message
                    || "Không thể cập nhật thông tin.",
                    "error"
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "Cập nhật thông tin";
            }
        }
    );
}

function setupChangePassword() {

    const button =
        document.getElementById(
            "changePasswordButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        async () => {

            const oldPassword =
                document.getElementById(
                    "oldPassword"
                ).value;

            const newPassword =
                document.getElementById(
                    "newPassword"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "confirmNewPassword"
                ).value;

            if (!oldPassword) {

                showProfileMessage(
                    "Vui lòng nhập mật khẩu hiện tại.",
                    "error"
                );

                return;
            }

            if (!newPassword) {

                showProfileMessage(
                    "Vui lòng nhập mật khẩu mới.",
                    "error"
                );

                return;
            }

            if (newPassword.length < 8) {

                showProfileMessage(
                    "Mật khẩu mới phải có ít nhất 8 ký tự.",
                    "error"
                );

                return;
            }

            if (newPassword !== confirmPassword) {

                showProfileMessage(
                    "Xác nhận mật khẩu mới không khớp.",
                    "error"
                );

                return;
            }

            if (oldPassword === newPassword) {

                showProfileMessage(
                    "Mật khẩu mới phải khác mật khẩu hiện tại.",
                    "error"
                );

                return;
            }

            try {

                button.disabled = true;

                button.textContent =
                    "Đang đổi mật khẩu...";

                const response =
                    await window.api.changePassword(
                        oldPassword,
                        newPassword
                    );

                showProfileMessage(
                    response.message
                    || "Đổi mật khẩu thành công.",
                    "success"
                );

                document.getElementById(
                    "oldPassword"
                ).value = "";

                document.getElementById(
                    "newPassword"
                ).value = "";

                document.getElementById(
                    "confirmNewPassword"
                ).value = "";

                setTimeout(
                    () => {

                        localStorage.removeItem(
                            "token"
                        );

                        localStorage.removeItem(
                            "user"
                        );

                        window.location.href =
                            "/pages/login.html";

                    },
                    1200
                );

            } catch (error) {

                console.error(
                    "Change password error:",
                    error
                );

                showProfileMessage(
                    error.message
                    || "Không thể đổi mật khẩu.",
                    "error"
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "Đổi mật khẩu";
            }
        }
    );
}

function setupProfileMobileNav() {
    const toggle = document.getElementById("profileMobileMenuToggle");
    const menu = document.getElementById("profileMobileMenu");

    if (!toggle || !menu) {
        return;
    }

    function closeMenu() {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Mở menu");
        menu.classList.remove("profile-nav-open");
    }

    toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
        menu.classList.toggle("profile-nav-open", open);
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

function setupEmailChange() {
    const sendButton = document.getElementById("requestEmailChangeButton");
    const confirmButton = document.getElementById("confirmEmailChangeButton");
    const otpPanel = document.getElementById("emailChangeVerifyPanel");
    const message = document.getElementById("emailChangeMessage");
    if (!sendButton || !confirmButton || !otpPanel || !message) {
        return;
    }

    function showMessage(text, error) {
        message.textContent = text;
        message.classList.toggle("error", Boolean(error));
        message.classList.toggle("success", !error);
    }

    sendButton.addEventListener("click", async () => {
        const newEmail = document.getElementById("newProfileEmail").value.trim();
        const currentPassword = document.getElementById("emailChangePassword").value;
        if (!newEmail || !currentPassword) {
            showMessage("Vui lòng nhập email mới và mật khẩu hiện tại.", true);
            return;
        }
        try {
            sendButton.disabled = true;
            await window.api.requestEmailChange(newEmail, currentPassword);
            document.getElementById("emailChangePassword").value = "";
            otpPanel.hidden = false;
            showMessage("Mã OTP đã được gửi tới Gmail mới. Mã có hiệu lực 10 phút.", false);
        } catch (error) {
            showMessage(error.message || "Không thể gửi mã xác minh.", true);
        } finally {
            sendButton.disabled = false;
        }
    });

    confirmButton.addEventListener("click", async () => {
        const code = document.getElementById("emailChangeOtp").value.trim();
        if (!/^[0-9]{6}$/.test(code)) {
            showMessage("Vui lòng nhập đúng mã OTP gồm 6 chữ số.", true);
            return;
        }
        try {
            confirmButton.disabled = true;
            await window.api.confirmEmailChange(code);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.alert("Đổi Gmail thành công. Vui lòng đăng nhập lại để tiếp tục.");
            window.location.href = "/pages/login.html";
        } catch (error) {
            showMessage(error.message || "Không thể xác minh Gmail mới.", true);
            confirmButton.disabled = false;
        }
    });
}

async function loadMembershipProfile() {
    try {
        const data = await window.api.request("/api/membership/me");
        const vip = data.tier === "VIP";
        const tier = document.getElementById("membershipTier");
        tier.textContent = vip ? "VIP" : "Thường";
        tier.classList.toggle("vip", vip);
        document.getElementById("membershipDescription").textContent = data.benefitDescription;
        document.getElementById("membershipOrders").textContent =
            `${data.completedPaidOrders} / 10 đơn`;
        document.getElementById("membershipSpending").textContent =
            `${Number(data.qualifiedSpending || 0).toLocaleString("vi-VN")}đ / 300.000.000đ`;
        const ordersProgress = Math.min(100, Number(data.completedPaidOrders || 0) / 10 * 100);
        const amountProgress = Math.min(100, Number(data.qualifiedSpending || 0) / 300000000 * 100);
        document.getElementById("membershipProgress").style.width =
            `${vip ? 100 : Math.max(ordersProgress, amountProgress)}%`;
        document.getElementById("membershipRemaining").textContent = vip
            ? "Bạn đã đạt hạng VIP. Mỗi đơn mới được tính ưu đãi VIP tự động khi không dùng mã khác."
            : `Còn ${data.remainingOrdersForVip} đơn hoàn thành và thanh toán HOẶC ${Number(data.remainingSpendingForVip || 0).toLocaleString("vi-VN")}đ để lên VIP.`;
    } catch (error) {
        document.getElementById("membershipDescription").textContent =
            error.message || "Không thể tải thông tin thành viên";
    }
}
