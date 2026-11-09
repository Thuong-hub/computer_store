package com.computerstore.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.computerstore.backend.entity.OrderItem;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);


    @Query("""
        SELECT COUNT(oi) > 0
        FROM OrderItem oi
        JOIN Order o ON oi.orderId = o.orderId
        WHERE o.userId = :userId
          AND oi.productId = :productId
          AND o.status = 'COMPLETED'
    """)
    boolean hasUserPurchasedProduct(
            @Param("userId") Long userId,
            @Param("productId") Long productId
    );



    @Query("""
        SELECT
            oi.productId,
            SUM(oi.quantity)
        FROM OrderItem oi
        JOIN Order o
            ON oi.orderId = o.orderId
        WHERE o.status = 'COMPLETED'
        GROUP BY oi.productId
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<Object[]> findTopSellingProducts(
            Pageable pageable
    );

    
    @Query("""
        SELECT SUM(oi.quantity)
        FROM OrderItem oi
        JOIN Order o
            ON oi.orderId = o.orderId
        WHERE o.status = 'COMPLETED'
    """)
    Long sumTotalUnitsSold();


    @Query("""
        SELECT
            oi.productId,
            SUM(oi.quantity)
        FROM OrderItem oi
        JOIN Order o
            ON oi.orderId = o.orderId
        WHERE o.status = 'COMPLETED'
          AND o.createdAt >= :since
        GROUP BY oi.productId
        HAVING SUM(oi.quantity) >= :minUnits
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<Object[]> findTopSellingSince(
            @Param("since") LocalDateTime since,
            @Param("minUnits") Long minUnits,
            Pageable pageable
    );
}
