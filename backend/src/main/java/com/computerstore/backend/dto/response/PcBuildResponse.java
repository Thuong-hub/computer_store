package com.computerstore.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PcBuildResponse {

    private Long buildId;

    private String buildName;

    private BigDecimal totalPrice;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public PcBuildResponse(
            Long buildId,
            String buildName,
            BigDecimal totalPrice,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.buildId = buildId;
        this.buildName = buildName;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    public Long getBuildId() {
        return buildId;
    }


    public String getBuildName() {
        return buildName;
    }


    public BigDecimal getTotalPrice() {
        return totalPrice;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}