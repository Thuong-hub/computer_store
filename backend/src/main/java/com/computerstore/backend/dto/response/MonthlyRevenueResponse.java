package com.computerstore.backend.dto.response;

import java.math.BigDecimal;

public class MonthlyRevenueResponse {

    private int month;
    private int year;
    private BigDecimal revenue;


    public MonthlyRevenueResponse(
            int month,
            int year,
            BigDecimal revenue) {

        this.month = month;
        this.year = year;
        this.revenue = revenue;
    }


    public int getMonth() {
        return month;
    }

    public int getYear() {
        return year;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }
}