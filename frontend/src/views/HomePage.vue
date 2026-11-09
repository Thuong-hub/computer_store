<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/index.html -->
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

    <main>
        <section class="hero">
            <div class="container hero-content">
                <div class="hero-text">
                    <p class="hero-small">LINH KIỆN MÁY TÍNH CHÍNH HÃNG</p>
                    <h1>Build PC <span>theo phong cách của bạn</span></h1>
                    <p>CPU, GPU, RAM, Mainboard, SSD và nhiều linh kiện máy tính với giá tốt.</p>
                    <div class="hero-buttons">
                        <a href="/pages/products.html" class="btn btn-primary">Xem sản phẩm</a>
                        <a href="/pages/pc-builder.html" class="btn btn-outline">Build PC ngay</a>
                    </div>
                </div>
                <div class="hero-image">
                    <div class="pc-placeholder">PC <span>GAMING</span></div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <div class="section-header">
                    <div>
                        <p class="section-label">DANH MỤC</p>
                        <h2>Linh kiện máy tính</h2>
                    </div>
                    <a href="/pages/products.html">Xem tất cả →</a>
                </div>
                <div class="category-grid">
                    <a href="/pages/products.html?category=CPU" class="category-card">
                        <div class="category-icon">CPU</div>
                        <h3>CPU</h3>
                        <p>Bộ vi xử lý</p>
                    </a>
                    <a href="/pages/products.html?category=GPU" class="category-card">
                        <div class="category-icon">GPU</div>
                        <h3>Card đồ họa</h3>
                        <p>NVIDIA / AMD</p>
                    </a>
                    <a href="/pages/products.html?category=RAM" class="category-card">
                        <div class="category-icon">RAM</div>
                        <h3>RAM</h3>
                        <p>DDR4 / DDR5</p>
                    </a>
                    <a href="/pages/products.html?category=Mainboard" class="category-card">
                        <div class="category-icon">MB</div>
                        <h3>Mainboard</h3>
                        <p>Bo mạch chủ</p>
                    </a>
                    <a href="/pages/products.html?category=SSD" class="category-card">
                        <div class="category-icon">SSD</div>
                        <h3>SSD</h3>
                        <p>NVMe / SATA</p>
                    </a>
                    <a href="/pages/products.html?category=PSU" class="category-card">
                        <div class="category-icon">PSU</div>
                        <h3>Nguồn</h3>
                        <p>PSU máy tính</p>
                    </a>
                </div>
            </div>
        </section>

        <section class="section featured-section">
            <div class="container">
                <div class="section-header">
                    <div>
                        <p class="section-label">NỔI BẬT</p>
                        <h2>Sản phẩm nổi bật</h2>
                    </div>
                    <a href="/pages/products.html">Xem tất cả →</a>
                </div>
                <div class="product-grid" id="featuredProducts">
                    <p>Đang tải sản phẩm...</p>
                </div>
            </div>
        </section>

        <section class="builder-banner">
            <div class="container builder-content">
                <div>
                    <p class="section-label">PC BUILDER</p>
                    <h2>Tự chọn linh kiện cho bộ PC của bạn</h2>
                    <p>Hệ thống sẽ kiểm tra khả năng tương thích giữa CPU, Mainboard, RAM, GPU, PSU và Case.</p>
                </div>
                <a href="/pages/pc-builder.html" class="btn btn-primary">Bắt đầu Build PC</a>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container footer-grid">
            <div>
                <h3>COMPUTERSTORE</h3>
                <p>Website bán linh kiện máy tính và hỗ trợ xây dựng cấu hình PC.</p>
            </div>
            <div>
                <h4>Sản phẩm</h4>
                <a href="/pages/products.html">Tất cả sản phẩm</a>
                <a href="/pages/pc-builder.html">PC Builder</a>
            </div>
            <div>
                <h4>Tài khoản</h4>
                <a href="/pages/login.html">Đăng nhập</a>
                <a href="/pages/register.html">Đăng ký</a>
                <a href="/pages/orders.html">Đơn hàng</a>
            </div>
            <div>
                <h4>Liên hệ</h4>
                <p>TP. Hồ Chí Minh</p>
                <p>computerstore@gmail.com</p>
            </div>
        </div>
        <div class="footer-bottom">© 2026 Computer Store</div>
    </footer>
</template>

<script setup>
import '../styles/index.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Computer Store",
  bodyClass: "home-page",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/main.js?raw'),
    () => import('../legacy/js/header-auth.js?raw'),
    () => import('../legacy/js/support-chat.js?raw'),
  ],
})
</script>
