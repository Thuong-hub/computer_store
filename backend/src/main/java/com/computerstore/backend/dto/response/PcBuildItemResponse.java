package com.computerstore.backend.dto.response;

import java.math.BigDecimal;

public class PcBuildItemResponse {

    private Long buildItemId;

    private Long productId;

    private String productName;

    private String categoryName;

    private String imageUrl;

    private BigDecimal price;

    private Integer quantity;

    private BigDecimal subtotal;


    public PcBuildItemResponse(
            Long buildItemId,
            Long productId,
            String productName,
            String categoryName,
            String imageUrl,
            BigDecimal price,
            Integer quantity,
            BigDecimal subtotal) {

        this.buildItemId = buildItemId;
        this.productId = productId;
        this.productName = productName;
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }


    public Long getBuildItemId() {
        return buildItemId;
    }


    public Long getProductId() {
        return productId;
    }


    public String getProductName() {
        return productName;
    }


    public String getCategoryName() {
        return categoryName;
    }


    public String getImageUrl() {
        return imageUrl;
    }


    public BigDecimal getPrice() {
        return price;
    }


    public Integer getQuantity() {
        return quantity;
    }


    public BigDecimal getSubtotal() {
        return subtotal;
    }
}