package com.computerstore.backend.dto.response;

import java.math.BigDecimal;

public class TopSellingProductResponse {

    private Long productId;

    private String productName;

    private String imageUrl;

    private BigDecimal price;

    private Long totalSold;


    public TopSellingProductResponse(
            Long productId,
            String productName,
            String imageUrl,
            BigDecimal price,
            Long totalSold) {

        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.price = price;
        this.totalSold = totalSold;
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


    public Long getTotalSold() {
        return totalSold;
    }
}