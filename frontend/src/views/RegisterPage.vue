<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/register.html -->
<template>


<main class="register-page">

    <div class="register-container">




        <section class="register-banner">

            <a
                href="/"
                class="register-logo"
            >
                COMPUTER<span>STORE</span>
            </a>


            <div class="register-banner-content">

                <p class="register-label">
                    COMPUTER STORE
                </p>

                <h1>
                    Tạo tài khoản
                    <span>mua sắm linh kiện</span>
                </h1>

                <p>
                    Đăng ký tài khoản để quản lý đơn hàng,
                    giỏ hàng và các cấu hình PC của bạn.
                </p>


                <div class="register-benefits">

                    <div>
                        ✓ Lưu cấu hình PC Builder
                    </div>

                    <div>
                        ✓ Theo dõi đơn hàng
                    </div>

                    <div>
                        ✓ Quản lý giỏ hàng riêng
                    </div>

                </div>

            </div>

        </section>




        <section class="register-form-section">

            <div class="register-form-wrapper">

                <div class="register-heading">

                    <p class="register-small">
                        TẠO TÀI KHOẢN
                    </p>

                    <h2>
                        Đăng ký
                    </h2>

                    <p>
                        Điền thông tin bên dưới để tạo tài khoản.
                    </p>

                </div>


                <div
                    id="registerMessage"
                    class="register-message"
                ></div>


                <form id="registerForm">


                    <div class="register-grid">


                        <div class="register-field">

                            <label for="fullName">
                                Họ và tên
                            </label>

                            <input
                                type="text"
                                id="fullName"
                                placeholder="Nguyễn Văn A"
                                required
                            >

                        </div>


                        <div class="register-field">

                            <label for="username">
                                Tên đăng nhập
                            </label>

                            <input
                                type="text"
                                id="username"
                                placeholder="nguyenvana"
                                required
                            >

                        </div>


                        <div class="register-field">

                            <label for="email">
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                placeholder="example@gmail.com"
                                required
                            >

                        </div>


                        <div class="register-field">

                            <label for="phone">
                                Số điện thoại
                            </label>

                            <input
                                type="text"
                                id="phone"
                                placeholder="0987654321"
                            >

                        </div>


                        <div class="register-field full-width">

                            <label for="address">
                                Địa chỉ
                            </label>

                            <input
                                type="text"
                                id="address"
                                placeholder="Tây Ninh, Việt Nam"
                            >

                        </div>


                        <div class="register-field">

                            <label for="password">
                                Mật khẩu
                            </label>

                            <div class="password-wrapper">

                                <input
                                    type="password"
                                    id="password"
                                    autocomplete="new-password"
                                    required
                                >

                                <button
                                    type="button"
                                    class="password-toggle"
                                    data-target="password"
                                >
                                    Hiện
                                </button>

                            </div>

                        </div>


                        <div class="register-field">

                            <label for="confirmPassword">
                                Xác nhận mật khẩu
                            </label>

                            <div class="password-wrapper">

                                <input
                                    type="password"
                                    id="confirmPassword"
                                    autocomplete="new-password"
                                    required
                                >

                                <button
                                    type="button"
                                    class="password-toggle"
                                    data-target="confirmPassword"
                                >
                                    Hiện
                                </button>

                            </div>

                        </div>

                    </div>


                    <button
                        type="submit"
                        id="registerButton"
                        class="register-button"
                    >
                        Tạo tài khoản
                    </button>


                    <p class="login-text">

                        Đã có tài khoản?

                        <a href="/pages/login.html">
                            Đăng nhập
                        </a>
                    </p>

                    <p class="login-text">
                        Đã đăng ký nhưng chưa nhận mã?
                        <a href="/pages/verify-email.html">Xác minh Gmail</a>

                    </p>

                </form>

            </div>

        </section>

    </div>

</main>
</template>

<script setup>
import '../styles/pages-register.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Đăng ký - Computer Store",
  bodyClass: "",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/register.js?raw'),
  ],
})
</script>
