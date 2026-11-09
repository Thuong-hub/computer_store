package com.computerstore.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "reviews",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "unique_user_product_review",
            columnNames = {"user_id", "product_id"}
        )
    }
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;


    @Column(name = "user_id", nullable = false)
    private Long userId;


    @Column(name = "product_id", nullable = false)
    private Long productId;


    @Column(name = "rating", nullable = false)
    private Integer rating;


    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;


    @Column(
        name = "status",
        nullable = false,
        length = 20
    )
    private String status = "ACTIVE";


    @ManyToOne
    @JoinColumn(
        name = "user_id",
        insertable = false,
        updatable = false
    )
    private User user;


    @ManyToOne
    @JoinColumn(
        name = "product_id",
        insertable = false,
        updatable = false
    )
    private Product product;


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


    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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


    public User getUser() {
        return user;
    }


    public Product getProduct() {
        return product;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}