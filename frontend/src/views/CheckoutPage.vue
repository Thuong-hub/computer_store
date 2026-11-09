<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/checkout.html -->
<!-- LƯU Ý: bản HTML gốc có lỗi thẻ, trình duyệt tự sửa khi tải trang. Ở đây thêm tường minh để Vue biên dịch được (DOM kết quả không đổi):
       - <div> mở ở dòng 257 không có thẻ đóng; thêm </div> trước </section> (dòng 410)
-->
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




<main class="checkout-page">

    <div class="container">


        

        <div class="checkout-breadcrumb">

            <a href="/">
                Trang chủ
            </a>

            <span>/</span>

            <a href="/pages/cart.html">
                Giỏ hàng
            </a>

            <span>/</span>

            <span>
                Thanh toán
            </span>

        </div>


        

        <div class="checkout-heading">

            <p class="section-label">
                CHECKOUT
            </p>

            <h1>
                Thanh toán
            </h1>

            <p>
                Kiểm tra thông tin giao hàng trước khi đặt hàng.
            </p>

        </div>


        

        <div
            id="checkoutMessage"
            class="checkout-message"
        ></div>


        <div class="checkout-layout">


            

            <section class="checkout-left">


                

                <div class="checkout-card">

                    <div class="checkout-card-title">

                        <span class="checkout-step">
                            1
                        </span>

                        <div>

                            <h2>
                                Thông tin nhận hàng
                            </h2>

                            <p>
                                Thông tin dùng để giao đơn hàng.
                            </p>

                        </div>

                    </div>


                    <div class="checkout-form-grid">


                        

                        <div class="checkout-field">

                            <label for="recipientName">

                                Họ tên người nhận

                                <span>*</span>

                            </label>

                            <input
                                type="text"
                                id="recipientName"
                                placeholder="Nhập họ tên người nhận"
                                autocomplete="name"
                            >

                        </div>


                        

                        <div class="checkout-field">

                            <label for="phone">

                                Số điện thoại

                                <span>*</span>

                            </label>

                            <input
                                type="tel"
                                id="phone"
                                placeholder="Ví dụ: 0901234567"
                                autocomplete="tel"
                            >

                        </div>


                        

                        <div class="checkout-field full-width">

                            <label for="shippingAddress">

                                Địa chỉ giao hàng

                                <span>*</span>

                            </label>

                            <textarea
                                id="shippingAddress"
                                rows="3"
                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                            ></textarea>

                        </div>


                        

                        <div class="checkout-field full-width">

                            <label for="note">
                                Ghi chú
                            </label>

                            <textarea
                                id="note"
                                rows="3"
                                placeholder="Ghi chú cho đơn hàng nếu có..."
                            ></textarea>

                        </div>

                    </div>

                </div>


                

                <div class="checkout-card">

                    <div class="checkout-card-title">

                        <span class="checkout-step">
                            2
                        </span>

                        <div>

                            <h2>
                                Phương thức thanh toán
                            </h2>

                            <p>
                                Chọn cách thanh toán cho đơn hàng.
                            </p>

                        </div>

                    </div>


                    <label class="payment-option">

                        <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            checked
                        >

                        <div class="payment-option-content">

                            <div class="payment-icon">
                                ₫
                            </div>

                            <div>

                                <strong>
                                    Thanh toán khi nhận hàng
                                </strong>

                                <span>
                                    Thanh toán trực tiếp khi nhận sản phẩm.
                                </span>

                            </div>

                        </div>

                    </label>

                    <label class="payment-option">

                        <input
                            type="radio"
                            name="paymentMethod"
                            value="BANK_TRANSFER"
                        >

                        <div class="payment-option-content">

                            <div class="payment-icon">
                                QR
                            </div>

                            <div>

                                <strong>
                                    Chuyển khoản
                                </strong>

                                <span>
                                    Quét mã TPBank QR để chuyển khoản.
                                </span>

                            </div>

                        </div>

                    </label>

                    <div
                        id="bankTransferPanel"
                        class="bank-transfer-panel"
                        hidden
                    >

                        <div class="bank-transfer-after-order">
                            <strong>
                                QR thanh toán sẽ được tạo riêng cho đơn hàng
                            </strong>

                            <p>
                                Sau khi bấm đặt đơn, hệ thống sẽ chuyển bạn đến chi tiết đơn hàng và hiển thị QR TPBank kèm mã thanh toán riêng. SePay sẽ tự động xác nhận khi ngân hàng ghi nhận đúng số tiền.
                            </p>
                        </div>

                    </div>


                    <div class="checkout-card">

                    <div class="checkout-card-title">

                        <span class="checkout-step">
                            3
                        </span>

                        <div>

                            <h2>
                                Mã giảm giá
                            </h2>

                            <p>
                                Nhập mã khuyến mãi nếu bạn có.
                            </p>

                        </div>

                    </div>


                    <div class="promotion-box">

                        <input
                            type="text"
                            id="promotionCode"
                            placeholder="Nhập mã giảm giá"
                        >

                        <button
                            type="button"
                            id="applyPromotionButton"
                        >
                            Áp dụng
                        </button>

                    </div>


                    <p id="memberOfferMessage" class="promotion-message" aria-live="polite"></p>

                    <p
                        id="promotionMessage"
                        class="promotion-message"
                    ></p>

                </div>

            </div></section>


            

            <aside class="checkout-summary">

                <h2>
                    Đơn hàng của bạn
                </h2>


                

                <div
                    id="checkoutItems"
                    class="checkout-items"
                >

                    <div class="checkout-loading">
                        Đang tải sản phẩm...
                    </div>

                </div>


                <div class="checkout-divider"></div>


                <div class="checkout-summary-row">

                    <span>
                        Tổng sản phẩm
                    </span>

                    <strong id="checkoutQuantity">
                        0
                    </strong>

                </div>


                <div class="checkout-summary-row">

                    <span>
                        Tạm tính
                    </span>

                    <strong id="checkoutSubtotal">
                        0 ₫
                    </strong>

                </div>


                <div
                    class="checkout-summary-row"
                    id="discountRow"
                    hidden
                >

                    <span id="checkoutDiscountLabel">
                        Giảm giá
                    </span>

                    <strong
                        id="checkoutDiscount"
                        class="discount-price"
                    >
                        -0 ₫
                    </strong>

                </div>


                <div class="checkout-summary-row">

                    <span>
                        Phí vận chuyển
                    </span>

                    <strong class="shipping-free">
                        Miễn phí
                    </strong>

                </div>


                <div class="checkout-divider"></div>


                <div class="checkout-total">

                    <span>
                        Tổng thanh toán
                    </span>

                    <strong id="checkoutTotal">
                        0 ₫
                    </strong>

                </div>


                <button
                    type="button"
                    id="placeOrderButton"
                    class="place-order-button"
                >
                    Đặt hàng
                </button>


                <a
                    href="/pages/cart.html"
                    class="back-cart-link"
                >
                    ← Quay lại giỏ hàng
                </a>


                <div class="checkout-security">

                    <strong>
                        ✓ Thanh toán an toàn
                    </strong>

                    <p>
                        Thông tin đặt hàng của bạn được bảo mật.
                    </p>

                </div>

            </aside>

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

            <a href="/pages/cart.html">
                Giỏ hàng
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
import '../styles/pages-checkout.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "Thanh toán - Computer Store",
  bodyClass: "store-mobile-page",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/checkout.js?raw'),
    () => import('../legacy/js/header-auth.js?raw'),
    () => import('../legacy/js/support-chat.js?raw'),
  ],
})
</script>
