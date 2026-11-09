package com.computerstore.backend.dto.response;

import java.time.LocalDateTime;

public class AdminReviewResponse {

    private Long reviewId;

    private Long userId;

    private String username;

    private Long productId;

    private String productName;

    private Integer rating;

    private String comment;

    private String status;

    private LocalDateTime createdAt;


    public AdminReviewResponse() {
    }


    public AdminReviewResponse(
            Long reviewId,
            Long userId,
            String username,
            Long productId,
            String productName,
            Integer rating,
            String comment,
            String status,
            LocalDateTime createdAt) {

        this.reviewId = reviewId;
        this.userId = userId;
        this.username = username;
        this.productId = productId;
        this.productName = productName;
        this.rating = rating;
        this.comment = comment;
        this.status = status;
        this.createdAt = createdAt;
    }


    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }


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


    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }


    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}