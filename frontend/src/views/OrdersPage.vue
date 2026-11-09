<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/orders.html -->
<template>





<header class="header orders-site-header">
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
     <a aria-label="Sản phẩm yêu thích" class="orders-mobile-wishlist" href="/pages/wishlist.html" title="Yêu thích">
      <svg aria-hidden="true" fill="none" height="21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" viewbox="0 0 24 24" width="21">
       <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z">
       </path>
      </svg>
     </a>
     <a aria-label="Giỏ hàng" class="cart-link" href="/pages/cart.html">
      <svg aria-hidden="true" class="orders-mobile-cart-icon" fill="none" height="22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" viewbox="0 0 24 24" width="22">
       <circle cx="9" cy="21" r="1">
       </circle>
       <circle cx="20" cy="21" r="1">
       </circle>
       <path d="M1 1h4l2.7 13.4A2 2 0 0 0 9.7 16h9.7a2 2 0 0 0 2-1.6L23 6H6">
       </path>
      </svg>
      <span class="orders-cart-label">
       Giỏ hàng
      </span>
      <span id="cartCount">
       0
      </span>
     </a>
     <button aria-controls="ordersMobileMenu" aria-expanded="false" aria-label="Mở menu" class="orders-mobile-menu-toggle" id="ordersMobileMenuToggle" type="button">
      <svg aria-hidden="true" fill="none" height="22" stroke="currentColor" stroke-linecap="round" stroke-width="2" viewbox="0 0 24 24" width="22">
       <path d="M4 6h16M4 12h16M4 18h16">
       </path>
      </svg>
     </button>
    </div>
   </div>
   <nav aria-label="Điều hướng chính" class="navbar" id="ordersMobileMenu">
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
     <a class="orders-mobile-menu-link" href="/pages/profile.html">
      Tài khoản của tôi
     </a>
     <a class="orders-mobile-menu-link" href="/pages/orders.html">
      Đơn hàng của tôi
     </a>
     <a class="orders-mobile-menu-link" href="/pages/wishlist.html">
      Yêu thích
     </a>
    </div>
   </nav>
  </header>




<main class="orders-page">

    <div class="container">


        <div class="orders-breadcrumb">

            <a href="/">
                Trang chủ
            </a>

            <span>/</span>

            <span>
                Đơn hàng
            </span>

        </div>


        <div class="orders-heading">

            <p class="section-label">
                MY ORDERS
            </p>

            <h1>
                Đơn hàng của tôi
            </h1>

            <p>
                Theo dõi lịch sử và trạng thái đơn hàng của bạn.
            </p>

        </div>


        <div
            id="ordersMessage"
            class="orders-message"
        ></div>




        <div class="orders-toolbar">

            <div class="order-filter">

                <button
                    type="button"
                    class="order-filter-button active"
                    data-status="ALL"
                >
                    Tất cả
                </button>

                <button
                    type="button"
                    class="order-filter-button"
                    data-status="PENDING"
                >
                    Chờ xử lý
                </button>

                <button
                    type="button"
                    class="order-filter-button"
                    data-status="CONFIRMED"
                >
                    Đã xác nhận
                </button>

                <button
                    type="button"
                    class="order-filter-button"
                    data-status="SHIPPING"
                >
                    Đang giao
                </button>

                <button
                    type="button"
                    class="order-filter-button"
                    data-status="COMPLETED"
                >
                    Hoàn thành
                </button>

                <button
                    type="button"
                    class="order-filter-button"
                    data-status="CANCELLED"
                >
                    Đã hủy
                </button>

            </div>

        </div>




        <section
            id="ordersList"
            class="orders-list"
        >

            <div class="orders-loading">
                Đang tải đơn hàng...
            </div>

        </section>




        <div
            id="emptyOrders"
            class="empty-orders"
            hidden
        >

            <div class="empty-orders-icon">
                📦
            </div>

            <h2>
                Chưa có đơn hàng
            </h2>

            <p>
                Bạn chưa có đơn hàng nào.
            </p>

            <a
                href="/pages/products.html"
                class="orders-shopping-button"
            >
                Tiếp tục mua sắm
            </a>

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

            <a href="/pages/profile.html">
                Hồ sơ
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
import '../styles/pages-orders.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Đơn hàng của tôi - Computer Store",
  bodyClass: "orders-view",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/orders.js?raw'),
    () => import('../legacy/js/header-auth.js?raw'),
    () => import('../legacy/js/support-chat.js?raw'),
  ],
})
</script>
