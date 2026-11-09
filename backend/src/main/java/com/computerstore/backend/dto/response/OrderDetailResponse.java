package com.computerstore.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDetailResponse {

    private Long orderId;

    private String recipientName;
    private String phone;
    private String shippingAddress;

    private BigDecimal originalAmount;
    private BigDecimal discountAmount;
    private String promotionCode;
    private BigDecimal totalAmount;

    private String status;
    private String note;

    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;


    public OrderDetailResponse() {
    }


        public OrderDetailResponse(
            Long orderId,
            String recipientName,
            String phone,
            String shippingAddress,
            BigDecimal originalAmount,
            BigDecimal discountAmount,
            String promotionCode,
            BigDecimal totalAmount,
            String status,
            String note,
            LocalDateTime createdAt,
            List<OrderItemResponse> items) {

        this.orderId = orderId;
        this.recipientName = recipientName;
        this.phone = phone;
        this.shippingAddress = shippingAddress;

        this.originalAmount = originalAmount;
        this.discountAmount = discountAmount;
        this.promotionCode = promotionCode;

        this.totalAmount = totalAmount;
        this.status = status;
        this.note = note;
        this.createdAt = createdAt;
        this.items = items;
    }


    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }


    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }


    public BigDecimal getOriginalAmount() {
    return originalAmount;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public String getPromotionCode() {
        return promotionCode;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
}