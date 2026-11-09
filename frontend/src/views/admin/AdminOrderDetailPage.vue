<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/admin/order-detail.html -->
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
                    ORDER DETAIL
                </p>

                <h1 id="adminOrderTitle">
                    Chi tiết đơn hàng
                </h1>

                <p id="adminOrderCreatedAt">
                    Đang tải...
                </p>

            </div>


            <a
                href="/pages/admin/orders.html"
                class="admin-back-button"
            >
                ← Quay lại danh sách
            </a>

        </header>


        <div
            id="adminMessage"
            class="admin-message"
        ></div>


        <div
            id="adminOrderDetail"
            class="admin-order-detail-layout"
        >

            <div class="admin-order-detail-main">


                <section class="admin-panel">

                    <div class="section-title-row">

                        <div>

                            <p class="panel-label">
                                KHÁCH HÀNG
                            </p>

                            <h2>
                                Thông tin nhận hàng
                            </h2>

                        </div>


                        <span
                            id="adminOrderStatus"
                            class="admin-order-status"
                        >
                            --
                        </span>

                    </div>


                    <div class="admin-detail-grid">

                        <div>
                            <span>Người nhận</span>
                            <strong id="detailRecipient">--</strong>
                        </div>

                        <div>
                            <span>Số điện thoại</span>
                            <strong id="detailPhone">--</strong>
                        </div>

                        <div class="full">
                            <span>Địa chỉ giao hàng</span>
                            <strong id="detailAddress">--</strong>
                        </div>

                        <div class="full">
                            <span>Ghi chú</span>
                            <strong id="detailNote">Không có</strong>
                        </div>

                    </div>

                </section>


                <section class="admin-panel">

                    <div class="section-title-row">

                        <div>

                            <p class="panel-label">
                                SẢN PHẨM
                            </p>

                            <h2>
                                Danh sách sản phẩm
                            </h2>

                        </div>

                    </div>


                    <div id="adminOrderItems">

                        <p class="admin-table-empty">
                            Đang tải sản phẩm...
                        </p>

                    </div>

                </section>

            </div>


            <aside class="admin-order-side">


                <section class="admin-panel admin-order-summary">

                    <p class="panel-label">
                        ĐƠN HÀNG
                    </p>

                    <h2>
                        Tổng kết
                    </h2>


                    <div class="admin-summary-row">

                        <span>Mã đơn</span>

                        <strong id="summaryOrderId">
                            --
                        </strong>

                    </div>


                    <div class="admin-summary-row">

                        <span>Tổng tiền</span>

                        <strong
                            id="summaryTotal"
                            class="admin-summary-total"
                        >
                            0 ₫
                        </strong>

                    </div>


                    <div
                        id="adminOrderNextAction"
                    ></div>

                </section>


                <section class="admin-panel">

                    <p class="panel-label">
                        THANH TOÁN
                    </p>

                    <h2>
                        Payment
                    </h2>


                    <div
                        id="adminPaymentInfo"
                        class="admin-payment-info"
                    >
                        Đang tải...
                    </div>

                </section>

            </aside>

        </div>

    </main>

</div>
</template>

<script setup>
import '../../styles/pages-admin-order-detail.css'
import { useLegacyPage } from '../../composables/useLegacyPage'

useLegacyPage({
  title: "Chi tiết đơn hàng - Admin",
  bodyClass: "admin-mobile-unified",
  scripts: [
    () => import('../../legacy/js/api.js?raw'),
    () => import('../../legacy/js/admin/order-detail.js?raw'),
    () => import('../../legacy/js/admin/mobile-unified.js?raw'),
  ],
})
</script>
