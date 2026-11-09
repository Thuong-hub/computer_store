package com.computerstore.backend.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;

import com.computerstore.backend.entity.Payment;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(Long orderId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Payment p WHERE p.orderId = :orderId")
    Optional<Payment> findByOrderIdForUpdate(@Param("orderId") Long orderId);

    Optional<Payment> findByTransactionCode(String transactionCode);

    List<Payment> findByOrderIdIn(List<Long> orderIds);

    List<Payment> findByPaymentStatusAndPaidAtGreaterThanEqualAndPaidAtLessThan(
        String status, LocalDateTime start, LocalDateTime end);

    boolean existsByOrderId(Long orderId);


    
    @Query("""
        SELECT SUM(p.amount)
        FROM Payment p
        WHERE p.paymentStatus = 'PAID'
    """)
    BigDecimal sumPaidAmount();


    
    @Query("""
        SELECT SUM(p.amount)
        FROM Payment p
        WHERE p.paymentStatus = 'PAID'
          AND p.paidAt >= :startTime
          AND p.paidAt < :endTime
    """)
    BigDecimal sumPaidAmountBetween(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}