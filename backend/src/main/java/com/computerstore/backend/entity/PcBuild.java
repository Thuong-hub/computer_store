package com.computerstore.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pc_builds")
public class PcBuild {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "build_id")
    private Long buildId;


    @Column(
        name = "user_id",
        nullable = false
    )
    private Long userId;


    @Column(
        name = "build_name",
        nullable = false,
        length = 100
    )
    private String buildName;


    @Column(
        name = "total_price",
        nullable = false
    )
    private BigDecimal totalPrice =
            BigDecimal.ZERO;


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


    public Long getBuildId() {
        return buildId;
    }


    public void setBuildId(Long buildId) {
        this.buildId = buildId;
    }


    public Long getUserId() {
        return userId;
    }


    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public String getBuildName() {
        return buildName;
    }


    public void setBuildName(String buildName) {
        this.buildName = buildName;
    }


    public BigDecimal getTotalPrice() {
        return totalPrice;
    }


    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}