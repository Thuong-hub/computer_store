<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/product-detail.html -->
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



    

    <main class="product-detail-page">

        <div class="container">

            

            <div class="breadcrumb product-breadcrumb">

                <a href="/">
                    Trang chủ
                </a>

                <span>/</span>

                <a href="/pages/products.html">
                    Sản phẩm
                </a>

                <span>/</span>

                <span id="breadcrumbProductName">
                    Chi tiết
                </span>

            </div>



            

            <section
                class="product-detail-wrapper"
                id="productDetail"
            >

                

                <div class="detail-image-box">

                    <div
                        class="detail-image"
                        id="productImageContainer"
                    >

                        <div class="detail-loading">
                            Đang tải ảnh...
                        </div>

                    </div>

                </div>



                

                <div class="detail-info">

                    <p
                        class="detail-category"
                        id="productCategory"
                    >
                        Đang tải...
                    </p>


                    <h1 id="productName">
                        Đang tải sản phẩm...
                    </h1>


                    <div
                        class="detail-status"
                        id="productStock"
                    >
                        Đang kiểm tra tồn kho...
                    </div>


                    <div
                        class="detail-price"
                        id="productPrice"
                    >
                        0 ₫
                    </div>


                    <div class="detail-divider"></div>


                    <div class="quantity-section">

                        <span>
                            Số lượng
                        </span>


                        <div class="quantity-control">

                            <button
                                type="button"
                                id="decreaseQuantity"
                            >
                                −
                            </button>


                            <input
                                type="number"
                                id="quantityInput"
                                value="1"
                                min="1"
                            >


                            <button
                                type="button"
                                id="increaseQuantity"
                            >
                                +
                            </button>

                        </div>

                    </div>



                    <div class="detail-actions">

                        <button
                            type="button"
                            id="addToCartButton"
                            class="detail-cart-button"
                        >
                            Thêm vào giỏ hàng
                        </button>

                        <a
                            href="/pages/pc-builder.html"
                            class="detail-builder-button"
                        >
                            PC Builder
                        </a>

                        <button
                            type="button"
                            id="wishlistButton"
                            class="detail-wishlist-button"
                        >
                            ♡ Thêm vào yêu thích
                        </button>

                    </div>

                    <a
                        href="/pages/wishlist.html"
                        class="detail-wishlist-link"
                    >
                        Xem danh sách yêu thích
                    </a>


                    <div
                        id="productMessage"
                        class="product-message"
                    ></div>



                    

                    <div class="product-benefits">

                        <div>
                            <strong>
                                Chính hãng
                            </strong>

                            <span>
                                Sản phẩm đảm bảo nguồn gốc
                            </span>
                        </div>


                        <div>
                            <strong>
                                Tồn kho realtime
                            </strong>

                            <span>
                                Kiểm tra trực tiếp từ hệ thống
                            </span>
                        </div>


                        <div>
                            <strong>
                                PC Builder
                            </strong>

                            <span>
                                Hỗ trợ kiểm tra tương thích linh kiện
                            </span>
                        </div>

                    </div>

                </div>

            </section>



            

            <section class="detail-section">

                <div class="detail-section-title">

                    <p class="section-label">
                        THÔNG TIN
                    </p>

                    <h2>
                        Mô tả sản phẩm
                    </h2>

                </div>


                <div
                    class="description-box"
                    id="productDescription"
                >

                    Đang tải mô tả...

                </div>

            </section>



            

            <section class="detail-section">

                <div class="detail-section-title">

                    <p class="section-label">
                        TECHNICAL SPECS
                    </p>

                    <h2>
                        Thông số kỹ thuật
                    </h2>

                </div>


                <div
                    class="specs-box"
                    id="productSpecs"
                >

                    <p>
                        Đang tải thông số kỹ thuật...
                    </p>

                </div>

            </section>



            

            <section class="detail-section">

                <div class="detail-section-title">

                    <p class="section-label">
                        ĐÁNH GIÁ
                    </p>

                    <h2>
                        Đánh giá sản phẩm
                    </h2>

                </div>


                <div
                    class="reviews-box"
                    id="productReviews"
                >

                    <p>
                        Phần đánh giá sẽ được tải ở bước sau.
                    </p>

                </div>

            </section>

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
import '../styles/pages-product-detail.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Chi tiết sản phẩm - Computer Store",
  bodyClass: "store-mobile-page",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/product-detail.js?raw'),
    () => import('../legacy/js/header-auth.js?raw'),
    () => import('../legacy/js/support-chat.js?raw'),
  ],
})
</script>
