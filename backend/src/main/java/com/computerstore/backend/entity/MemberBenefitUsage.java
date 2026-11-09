package com.computerstore.backend.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "member_benefit_usage",
       uniqueConstraints = @UniqueConstraint(name = "uq_member_benefit_user_type",
       columnNames = {"user_id", "benefit_type"}))
public class MemberBenefitUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "benefit_type", nullable = false, length = 20)
    private String benefitType;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "USED";

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long value) { userId = value; }
    public String getBenefitType() { return benefitType; }
    public void setBenefitType(String value) { benefitType = value; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long value) { orderId = value; }
    public String getStatus() { return status; }
    public void setStatus(String value) { status = value; }
    public LocalDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(LocalDateTime value) { usedAt = value; }
    public LocalDateTime getReleasedAt() { return releasedAt; }
    public void setReleasedAt(LocalDateTime value) { releasedAt = value; }
}
