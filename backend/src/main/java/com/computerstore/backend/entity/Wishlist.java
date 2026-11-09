package com.computerstore.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "wishlist",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "unique_user_wishlist_product",
            columnNames = {"user_id", "product_id"}
        )
    }
)
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wishlist_id")
    private Long wishlistId;


    @Column(name = "user_id", nullable = false)
    private Long userId;


    @Column(name = "product_id", nullable = false)
    private Long productId;


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


    public Long getWishlistId() {
        return wishlistId;
    }

    public void setWishlistId(Long wishlistId) {
        this.wishlistId = wishlistId;
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


    public User getUser() {
        return user;
    }


    public Product getProduct() {
        return product;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}