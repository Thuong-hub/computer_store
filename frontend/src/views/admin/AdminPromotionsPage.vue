<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/admin/promotions.html -->
<template>


<div class="admin-layout">


    <aside class="admin-sidebar">

        <div class="admin-logo">COMPUTER<span>STORE</span>
            <small>ADMIN</small>
        </div>

        <nav class="admin-menu">

            <a href="/pages/admin/index.html">
                <span class="menu-icon">◫</span>
                Dashboard
            </a>

            <a href="/pages/admin/products.html">
                <span class="menu-icon">▣</span>
                Sản phẩm
            </a>
            <a href="/pages/admin/promotions.html"class="active"><span class="menu-icon">%</span>Khuyến mãi</a>
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
                    PROMOTION MANAGEMENT
                </p>

                <h1>
                    Quản lý khuyến mãi
                </h1>

                <p>
                    Quản lý mã giảm giá, ưu đãi sản phẩm và Black Friday.
                </p>

            </div>

            <div class="admin-header-actions">

                <button
                    type="button"
                    id="addPromotionButton"
                    class="admin-primary-button"
                >
                    + Thêm khuyến mãi
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



        <section class="admin-panel admin-promotion-toolbar">

            <div class="admin-promotion-filters">

                <button
                    type="button"
                    class="admin-promotion-filter active"
                    data-filter="ALL"
                >
                    Tất cả
                </button>

                <button
                    type="button"
                    class="admin-promotion-filter"
                    data-filter="ACTIVE"
                >
                    Đang hoạt động
                </button>

                <button
                    type="button"
                    class="admin-promotion-filter"
                    data-filter="INACTIVE"
                >
                    Đã tắt
                </button>

                <button
                    type="button"
                    class="admin-promotion-filter"
                    data-filter="EXPIRED"
                >
                    Hết hạn
                </button>

            </div>

            <input
                type="text"
                id="adminPromotionSearch"
                placeholder="Tìm mã hoặc tên khuyến mãi..."
            >

        </section>



        <section class="admin-panel">

            <div class="section-title-row">

                <div>

                    <p class="panel-label">
                        KHUYẾN MÃI
                    </p>

                    <h2>
                        Danh sách mã giảm giá
                    </h2>

                </div>

                <strong id="adminPromotionCount">
                    0 khuyến mãi
                </strong>

            </div>


            <div class="admin-table-wrapper">

                <table class="admin-table admin-promotion-table">

                    <thead>

                    <tr>
                        <th>ID</th>
                        <th>Mã</th>
                        <th>Tên khuyến mãi</th>
                        <th>Giảm</th>
                        <th>Đơn tối thiểu</th>
                        <th>Giảm tối đa</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>

                    </thead>

                    <tbody id="adminPromotionTableBody">

                    <tr>
                        <td
                            colspan="9"
                            class="admin-table-empty"
                        >
                            Đang tải khuyến mãi...
                        </td>
                    </tr>

                    </tbody>

                </table>

            </div>

        </section>

        <section class="admin-panel product-promotion-panel">
            <div class="section-title-row">
                <div>
                    <p class="panel-label">ƯU ĐÃI SẢN PHẨM</p>
                    <h2>Giảm giá sản phẩm &amp; Black Friday</h2>
                    <p class="admin-section-description">Sản phẩm mới 5%, Bestseller 10%, Sale 15%. Black Friday 30%</p>
                </div>
                <button type="button" id="addProductPromotionButton" class="admin-primary-button">+ Thêm ưu đãi sản phẩm</button>
            </div>

            <div class="product-promotion-toolbar">
                <div class="admin-promotion-filters">
                    <button type="button" class="product-promotion-filter active" data-product-filter="ALL">Tất cả</button>
                    <button type="button" class="product-promotion-filter" data-product-filter="NEW_PRODUCT">Sản phẩm mới</button>
                    <button type="button" class="product-promotion-filter" data-product-filter="BESTSELLER">Bestseller</button>
                    <button type="button" class="product-promotion-filter" data-product-filter="SALE">Sale</button>
                    <button type="button" class="product-promotion-filter" data-product-filter="BLACK_FRIDAY">Black Friday</button>
                </div>
                <input type="text" id="productPromotionSearch" placeholder="Tìm sản phẩm...">
            </div>

            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sản phẩm</th>
                            <th>Loại</th>
                            <th>Giảm</th>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="productPromotionTableBody">
                        <tr><td colspan="7" class="admin-table-empty">Đang tải ưu đãi sản phẩm...</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="admin-panel black-friday-panel">
            <div class="section-title-row">
                <div>
                    <p class="panel-label">BLACK FRIDAY</p>
                    <h2>Lịch Black Friday theo năm</h2>
                    <p class="admin-section-description">Mỗi năm chỉ lưu một campaign. Chọn ngày, bật chiến dịch; mọi sản phẩm tham gia được giảm cố định 30%.</p>
                </div>
            </div>
            <form id="blackFridayForm" class="black-friday-form">
                <label>Năm <input id="blackFridayYear" type="number" min="2026" required></label>
                <label>Ngày áp dụng <input id="blackFridayDate" type="date" required></label>
                <label class="sale-checkbox"><input id="blackFridayEnabled" type="checkbox"> Bật campaign</label>
                <button type="submit" class="admin-primary-button">Lưu Black Friday</button>
            </form>
            <div class="black-friday-quick-tools">
                <div class="black-friday-selection-tools">
                    <div class="black-friday-selection-main">
                        <button type="button" id="blackFridaySelectAll" class="black-friday-tool-button primary-soft">Chọn tất cả</button>
                        <button type="button" id="blackFridayClearAll" class="black-friday-tool-button">Bỏ chọn tất cả</button>
                        <button type="button" id="blackFridaySelectSelling" class="black-friday-tool-button">Chọn sản phẩm đang bán</button>
                    </div>
                    <div class="black-friday-category-tool">
                        <select id="blackFridayCategorySelect" class="black-friday-tool-select">
                            <option value="">Chọn danh mục</option>
                        </select>
                        <button type="button" id="blackFridaySelectCategory" class="black-friday-tool-button">Chọn danh mục</button>
                    </div>
                    <div class="black-friday-selection-count" id="blackFridaySelectionCount">Đã chọn: 0 sản phẩm</div>
                </div>

                <div class="black-friday-bulk-discount">
                    <span>Áp dụng nhanh mức giảm:</span>
                    <button type="button" class="black-friday-percent-button" data-bulk-percent="30">30%</button>
                </div>
            </div>

            <div id="blackFridayProducts" class="black-friday-products">Đang tải sản phẩm...</div>
        </section>

    </main>

</div>



<div id="productPromotionModal" class="admin-modal" hidden>
    <div class="admin-modal-overlay"></div>
    <div class="admin-modal-box">
        <div class="admin-modal-header">
            <div>
                <p class="panel-label">ƯU ĐÃI SẢN PHẨM</p>
                <h2 id="productPromotionModalTitle">Thêm ưu đãi sản phẩm</h2>
            </div>
            <button type="button" id="closeProductPromotionModal" class="admin-modal-close">×</button>
        </div>
        <form id="productPromotionForm">
            <input type="hidden" id="productPromotionId">
            <div class="admin-form-grid">
                <div class="admin-form-group full">
                    <label>Sản phẩm *</label>
                    <select id="productPromotionProductId" required></select>
                </div>
                <div class="admin-form-group">
                    <label>Loại ưu đãi *</label>
                    <select id="productPromotionType" required>
                        <option value="NEW_PRODUCT">Sản phẩm mới - 5%</option>
                        <option value="BESTSELLER">Bestseller - 10%</option>
                        <option value="SALE">Sale - 15%</option>
                        <option value="BLACK_FRIDAY">Black Friday - 30%</option>
                    </select>
                </div>
                <div class="admin-form-group">
                    <label>Phần trăm giảm (%)</label>
                    <input type="number" id="productPromotionDiscount" min="5" max="30" step="1" value="5" required>
                </div>
                <div class="admin-form-group">
                    <label>Bắt đầu *</label>
                    <input type="datetime-local" id="productPromotionStartAt" required>
                </div>
                <div class="admin-form-group">
                    <label>Kết thúc *</label>
                    <input type="datetime-local" id="productPromotionEndAt" required>
                </div>
                <div class="admin-form-group">
                    <label>Trạng thái</label>
                    <select id="productPromotionStatus">
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="INACTIVE">Đã tắt</option>
                    </select>
                </div>
            </div>
            <div class="admin-modal-actions">
                <button type="button" id="cancelProductPromotionButton" class="admin-secondary-button">Hủy</button>
                <button type="submit" id="saveProductPromotionButton" class="admin-primary-button">Lưu ưu đãi</button>
            </div>
        </form>
    </div>
</div>

<div
    id="promotionModal"
    class="admin-modal"
    hidden
>

    <div class="admin-modal-overlay"></div>

    <div class="admin-modal-box">

        <div class="admin-modal-header">

            <div>

                <p class="panel-label">
                    PROMOTION
                </p>

                <h2 id="promotionModalTitle">
                    Thêm khuyến mãi
                </h2>

            </div>

            <button
                type="button"
                id="closePromotionModal"
                class="admin-modal-close"
            >
                ×
            </button>

        </div>


        <form id="promotionForm">

            <input
                type="hidden"
                id="promotionId"
            >

            <div class="admin-form-grid">

                <div class="admin-form-group">

                    <label>
                        Mã khuyến mãi *
                    </label>

                    <input
                        type="text"
                        id="promotionCode"
                        maxlength="50"
                        placeholder="WELCOME15"
                        required
                    >

                </div>

                <div class="admin-form-group">

                    <label>
                        Tên khuyến mãi *
                    </label>

                    <input
                        type="text"
                        id="promotionName"
                        maxlength="120"
                        placeholder="Chào mừng khách hàng mới"
                        required
                    >

                </div>

                <div class="admin-form-group full">

                    <label>
                        Mô tả
                    </label>

                    <textarea
                        id="promotionDescription"
                        rows="3"
                        placeholder="Mô tả chương trình khuyến mãi..."
                    ></textarea>

                </div>

                <div class="admin-form-group">

                    <label>
                        Phần trăm giảm (%) *
                    </label>

                    <input
                        type="number"
                        id="promotionDiscountPercent"
                        min="0"
                        max="100"
                        step="0.01"
                        required
                    >

                </div>

                <div class="admin-form-group">

                    <label>
                        Đơn tối thiểu (đ)
                    </label>

                    <input
                        type="number"
                        id="promotionMinOrderValue"
                        min="0"
                        step="1000"
                    >

                </div>

                <div class="admin-form-group">

                    <label>
                        Giảm tối đa (đ)
                    </label>

                    <input
                        type="number"
                        id="promotionMaxDiscount"
                        min="0"
                        step="1000"
                    >

                </div>

                <div class="admin-form-group">

                    <label>
                        Bắt đầu *
                    </label>

                    <input
                        type="datetime-local"
                        id="promotionStartAt"
                        required
                    >

                </div>

                <div class="admin-form-group">

                    <label>
                        Kết thúc *
                    </label>

                    <input
                        type="datetime-local"
                        id="promotionEndAt"
                        required
                    >

                </div>

            </div>


            <div class="admin-modal-actions">

                <button
                    type="button"
                    id="cancelPromotionButton"
                    class="admin-secondary-button"
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    id="savePromotionButton"
                    class="admin-primary-button"
                >
                    Lưu khuyến mãi
                </button>

            </div>

        </form>

    </div>

</div>
</template>

<script setup>
import '../../styles/pages-admin-promotions.css'
import { useLegacyPage } from '../../composables/useLegacyPage'

useLegacyPage({
  title: "Quản lý khuyến mãi - Admin",
  bodyClass: "admin-mobile-unified",
  scripts: [
    () => import('../../legacy/js/api.js?raw'),
    () => import('../../legacy/js/admin/promotions.js?raw'),
    () => import('../../legacy/js/admin/promotions-compact.js?raw'),
    () => import('../../legacy/js/admin/mobile-unified.js?raw'),
  ],
})
</script>
