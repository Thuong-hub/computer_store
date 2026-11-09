<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/admin/users.html -->
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
            <a href="/pages/admin/orders.html">
                <span class="menu-icon">▤</span>
                Đơn hàng
            </a>


            <a
                href="/pages/admin/users.html"
                class="active"
            >
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
                    USER MANAGEMENT
                </p>

                <h1>
                    Quản lý người dùng
                </h1>

                <p>
                    Xem và quản lý trạng thái tài khoản.
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




        <section class="admin-panel admin-user-toolbar">

            <div class="admin-user-filters">

                <button
                    type="button"
                    class="admin-user-filter active"
                    data-status="ALL"
                >
                    Tất cả
                </button>


                <button
                    type="button"
                    class="admin-user-filter"
                    data-status="ACTIVE"
                >
                    Đang hoạt động
                </button>


                <button
                    type="button"
                    class="admin-user-filter"
                    data-status="BLOCKED"
                >
                    Đã khóa
                </button>

                <button
                    type="button"
                    class="admin-user-filter"
                    data-status="DELETED"
                >
                    Đã xóa
                </button>

            </div>


            <div class="admin-user-search">

                <input
                    type="text"
                    id="adminUserSearch"
                    placeholder="Tìm username hoặc email..."
                >

                <button
                    type="button"
                    id="adminUserSearchButton"
                >
                    Tìm kiếm
                </button>

            </div>

        </section>




        <section class="admin-panel">

            <div class="section-title-row">

                <div>

                    <p class="panel-label">
                        TÀI KHOẢN
                    </p>

                    <h2>
                        Danh sách người dùng
                    </h2>

                </div>


                <strong id="adminUserCount">
                    0 tài khoản
                </strong>

            </div>


            <div class="admin-table-wrapper">

                <table class="admin-table">

                    <thead>

                    <tr>

                        <th>ID</th>

                        <th>Người dùng</th>

                        <th>Email</th>

                        <th>Điện thoại</th>

                        <th>Vai trò</th>

                        <th>Trạng thái</th>

                        <th>Ngày tạo</th>

                        <th>Thao tác</th>

                    </tr>

                    </thead>


                    <tbody id="adminUserTableBody">

                    <tr>

                        <td
                            colspan="8"
                            class="admin-table-empty"
                        >
                            Đang tải tài khoản...
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
import '../../styles/pages-admin-users.css'
import { useLegacyPage } from '../../composables/useLegacyPage'

useLegacyPage({
  title: "Quản lý người dùng - Admin",
  bodyClass: "admin-mobile-unified",
  scripts: [
    () => import('../../legacy/js/api.js?raw'),
    () => import('../../legacy/js/admin/users.js?raw'),
    () => import('../../legacy/js/admin/mobile-unified.js?raw'),
  ],
})
</script>
