<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/admin/support.html -->
<template>

<div class="admin-layout">
    <aside class="admin-sidebar" id="supportAdminSidebar">
        <div class="admin-logo">COMPUTER<span>STORE</span><small>ADMIN</small></div>
        <button type="button" id="supportAdminMenuToggle" class="admin-unified-menu-toggle" aria-expanded="false">☰ Menu</button>
        <nav class="admin-menu">
            <a href="/pages/admin/index.html"><span class="menu-icon">◫</span> Dashboard</a>
            <a href="/pages/admin/products.html"><span class="menu-icon">▣</span> Sản phẩm</a>
            <a href="/pages/admin/promotions.html"><span class="menu-icon">%</span> Khuyến mãi</a>
            <a href="/pages/admin/inventory.html"><span class="menu-icon">▦</span> Tổng kho</a>
            <a href="/pages/admin/reports.html"><span class="menu-icon">▥</span> Báo cáo doanh thu</a>
            <a href="/pages/admin/orders.html"><span class="menu-icon">▤</span> Đơn hàng</a>
            <a href="/pages/admin/users.html"><span class="menu-icon">♟</span> Người dùng</a>
            
            <a href="/pages/admin/reviews.html"><span class="menu-icon">★</span> Đánh giá</a>
            <a href="/pages/admin/support.html" class="active" aria-current="page"><span class="menu-icon">✉</span> Chat hỗ trợ</a>
        </nav>
        <div class="admin-sidebar-bottom">
            <a href="/" class="back-store-link">← Về cửa hàng</a>
            <button type="button" id="supportAdminLogout" class="admin-logout-button">Đăng xuất</button>
        </div>
    </aside>
    <main class="admin-main">
        <header class="admin-header">
            <div>
                <p class="admin-page-label">CUSTOMER SUPPORT</p>
                <h1>Chat hỗ trợ khách hàng</h1>
                <p>Đọc tin nhắn và phản hồi trực tiếp trên ComputerStore.</p>
            </div>
            <div class="admin-profile">
                <div class="admin-avatar" id="supportAdminAvatar">A</div>
                <div><strong id="supportAdminName">Admin</strong><span>Quản trị viên</span></div>
            </div>
        </header>
        <p class="support-admin-hours">Giờ hỗ trợ: Thứ 2–Thứ 6: 07:00–18:00 · Thứ 7–Chủ nhật: 08:00–16:00 (giờ Việt Nam). Tin nhắn ngoài giờ vẫn được lưu để trả lời sau.</p>
        <div class="support-admin-layout">
            <section class="support-admin-inbox" aria-label="Danh sách khách hàng">
                <div class="support-admin-section-head">
                    <h2>Hộp thư khách hàng</h2>
                    <button type="button" id="supportAdminRefresh">Làm mới</button>
                </div>
                <div id="supportConversationList" class="support-admin-customer-list">Đang tải hội thoại...</div>
            </section>
            <section class="support-admin-detail" aria-label="Nội dung hội thoại">
                <header id="supportCustomerHeader" class="support-admin-detail-head">Chọn khách hàng để xem tin nhắn</header>
                <div id="supportAdminMessages" class="support-admin-messages" role="log" aria-live="polite"></div>
                <p id="supportAdminError" class="support-admin-error" role="status"></p>
                <form id="supportAdminForm" class="support-admin-compose">
                    <input id="supportAdminInput" type="text" maxlength="2000" required disabled placeholder="Nhập nội dung trả lời khách hàng..." aria-label="Tin nhắn trả lời">
                    <button id="supportAdminSend" type="submit" disabled>Gửi phản hồi</button>
                </form>
            </section>
        </div>
    </main>
</div>
</template>

<script setup>
import '../../styles/pages-admin-support.css'
import { useLegacyPage } from '../../composables/useLegacyPage'

useLegacyPage({
  title: "Hỗ trợ khách hàng - ComputerStore Admin",
  bodyClass: "admin-mobile-unified",
  scripts: [
    () => import('../../legacy/js/api.js?raw'),
    () => import('../../legacy/js/admin/support.js?raw'),
  ],
})
</script>
