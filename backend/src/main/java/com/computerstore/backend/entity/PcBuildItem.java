package com.computerstore.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pc_build_items")
public class PcBuildItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "build_item_id")
    private Long buildItemId;


    @Column(
        name = "build_id",
        nullable = false
    )
    private Long buildId;


    @Column(
        name = "product_id",
        nullable = false
    )
    private Long productId;


    @Column(
        name = "quantity",
        nullable = false
    )
    private Integer quantity = 1;


    @Column(
        name = "created_at",
        insertable = false,
        updatable = false
    )
    private LocalDateTime createdAt;


    public Long getBuildItemId() {
        return buildItemId;
    }


    public void setBuildItemId(Long buildItemId) {
        this.buildItemId = buildItemId;
    }


    public Long getBuildId() {
        return buildId;
    }


    public void setBuildId(Long buildId) {
        this.buildId = buildId;
    }


    public Long getProductId() {
        return productId;
    }


    public void setProductId(Long productId) {
        this.productId = productId;
    }


    public Integer getQuantity() {
        return quantity;
    }


    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}