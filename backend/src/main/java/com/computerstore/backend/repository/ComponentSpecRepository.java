package com.computerstore.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.computerstore.backend.entity.ComponentSpec;

public interface ComponentSpecRepository
        extends JpaRepository<ComponentSpec, Long> {

    List<ComponentSpec> findByProductId(Long productId);

    
    Optional<ComponentSpec> findByProductIdAndSpecNameIgnoreCase(
            Long productId,
            String specName
    );

    /**
     * Lấy thông số của tất cả sản phẩm ACTIVE (có thể lọc theo danh mục) chỉ với 1 truy vấn.
     * Dùng cho bộ lọc theo thông số ở trang danh sách sản phẩm, thay vì gọi /{id}/specs cho từng sản phẩm.
     */
    @Query("""
        SELECT s
        FROM ComponentSpec s
        WHERE s.productId IN (
            SELECT p.productId
            FROM Product p
            WHERE p.status = 'ACTIVE'
              AND (:categoryId IS NULL OR p.categoryId = :categoryId)
        )
        ORDER BY s.productId, s.specName
        """)
    List<ComponentSpec> findActiveSpecs(@Param("categoryId") Long categoryId);
}
