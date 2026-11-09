package com.computerstore.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;


    @Column(name = "user_id", nullable = false)
    private Long userId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(
        name = "user_id",
        insertable = false,
        updatable = false
    )
    private User user;


    @Column(
        name = "recipient_name",
        nullable = false,
        length = 100
    )
    private String recipientName;


    @Column(
        name = "phone",
        nullable = false,
        length = 20
    )
    private String phone;


    @Column(
        name = "shipping_address",
        nullable = false,
        length = 255
    )
    private String shippingAddress;

    @Column(
    name = "original_amount",
    nullable = false
    )
    private BigDecimal originalAmount;


    @Column(
        name = "discount_amount",
        nullable = false
    )
    private BigDecimal discountAmount = BigDecimal.ZERO;


    @Column(
        name = "promotion_code",
        length = 50
    )
    private String promotionCode;

    @Column(name = "member_discount_type", length = 20)
    private String memberDiscountType;

    @Column(name = "member_discount_percent")
    private BigDecimal memberDiscountPercent;

    public String getMemberDiscountType() { return memberDiscountType; }
    public void setMemberDiscountType(String value) { memberDiscountType = value; }
    public BigDecimal getMemberDiscountPercent() { return memberDiscountPercent; }
    public void setMemberDiscountPercent(BigDecimal value) { memberDiscountPercent = value; }

    @Column(
        name = "total_amount",
        nullable = false
    )
    private BigDecimal totalAmount;


    @Column(
        name = "status",
        nullable = false,
        length = 30
    )
    private String status = "PENDING";


    @Column(name = "note")
    private String note;


    @Column(
        name = "created_at",
        insertable = false,
        updatable = false
    )
    private LocalDateTime createdAt;


    @Column(
        name = "updated_at",
        insertable = false,
        updatable = false
    )
    private LocalDateTime updatedAt;


    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public User getUser() {
        return user;
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


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public BigDecimal getOriginalAmount() {
    return originalAmount;
    }

    public void setOriginalAmount(BigDecimal originalAmount) {
        this.originalAmount = originalAmount;
    }


    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }


    public String getPromotionCode() {
        return promotionCode;
    }

    public void setPromotionCode(String promotionCode) {
        this.promotionCode = promotionCode;
    }
}