<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/admin/index.html -->
<template>


<div class="admin-layout">




    <aside class="admin-sidebar">

        <div class="admin-logo">COMPUTER<span>STORE</span>

            <small>
                ADMIN
            </small>

        </div>


        <nav class="admin-menu">

            <a
                href="/pages/admin/index.html"
                class="active"
            >
                <span class="menu-icon">
                    ◫
                </span>

                Dashboard
            </a>


            <a
                href="/pages/admin/products.html"
            >
                <span class="menu-icon">
                    ▣
                </span>

                Sản phẩm
            </a>
            <a href="/pages/admin/promotions.html"><span class="menu-icon">%</span> Khuyến mãi</a>


            <a href="/pages/admin/inventory.html"><span class="menu-icon">▦</span> Tổng kho</a>
            <a href="/pages/admin/reports.html"><span class="menu-icon">▥</span> Báo cáo doanh thu</a>
            <a
                href="/pages/admin/orders.html"
            >
                <span class="menu-icon">
                    ▤
                </span>

                Đơn hàng
            </a>


            <a
                href="/pages/admin/users.html"
            >
                <span class="menu-icon">
                    ♟
                </span>

                Người dùng
            </a>


            


            <a
                href="/pages/admin/reviews.html"
            >
                <span class="menu-icon">
                    ★
                </span>

                Đánh giá
            </a>
            <a href="/pages/admin/support.html"><span class="menu-icon">✉</span> Chat hỗ trợ</a>
        </nav>


        <div class="admin-sidebar-bottom">

            <a
                href="/"
                class="back-store-link"
            >
                ← Về cửa hàng
            </a>


            <button
                type="button"
                id="adminLogoutButton"
                class="admin-logout-button"
            >
                Đăng xuất
            </button>

        </div>

    </aside>




    <main class="admin-main">




        <header class="admin-header">

            <div>

                <p class="admin-page-label">
                    ADMIN PANEL
                </p>

                <h1>
                    Tổng quan hệ thống
                </h1>

                <p>
                    Theo dõi hoạt động của Computer Store.
                </p>

            </div>


            <div class="admin-profile">

                <div class="admin-avatar">
                    A
                </div>


                <div>

                    <strong id="adminName">
                        Administrator
                    </strong>

                    <span>
                        Quản trị viên
                    </span>

                </div>

            </div>

        </header>


        <div
            id="adminMessage"
            class="admin-message"
        ></div>




        <section class="stats-grid">


            <article class="stat-card">

                <div class="stat-icon">
                    ▣
                </div>

                <div>

                    <span>
                        Tổng sản phẩm
                    </span>

                    <strong id="totalProducts">
                        0
                    </strong>

                    <small>
                        Sản phẩm trong hệ thống
                    </small>

                </div>

            </article>


            <article class="stat-card">

                <div class="stat-icon">
                    ♟
                </div>

                <div>

                    <span>
                        Người dùng
                    </span>

                    <strong id="totalUsers">
                        0
                    </strong>

                    <small>
                        Tổng tài khoản
                    </small>

                </div>

            </article>


            <article class="stat-card">

                <div class="stat-icon">
                    ▤
                </div>

                <div>

                    <span>
                        Tổng đơn hàng
                    </span>

                    <strong id="totalOrders">
                        0
                    </strong>

                    <small>
                        Toàn bộ đơn hàng
                    </small>

                </div>

            </article>


            <article class="stat-card revenue-card">

                <div class="stat-icon">
                    ₫
                </div>

                <div>

                    <span>
                        Tổng doanh thu
                    </span>

                    <strong id="totalRevenue">
                        0 ₫
                    </strong>

                    <small>
                        Thanh toán đã hoàn tất
                    </small>

                </div>

            </article>

        </section>




        <section class="revenue-grid">


            <article class="admin-panel">

                <div class="panel-heading">

                    <div>

                        <p class="panel-label">
                            DOANH THU
                        </p>

                        <h2>
                            Doanh thu hôm nay
                        </h2>

                    </div>

                    <span class="panel-icon">
                        ₫
                    </span>

                </div>


                <strong
                    id="todayRevenue"
                    class="large-money"
                >
                    0 ₫
                </strong>

            </article>


            <article class="admin-panel">

                <div class="panel-heading">

                    <div>

                        <p class="panel-label">
                            THÁNG NÀY
                        </p>

                        <h2>
                            Doanh thu tháng
                        </h2>

                    </div>

                    <span class="panel-icon">
                        ↗
                    </span>

                </div>


                <strong
                    id="thisMonthRevenue"
                    class="large-money"
                >
                    0 ₫
                </strong>

            </article>

        </section>




        <section class="admin-panel order-panel">

            <div class="section-title-row">

                <div>

                    <p class="panel-label">
                        ĐƠN HÀNG
                    </p>

                    <h2>
                        Trạng thái đơn hàng
                    </h2>

                </div>


                <a
                    href="/pages/admin/orders.html"
                    class="view-all-link"
                >
                    Xem tất cả →
                </a>

            </div>


            <div class="order-status-grid">


                <div class="order-status-card pending">

                    <span>
                        Chờ xử lý
                    </span>

                    <strong id="pendingOrders">
                        0
                    </strong>

                </div>


                <div class="order-status-card confirmed">

                    <span>
                        Đã xác nhận
                    </span>

                    <strong id="confirmedOrders">
                        0
                    </strong>

                </div>


                <div class="order-status-card shipping">

                    <span>
                        Đang giao
                    </span>

                    <strong id="shippingOrders">
                        0
                    </strong>

                </div>


                <div class="order-status-card completed">

                    <span>
                        Hoàn thành
                    </span>

                    <strong id="completedOrders">
                        0
                    </strong>

                </div>


                <div class="order-status-card cancelled">

                    <span>
                        Đã hủy
                    </span>

                    <strong id="cancelledOrders">
                        0
                    </strong>

                </div>

            </div>

        </section>




        <section class="admin-panel">

            <div class="section-title-row">

                <div>

                    <p class="panel-label">
                        QUẢN LÝ
                    </p>

                    <h2>
                        Truy cập nhanh
                    </h2>

                </div>

            </div>


            <div class="quick-action-grid">
                <a class="quick-action" href="/pages/admin/inventory.html"><strong>Tổng kho</strong><span>Xem, nhập xuất và lịch sử kho →</span></a>
                <a class="quick-action" href="/pages/admin/reports.html"><strong>Doanh thu</strong><span>Lọc ngày, tháng, năm và trạng thái đơn →</span></a>


                <a
                    href="/pages/admin/products.html"
                    class="quick-action"
                >

                    <strong>
                        Quản lý sản phẩm
                    </strong>

                    <span>
                        Thêm, sửa sản phẩm và tồn kho →
                    </span>

                </a>


                <a
                    href="/pages/admin/orders.html"
                    class="quick-action"
                >

                    <strong>
                        Quản lý đơn hàng
                    </strong>

                    <span>
                        Xác nhận và cập nhật đơn hàng →
                    </span>

                </a>


                <a
                    href="/pages/admin/users.html"
                    class="quick-action"
                >

                    <strong>
                        Quản lý người dùng
                    </strong>

                    <span>
                        Xem và khóa tài khoản →
                    </span>

                </a>


                <a
                    href="/pages/admin/promotions.html"
                    class="quick-action"
                >

                    <strong>
                        Khuyến mãi
                    </strong>

                    <span>
                        Mã giảm giá, ưu đãi sản phẩm và Black Friday →
                    </span>

                </a>

            </div>

        </section>


    </main>

</div>
</template>

<script setup>
import '../../styles/pages-admin-index.css'
import { useLegacyPage } from '../../composables/useLegacyPage'

useLegacyPage({
  title: "Admin Dashboard - Computer Store",
  bodyClass: "admin-mobile-unified",
  scripts: [
    () => import('../../legacy/js/api.js?raw'),
    () => import('../../legacy/js/admin/admin.js?raw'),
    () => import('../../legacy/js/admin/mobile-unified.js?raw'),
  ],
})
</script>
