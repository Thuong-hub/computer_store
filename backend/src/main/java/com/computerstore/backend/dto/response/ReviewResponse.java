package com.computerstore.backend.dto.response;

import java.time.LocalDateTime;

public class ReviewResponse {

    private Long reviewId;

    private Long userId;

    private String username;

    private Integer rating;

    private String comment;

    private LocalDateTime createdAt;


    public ReviewResponse() {
    }


    public ReviewResponse(
            Long reviewId,
            Long userId,
            String username,
            Integer rating,
            String comment,
            LocalDateTime createdAt) {

        this.reviewId = reviewId;
        this.userId = userId;
        this.username = username;
        this.rating = rating;
        this.comment = comment;
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


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}