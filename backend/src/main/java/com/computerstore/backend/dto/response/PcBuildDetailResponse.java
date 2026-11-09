package com.computerstore.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PcBuildDetailResponse {

    private Long buildId;
    private String buildName;
    private BigDecimal totalPrice;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<PcBuildItemResponse> items;


    public PcBuildDetailResponse(
            Long buildId,
            String buildName,
            BigDecimal totalPrice,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            List<PcBuildItemResponse> items) {

        this.buildId = buildId;
        this.buildName = buildName;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.items = items;
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


    public List<PcBuildItemResponse> getItems() {
        return items;
    }
}