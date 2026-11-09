<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/order-detail.html -->
<template>



<header class="header order-detail-site-header">
   <div class="container header-top">
    <a class="logo" href="/">COMPUTER<span>STORE</span></a>
    <div class="search-box">
     <input aria-label="Tìm sản phẩm" id="searchInput" placeholder="Tìm CPU, GPU, RAM, SSD..." type="text"/>
     <button id="searchButton" type="button">
      Tìm kiếm
     </button>
    </div>
    <div class="header-actions">
     <a href="/pages/login.html" id="loginLink">
      Đăng nhập
     </a>
     <a aria-label="Sản phẩm yêu thích" class="detail-mobile-wishlist" href="/pages/wishlist.html" title="Yêu thích">
      <svg aria-hidden="true" fill="none" height="21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" viewbox="0 0 24 24" width="21">
       <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z">
       </path>
      </svg>
     </a>
     <a aria-label="Giỏ hàng" class="cart-link" href="/pages/cart.html">
      <svg aria-hidden="true" class="detail-mobile-cart-icon" fill="none" height="22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" viewbox="0 0 24 24" width="22">
       <circle cx="9" cy="21" r="1">
       </circle>
       <circle cx="20" cy="21" r="1">
       </circle>
       <path d="M1 1h4l2.7 13.4A2 2 0 0 0 9.7 16h9.7a2 2 0 0 0 2-1.6L23 6H6">
       </path>
      </svg>
      <span class="detail-cart-label">
       Giỏ hàng
      </span>
      <span id="cartCount">
       0
      </span>
     </a>
     <button aria-controls="detailMobileMenu" aria-expanded="false" aria-label="Mở menu" class="detail-mobile-menu-toggle" id="detailMobileMenuToggle" type="button">
      <svg aria-hidden="true" fill="none" height="22" stroke="currentColor" stroke-linecap="round" stroke-width="2" viewbox="0 0 24 24" width="22">
       <path d="M4 6h16M4 12h16M4 18h16">
       </path>
      </svg>
     </button>
    </div>
   </div>
   <nav aria-label="Điều hướng chính" class="navbar" id="detailMobileMenu">
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
     <a class="detail-mobile-menu-link" href="/pages/profile.html">
      Tài khoản của tôi
     </a>
     <a class="detail-mobile-menu-link" href="/pages/orders.html">
      Đơn hàng của tôi
     </a>
     <a class="detail-mobile-menu-link" href="/pages/wishlist.html">
      Yêu thích
     </a>
    </div>
   </nav>
  </header>


<main class="order-detail-page">

    <div class="container">


        <div class="order-detail-breadcrumb">

            <a href="/">
                Trang chủ
            </a>

            <span>/</span>

            <a href="/pages/orders.html">
                Đơn hàng
            </a>

            <span>/</span>

            <span>
                Chi tiết
            </span>

        </div>


        <div
            id="orderDetailMessage"
            class="order-detail-message"
        ></div>


        <div
            id="orderDetailContent"
            class="order-detail-content"
        >

            <div class="order-detail-loading">
                Đang tải chi tiết đơn hàng...
            </div>

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

        </div>


        <div>

            <h4>
                Tài khoản
            </h4>

            <a href="/pages/orders.html">
                Đơn hàng
            </a>

            <a href="/pages/profile.html">
                Hồ sơ
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
import '../styles/pages-order-detail.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Chi tiết đơn hàng - Computer Store",
  bodyClass: "order-detail-view",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/order-detail.js?raw'),
    () => import('../legacy/js/header-auth.js?raw'),
    () => import('../legacy/js/support-chat.js?raw'),
  ],
})
</script>
