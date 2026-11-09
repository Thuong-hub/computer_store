package com.computerstore.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(
        name = "username",
        nullable = false,
        unique = true,
        length = 50
    )
    private String username;

    @Column(
        name = "email",
        nullable = false,
        unique = true,
        length = 100
    )
    private String email;

    @Column(
        name = "password",
        nullable = false,
        length = 255
    )
    private String password;

    @Column(name = "customer_code", unique = true, length = 20)
    private String customerCode;

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean value) {
        emailVerified = value;
    }

    @Column(name = "password_version", nullable = false)
    private Integer passwordVersion = 0;

    public Integer getPasswordVersion() { return passwordVersion; }
    public void setPasswordVersion(Integer version) { this.passwordVersion = version; }

    @Column(name = "registration_released", nullable = false)
    private Boolean registrationReleased = false;

    @Column(name = "released_username", length = 50)
    private String releasedUsername;

    @Column(name = "released_email", length = 100)
    private String releasedEmail;

    @Column(name = "customer_tier", nullable = false, length = 20)
    private String customerTier = "NORMAL";

    @Column(name = "vip_since")
    private LocalDateTime vipSince;

    public String getCustomerTier() { return customerTier; }
    public void setCustomerTier(String customerTier) { this.customerTier = customerTier; }
    public LocalDateTime getVipSince() { return vipSince; }
    public void setVipSince(LocalDateTime vipSince) { this.vipSince = vipSince; }

    @Column(name = "first_time_eligible", nullable = false)
    private Boolean firstTimeEligible = true;

    public Boolean getRegistrationReleased() { return registrationReleased; }
    public void setRegistrationReleased(Boolean value) { registrationReleased = value; }
    public String getReleasedUsername() { return releasedUsername; }
    public void setReleasedUsername(String value) { releasedUsername = value; }
    public String getReleasedEmail() { return releasedEmail; }
    public void setReleasedEmail(String value) { releasedEmail = value; }
    public Boolean getFirstTimeEligible() { return firstTimeEligible; }
    public void setFirstTimeEligible(Boolean value) { firstTimeEligible = value; }

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(
        name = "role",
        nullable = false,
        length = 20
    )
    private String role = "USER";

    @Column(
        name = "status",
        nullable = false,
        length = 20
    )
    private String status = "ACTIVE";

    @Column(
        name = "created_at",
        insertable = false,
        updatable = false
    )
    private LocalDateTime createdAt;


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}