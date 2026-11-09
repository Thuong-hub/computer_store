package com.computerstore.backend.dto.response;

import java.math.BigDecimal;

public class LowStockProductResponse {

    private Long productId;

    private String productName;

    private String imageUrl;

    private BigDecimal price;

    private Integer stockQuantity;


    public LowStockProductResponse(
            Long productId,
            String productName,
            String imageUrl,
            BigDecimal price,
            Integer stockQuantity) {

        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }


    public Long getProductId() {
        return productId;
    }


    public String getProductName() {
        return productName;
    }


    public String getImageUrl() {
        return imageUrl;
    }


    public BigDecimal getPrice() {
        return price;
    }


    public Integer getStockQuantity() {
        return stockQuantity;
    }
}