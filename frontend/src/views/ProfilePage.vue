<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/profile.html -->
<template>

  <header class="header profile-site-header">
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
     <a aria-label="Sản phẩm yêu thích" class="profile-mobile-wishlist" href="/pages/wishlist.html" title="Yêu thích">
      <svg aria-hidden="true" fill="none" height="21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" viewbox="0 0 24 24" width="21">
       <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z">
       </path>
      </svg>
     </a>
     <a aria-label="Giỏ hàng" class="cart-link" href="/pages/cart.html">
      <svg aria-hidden="true" class="profile-mobile-cart-icon" fill="none" height="22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" viewbox="0 0 24 24" width="22">
       <circle cx="9" cy="21" r="1">
       </circle>
       <circle cx="20" cy="21" r="1">
       </circle>
       <path d="M1 1h4l2.7 13.4A2 2 0 0 0 9.7 16h9.7a2 2 0 0 0 2-1.6L23 6H6">
       </path>
      </svg>
      <span class="profile-cart-label">
       Giỏ hàng
      </span>
      <span id="cartCount">
       0
      </span>
     </a>
     <button aria-controls="profileMobileMenu" aria-expanded="false" aria-label="Mở menu" class="profile-mobile-menu-toggle" id="profileMobileMenuToggle" type="button">
      <svg aria-hidden="true" fill="none" height="22" stroke="currentColor" stroke-linecap="round" stroke-width="2" viewbox="0 0 24 24" width="22">
       <path d="M4 6h16M4 12h16M4 18h16">
       </path>
      </svg>
     </button>
    </div>
   </div>
   <nav aria-label="Điều hướng chính" class="navbar" id="profileMobileMenu">
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
     <a class="profile-mobile-menu-link" href="/pages/profile.html">
      Tài khoản của tôi
     </a>
     <a class="profile-mobile-menu-link" href="/pages/orders.html">
      Đơn hàng của tôi
     </a>
     <a class="profile-mobile-menu-link" href="/pages/wishlist.html">
      Yêu thích
     </a>
    </div>
   </nav>
  </header>
  <main class="profile-page">
   <div class="container">
    <div class="profile-breadcrumb">
     <a href="/">
      Trang chủ
     </a>
     <span>
      /
     </span>
     <span>
      Hồ sơ
     </span>
    </div>
    <div class="profile-heading">
     <p class="section-label">
      MY ACCOUNT
     </p>
     <h1>
      Hồ sơ tài khoản
     </h1>
     <p>
      Xem và quản lý thông tin tài khoản của bạn.
     </p>
    </div>
    <div class="profile-message" id="profileMessage">
    </div>
    <div class="profile-layout">
     <aside class="profile-sidebar">
      <div class="profile-avatar">
       <span id="profileAvatarText">
        U
       </span>
      </div>
      <h2 id="sidebarName">
       Đang tải...
      </h2>
      <p id="sidebarUsername">
       @username
      </p>
      <span class="profile-role" id="sidebarRole">
       USER
      </span>
      <div class="profile-menu">
       <a class="active" href="/pages/profile.html">
        Hồ sơ
       </a>
       <a href="/pages/orders.html">
        Đơn hàng của tôi
       </a>
       <a href="/pages/wishlist.html">
        Yêu thích
       </a>
       <a href="/pages/pc-builder.html">
        PC Builder
       </a>
       <a href="/pages/cart.html">
        Giỏ hàng
       </a>
      </div>
     </aside>
     <section class="profile-content">
      <div class="profile-card">
       <div class="profile-card-header">
        <div>
         <h2>
          Thông tin cá nhân
         </h2>
         <p>
          Thông tin hiện tại của tài khoản.
         </p>
        </div>
       </div>
       <div class="profile-loading" id="profileLoading">
        Đang tải thông tin...
       </div>
       <div class="profile-info-grid" hidden="" id="profileInfo">
        <div class="profile-info-item">
         <span>
          Mã khách hàng
         </span>
         <strong id="profileUserId">
          -
         </strong>
        </div>
        <div class="profile-info-item">
         <span>
          Tên đăng nhập
         </span>
         <strong id="profileUsername">
          -
         </strong>
        </div>
        <div class="profile-info-item">
         <span>
          Họ và tên
         </span>
         <strong id="profileFullName">
          -
         </strong>
        </div>
        <div class="profile-info-item">
         <span>
          Email
         </span>
         <strong id="profileEmail">
          -
         </strong>
        </div>
        <div class="profile-info-item">
         <span>
          Số điện thoại
         </span>
         <strong id="profilePhone">
          -
         </strong>
        </div>
        <div class="profile-info-item">
         <span>
          Vai trò
         </span>
         <strong id="profileRole">
          -
         </strong>
        </div>
        <div class="profile-info-item full-width">
         <span>
          Địa chỉ
         </span>
         <strong id="profileAddress">
          -
         </strong>
        </div>
       </div>
      </div>
      <section class="profile-card membership-card" id="membershipCard" aria-live="polite">
        <div class="profile-card-header">
          <div>
            <h2>Thành viên ComputerStore <span id="membershipTier" class="member-badge">Đang tải</span></h2>
            <p id="membershipDescription">Đang kiểm tra quyền lợi thành viên...</p>
          </div>
        </div>
        <div class="membership-stats">
          <div><span>Đơn hoàn thành, đã thanh toán</span><strong id="membershipOrders">0 / 10</strong></div>
          <div><span>Doanh số đủ điều kiện</span><strong id="membershipSpending">0đ / 300.000.000đ</strong></div>
        </div>
        <div class="membership-progress"><span id="membershipProgress"></span></div>
        <p id="membershipRemaining" class="membership-note"></p>
      </section>
      <div class="profile-card">
       <div class="profile-card-header">
        <div>
         <h2>
          Cập nhật thông tin
         </h2>
         <p>
          Chỉnh sửa thông tin cá nhân của bạn.
         </p>
        </div>
       </div>
       <div class="profile-form-grid">
        <div class="profile-field">
         <label for="editFullName">
          Họ và tên
         </label>
         <input id="editFullName" type="text"/>
        </div>
        <div class="profile-field">
         <label for="editEmail">
          Email
         </label>
         <input id="editEmail" readonly="" type="email"/>
        </div>
        <div class="profile-field">
         <label for="editPhone">
          Số điện thoại
         </label>
         <input id="editPhone" placeholder="Ví dụ: 0987654321" type="text"/>
        </div>
        <div class="profile-field full-width">
         <label for="editAddress">
          Địa chỉ
         </label>
         <textarea id="editAddress" rows="3"></textarea>
        </div>
       </div>
       <button class="profile-primary-button" id="updateProfileButton" type="button">
        Cập nhật thông tin
       </button>
      </div>
      <div class="profile-card" id="changeEmailCard">
       <div class="profile-card-header">
        <div>
         <h2>Đổi địa chỉ Gmail</h2>
         <p>Nhập email mới và xác minh mã được gửi đến hộp thư mới. Email cũ vẫn giữ nguyên cho đến khi xác minh thành công.</p>
        </div>
       </div>
       <div class="profile-form-grid">
        <div class="profile-field">
         <label for="newProfileEmail">Email mới</label>
         <input id="newProfileEmail" type="email" autocomplete="email" placeholder="Email bạn muốn sử dụng"/>
        </div>
        <div class="profile-field">
         <label for="emailChangePassword">Mật khẩu hiện tại</label>
         <input id="emailChangePassword" type="password" autocomplete="current-password"/>
        </div>
       </div>
       <button class="profile-primary-button" id="requestEmailChangeButton" type="button">Gửi mã xác minh tới Gmail mới</button>
       <div id="emailChangeVerifyPanel" class="profile-email-verification" hidden>
        <div class="profile-field">
         <label for="emailChangeOtp">Mã xác minh 6 chữ số</label>
         <input id="emailChangeOtp" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" autocomplete="one-time-code" placeholder="Nhập OTP trong Gmail mới"/>
        </div>
        <button class="profile-primary-button" id="confirmEmailChangeButton" type="button">Xác minh và đổi email</button>
       </div>
       <p id="emailChangeMessage" class="profile-email-change-message" role="status" aria-live="polite"></p>
      </div>
      <div class="profile-card">
       <div class="profile-card-header">
        <div>
         <h2>
          Đổi mật khẩu
         </h2>
         <p>
          Thay đổi mật khẩu đăng nhập của tài khoản.
         </p>
        </div>
       </div>
       <div class="profile-form-grid">
        <div class="profile-field full-width">
         <label for="oldPassword">
          Mật khẩu hiện tại
         </label>
         <input autocomplete="current-password" id="oldPassword" type="password"/>
        </div>
        <div class="profile-field">
         <label for="newPassword">
          Mật khẩu mới
         </label>
         <input autocomplete="new-password" id="newPassword" type="password"/>
        </div>
        <div class="profile-field">
         <label for="confirmNewPassword">
          Xác nhận mật khẩu mới
         </label>
         <input autocomplete="new-password" id="confirmNewPassword" type="password"/>
        </div>
       </div>
       <button class="profile-primary-button" id="changePasswordButton" type="button">
        Đổi mật khẩu
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
     <a href="/pages/wishlist.html">
      Yêu thích
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
import '../styles/pages-profile.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Hồ sơ tài khoản - Computer Store",
  bodyClass: "",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/profile.js?raw'),
    () => import('../legacy/js/header-auth.js?raw'),
    () => import('../legacy/js/support-chat.js?raw'),
  ],
})
</script>
