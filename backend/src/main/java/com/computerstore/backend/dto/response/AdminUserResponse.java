package com.computerstore.backend.dto.response;

import java.time.LocalDateTime;
import java.math.BigDecimal;

public class AdminUserResponse {

    private Long userId;

    private String customerCode;

    private String username;

    private String email;

    private String fullName;

    private String phone;

    private String address;

    private String role;

    private String status;

    private LocalDateTime createdAt;
    private boolean registrationReleased;
    private String customerTier;
    private long completedPaidOrders;
    private BigDecimal qualifiedSpending;

    public String getCustomerTier() { return customerTier; }
    public void setCustomerTier(String value) { customerTier = value; }
    public long getCompletedPaidOrders() { return completedPaidOrders; }
    public void setCompletedPaidOrders(long value) { completedPaidOrders = value; }
    public BigDecimal getQualifiedSpending() { return qualifiedSpending; }
    public void setQualifiedSpending(BigDecimal value) { qualifiedSpending = value; }


    public AdminUserResponse(
            Long userId,
            String customerCode,
            String username,
            String email,
            String fullName,
            String phone,
            String address,
            String role,
            String status,
            LocalDateTime createdAt,
            boolean registrationReleased) {

        this.userId = userId;
        this.customerCode = customerCode;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.address = address;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
        this.registrationReleased = registrationReleased;
    }


    public Long getUserId() {
        return userId;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public boolean isRegistrationReleased() { return registrationReleased; }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}