<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/admin/reviews.html -->
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

            <a href="/pages/admin/users.html">
                <span class="menu-icon">♟</span>
                Người dùng
            </a>

            

            <a
                href="/pages/admin/reviews.html"
                class="active"
            >
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
                    REVIEW MANAGEMENT
                </p>

                <h1>
                    Quản lý đánh giá
                </h1>

                <p>
                    Theo dõi đánh giá sản phẩm và ẩn nội dung không phù hợp.
                </p>

            </div>

            <div class="admin-header-actions">

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

            </div>

        </header>


        <div
            id="adminMessage"
            class="admin-message"
        ></div>



        <section class="admin-panel admin-review-toolbar">

            <div class="admin-review-filters">

                <button
                    type="button"
                    class="admin-review-filter active"
                    data-filter="ALL"
                >
                    Tất cả
                </button>

                <button
                    type="button"
                    class="admin-review-filter"
                    data-filter="ACTIVE"
                >
                    Đang hiển thị
                </button>

                <button
                    type="button"
                    class="admin-review-filter"
                    data-filter="HIDDEN"
                >
                    Đã ẩn
                </button>

                <button
                    type="button"
                    class="admin-review-filter"
                    data-filter="LOW_RATING"
                >
                    1 - 2 sao
                </button>

            </div>

            <input
                type="text"
                id="adminReviewSearch"
                placeholder="Tìm user, sản phẩm, nội dung..."
            >

        </section>



        <section class="admin-panel">

            <div class="section-title-row">

                <div>

                    <p class="panel-label">
                        ĐÁNH GIÁ
                    </p>

                    <h2>
                        Danh sách đánh giá
                    </h2>

                </div>

                <strong id="adminReviewCount">
                    0 đánh giá
                </strong>

            </div>


            <div class="admin-table-wrapper">

                <table class="admin-table admin-review-table">

                    <thead>

                    <tr>
                        <th>ID</th>
                        <th>Người dùng</th>
                        <th>Sản phẩm</th>
                        <th>Số sao</th>
                        <th>Nội dung</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>

                    </thead>

                    <tbody id="adminReviewTableBody">

                    <tr>
                        <td
                            colspan="8"
                            class="admin-table-empty"
                        >
                            Đang tải đánh giá...
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
import '../../styles/pages-admin-reviews.css'
import { useLegacyPage } from '../../composables/useLegacyPage'

useLegacyPage({
  title: "Quản lý đánh giá - Admin",
  bodyClass: "admin-mobile-unified",
  scripts: [
    () => import('../../legacy/js/api.js?raw'),
    () => import('../../legacy/js/admin/reviews.js?raw'),
    () => import('../../legacy/js/admin/mobile-unified.js?raw'),
  ],
})
</script>
