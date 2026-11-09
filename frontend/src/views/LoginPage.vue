<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/login.html -->
<template>


    <main class="auth-page">

        <div class="auth-container">


            <div class="auth-banner">

                <a href="/"
                   class="auth-logo">

                    COMPUTER<span>STORE</span>

                </a>

                <div class="auth-banner-content">

                    <p class="auth-small">
                        WELCOME BACK
                    </p>

                    <h1>
                        Đăng nhập để tiếp tục mua sắm
                    </h1>

                    <p>
                        Quản lý giỏ hàng, đơn hàng,
                        PC Builder và tài khoản của bạn.
                    </p>

                </div>

            </div>



            <div class="auth-form-side">

                <div class="auth-form-box">

                    <a href="/"
                       class="back-home">
                        ← Về trang chủ
                    </a>


                    <div class="auth-title">

                        <p class="section-label">
                            ACCOUNT
                        </p>

                        <h2>
                            Đăng nhập
                        </h2>

                        <p>
                            Nhập tài khoản để tiếp tục.
                        </p>

                    </div>


                    <form id="loginForm">

                        <div class="form-group">

                            <label for="username">
                                Tên đăng nhập
                            </label>

                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Nhập username"
                                autocomplete="username"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label for="password">
                                Mật khẩu
                            </label>

                            <div class="password-wrapper">

                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Nhập mật khẩu"
                                    autocomplete="current-password"
                                    required
                                >

                                <button
                                    type="button"
                                    id="togglePassword"
                                    class="toggle-password"
                                >
                                    Hiện
                                </button>

                            </div>

                        </div>


                        <p class="forgot-inline"><a href="/pages/forgot-password.html">Quên mật khẩu?</a></p>

                        <div
                            id="loginMessage"
                            class="auth-message"
                        ></div>


                        <button
                            type="submit"
                            id="loginButton"
                            class="auth-submit"
                        >
                            Đăng nhập
                        </button>

                    </form>


                    <div class="auth-switch">

                        Chưa có tài khoản?

                        <a href="/pages/register.html">
                            Đăng ký ngay
                        </a>

                    </div>

                </div>

            </div>

        </div>

    </main>
</template>

<script setup>
import '../styles/pages-login.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Đăng nhập - Computer Store",
  bodyClass: "",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/auth.js?raw'),
  ],
})
</script>
