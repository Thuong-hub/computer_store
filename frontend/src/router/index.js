import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'

// URL giữ NGUYÊN như bản HTML tĩnh (/pages/login.html, /pages/admin/orders.html ...)
// nên mọi link <a href>, window.location.href và redirect của backend vẫn chạy như cũ.
const routes = [
  { path: '/', component: () => import('../views/HomePage.vue') },
  { path: '/index.html', component: () => import('../views/HomePage.vue') },
  { path: '/pages/cart.html', component: () => import('../views/CartPage.vue') },
  { path: '/pages/checkout.html', component: () => import('../views/CheckoutPage.vue') },
  { path: '/pages/forgot-password.html', component: () => import('../views/ForgotPasswordPage.vue') },
  { path: '/pages/invoice.html', component: () => import('../views/InvoicePage.vue') },
  { path: '/pages/login.html', component: () => import('../views/LoginPage.vue') },
  { path: '/pages/order-detail.html', component: () => import('../views/OrderDetailPage.vue') },
  { path: '/pages/orders.html', component: () => import('../views/OrdersPage.vue') },
  { path: '/pages/pc-builder.html', component: () => import('../views/PcBuilderPage.vue') },
  { path: '/pages/product-detail.html', component: () => import('../views/ProductDetailPage.vue') },
  { path: '/pages/products.html', component: () => import('../views/ProductsPage.vue') },
  { path: '/pages/profile.html', component: () => import('../views/ProfilePage.vue') },
  { path: '/pages/register.html', component: () => import('../views/RegisterPage.vue') },
  { path: '/pages/reset-password.html', component: () => import('../views/ResetPasswordPage.vue') },
  { path: '/pages/verify-email.html', component: () => import('../views/VerifyEmailPage.vue') },
  { path: '/pages/wishlist.html', component: () => import('../views/WishlistPage.vue') },
  { path: '/pages/admin/index.html', component: () => import('../views/admin/AdminDashboardPage.vue') },
  { path: '/pages/admin/inventory.html', component: () => import('../views/admin/AdminInventoryPage.vue') },
  { path: '/pages/admin/order-detail.html', component: () => import('../views/admin/AdminOrderDetailPage.vue') },
  { path: '/pages/admin/orders.html', component: () => import('../views/admin/AdminOrdersPage.vue') },
  { path: '/pages/admin/products.html', component: () => import('../views/admin/AdminProductsPage.vue') },
  { path: '/pages/admin/promotions.html', component: () => import('../views/admin/AdminPromotionsPage.vue') },
  { path: '/pages/admin/reports.html', component: () => import('../views/admin/AdminReportsPage.vue') },
  { path: '/pages/admin/reviews.html', component: () => import('../views/admin/AdminReviewsPage.vue') },
  { path: '/pages/admin/sales.html', redirect: (to) => ({ path: '/pages/admin/promotions.html', query: to.query }) },
  { path: '/pages/admin/support.html', component: () => import('../views/admin/AdminSupportPage.vue') },
  { path: '/pages/admin/users.html', component: () => import('../views/admin/AdminUsersPage.vue') },
  { path: '/pages/admin.html', redirect: (to) => ({ path: '/pages/admin/index.html', query: to.query }) }, // giữ tương thích URL cũ (trùng LegacyAdminPageRedirectController)
  { path: '/pages/admin-products.html', redirect: (to) => ({ path: '/pages/admin/products.html', query: to.query }) }, // giữ tương thích URL cũ (trùng LegacyAdminPageRedirectController)
  { path: '/pages/admin-inventory.html', redirect: (to) => ({ path: '/pages/admin/inventory.html', query: to.query }) }, // giữ tương thích URL cũ (trùng LegacyAdminPageRedirectController)
  { path: '/pages/admin-orders.html', redirect: (to) => ({ path: '/pages/admin/orders.html', query: to.query }) }, // giữ tương thích URL cũ (trùng LegacyAdminPageRedirectController)
  { path: '/pages/admin-order-detail.html', redirect: (to) => ({ path: '/pages/admin/order-detail.html', query: to.query }) }, // giữ tương thích URL cũ (trùng LegacyAdminPageRedirectController)
  { path: '/pages/admin-users.html', redirect: (to) => ({ path: '/pages/admin/users.html', query: to.query }) }, // giữ tương thích URL cũ (trùng LegacyAdminPageRedirectController)
  { path: '/pages/admin-promotions.html', redirect: (to) => ({ path: '/pages/admin/promotions.html', query: to.query }) }, // giữ tương thích URL cũ (trùng LegacyAdminPageRedirectController)
  { path: '/pages/admin-reports.html', redirect: (to) => ({ path: '/pages/admin/reports.html', query: to.query }) }, // giữ tương thích URL cũ (trùng LegacyAdminPageRedirectController)
  { path: '/pages/admin-reviews.html', redirect: (to) => ({ path: '/pages/admin/reviews.html', query: to.query }) }, // giữ tương thích URL cũ (trùng LegacyAdminPageRedirectController)
  { path: '/pages/admin-sales.html', redirect: (to) => ({ path: '/pages/admin/sales.html', query: to.query }) }, // giữ tương thích URL cũ (trùng LegacyAdminPageRedirectController)
  { path: '/pages/admin-support.html', redirect: (to) => ({ path: '/pages/admin/support.html', query: to.query }) }, // giữ tương thích URL cũ (trùng LegacyAdminPageRedirectController)
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Các trang dùng script cũ (biến global, DOMContentLoaded) chỉ được khởi tạo 1 lần cho mỗi lần tải trang.
// Vì vậy mọi điều hướng SAU lần vào đầu tiên được thực hiện bằng tải lại trang thật,
// đúng hành vi của bản HTML nhiều trang trước đây.
router.beforeEach((to, from) => {
  if (from !== START_LOCATION && to.fullPath !== from.fullPath) {
    window.location.assign(to.fullPath)
    return false
  }
})

export default router
