package com.computerstore.backend.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.repository.query.Param;

import com.computerstore.backend.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.productId = :id")
    Optional<Product> findByIdLocked(@Param("id") Long id);

    List<Product> findByNameContainingIgnoreCase(String keyword);

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByBrandId(Long brandId);

    List<Product> findByPriceBetween(
            BigDecimal minPrice,
            BigDecimal maxPrice
    );

    @Query("""
    SELECT p
    FROM Product p
    WHERE (:keyword IS NULL
           OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))

      AND (:categoryId IS NULL
           OR p.categoryId = :categoryId)

      AND (:brandId IS NULL
           OR p.brandId = :brandId)

      AND (:minPrice IS NULL
           OR p.price >= :minPrice)

      AND (:maxPrice IS NULL
           OR p.price <= :maxPrice)
""")
    List<Product> filterProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );

     
    List<Product>findByStockQuantityLessThanEqualOrderByStockQuantityAsc(Integer stockQuantity);
    long countByStockQuantityLessThanEqual(Integer stockQuantity);
}