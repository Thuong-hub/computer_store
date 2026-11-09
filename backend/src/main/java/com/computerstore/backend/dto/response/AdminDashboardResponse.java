package com.computerstore.backend.dto.response;

import java.math.BigDecimal;

public class AdminDashboardResponse {

    private long totalProducts;
    private long lowStockProducts;
    private long totalUsers;
    private long totalOrders;
    private long totalUnitsSold;

    private long pendingOrders;
    private long confirmedOrders;
    private long shippingOrders;
    private long completedOrders;
    private long cancelledOrders;

    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private BigDecimal thisMonthRevenue;

    public AdminDashboardResponse(
            long totalProducts,
            long lowStockProducts,
            long totalUsers,
            long totalOrders,
            long totalUnitsSold,
            long pendingOrders,
            long confirmedOrders,
            long shippingOrders,
            long completedOrders,
            long cancelledOrders,
            BigDecimal totalRevenue,
            BigDecimal todayRevenue,
            BigDecimal thisMonthRevenue) {

        this.totalProducts = totalProducts;
        this.lowStockProducts = lowStockProducts;
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.totalUnitsSold = totalUnitsSold;
        this.pendingOrders = pendingOrders;
        this.confirmedOrders = confirmedOrders;
        this.shippingOrders = shippingOrders;
        this.completedOrders = completedOrders;
        this.cancelledOrders = cancelledOrders;
        this.totalRevenue = totalRevenue;
        this.todayRevenue = todayRevenue;
        this.thisMonthRevenue = thisMonthRevenue;
    }


    public long getTotalProducts() {
        return totalProducts;
    }

    public long getLowStockProducts() {
        return lowStockProducts;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public long getTotalUnitsSold() {
        return totalUnitsSold;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public long getConfirmedOrders() {
        return confirmedOrders;
    }

    public long getShippingOrders() {
        return shippingOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public long getCancelledOrders() {
        return cancelledOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public BigDecimal getTodayRevenue() {
        return todayRevenue;
    }

    public BigDecimal getThisMonthRevenue() {
        return thisMonthRevenue;
    }
}