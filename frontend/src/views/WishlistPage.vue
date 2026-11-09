<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/wishlist.html -->
<template>


<header class="header">

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

            <button id="searchButton">
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
                <span id="cartCount">0</span>
            </a>

        </div>

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

            <a href="/pages/pc-builder.html">
                PC Builder
            </a>

        </div>

    </nav>

</header>

<main class="wishlist-page">

    <div class="container">

        <div class="wishlist-breadcrumb">
            <a href="/">Trang chủ</a>
            <span>/</span>
            <span>Yêu thích</span>
        </div>

        <div class="wishlist-heading">

            <div>
                <p class="section-label">
                    WISHLIST
                </p>

                <h1>
                    Sản phẩm yêu thích
                </h1>

                <p>
                    Lưu lại những linh kiện bạn muốn xem hoặc mua sau.
                </p>
            </div>

            <strong id="wishlistCount">
                0 sản phẩm
            </strong>

        </div>

        <div
            id="wishlistMessage"
            class="wishlist-message"
        ></div>

        <section
            id="wishlistGrid"
            class="wishlist-grid"
        >
            <div class="wishlist-loading">
                Đang tải danh sách yêu thích...
            </div>
        </section>

        <div
            id="wishlistEmpty"
            class="wishlist-empty"
            hidden
        >
            <div class="wishlist-empty-icon">
                ♡
            </div>

            <h2>
                Chưa có sản phẩm yêu thích
            </h2>

            <p>
                Hãy thêm sản phẩm để dễ dàng xem lại sau.
            </p>

            <a
                href="/pages/products.html"
                class="wishlist-shop-button"
            >
                Xem sản phẩm
            </a>
        </div>

    </div>

</main>

<footer class="footer">

    <div class="container footer-grid">

        <div>
            <h3>COMPUTERSTORE</h3>
            <p>
                Website bán linh kiện máy tính và hỗ trợ xây dựng cấu hình PC.
            </p>
        </div>

        <div>
            <h4>Sản phẩm</h4>
            <a href="/pages/products.html">
                Tất cả sản phẩm
            </a>
            <a href="/pages/pc-builder.html">
                PC Builder
            </a>
        </div>

        <div>
            <h4>Tài khoản</h4>
            <a href="/pages/profile.html">
                Hồ sơ
            </a>
            <a href="/pages/orders.html">
                Đơn hàng
            </a>
            <a href="/pages/wishlist.html">
                Yêu thích
            </a>
        </div>

        <div>
            <h4>Công cụ</h4>
            <a href="/pages/cart.html">
                Giỏ hàng
            </a>
        </div>

    </div>

</footer>
</template>

<script setup>
import '../styles/pages-wishlist.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Danh sách yêu thích - Computer Store",
  bodyClass: "",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/wishlist.js?raw'),
    () => import('../legacy/js/header-auth.js?raw'),
    () => import('../legacy/js/support-chat.js?raw'),
  ],
})
</script>
