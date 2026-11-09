<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/reset-password.html -->
<template>

    <main class="auth-page">
        <div class="auth-container">
            <div class="auth-banner">
                <a href="/" class="auth-logo">COMPUTER<span>STORE</span></a>
                <div class="auth-banner-content">
                    <p class="auth-small">BẢO MẬT TÀI KHOẢN</p>
                    <h1>Đặt lại mật khẩu</h1>
                    <p>Áp dụng cho cả tài khoản khách hàng và quản trị viên.</p>
                </div>
            </div>

            <div class="auth-form-side">
                <div class="auth-form-box">
                    <a class="back-home" href="/pages/login.html">← Về đăng nhập</a>

                    <div class="auth-title">
                        <p class="section-label">ACCOUNT SECURITY</p>
                        <h2>Đặt lại mật khẩu</h2>
                        <p>Mật khẩu mới cần ít nhất 8 ký tự. Liên kết chỉ dùng một lần.</p>
                    </div>

                    <form id="resetPasswordForm">
                        <div class="form-group">
                            <label for="newPassword">Mật khẩu mới</label>
                            <input type="password" id="newPassword" autocomplete="new-password" minlength="8" maxlength="128" required>
                        </div>

                        <div class="form-group">
                            <label for="confirmPassword">Nhập lại mật khẩu</label>
                            <input type="password" id="confirmPassword" autocomplete="new-password" minlength="8" maxlength="128" required>
                        </div>

                        <div id="resetMessage" class="auth-message" role="status" aria-live="polite"></div>
                        <button id="resetButton" type="submit" class="auth-submit">Đổi mật khẩu</button>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import '../styles/pages-reset-password.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Đặt lại mật khẩu - ComputerStore",
  bodyClass: "",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/password-reset.js?raw'),
  ],
})
</script>
