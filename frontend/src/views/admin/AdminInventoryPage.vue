<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/admin/inventory.html -->
<template>

    <div class="admin-layout">
        <aside class="admin-sidebar" id="inventorySidebar">
            <div class="admin-logo">COMPUTER<span>STORE</span>
                <small>ADMIN</small>
            </div>

            <button
                type="button"
                class="inventory-mobile-menu-toggle"
                id="inventoryMenuToggle"
                aria-label="Mở menu quản trị"
                aria-controls="inventoryNavigation"
                aria-expanded="false"
            >
                <span class="inventory-menu-icon" aria-hidden="true">☰</span>
                <span>Menu</span>
            </button>

            <nav class="admin-menu" id="inventoryNavigation" aria-label="Điều hướng quản trị">
                <a href="/pages/admin/index.html">
                    <span class="menu-icon">◫</span>
                    Dashboard
                </a>
                <a href="/pages/admin/products.html">
                    <span class="menu-icon">▣</span>
                    Sản phẩm
                </a>
            <a href="/pages/admin/promotions.html"><span class="menu-icon">%</span> Khuyến mãi</a>
                <a href="/pages/admin/inventory.html">
                    <span class="menu-icon">▦</span>
                    Tổng kho
                </a>
                <a href="/pages/admin/reports.html">
                    <span class="menu-icon">▥</span>
                    Báo cáo doanh thu
                </a>
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
                <a href="/" class="back-store-link">← Về cửa hàng</a>
                <button type="button" id="adminLogoutButton" class="admin-logout-button">
                    Đăng xuất
                </button>
            </div>
        </aside>

        <main class="admin-main">
            <header class="admin-header">
                <div>
                    <p class="admin-page-label">ADMIN PANEL</p>
                    <h1>Quản lý tổng kho</h1>
                    <p>Theo dõi số lượng hiện tại, nhập xuất và nhật ký kho.</p>
                </div>
                <div class="admin-profile">
                    <div class="admin-avatar">A</div>
                    <div>
                        <strong id="adminName">Admin</strong>
                        <span>Quản trị viên</span>
                    </div>
                </div>
            </header>

            <div id="pageMessage" class="enh-message" role="status"></div>

            <section class="enh-stats" id="inventoryStats">
                <article>
                    <span>Tổng loại sản phẩm</span>
                    <strong id="invProducts">—</strong>
                </article>
                <article>
                    <span>Tổng đơn vị tồn</span>
                    <strong id="invUnits">—</strong>
                </article>
                <article>
                    <span>Giá trị theo giá bán</span>
                    <strong id="invValue">—</strong>
                </article>
                <article>
                    <span>Loại sắp hết (≤ 5)</span>
                    <strong id="invLow">—</strong>
                </article>
            </section>

            <section id="inventoryAdjustPanel" class="admin-panel enh-inventory-editor" hidden>
                <div class="enh-heading">
                    <div>
                        <p class="panel-label">CẬP NHẬT TỒN KHO</p>
                        <h2>Nhập / xuất sản phẩm</h2>
                        <p id="adjustProduct" class="enh-editor-product"></p>
                    </div>
                    <button type="button" id="adjustClose" class="enh-btn secondary">Đóng</button>
                </div>
                <p class="enh-editor-stock">
                    Số lượng tồn hiện tại:
                    <strong id="adjustCurrentStock">0</strong>
                </p>
                <form id="adjustForm" class="enh-editor-form">
                    <div class="enh-editor-fields">
                        <label>
                            Thao tác
                            <select id="adjustMode" required>
                                <option value="IN">Nhập kho (+)</option>
                                <option value="OUT">Xuất kho (-)</option>
                                <option value="SET">Đặt lại số tồn chính xác</option>
                            </select>
                        </label>
                        <label>
                            Số lượng
                            <input
                                type="number"
                                id="adjustQty"
                                min="0"
                                max="2147483647"
                                step="1"
                                inputmode="numeric"
                                placeholder="Nhập số lượng"
                                required
                            >
                        </label>
                    </div>
                    <p id="adjustPreview" class="enh-stock-preview" aria-live="polite">
                        Nhập số lượng để xem tồn kho dự kiến.
                    </p>
                    <label>
                        Lý do nhập / xuất
                        <textarea
                            id="adjustNote"
                            rows="3"
                            maxlength="255"
                            required
                            placeholder="Ví dụ: Nhập hàng từ nhà cung cấp, hàng lỗi cần xuất kho..."
                        ></textarea>
                    </label>
                    <p class="enh-editor-alert" id="adjustError" role="alert" aria-live="assertive"></p>
                    <div class="enh-editor-actions">
                        <button type="submit" id="adjustSubmit" class="enh-btn">Lưu kho</button>
                    </div>
                </form>
            </section>

            <section class="admin-panel inventory-products-panel">
                <div class="enh-heading">
                    <div>
                        <p class="panel-label">TỒN KHO</p>
                        <h2>Danh sách sản phẩm</h2>
                    </div>
                    <div class="enh-controls">
                        <input type="search" id="invSearch" placeholder="Tên sản phẩm..." aria-label="Tìm tên sản phẩm">
                        <select id="invFilter" aria-label="Lọc tình trạng tồn kho">
                            <option value="all">Tất cả</option>
                            <option value="low">Sắp hết (≤ 5)</option>
                            <option value="empty">Hết hàng</option>
                        </select>
                    </div>
                </div>
                <div class="enh-table-wrap inventory-products-wrap">
                    <table class="enh-table inventory-products-table">
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Sản phẩm</th>
                                <th>Giá bán</th>
                                <th>Tồn kho</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody id="invBody">
                            <tr class="enh-empty-row">
                                <td colspan="6">Đang tải dữ liệu...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section class="admin-panel inventory-history-panel">
                <div class="enh-heading">
                    <div>
                        <p class="panel-label">NHẬT KÝ</p>
                        <h2>Lịch sử biến động kho</h2>
                    </div>
                    <button type="button" class="enh-btn secondary" id="invReload">Làm mới</button>
                </div>
                <p class="enh-note">
                    Lịch sử ghi nhận các biến động mới kể từ khi cài bản cập nhật.
                    Dữ liệu tồn kho cũ được giữ nguyên.
                </p>
                <p id="inventoryHistoryError" class="enh-editor-alert" role="status"></p>
                <div class="enh-table-wrap inventory-history-wrap">
                    <table class="enh-table inventory-history-table">
                        <thead>
                            <tr>
                                <th>Thời điểm</th>
                                <th>Mã SP</th>
                                <th>Loại</th>
                                <th>Chênh lệch</th>
                                <th>Trước → Sau</th>
                                <th>Đơn</th>
                                <th>Người thực hiện / Lý do</th>
                            </tr>
                        </thead>
                        <tbody id="invHistory"></tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import '../../styles/pages-admin-inventory.css'
import { useLegacyPage } from '../../composables/useLegacyPage'

useLegacyPage({
  title: "Quản lý tổng kho - ComputerStore",
  bodyClass: "inventory-page",
  scripts: [
    () => import('../../legacy/js/api.js?raw'),
    () => import('../../legacy/js/admin/enhancements.js?raw'),
    () => import('../../legacy/js/admin/inventory.js?raw'),
  ],
})
</script>
