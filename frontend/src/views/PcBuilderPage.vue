<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/pc-builder.html -->
<template>





<header class="header pc-builder-header">

    <div class="container header-top">

        <a
            href="/"
            class="logo"
        >
            COMPUTER<span>STORE</span>
        </a>


        <div class="search-box">

            <input
                type="text"
                id="searchInput"
                placeholder="Tìm CPU, GPU, RAM, SSD..."
            >

            <button
                type="button"
                id="searchButton"
            >
                Tìm kiếm
            </button>

        </div>


        <div class="header-actions">

            <a
                href="/pages/login.html"
                id="loginLink"
            >
                Đăng nhập
            </a>


            <a
                href="/pages/cart.html"
                class="cart-link"
            >
                Giỏ hàng

                <svg class="pc-mobile-cart-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.8 13.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L23 6H6"></path>
                </svg>

                <span id="cartCount">
                    0
                </span>
            </a>

        </div>

        <div class="pc-mobile-header-tools">
            <a class="pc-mobile-icon-button" href="/pages/wishlist.html" aria-label="Danh sách yêu thích" title="Yêu thích">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"></path>
                </svg>
            </a>
            <button class="pc-mobile-menu-button" type="button" id="pcBuilderMenuButton" aria-label="Mở menu điều hướng" aria-expanded="false" aria-controls="pcBuilderMobileMenu">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>

    </div>

    <div id="pcBuilderMobileMenu" class="pc-mobile-navigation" hidden>
        <a href="/">Trang chủ</a>
        <a href="/pages/products.html">Sản phẩm</a>
        <a href="/pages/products.html?category=CPU">CPU</a>
        <a href="/pages/products.html?category=GPU">GPU</a>
        <a href="/pages/products.html?category=RAM">RAM</a>
        <a href="/pages/products.html?category=Mainboard">Mainboard</a>
        <a href="/pages/products.html?category=SSD">SSD</a>
        <a href="/pages/pc-builder.html" class="active">PC Builder</a>
        <a href="/pages/profile.html">Tài khoản</a>
        <a href="/pages/orders.html">Đơn hàng</a>
        <a href="/pages/wishlist.html">Yêu thích</a>
    </div>

    <nav class="navbar">

        <div class="container nav-menu">

            <a href="/">
                Trang chủ
            </a>

            <a href="/pages/products.html">
                Sản phẩm
            </a>

            <a href="/pages/products.html?category=CPU">
                CPU
            </a>

            <a href="/pages/products.html?category=GPU">
                GPU
            </a>

            <a href="/pages/products.html?category=RAM">
                RAM
            </a>

            <a href="/pages/products.html?category=Mainboard">
                Mainboard
            </a>

            <a href="/pages/products.html?category=SSD">
                SSD
            </a>

            <a
                href="/pages/pc-builder.html"
                class="active"
            >
                PC Builder
            </a>

        </div>

    </nav>

</header>




<main class="pc-builder-page">

    <div class="container">




        <div class="builder-breadcrumb">

            <a href="/">
                Trang chủ
            </a>

            <span>/</span>

            <span>
                PC Builder
            </span>

        </div>




        <div class="builder-heading">

            <div>

                <p class="section-label">
                    PC BUILDER
                </p>

                <h1>
                    Xây dựng cấu hình PC
                </h1>

                <p>
                    Chọn linh kiện và hệ thống sẽ kiểm tra
                    khả năng tương thích cho cấu hình của bạn.
                </p>

            </div>


            <button
                type="button"
                id="createBuildButton"
                class="create-build-button"
            >
                + Tạo cấu hình mới
            </button>

            <a href="#builderSummary" class="builder-mobile-summary-link">Xem tổng giá ↓</a>

        </div>




        <div
            id="builderMessage"
            class="builder-message"
        ></div>




        <div class="builder-layout">




            <aside class="build-list-panel">

                <div class="panel-title">

                    <div>

                        <h2>
                            Cấu hình của tôi
                        </h2>

                        <p>
                            Chọn cấu hình để chỉnh sửa.
                        </p>

                    </div>

                </div>


                <div
                    id="buildList"
                    class="build-list"
                >

                    <div class="build-list-loading">
                        Đang tải cấu hình...
                    </div>

                </div>



            </aside>




            <section class="builder-components">




                <div class="current-build-header">

                    <div>

                        <span class="current-build-label">
                            CẤU HÌNH ĐANG CHỌN
                        </span>

                        <h2 id="currentBuildName">
                            Chưa chọn cấu hình
                        </h2>

                        <p id="currentBuildId">
                            Hãy tạo hoặc chọn một PC Build.
                        </p>

                    </div>


                    <div class="current-build-actions">

                        <button
                            type="button"
                            id="renameBuildButton"
                            class="secondary-build-button"
                            disabled
                        >
                            Đổi tên
                        </button>


                        <button
                            type="button"
                            id="deleteBuildButton"
                            class="danger-build-button"
                            disabled
                        >
                            Xóa cấu hình
                        </button>

                    </div>

                </div>




                <div
                    class="component-slot"
                    data-category="CPU"
                >

                    <div class="component-number">
                        1
                    </div>


                    <div class="component-type">

                        <strong>
                            CPU
                        </strong>

                        <span>
                            Bộ xử lý
                        </span>

                    </div>


                    <div
                        class="component-selected"
                        id="slotCPU"
                    >

                        <div class="empty-component">

                            <span class="empty-icon">
                                +
                            </span>

                            <div>

                                <strong>
                                    Chưa chọn CPU
                                </strong>

                                <p>
                                    Chọn bộ xử lý cho cấu hình.
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="choose-component-button"
                        data-category="CPU"
                        disabled
                    >
                        Chọn CPU
                    </button>

                </div>




                <div
                    class="component-slot"
                    data-category="Mainboard"
                >

                    <div class="component-number">
                        2
                    </div>


                    <div class="component-type">

                        <strong>
                            Mainboard
                        </strong>

                        <span>
                            Bo mạch chủ
                        </span>

                    </div>


                    <div
                        class="component-selected"
                        id="slotMainboard"
                    >

                        <div class="empty-component">

                            <span class="empty-icon">
                                +
                            </span>

                            <div>

                                <strong>
                                    Chưa chọn Mainboard
                                </strong>

                                <p>
                                    Mainboard phải phù hợp với CPU.
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="choose-component-button"
                        data-category="Mainboard"
                        disabled
                    >
                        Chọn Mainboard
                    </button>

                </div>




                <div
                    class="component-slot"
                    data-category="RAM"
                >

                    <div class="component-number">
                        3
                    </div>


                    <div class="component-type">

                        <strong>
                            RAM
                        </strong>

                        <span>
                            Bộ nhớ
                        </span>

                    </div>


                    <div
                        class="component-selected"
                        id="slotRAM"
                    >

                        <div class="empty-component">

                            <span class="empty-icon">
                                +
                            </span>

                            <div>

                                <strong>
                                    Chưa chọn RAM
                                </strong>

                                <p>
                                    Chọn loại RAM tương thích Mainboard.
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="choose-component-button"
                        data-category="RAM"
                        disabled
                    >
                        Chọn RAM
                    </button>

                </div>




                <div
                    class="component-slot"
                    data-category="GPU"
                >

                    <div class="component-number">
                        4
                    </div>


                    <div class="component-type">

                        <strong>
                            GPU
                        </strong>

                        <span>
                            Card đồ họa
                        </span>

                    </div>


                    <div
                        class="component-selected"
                        id="slotGPU"
                    >

                        <div class="empty-component">

                            <span class="empty-icon">
                                +
                            </span>

                            <div>

                                <strong>
                                    Chưa chọn GPU
                                </strong>

                                <p>
                                    Chọn card đồ họa.
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="choose-component-button"
                        data-category="GPU"
                        disabled
                    >
                        Chọn GPU
                    </button>

                </div>




                <div
                    class="component-slot"
                    data-category="STORAGE"
                >

                    <div class="component-number">
                        5
                    </div>


                    <div class="component-type">

                        <strong>
                            SSD / HDD
                        </strong>

                        <span>
                            Lưu trữ
                        </span>

                    </div>


                    <div
                        class="component-selected"
                        id="slotStorage"
                    >

                        <div class="empty-component">

                            <span class="empty-icon">
                                +
                            </span>

                            <div>

                                <strong>
                                    Chưa chọn ổ lưu trữ
                                </strong>

                                <p>
                                    Chọn SSD hoặc HDD.
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="choose-component-button"
                        data-category="STORAGE"
                        disabled
                    >
                        Chọn lưu trữ
                    </button>

                </div>




                <div
                    class="component-slot"
                    data-category="PSU"
                >

                    <div class="component-number">
                        6
                    </div>


                    <div class="component-type">

                        <strong>
                            PSU
                        </strong>

                        <span>
                            Nguồn máy tính
                        </span>

                    </div>


                    <div
                        class="component-selected"
                        id="slotPSU"
                    >

                        <div class="empty-component">

                            <span class="empty-icon">
                                +
                            </span>

                            <div>

                                <strong>
                                    Chưa chọn PSU
                                </strong>

                                <p>
                                    Công suất phải phù hợp GPU.
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="choose-component-button"
                        data-category="PSU"
                        disabled
                    >
                        Chọn PSU
                    </button>

                </div>




                <div
                    class="component-slot"
                    data-category="Case"
                >

                    <div class="component-number">
                        7
                    </div>


                    <div class="component-type">

                        <strong>
                            Case
                        </strong>

                        <span>
                            Vỏ máy tính
                        </span>

                    </div>


                    <div
                        class="component-selected"
                        id="slotCase"
                    >

                        <div class="empty-component">

                            <span class="empty-icon">
                                +
                            </span>

                            <div>

                                <strong>
                                    Chưa chọn Case
                                </strong>

                                <p>
                                    Kiểm tra kích thước Mainboard và GPU.
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="choose-component-button"
                        data-category="Case"
                        disabled
                    >
                        Chọn Case
                    </button>

                </div>




                <div
                    class="component-slot optional-slot"
                    data-category="Cooling"
                >

                    <div class="component-number">
                        8
                    </div>


                    <div class="component-type">

                        <strong>
                            Cooling
                        </strong>

                        <span>
                            Tản nhiệt · Tùy chọn
                        </span>

                    </div>


                    <div
                        class="component-selected"
                        id="slotCooling"
                    >

                        <div class="empty-component">

                            <span class="empty-icon">
                                +
                            </span>

                            <div>

                                <strong>
                                    Chưa chọn tản nhiệt
                                </strong>

                                <p>
                                    Linh kiện không bắt buộc.
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="choose-component-button"
                        data-category="Cooling"
                        disabled
                    >
                        Chọn Cooling
                    </button>

                </div>

            </section>




            <aside class="builder-summary" id="builderSummary">

                <h2>
                    Tổng quan cấu hình
                </h2>


                <div class="summary-info-row">

                    <span>
                        Số linh kiện
                    </span>

                    <strong id="builderItemCount">
                        0
                    </strong>

                </div>


                <div class="summary-info-row">

                    <span>
                        Tổng số lượng
                    </span>

                    <strong id="builderQuantity">
                        0
                    </strong>

                </div>


                <div class="builder-summary-divider"></div>


                <div class="builder-total">

                    <span>
                        Tổng giá
                    </span>

                    <strong id="builderTotalPrice">
                        0 ₫
                    </strong>

                </div>




                <div class="builder-check-section">

                    <h3>
                        Độ đầy đủ
                    </h3>


                    <div
                        id="buildValidation"
                        class="builder-status neutral"
                    >
                        Chưa kiểm tra
                    </div>

                </div>




                <div class="builder-check-section">

                    <h3>
                        Tương thích
                    </h3>


                    <div
                        id="buildCompatibility"
                        class="builder-status neutral"
                    >
                        Chưa kiểm tra
                    </div>

                </div>




                <div class="builder-check-section">

                    <h3>
                        Trạng thái
                    </h3>


                    <div
                        id="buildReady"
                        class="builder-status neutral"
                    >
                        Chưa sẵn sàng
                    </div>

                </div>


                <button
                    type="button"
                    id="checkBuildButton"
                    class="check-build-button"
                    disabled
                >
                    Kiểm tra cấu hình
                </button>


                <button
                    type="button"
                    id="addBuildToCartButton"
                    class="add-build-cart-button"
                    disabled
                >
                    Thêm cả bộ vào giỏ hàng
                </button>


                <p class="builder-summary-note">
                    Cấu hình phải đủ linh kiện bắt buộc
                    và tương thích trước khi thêm vào giỏ.
                </p>

            </aside>

        </div>

    </div>

</main>




<div
    id="createBuildModal"
    class="builder-modal"
    hidden
>

    <div class="builder-modal-backdrop"></div>


    <div class="builder-modal-dialog">

        <div class="builder-modal-header">

            <h2>
                Tạo cấu hình PC
            </h2>


            <button
                type="button"
                id="closeCreateBuildModal"
            >
                ×
            </button>

        </div>


        <div class="builder-modal-body">

            <label for="buildNameInput">
                Tên cấu hình
            </label>


            <input
                type="text"
                id="buildNameInput"
                placeholder="Ví dụ: Gaming PC 2026"
                maxlength="100"
            >

        </div>


        <div class="builder-modal-footer">

            <button
                type="button"
                id="cancelCreateBuildButton"
                class="modal-cancel-button"
            >
                Hủy
            </button>


            <button
                type="button"
                id="confirmCreateBuildButton"
                class="modal-confirm-button"
            >
                Tạo cấu hình
            </button>

        </div>

    </div>

</div>




<div
    id="componentModal"
    class="builder-modal component-modal"
    hidden
>

    <div class="builder-modal-backdrop"></div>


    <div class="component-modal-dialog">

        <div class="builder-modal-header">

            <div>

                <span class="component-modal-label">
                    CHỌN LINH KIỆN
                </span>

                <h2 id="componentModalTitle">
                    Chọn sản phẩm
                </h2>

            </div>


            <button
                type="button"
                id="closeComponentModal"
            >
                ×
            </button>

        </div>


        <div class="component-modal-toolbar">

            <input
                type="text"
                id="componentSearchInput"
                placeholder="Tìm sản phẩm (không cần gõ dấu)..."
                autocomplete="off"
            >

            <div class="component-filter-row">

                <select id="componentBrandFilter" aria-label="Lọc theo thương hiệu">
                    <option value="">Tất cả thương hiệu</option>
                </select>

                <select id="componentSortSelect" aria-label="Sắp xếp sản phẩm">
                    <option value="">Sắp xếp: Mặc định</option>
                    <option value="price-asc">Giá thấp → cao</option>
                    <option value="price-desc">Giá cao → thấp</option>
                    <option value="name-asc">Tên A → Z</option>
                </select>

                <label class="component-filter-toggle">
                    <input type="checkbox" id="componentHideIncompatible">
                    <span>Ẩn sản phẩm không tương thích</span>
                </label>

            </div>

            <div
                id="componentCompatibilityOverview"
                class="component-compatibility-overview"
                role="status"
                aria-live="polite"
            >
                Đang kiểm tra linh kiện với cấu hình hiện tại...
            </div>

        </div>


        <div
            id="componentProductList"
            class="component-product-list"
        >

            <div class="component-modal-empty">
                Danh sách sản phẩm sẽ hiển thị ở đây.
            </div>

        </div>

    </div>

</div>




<footer class="footer">

    <div class="container footer-grid">

        <div>

            <h3>
                COMPUTERSTORE
            </h3>

            <p>
                Website bán linh kiện máy tính
                và hỗ trợ xây dựng cấu hình PC.
            </p>

        </div>


        <div>

            <h4>
                Sản phẩm
            </h4>

            <a href="/pages/products.html">
                Tất cả sản phẩm
            </a>

        </div>


        <div>

            <h4>
                Tài khoản
            </h4>

            <a href="/pages/profile.html">
                Hồ sơ
            </a>

            <a href="/pages/orders.html">
                Đơn hàng
            </a>

        </div>


        <div>

            <h4>
                Công cụ
            </h4>

            <a href="/pages/pc-builder.html">
                PC Builder
            </a>

        </div>

    </div>

</footer>
</template>

<script setup>
import '../styles/pages-pc-builder.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "PC Builder - Computer Store",
  bodyClass: "",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/pc-builder.js?raw'),
    () => import('../legacy/js/header-auth.js?raw'),
    () => import('../legacy/js/support-chat.js?raw'),
  ],
})
</script>
