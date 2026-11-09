

const API_BASE_URL = "";

function getToken() {
    return localStorage.getItem("token");
}

async function apiRequest(url, options = {}) {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {

        headers["Authorization"] =
            `Bearer ${token}`;
    }

    try {

        const response = await fetch(
            API_BASE_URL + url,
            {
                ...options,
                headers
            }
        );

        if (response.status === 204) {
            return null;
        }

        let data = null;

        try {

            data = await response.json();

        } catch (error) {

            data = null;
        }

        if (!response.ok) {

            const message =
                data?.message ||
                `HTTP Error ${response.status}`;

            throw new Error(message);
        }

        return data;

    } catch (error) {

        console.error(
            "API Error:",
            error
        );

        throw error;
    }
}

async function getProducts() {

    return await apiRequest(
        "/api/products"
    );
}

async function getProductById(productId) {

    return await apiRequest(
        `/api/products/${productId}`
    );
}

async function getProductSpecs(productId) {

    return await apiRequest(
        `/api/products/${productId}/specs`
    );
}

async function login(username, password) {

    return await apiRequest(
        "/api/auth/login",
        {
            method: "POST",

            body: JSON.stringify({
                username,
                password
            })
        }
    );
}

async function register(userData) {

    return await apiRequest(
        "/api/auth/register",
        {
            method: "POST",

            body: JSON.stringify(userData)
        }
    );
}

async function addToCart(productId, quantity) {

    return await apiRequest(
        "/api/cart/items",
        {
            method: "POST",

            body: JSON.stringify({
                productId,
                quantity
            })
        }
    );
}

async function getCartItems() {

    return await apiRequest(
        "/api/cart/items"
    );
}

async function updateCartItem(
    cartItemId,
    quantity
) {

    return await apiRequest(
        `/api/cart/items/${cartItemId}`,
        {
            method: "PUT",

            body: JSON.stringify({
                quantity
            })
        }
    );
}

async function deleteCartItem(
    cartItemId
) {

    return await apiRequest(
        `/api/cart/items/${cartItemId}`,
        {
            method: "DELETE"
        }
    );
}

async function clearCart() {

    return await apiRequest(
        "/api/cart/items",
        {
            method: "DELETE"
        }
    );
}

async function checkoutOrder(orderData) {

    return await apiRequest(
        "/api/orders/checkout",
        {
            method: "POST",

            body: JSON.stringify(
                orderData
            )
        }
    );
}

async function getMyOrders() {

    return await apiRequest(
        "/api/orders/my-orders"
    );
}

async function getOrderDetail(
    orderId
) {

    return await apiRequest(
        `/api/orders/${orderId}`
    );
}

async function deleteAdminUser(userId) {
    return await apiRequest(`/api/admin/users/${userId}`, {
        method: "DELETE"
    });
}

async function restoreAdminUser(userId) {
    return await apiRequest(`/api/admin/users/${userId}/restore`, {
        method: "PUT"
    });
}

async function allowAdminUserRegistration(userId) {
    return await apiRequest(`/api/admin/users/${userId}/allow-registration`, {
        method: "PUT"
    });
}

async function requestEmailChange(newEmail, currentPassword) {
    return await apiRequest("/api/auth/me/email-change/request", {
        method: "POST",
        body: JSON.stringify({newEmail, currentPassword})
    });
}

async function confirmEmailChange(code) {
    return await apiRequest("/api/auth/me/email-change/confirm", {
        method: "POST",
        body: JSON.stringify({code})
    });
}

async function cancelOrder(
    orderId
) {

    return await apiRequest(
        `/api/orders/${orderId}/cancel`,
        {
            method: "PUT"
        }
    );
}

async function getOrderPayment(orderId) {

    return await apiRequest(
        `/api/orders/${orderId}/payment`
    );
}

async function getCurrentUser() {

    return await apiRequest(
        "/api/auth/me"
    );
}

async function updateProfile(profileData) {

    return await apiRequest(
        "/api/auth/me",
        {
            method: "PUT",

            body: JSON.stringify(
                profileData
            )
        }
    );
}

async function changePassword(
    oldPassword,
    newPassword
) {

    return await apiRequest(
        "/api/auth/change-password",
        {
            method: "PUT",

            body: JSON.stringify({
                oldPassword,
                newPassword
            })
        }
    );
}

async function getPcBuilds() {

    return await apiRequest(
        "/api/pc-builds"
    );
}

async function createPcBuild(buildName) {

    return await apiRequest(
        "/api/pc-builds",
        {
            method: "POST",

            body: JSON.stringify({
                buildName
            })
        }
    );
}

async function getPcBuild(buildId) {

    return await apiRequest(
        `/api/pc-builds/${buildId}`
    );
}

async function getPcBuildDetail(buildId) {

    return await apiRequest(
        `/api/pc-builds/${buildId}/detail`
    );
}

async function getPcBuildItems(buildId) {

    return await apiRequest(
        `/api/pc-builds/${buildId}/items`
    );
}

async function addPcBuildItem(
    buildId,
    productId,
    quantity = 1
) {

    return await apiRequest(
        `/api/pc-builds/${buildId}/items`,
        {
            method: "POST",

            body: JSON.stringify({
                productId,
                quantity
            })
        }
    );
}

async function updatePcBuildItem(
    buildId,
    buildItemId,
    quantity
) {

    return await apiRequest(
        `/api/pc-builds/${buildId}/items/${buildItemId}`,
        {
            method: "PUT",

            body: JSON.stringify({
                quantity
            })
        }
    );
}

async function deletePcBuildItem(
    buildId,
    buildItemId
) {

    return await apiRequest(
        `/api/pc-builds/${buildId}/items/${buildItemId}`,
        {
            method: "DELETE"
        }
    );
}

async function updatePcBuild(
    buildId,
    buildName
) {

    return await apiRequest(
        `/api/pc-builds/${buildId}`,
        {
            method: "PUT",

            body: JSON.stringify({
                buildName
            })
        }
    );
}

async function deletePcBuild(buildId) {

    return await apiRequest(
        `/api/pc-builds/${buildId}`,
        {
            method: "DELETE"
        }
    );
}

async function validatePcBuild(buildId) {

    return await apiRequest(
        `/api/pc-builds/${buildId}/validate`
    );
}

async function checkPcBuildCompatibility(
    buildId
) {

    return await apiRequest(
        `/api/pc-builds/${buildId}/compatibility`
    );
}

async function checkPcBuildReady(buildId) {

    return await apiRequest(
        `/api/pc-builds/${buildId}/ready`
    );
}

async function addPcBuildToCart(buildId) {

    return await apiRequest(
        `/api/pc-builds/${buildId}/add-to-cart`,
        {
            method: "POST"
        }
    );
}

async function getAdminDashboard() {

    return await apiRequest(
        "/api/admin/dashboard"
    );
}

async function getAdminMonthlyRevenue(year) {

    return await apiRequest(
        `/api/admin/dashboard/monthly-revenue?year=${year}`
    );
}

async function getAdminTopProducts(limit = 5) {

    return await apiRequest(
        `/api/admin/dashboard/top-products?limit=${limit}`
    );
}

async function getAdminLowStock(threshold = 5) {

    return await apiRequest(
        `/api/admin/dashboard/low-stock?threshold=${threshold}`
    );
}

async function getAdminOrders() {

    return await apiRequest(
        "/api/admin/orders"
    );
}

async function getAdminOrderDetail(orderId) {

    return await apiRequest(
        `/api/admin/orders/${orderId}`
    );
}

async function updateAdminOrderStatus(
    orderId,
    status
) {

    return await apiRequest(
        `/api/admin/orders/${orderId}/status`,
        {
            method: "PUT",

            body: JSON.stringify({
                status
            })
        }
    );
}

async function getAdminOrderPayment(orderId) {

    return await apiRequest(
        `/api/admin/orders/${orderId}/payment`
    );
}

async function markAdminOrderPaid(orderId) {

    return await apiRequest(
        `/api/admin/orders/${orderId}/payment/paid`,
        {
            method: "PUT"
        }
    );
}

async function getAdminUsers() {

    return await apiRequest(
        "/api/admin/users"
    );
}

async function searchAdminUsers(keyword) {

    return await apiRequest(
        `/api/admin/users/search?keyword=${encodeURIComponent(
            keyword || ""
        )}`
    );
}

async function getAdminUserById(userId) {

    return await apiRequest(
        `/api/admin/users/${userId}`
    );
}

async function updateAdminUserStatus(
    userId,
    status
) {

    return await apiRequest(
        `/api/admin/users/${userId}/status`,
        {
            method: "PUT",

            body: JSON.stringify({
                status
            })
        }
    );
}

async function createProduct(product) {

    return await apiRequest(
        "/api/products",
        {
            method: "POST",
            body: JSON.stringify(product)
        }
    );
}

async function updateProduct(
    productId,
    product
) {

    return await apiRequest(
        `/api/products/${productId}`,
        {
            method: "PUT",
            body: JSON.stringify(product)
        }
    );
}

async function deleteProduct(productId) {

    return await apiRequest(
        `/api/products/${productId}`,
        {
            method: "DELETE"
        }
    );
}

async function getCategories() {

    return await apiRequest(
        "/api/categories"
    );
}

async function getBrands() {

    return await apiRequest(
        "/api/brands"
    );
}

async function archiveProduct(productId) {
    return await apiRequest(
        `/api/admin/products/${productId}/archive`,
        {
            method: "DELETE"
        }
    );
}

async function getAdminProducts() {

    return await apiRequest(
        "/api/admin/products"
    );
}

async function restoreProduct(productId) {

    return await apiRequest(
        `/api/admin/products/${productId}/restore`,
        {
            method: "PUT"
        }
    );
}

async function getAdminPromotions() {

    return await apiRequest(
        "/api/admin/promotions"
    );
}

async function createAdminPromotion(data) {

    return await apiRequest(
        "/api/admin/promotions",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );
}

async function updateAdminPromotion(
    promotionId,
    data
) {

    return await apiRequest(
        `/api/admin/promotions/${promotionId}`,
        {
            method: "PUT",
            body: JSON.stringify(data)
        }
    );
}

async function updateAdminPromotionStatus(
    promotionId,
    status
) {

    return await apiRequest(
        `/api/admin/promotions/${promotionId}/status`,
        {
            method: "PUT",

            body: JSON.stringify({
                status: status
            })
        }
    );
}


async function getAdminReviews() {

    return await apiRequest(
        "/api/admin/reviews"
    );
}

async function updateAdminReviewStatus(
    reviewId,
    status
) {

    return await apiRequest(
        `/api/admin/reviews/${reviewId}/status`,
        {
            method: "PUT",

            body: JSON.stringify({
                status
            })
        }
    );
}

async function getInvoicePrintRequest(orderId) {
    return await apiRequest(`/api/orders/${encodeURIComponent(orderId)}/invoice-request`);
}

async function createInvoicePrintRequest(orderId) {
    return await apiRequest(`/api/orders/${encodeURIComponent(orderId)}/invoice-request`, {
        method: "POST"
    });
}

async function getAdminInvoicePrintRequests() {
    return await apiRequest("/api/admin/invoice-requests");
}

async function completeAdminInvoicePrintRequest(requestId) {
    return await apiRequest(`/api/admin/invoice-requests/${encodeURIComponent(requestId)}/complete`, {
        method: "PUT"
    });
}

window.api = {

    request: apiRequest,
    getInvoicePrintRequest,
    createInvoicePrintRequest,
    getAdminInvoicePrintRequests,
    completeAdminInvoicePrintRequest,

    getProducts,
    getProductById,
    getProductSpecs,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getBrands,

    getAdminDashboard,
    getAdminMonthlyRevenue,
    getAdminTopProducts,
    getAdminLowStock,
    getAdminProducts,
    archiveProduct,
    restoreProduct,

    getAdminOrders,
    getAdminOrderDetail,
    updateAdminOrderStatus,
    getAdminOrderPayment,
    markAdminOrderPaid,

    getAdminPromotions,
    createAdminPromotion,
    updateAdminPromotion,
    updateAdminPromotionStatus,

    getAdminReviews,
    updateAdminReviewStatus,

    getAdminUsers,
    searchAdminUsers,
    getAdminUserById,
    updateAdminUserStatus,
    deleteAdminUser,
    restoreAdminUser,
    allowAdminUserRegistration,

    login,
    register,
    getToken,
    getCurrentUser,
    updateProfile,
    changePassword,
    requestEmailChange,
    confirmEmailChange,

    addToCart,
    getCartItems,
    updateCartItem,
    deleteCartItem,
    clearCart,

    checkoutOrder,
    getMyOrders,
    getOrderDetail,
    cancelOrder,
    getOrderPayment,

    getPcBuilds,
    createPcBuild,
    getPcBuild,
    getPcBuildDetail,
    getPcBuildItems,
    addPcBuildItem,
    updatePcBuildItem,
    deletePcBuildItem,
    updatePcBuild,
    deletePcBuild,
    validatePcBuild,
    checkPcBuildCompatibility,
    checkPcBuildReady,
    addPcBuildToCart
};