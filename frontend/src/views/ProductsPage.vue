<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/products.html -->
<template>




    <header class="header">
        <div class="container header-top">
            <a href="/" class="logo">COMPUTER<span>STORE</span></a>

            <div class="search-box">
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Tìm CPU, GPU, RAM, SSD..."
                    aria-label="Tìm kiếm sản phẩm"
                >
                <button id="searchButton" type="button">Tìm kiếm</button>
            </div>

            <div class="header-actions">
                <a href="/pages/login.html" id="loginLink">Đăng nhập</a>

                <a
                    href="/pages/login.html"
                    id="mobileWishlistLink"
                    class="mobile-icon-link"
                    aria-label="Yêu thích"
                    title="Yêu thích"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"></path>
                    </svg>
                </a>

                <a href="/pages/cart.html" class="cart-link" aria-label="Giỏ hàng">
                    <svg class="header-mobile-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.6a2 2 0 0 0 2-1.6L23 6H6"></path>
                    </svg>
                    <span class="cart-text">Giỏ hàng</span>
                    <span id="cartCount">0</span>
                </a>

                <button
                    type="button"
                    class="mobile-menu-button"
                    id="mobileMenuButton"
                    aria-controls="mobilePrimaryNav"
                    aria-expanded="false"
                    aria-label="Mở menu điều hướng"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
        </div>

        <nav class="navbar" id="mobilePrimaryNav" aria-label="Điều hướng chính">
            <div class="container nav-menu">
                <a href="/">Trang chủ</a>
                <a href="/pages/products.html">Sản phẩm</a>
                <a href="/pages/products.html?category=CPU">CPU</a>
                <a href="/pages/products.html?category=GPU">GPU</a>
                <a href="/pages/products.html?category=RAM">RAM</a>
                <a href="/pages/products.html?category=Mainboard">Mainboard</a>
                <a href="/pages/products.html?category=SSD">SSD</a>
                <a href="/pages/pc-builder.html">PC Builder</a>
                <div class="mobile-nav-account" id="mobileNavAccount"></div>
            </div>
        </nav>
    </header>





    <main class="products-page">

        <div class="container">



            <div class="breadcrumb">

                <a href="/">
                    Trang chủ
                </a>

                <span>/</span>

                <span>
                    Sản phẩm
                </span>

            </div>




            <div class="products-title">

                <div>

                    <p class="section-label">
                        COMPUTER STORE
                    </p>

                    <h1 id="productsHeading">
                        Tất cả sản phẩm
                    </h1>

                </div>


                <p id="productCount">
                    Đang tải...
                </p>

            </div>





            <div class="products-layout">

                <button type="button"
                        id="mobileFilterToggle"
                        class="mobile-filter-toggle"
                        aria-controls="productFilterSidebar"
                        aria-expanded="false">
                    <span>Bộ lọc sản phẩm</span>
                    <span aria-hidden="true">☰</span>
                </button>




                <aside class="filter-sidebar" id="productFilterSidebar" aria-label="Bộ lọc sản phẩm">

                    <div class="filter-header">

                        <h3>
                            Bộ lọc
                        </h3>

                        <button type="button" class="mobile-filter-close" id="mobileFilterClose" aria-label="Đóng bộ lọc">Đóng</button>

                        <button type="button" id="clearFilter">
                            Xóa lọc
                        </button>

                    </div>

                    <!-- Khoảng giá: ô nhập + thanh trượt 2 đầu (JS cập nhật giá trị và mốc tối đa) -->
                    <section class="pf-group" data-group-id="price">
                        <button type="button" class="pf-group-head" data-toggle="price" aria-expanded="true">
                            <span>Khoảng giá</span>
                            <svg class="pf-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 6.25 8 10.75l4.5-4.5" /></svg>
                        </button>
                        <div class="pf-group-body">
                            <div class="pf-price-inputs">
                                <input type="text" id="minPrice" inputmode="numeric" autocomplete="off" value="0đ" aria-label="Giá thấp nhất">
                                <span class="pf-price-sep" aria-hidden="true"></span>
                                <input type="text" id="maxPrice" inputmode="numeric" autocomplete="off" value="0đ" aria-label="Giá cao nhất">
                            </div>
                            <div class="pf-range">
                                <div class="pf-range-track"><div class="pf-range-fill" id="priceRangeFill"></div></div>
                                <input type="range" id="priceRangeMin" min="0" max="0" step="100000" value="0" aria-label="Giá thấp nhất (thanh trượt)">
                                <input type="range" id="priceRangeMax" min="0" max="0" step="100000" value="0" aria-label="Giá cao nhất (thanh trượt)">
                            </div>
                        </div>
                    </section>

                    <!-- Danh mục, Thương hiệu, Thông số, Tình trạng: do products.js vẽ -->
                    <div id="facetGroups"></div>

                </aside>





                <section class="products-content">

                    <div id="activeFilters" class="pf-active-filters" aria-live="polite" hidden></div>




                    <div class="products-toolbar">

                        <div>

                            <span>
                                Sắp xếp:
                            </span>

                            <select id="sortSelect" aria-label="Sắp xếp sản phẩm">

                                <option value="">
                                    Mặc định
                                </option>

                                <option value="newest">
                                    Mới nhất
                                </option>

                                <option value="discount-desc">
                                    Giảm giá nhiều nhất
                                </option>

                                <option value="price-asc">
                                    Giá thấp → cao
                                </option>

                                <option value="price-desc">
                                    Giá cao → thấp
                                </option>

                                <option value="name-asc">
                                    Tên A → Z
                                </option>

                                <option value="name-desc">
                                    Tên Z → A
                                </option>

                            </select>

                        </div>

                    </div>




                    <div
                        class="product-grid products-grid"
                        id="productsGrid"
                    >

                        <p>
                            Đang tải sản phẩm...
                        </p>

                    </div>




                    <nav id="productsPagination" class="products-pagination" aria-label="Phân trang sản phẩm" hidden></nav>

                    <div
                        id="emptyProducts"
                        class="empty-products"
                        hidden
                    >

                        <h3>
                            Không tìm thấy sản phẩm
                        </h3>

                        <p>
                            Hãy thử thay đổi từ khóa hoặc bộ lọc.
                        </p>

                        <button type="button" id="emptyClearFilter" class="filter-button empty-clear-button">
                            Xóa tất cả bộ lọc
                        </button>

                    </div>

                </section>

            </div>

        </div>

    </main>





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

                <a href="/pages/pc-builder.html">
                    PC Builder
                </a>

            </div>


            <div>

                <h4>
                    Tài khoản
                </h4>

                <a href="/pages/login.html">
                    Đăng nhập
                </a>

                <a href="/pages/register.html">
                    Đăng ký
                </a>

                <a href="/pages/orders.html">
                    Đơn hàng
                </a>

            </div>


            <div>

                <h4>
                    Liên hệ
                </h4>

                <p>
                    TP. Hồ Chí Minh
                </p>

                <p>
                    computerstore@gmail.com
                </p>

            </div>

        </div>


        <div class="footer-bottom">
            © 2026 Computer Store
        </div>

    </footer>
</template>

<script setup>
import '../styles/pages-products.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Sản phẩm - Computer Store",
  bodyClass: "store-mobile-page",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/products.js?raw'),
    () => import('../legacy/js/catalog-mobile.js?raw'),
    () => import('../legacy/js/header-auth.js?raw'),
    () => import('../legacy/js/support-chat.js?raw'),
  ],
})
</script>
