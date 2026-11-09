package com.computerstore.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "customer_email_history",
        uniqueConstraints = @UniqueConstraint(name = "uq_customer_email_history",
                columnNames = {"email_hash", "user_id"}))
public class CustomerEmailHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "email_hash", nullable = false, length = 64)
    private String emailHash;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long value) { userId = value; }
    public String getEmailHash() { return emailHash; }
    public void setEmailHash(String value) { emailHash = value; }
}
