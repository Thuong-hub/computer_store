package com.computerstore.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.time.LocalDateTime;

import com.computerstore.backend.entity.Order;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    
    List<Order> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

   
    List<Order> findAllByOrderByCreatedAtDesc();


   
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.orderId = :id")
    Optional<Order> findByIdLocked(@Param("id") Long id);

    List<Order> findByCreatedAtGreaterThanEqualAndCreatedAtLessThanOrderByCreatedAtDesc(
        LocalDateTime start, LocalDateTime end);

    long countByStatus(String status);

    @Query(value = "SELECT COUNT(*) FROM orders o JOIN payments p ON p.order_id = o.order_id "
            + "WHERE o.user_id = :userId AND o.status = 'COMPLETED' "
            + "AND p.payment_status = 'PAID'", nativeQuery = true)
    long countQualifiedVipOrders(@Param("userId") Long userId);

    @Query(value = "SELECT COALESCE(SUM(o.total_amount), 0) FROM orders o "
            + "JOIN payments p ON p.order_id = o.order_id "
            + "WHERE o.user_id = :userId AND o.status = 'COMPLETED' "
            + "AND p.payment_status = 'PAID'", nativeQuery = true)
    java.math.BigDecimal sumQualifiedVipSpending(@Param("userId") Long userId);

    long countByUserIdInAndStatusNot(List<Long> userIds, String status);


    boolean existsByUserIdAndStatusIn(Long userId, List<String> statuses);

    @Query(value = "SELECT COUNT(*) FROM orders o LEFT JOIN payments p ON p.order_id = o.order_id "
            + "WHERE o.user_id = :userId AND "
            + "(o.status = 'COMPLETED' OR p.payment_status = 'PAID')", nativeQuery = true)
    long countPaidOrCompletedByUserId(@Param("userId") Long userId);

}