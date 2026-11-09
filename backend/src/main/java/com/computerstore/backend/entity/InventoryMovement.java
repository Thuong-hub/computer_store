package com.computerstore.backend.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "inventory_movements")
public class InventoryMovement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "product_id", nullable = false)
    private Long productId;
    @Column(name = "order_id")
    private Long orderId;
    @Column(name = "quantity_delta", nullable = false)
    private Integer quantityDelta;
    @Column(name = "quantity_before", nullable = false)
    private Integer quantityBefore;
    @Column(name = "quantity_after", nullable = false)
    private Integer quantityAfter;
    @Column(name = "action", nullable = false)
    private String action;
    @Column(name = "actor")
    private String actor;
    @Column(name = "note")
    private String note;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long value) { productId = value; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long value) { orderId = value; }
    public Integer getQuantityDelta() { return quantityDelta; }
    public void setQuantityDelta(Integer value) { quantityDelta = value; }
    public Integer getQuantityBefore() { return quantityBefore; }
    public void setQuantityBefore(Integer value) { quantityBefore = value; }
    public Integer getQuantityAfter() { return quantityAfter; }
    public void setQuantityAfter(Integer value) { quantityAfter = value; }
    public String getAction() { return action; }
    public void setAction(String value) { action = value; }
    public String getActor() { return actor; }
    public void setActor(String value) { actor = value; }
    public String getNote() { return note; }
    public void setNote(String value) { note = value; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
