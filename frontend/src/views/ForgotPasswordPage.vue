<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/forgot-password.html -->
<template>

    <main class="auth-page">
        <div class="auth-container">
            <div class="auth-banner">
                <a href="/" class="auth-logo">COMPUTER<span>STORE</span></a>
                <div class="auth-banner-content">
                    <p class="auth-small">BẢO MẬT TÀI KHOẢN</p>
                    <h1>Quên mật khẩu</h1>
                    <p>Áp dụng cho cả tài khoản khách hàng và quản trị viên.</p>
                </div>
            </div>

            <div class="auth-form-side">
                <div class="auth-form-box">
                    <a class="back-home" href="/pages/login.html">← Về đăng nhập</a>

                    <div class="auth-title">
                        <p class="section-label">ACCOUNT SECURITY</p>
                        <h2>Quên mật khẩu</h2>
                        <p>Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu (15 phút).</p>
                    </div>

                    <form id="forgotForm">
                        <div class="form-group">
                            <label for="email">Email tài khoản</label>
                            <input type="email" id="email" autocomplete="email" required placeholder="email@example.com" maxlength="100">
                        </div>

                        <div id="resetMessage" class="auth-message" role="status" aria-live="polite"></div>
                        <button id="resetButton" type="submit" class="auth-submit">Gửi liên kết</button>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import '../styles/pages-forgot-password.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Quên mật khẩu - ComputerStore",
  bodyClass: "",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/password-reset.js?raw'),
  ],
})
</script>
