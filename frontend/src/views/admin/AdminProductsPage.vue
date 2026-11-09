<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/admin/products.html -->
<template>


<div class="admin-layout">




    <aside class="admin-sidebar">

        <div class="admin-logo">COMPUTER<span>STORE</span>

            <small>ADMIN</small>

        </div>


        <button
            type="button"
            id="productsMobileMenuToggle"
            class="products-mobile-menu-toggle"
            aria-controls="productsSidebarMenu"
            aria-expanded="false"
        >
            <span aria-hidden="true">☰</span>
            Menu
        </button>

        <nav class="admin-menu" id="productsSidebarMenu">

            <a href="/pages/admin/index.html">
                <span class="menu-icon">◫</span>
                Dashboard
            </a>


            <a
                href="/pages/admin/products.html"
                class="active"
            >
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
                    PRODUCT MANAGEMENT
                </p>

                <h1>
                    Quản lý sản phẩm
                </h1>

                <p>
                    Theo dõi sản phẩm, giá bán và tồn kho.
                </p>

            </div>


            <div class="admin-header-actions">

                <button
                    type="button"
                    id="addProductButton"
                    class="admin-primary-button"
                >
                    + Thêm sản phẩm
                </button>


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




        <section class="admin-panel admin-product-toolbar">

            <div class="admin-product-filters">

                <button
                    type="button"
                    class="admin-product-filter active"
                    data-filter="ALL"
                >
                    Tất cả
                </button>


                <button
                    type="button"
                    class="admin-product-filter"
                    data-filter="ACTIVE"
                >
                    Đang bán
                </button>


                <button
                    type="button"
                    class="admin-product-filter"
                    data-filter="INACTIVE"
                >
                    Ngừng bán
                </button>


                <button
                    type="button"
                    class="admin-product-filter"
                    data-filter="DELETED"
                >
                    Đã xóa
                </button>

                <button
                    type="button"
                    class="admin-product-filter"
                    data-filter="LOW_STOCK"
                >
                    Sắp hết hàng
                </button>

                <button
                    type="button"
                    class="admin-product-filter"
                    data-filter="OUT_OF_STOCK"
                >
                    Hết hàng
                </button>

            </div>


            <input
                type="text"
                id="adminProductSearch"
                placeholder="Tìm tên sản phẩm..."
            >

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


                <strong id="adminProductCount">
                    0 sản phẩm
                </strong>

            </div>


            <div class="admin-table-wrapper admin-products-list-wrapper">

                <table class="admin-table">

                    <thead>

                    <tr>

                        <th>ID</th>

                        <th>Sản phẩm</th>

                        <th>Danh mục</th>

                        <th>Thương hiệu</th>

                        <th>Giá</th>

                        <th>Tồn kho</th>

                        <th>Trạng thái</th>

                        <th>Thao tác</th>

                    </tr>

                    </thead>


                    <tbody id="adminProductTableBody">

                    <tr>

                        <td
                            colspan="8"
                            class="admin-table-empty"
                        >
                            Đang tải sản phẩm...
                        </td>

                    </tr>

                    </tbody>

                </table>

            </div>

        </section>

    </main>

</div>



<div
    id="productModal"
    class="admin-modal"
    hidden
>

    <div class="admin-modal-overlay"></div>


    <div class="admin-modal-box">

        <div class="admin-modal-header">

            <div>

                <p class="panel-label">
                    PRODUCT
                </p>

                <h2 id="productModalTitle">
                    Thêm sản phẩm
                </h2>

            </div>


            <button
                type="button"
                id="closeProductModal"
                class="admin-modal-close"
            >
                ×
            </button>

        </div>


        <form id="productForm">

            <input
                type="hidden"
                id="productId"
            >


            <div class="admin-form-grid">


                <div class="admin-form-group full">

                    <label>
                        Tên sản phẩm *
                    </label>

                    <input
                        type="text"
                        id="productName"
                        required
                    >

                </div>


                <div class="admin-form-group">

                    <label>
                        Danh mục *
                    </label>

                    <select
                        id="productCategory"
                        required
                    >
                        <option value="">
                            -- Chọn danh mục --
                        </option>
                    </select>

                </div>


                <div class="admin-form-group">

                    <label>
                        Thương hiệu *
                    </label>

                    <select
                        id="productBrand"
                        required
                    >
                        <option value="">
                            -- Chọn thương hiệu --
                        </option>
                    </select>

                </div>


                <div class="admin-form-group">

                    <label>
                        Giá bán *
                    </label>

                    <input
                        type="number"
                        id="productPrice"
                        min="0"
                        required
                    >

                </div>


                <div class="admin-form-group">

                    <label for="productStock">
                        Tồn kho hiện tại (chỉ xem)
                    </label>

                    <input
                        type="number"
                        id="productStock"
                        min="0"
                        value="0"
                        readonly
                        aria-describedby="productStockHelp"
                    >

                    <p id="productStockHelp" class="product-stock-help">
                        <span id="productStockHint">Để nhập hoặc xuất hàng, dùng mục Tổng kho.</span>
                        <a id="productStockManageLink" href="/pages/admin/inventory.html" hidden>
                            Đến Tổng kho →
                        </a>
                    </p>

                </div>


                <div class="admin-form-group">

                    <label>
                        Trạng thái
                    </label>

                    <select id="productStatus">

                        <option value="ACTIVE">
                            Đang bán
                        </option>

                        <option value="INACTIVE">
                            Ngừng bán
                        </option>

                    </select>

                </div>


                <div class="admin-form-group">

                    <label>
                        File ảnh
                    </label>

                    <input
                        type="text"
                        id="productImage"
                        placeholder="intel-core-i5-14600k.jpg"
                    >

                </div>


                <div class="admin-form-group full">

                    <label>
                        Mô tả
                    </label>

                    <textarea
                        id="productDescription"
                        rows="5"
                        placeholder="Mô tả sản phẩm..."
                    ></textarea>

                </div>

            </div>


            <div class="admin-modal-actions">

                <button
                    type="button"
                    id="cancelProductButton"
                    class="admin-secondary-button"
                >
                    Hủy
                </button>


                <button
                    type="submit"
                    id="saveProductButton"
                    class="admin-primary-button"
                >
                    Lưu sản phẩm
                </button>

            </div>

        </form>

    </div>

</div>
</template>

<script setup>
import '../../styles/pages-admin-products.css'
import { useLegacyPage } from '../../composables/useLegacyPage'

useLegacyPage({
  title: "Quản lý sản phẩm - Admin",
  bodyClass: "admin-products-page",
  scripts: [
    () => import('../../legacy/js/api.js?raw'),
    () => import('../../legacy/js/admin/products.js?raw'),
    () => import('../../legacy/js/admin/products-mobile.js?raw'),
  ],
})
</script>
