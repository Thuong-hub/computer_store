<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/admin/orders.html -->
<template>


<div class="admin-layout">




    <aside class="admin-sidebar">

        <div class="admin-logo">COMPUTER<span>STORE</span>

            <small>ADMIN</small>

        </div>


        <nav class="admin-menu">

            <a href="/pages/admin/index.html">
                <span class="menu-icon">◫</span>
                Dashboard
            </a>


            <a href="/pages/admin/products.html">
                <span class="menu-icon">▣</span>
                Sản phẩm
            </a>
            <a href="/pages/admin/promotions.html"><span class="menu-icon">%</span> Khuyến mãi</a>


            <a href="/pages/admin/inventory.html"><span class="menu-icon">▦</span> Tổng kho</a>
            <a href="/pages/admin/reports.html"><span class="menu-icon">▥</span> Báo cáo doanh thu</a>
            <a
                href="/pages/admin/orders.html"
                class="active"
            >
                <span class="menu-icon">▤</span>
                Đơn hàng
            </a>


            <a href="/pages/admin/users.html">
                <span class="menu-icon">♟</span>
                Người dùng
            </a>


            


            <a href="/pages/admin/reviews.html">
                <span class="menu-icon">★</span>
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
                    ORDER MANAGEMENT
                </p>

                <h1>
                    Quản lý đơn hàng
                </h1>

                <p>
                    Theo dõi và cập nhật trạng thái đơn hàng.
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




        <section class="admin-panel admin-order-toolbar">

            <div class="order-filter-buttons">

                <button
                    class="admin-filter-button active"
                    data-status="ALL"
                >
                    Tất cả
                </button>

                <button
                    class="admin-filter-button"
                    data-status="PENDING"
                >
                    Chờ xử lý
                </button>

                <button
                    class="admin-filter-button"
                    data-status="CONFIRMED"
                >
                    Đã xác nhận
                </button>

                <button
                    class="admin-filter-button"
                    data-status="SHIPPING"
                >
                    Đang giao
                </button>

                <button
                    class="admin-filter-button"
                    data-status="COMPLETED"
                >
                    Hoàn thành
                </button>

                <button
                    class="admin-filter-button"
                    data-status="CANCELLED"
                >
                    Đã hủy
                </button>

            </div>


            <input
                type="text"
                id="adminOrderSearch"
                placeholder="Tìm mã đơn, người nhận, SĐT..."
            >

        </section>




        <section class="admin-panel">

            <div class="section-title-row">

                <div>

                    <p class="panel-label">
                        DANH SÁCH
                    </p>

                    <h2>
                        Tất cả đơn hàng
                    </h2>

                </div>


                <strong id="adminOrderCount">
                    0 đơn
                </strong>

            </div>


            <div class="admin-table-wrapper">

                <table class="admin-table">

                    <thead>

                    <tr>

                        <th>Mã đơn</th>

                        <th>Người nhận</th>

                        <th>Điện thoại</th>

                        <th>Tổng tiền</th>

                        <th>Ngày đặt</th>

                        <th>Trạng thái</th>

                        <th>Thao tác</th>

                    </tr>

                    </thead>


                    <tbody id="adminOrderTableBody">

                    <tr>

                        <td
                            colspan="7"
                            class="admin-table-empty"
                        >
                            Đang tải đơn hàng...
                        </td>

                    </tr>

                    </tbody>

                </table>

            </div>

        </section>

    </main>

</div>
</template>

<script setup>
import '../../styles/pages-admin-orders.css'
import { useLegacyPage } from '../../composables/useLegacyPage'

useLegacyPage({
  title: "Quản lý đơn hàng - Admin",
  bodyClass: "admin-mobile-unified",
  scripts: [
    () => import('../../legacy/js/api.js?raw'),
    () => import('../../legacy/js/admin/orders.js?raw'),
    () => import('../../legacy/js/admin/mobile-unified.js?raw'),
  ],
})
</script>
