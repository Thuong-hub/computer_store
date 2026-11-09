<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/cart.html -->
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




<main class="cart-page">

    <div class="container">




        <div class="cart-breadcrumb">

            <a href="/">
                Trang chủ
            </a>

            <span>/</span>

            <span>
                Giỏ hàng
            </span>

        </div>




        <div class="cart-page-header">

            <div>

                <p class="section-label">
                    SHOPPING CART
                </p>

                <h1>
                    Giỏ hàng của bạn
                </h1>

                <p id="cartDescription">
                    Kiểm tra lại sản phẩm trước khi thanh toán.
                </p>

            </div>


            <button
                type="button"
                id="clearCartButton"
                class="clear-cart-button"
            >
                Xóa toàn bộ
            </button>

        </div>




        <div
            id="cartMessage"
            class="cart-message"
        ></div>




        <div class="cart-layout">




            <section class="cart-items-section">

                <div class="cart-table-header">

                    <span>
                        Sản phẩm
                    </span>

                    <span>
                        Đơn giá
                    </span>

                    <span>
                        Số lượng
                    </span>

                    <span>
                        Thành tiền
                    </span>

                    <span></span>

                </div>




                <div id="cartItems">

                    <div class="cart-loading">

                        Đang tải giỏ hàng...

                    </div>

                </div>




                <div
                    id="emptyCart"
                    class="empty-cart"
                    hidden
                >

                    <div class="empty-cart-icon">
                        🛒
                    </div>

                    <h2>
                        Giỏ hàng đang trống
                    </h2>

                    <p>
                        Bạn chưa có sản phẩm nào trong giỏ hàng.
                    </p>

                    <a
                        href="/pages/products.html"
                        class="continue-shopping-button"
                    >
                        Tiếp tục mua sắm
                    </a>

                </div>

            </section>




            <aside class="cart-summary">

                <h2>
                    Tóm tắt đơn hàng
                </h2>


                <div class="summary-row">

                    <span>
                        Tổng sản phẩm
                    </span>

                    <strong id="summaryQuantity">
                        0
                    </strong>

                </div>


                <div class="summary-row">

                    <span>
                        Tạm tính
                    </span>

                    <strong id="summarySubtotal">
                        0 ₫
                    </strong>

                </div>


                <div class="summary-row" id="cartDiscountRow" hidden>

                    <span id="cartDiscountLabel">
                        Giảm giá
                    </span>

                    <strong id="cartDiscountAmount" class="cart-discount-amount">
                        -0 ₫
                    </strong>

                </div>


                <div class="summary-row">

                    <span>
                        Phí vận chuyển
                    </span>

                    <strong class="free-shipping">
                        Miễn phí
                    </strong>

                </div>


                <div class="summary-divider"></div>


                <div class="summary-total">

                    <span>
                        Tổng cộng
                    </span>

                    <strong id="summaryTotal">
                        0 ₫
                    </strong>

                </div>


                <button
                    type="button"
                    id="checkoutButton"
                    class="checkout-button"
                >
                    Tiến hành thanh toán
                </button>


                <a
                    href="/pages/products.html"
                    class="continue-link"
                >
                    ← Tiếp tục mua sắm
                </a>


                <div class="cart-benefits">

                    <div>
                        <strong>✓ Thanh toán an toàn</strong>

                        <span>
                            Bảo mật thông tin mua hàng
                        </span>
                    </div>


                    <div>
                        <strong>✓ Giao hàng toàn quốc</strong>

                        <span>
                            Đóng gói sản phẩm cẩn thận
                        </span>
                    </div>


                    <div>
                        <strong>✓ Hỗ trợ khách hàng</strong>

                        <span>
                            Hỗ trợ trong quá trình mua hàng
                        </span>
                    </div>

                </div>

            </aside>

        </div>

    </div>

</main>




<footer class="footer">

    <div class="container footer-grid">

        <div>

            <h3>
                COMPUTER STORE
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

            <a href="/pages/products.html?category=CPU">
                CPU
            </a>

            <a href="/pages/products.html?category=GPU">
                GPU
            </a>

            <a href="/pages/products.html?category=RAM">
                RAM
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

            <a href="/pages/cart.html">
                Giỏ hàng
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
import '../styles/pages-cart.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Giỏ hàng - Computer Store",
  bodyClass: "store-mobile-page",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/cart.js?raw'),
    () => import('../legacy/js/header-auth.js?raw'),
    () => import('../legacy/js/support-chat.js?raw'),
  ],
})
</script>
