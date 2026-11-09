<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/admin/reports.html -->
<template>

  <div class="admin-layout">
   <aside class="admin-sidebar">
    <div class="admin-logo">COMPUTER<span>STORE</span>
     <small>
      ADMIN
     </small>
    </div>
    <nav class="admin-menu">
     <a href="/pages/admin/index.html">
      <span class="menu-icon">
       ◫
      </span>
      Dashboard
     </a>
     <a href="/pages/admin/products.html">
      <span class="menu-icon">
       ▣
      </span>
      Sản phẩm
     </a>
            <a href="/pages/admin/promotions.html"><span class="menu-icon">%</span> Khuyến mãi</a>
     <a href="/pages/admin/inventory.html">
      <span class="menu-icon">
       ▦
      </span>
      Tổng kho
     </a>
     <a href="/pages/admin/reports.html">
      <span class="menu-icon">
       ▥
      </span>
      Báo cáo doanh thu
     </a>
     <a href="/pages/admin/orders.html">
      <span class="menu-icon">
       ▤
      </span>
      Đơn hàng
     </a>
     <a href="/pages/admin/users.html">
      <span class="menu-icon">
       ♟
      </span>
      Người dùng
     </a>
     
     <a href="/pages/admin/reviews.html">
      <span class="menu-icon">
       ★
      </span>
      Đánh giá
     </a>
            <a href="/pages/admin/support.html"><span class="menu-icon">✉</span> Chat hỗ trợ</a>
        </nav>
    <div class="admin-sidebar-bottom">
     <a class="back-store-link" href="/">
      ← Về cửa hàng
     </a>
     <button class="admin-logout-button" id="adminLogoutButton" type="button">
      Đăng xuất
     </button>
    </div>
   </aside>
   <main class="admin-main">
    <header class="admin-header">
     <div>
      <p class="admin-page-label">
       ADMIN PANEL
      </p>
      <h1>
       Báo cáo doanh thu
      </h1>
      <p>
       Thống kê theo ngày, tháng, năm và trạng thái đơn hàng.
      </p>
     </div>
     <div class="admin-profile">
      <div class="admin-avatar">
       A
      </div>
      <div>
       <strong id="adminName">
        Admin
       </strong>
       <span>
        Quản trị viên
       </span>
      </div>
     </div>
    </header>
    <section class="admin-panel">
     <div class="enh-heading">
      <div>
       <p class="panel-label">
        BỘ LỌC
       </p>
       <h2>
        Khoảng thời gian báo cáo
       </h2>
      </div>
     </div>
     <form class="enh-filter" id="reportForm">
      <label>
       Từ ngày
       <input id="reportFrom" required="" type="date"/>
      </label>
      <label>
       Đến ngày
       <input id="reportTo" required="" type="date"/>
      </label>
      <label>
       Nhóm theo
       <select id="reportGroup">
        <option value="day">
         Ngày
        </option>
        <option selected="" value="month">
         Tháng
        </option>
        <option value="year">
         Năm
        </option>
       </select>
      </label>
      <button class="enh-btn" type="submit">
       Xem báo cáo
      </button>
     </form>
     <p class="enh-note">
      Doanh thu ghi nhận theo ngày thanh toán, chỉ gồm đơn
      <strong>
       đã hoàn thành và đã thanh toán
      </strong>
      . Đơn hàng lọc theo ngày đặt. Tiền khách chuyển khoản cho đơn chưa hoàn thành được thống kê riêng.
     </p>
    </section>
    <div class="enh-message" id="pageMessage" role="status">
    </div>
    <section class="enh-stats">
     <article>
      <span>
       Doanh thu đã hoàn thành
      </span>
      <strong id="reportRevenue">
       —
      </strong>
     </article>
     <article>
      <span>
       Đã thu, chưa hoàn thành
      </span>
      <strong id="reportPaidPending">
       —
      </strong>
     </article>
     <article>
      <span>
       Tổng đơn đặt trong kỳ
      </span>
      <strong id="reportOrders">
       —
      </strong>
     </article>
     <article>
      <span>
       Đơn hoàn thành trong kỳ
      </span>
      <strong id="reportCompleted">
       —
      </strong>
     </article>
    </section>
    <section class="admin-panel">
     <div class="enh-heading">
      <div>
       <p class="panel-label">
        THỐNG KÊ
       </p>
       <h2>
        Biểu đồ doanh thu
       </h2>
      </div>
     </div>
     <div aria-label="Biểu đồ doanh thu" class="enh-chart" id="revenueChart">
     </div>
     <div class="enh-status-grid" id="reportStatus">
     </div>
    </section>
    <section class="admin-panel">
     <div class="enh-heading">
      <div>
       <p class="panel-label">
        ĐƠN HÀNG
       </p>
       <h2>
        Chi tiết đơn hàng theo ngày đặt
       </h2>
      </div>
      <div class="enh-controls">
       <select id="orderStatusFilter">
        <option value="ALL">
         Tất cả đơn
        </option>
        <option value="PENDING">
         Chờ xử lý
        </option>
        <option value="CONFIRMED">
         Đã xác nhận
        </option>
        <option value="SHIPPING">
         Đang giao
        </option>
        <option value="COMPLETED">
         Hoàn thành
        </option>
        <option value="CANCELLED">
         Đã hủy
        </option>
       </select>
       <button class="enh-btn secondary" id="exportOrders" type="button">
        Xuất CSV
       </button>
      </div>
     </div>
     <div class="enh-table-wrap">
      <table class="enh-table">
       <thead>
        <tr>
         <th>
          Mã đơn
         </th>
         <th>
          Khách hàng
         </th>
         <th>
          Ngày giờ đặt
         </th>
         <th>
          Giá trị đơn
         </th>
         <th>
          Thanh toán
         </th>
         <th>
          Trạng thái
         </th>
         <th>
          Chi tiết
         </th>
        </tr>
       </thead>
       <tbody id="reportRows">
       </tbody>
      </table>
     </div>
    </section>
   </main>
  </div>
</template>

<script setup>
import '../../styles/pages-admin-reports.css'
import { useLegacyPage } from '../../composables/useLegacyPage'

useLegacyPage({
  title: "Báo cáo doanh thu - ComputerStore",
  bodyClass: "admin-mobile-unified",
  scripts: [
    () => import('../../legacy/js/api.js?raw'),
    () => import('../../legacy/js/admin/enhancements.js?raw'),
    () => import('../../legacy/js/admin/reports.js?raw'),
    () => import('../../legacy/js/admin/mobile-unified.js?raw'),
  ],
})
</script>
