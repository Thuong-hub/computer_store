

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupLoginForm();

        setupPasswordToggle();
    }
);

function setupLoginForm() {

    const form =
        document.getElementById(
            "loginForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const usernameInput =
                document.getElementById(
                    "username"
                );

            const passwordInput =
                document.getElementById(
                    "password"
                );

            const button =
                document.getElementById(
                    "loginButton"
                );

            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value;

            if (!username) {

                showAuthMessage(
                    "Vui lòng nhập tên đăng nhập.",
                    "error"
                );

                return;
            }

            if (!password) {

                showAuthMessage(
                    "Vui lòng nhập mật khẩu.",
                    "error"
                );

                return;
            }

            try {

                button.disabled = true;

                button.textContent =
                    "Đang đăng nhập...";

                const response =
                    await window.api.login(
                        username,
                        password
                    );

                localStorage.setItem(
                    "token",
                    response.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify({
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
                    })
                );

                showAuthMessage(
                    "Đăng nhập thành công.",
                    "success"
                );

                setTimeout(
                    () => {

                        const role =
                            String(
                                response.role || ""
                            )
                                .trim()
                                .toUpperCase();

                        const params =
                            new URLSearchParams(
                                window.location.search
                            );

                        const redirect =
                            params.get(
                                "redirect"
                            );

                        if (role === "ADMIN") {

                            window.location.href =
                                "/pages/admin/index.html";

                            return;
                        }

                        if (
                            redirect
                            &&
                            redirect.startsWith("/")
                            &&
                            !redirect.startsWith("//")
                        ) {

                            window.location.href =
                                redirect;

                            return;
                        }

                        window.location.href = "/";

                    },
                    600
                );

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                showAuthMessage(
                    error.message
                    ||
                    "Đăng nhập thất bại.",
                    "error"
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "Đăng nhập";
            }
        }
    );
}

function setupPasswordToggle() {

    const passwordInput =
        document.getElementById(
            "password"
        );

    const button =
        document.getElementById(
            "togglePassword"
        );

    if (!passwordInput || !button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {

            const isPassword =
                passwordInput.type
                ===
                "password";

            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";

            button.textContent =
                isPassword
                    ? "Ẩn"
                    : "Hiện";
        }
    );
}

function showAuthMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "loginMessage"
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