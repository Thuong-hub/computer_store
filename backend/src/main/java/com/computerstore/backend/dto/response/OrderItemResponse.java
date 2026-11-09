package com.computerstore.backend.dto.response;

import java.math.BigDecimal;

public class OrderItemResponse {

    private Long orderItemId;
    private Long productId;
    private String productName;
    private String imageUrl;

    private Integer quantity;

    
    private BigDecimal price;

    private BigDecimal subtotal;

    private BigDecimal discountAmount = BigDecimal.ZERO;

    private BigDecimal finalSubtotal;

    private String discountLabel;


    public OrderItemResponse() {
    }


    public OrderItemResponse(
            Long orderItemId,
            Long productId,
            String productName,
            String imageUrl,
            Integer quantity,
            BigDecimal price,
            BigDecimal subtotal) {

        this.orderItemId = orderItemId;
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = subtotal;
        this.finalSubtotal = subtotal;
    }


    public OrderItemResponse(
            Long orderItemId,
            Long productId,
            String productName,
            String imageUrl,
            Integer quantity,
            BigDecimal price,
            BigDecimal subtotal,
            BigDecimal discountAmount,
            String discountLabel) {

        this(orderItemId, productId, productName, imageUrl, quantity, price, subtotal);
        this.discountAmount = discountAmount == null ? BigDecimal.ZERO : discountAmount;
        this.discountLabel = discountLabel;
        this.finalSubtotal = subtotal == null
                ? null
                : subtotal.subtract(this.discountAmount);
    }


    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public BigDecimal getFinalSubtotal() {
        return finalSubtotal;
    }

    public String getDiscountLabel() {
        return discountLabel;
    }


    public Long getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }


    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }


    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }


    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }


    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}