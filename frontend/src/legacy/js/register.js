document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupRegisterForm();

        setupPasswordToggle();
    }
);

function setupRegisterForm() {

    const form =
        document.getElementById(
            "registerForm"
        );

    const button =
        document.getElementById(
            "registerButton"
        );

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const fullName =
                document.getElementById(
                    "fullName"
                ).value.trim();

            const username =
                document.getElementById(
                    "username"
                ).value.trim();

            const email =
                document.getElementById(
                    "email"
                ).value.trim();

            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();

            const address =
                document.getElementById(
                    "address"
                ).value.trim();

            const password =
                document.getElementById(
                    "password"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;

            if (
                !fullName
                ||
                !username
                ||
                !email
                ||
                !password
            ) {

                showRegisterMessage(
                    "Vui lòng nhập đầy đủ thông tin bắt buộc.",
                    "error"
                );

                return;
            }

            if (
                password
                !==
                confirmPassword
            ) {

                showRegisterMessage(
                    "Xác nhận mật khẩu không khớp.",
                    "error"
                );

                return;
            }

            if (
                phone
                &&
                !/^0\d{9,10}$/.test(phone)
            ) {

                showRegisterMessage(
                    "Số điện thoại không hợp lệ.",
                    "error"
                );

                return;
            }

            try {

                button.disabled = true;

                button.textContent =
                    "Đang tạo tài khoản...";

                const response =
                    await window.api.request(
                        "/api/auth/register",
                        {
                            method: "POST",

                            body: JSON.stringify({
                                username,
                                email,
                                password,
                                fullName,

                                phone:
                                    phone || null,

                                address:
                                    address || null
                            })
                        }
                    );

                showRegisterMessage(
                    response.message
                    || "Đăng ký thành công.",
                    "success"
                );

                setTimeout(
                    () => {

                        window.location.href =
                            `/pages/verify-email.html?email=${encodeURIComponent(email)}`;

                    },
                    1200
                );

            } catch (error) {

                console.error(
                    "Register error:",
                    error
                );

                showRegisterMessage(
                    error.message
                    || "Không thể đăng ký tài khoản.",
                    "error"
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "Tạo tài khoản";
            }
        }
    );
}

function setupPasswordToggle() {

    document
        .querySelectorAll(
            ".password-toggle"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const targetId =
                        button.dataset.target;

                    const input =
                        document.getElementById(
                            targetId
                        );

                    if (
                        input.type
                        ===
                        "password"
                    ) {

                        input.type =
                            "text";

                        button.textContent =
                            "Ẩn";

                    } else {

                        input.type =
                            "password";

                        button.textContent =
                            "Hiện";
                    }
                }
            );
        });
}

function showRegisterMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "registerMessage"
        );

    element.textContent =
        message;

    element.className =
        `register-message ${type}`;
}