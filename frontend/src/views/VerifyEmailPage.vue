<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/verify-email.html -->
<template>

    <main class="verify-page">
        <section class="verify-card">
            <a class="brand" href="/">COMPUTER<span>STORE</span></a>
            <div class="verify-icon">✉</div>
            <h1>Xác minh địa chỉ Gmail</h1>
            <p>ComputerStore đã gửi mã gồm 6 chữ số đến email đăng ký. Mã có hiệu lực 10 phút.</p>
            <form id="verifyForm">
                <label for="verifyEmail">Email đăng ký</label>
                <input id="verifyEmail" type="email" autocomplete="email" required placeholder="ten@gmail.com">
                <label for="verifyCode">Mã xác minh</label>
                <input id="verifyCode" type="text" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" required placeholder="000000">
                <div id="verifyMessage" role="status" aria-live="polite"></div>
                <button id="verifyButton" class="verify-button" type="submit">Xác minh email</button>
            </form>
            <button id="resendCodeButton" class="resend-button" type="button">Gửi lại mã xác minh</button>
            <a class="login-link" href="/pages/login.html">Quay về đăng nhập</a>
        </section>
    </main>
</template>

<script setup>
import '../styles/pages-verify-email.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Xác minh email - ComputerStore",
  bodyClass: "",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/verify-email.js?raw'),
  ],
})
</script>
