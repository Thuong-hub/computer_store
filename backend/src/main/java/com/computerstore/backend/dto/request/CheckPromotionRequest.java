package com.computerstore.backend.dto.request;

import java.math.BigDecimal;

public class CheckPromotionRequest {

    private String code;

    private BigDecimal orderAmount;


    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }


    public BigDecimal getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(BigDecimal orderAmount) {
        this.orderAmount = orderAmount;
    }
}