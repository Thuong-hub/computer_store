package com.computerstore.backend.service.commerce;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.computerstore.backend.entity.Product;
import com.computerstore.backend.entity.ProductPromotion;
import com.computerstore.backend.repository.ProductPromotionRepository;
import com.computerstore.backend.repository.ProductRepository;

class ProductPromotionServiceTest {

    private ProductPromotionRepository promotions;
    private ProductRepository products;
    private ProductPromotionService service;

    @BeforeEach
    void setUp() {
        promotions = mock(ProductPromotionRepository.class);
        products = mock(ProductRepository.class);
        service = new ProductPromotionService(promotions, products);

        Product product = new Product();
        product.setProductId(1L);
        product.setStatus("ACTIVE");
        when(products.findById(1L)).thenReturn(Optional.of(product));
        when(promotions.findByPromotionTypeAndCampaignYearOrderByProductIdAsc(
                eq(ProductPromotionService.BLACK_FRIDAY), eq(2026)))
                .thenReturn(List.of());
        when(promotions.save(any(ProductPromotion.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void blackFridayAcceptsOnlyThirtyPercent() {
        LocalDateTime start = LocalDateTime.of(2026, 11, 27, 0, 0);
        LocalDateTime end = LocalDateTime.of(2026, 11, 28, 0, 0);

        ProductPromotion promotion = service.createProductPromotion(
                1L, ProductPromotionService.BLACK_FRIDAY, new BigDecimal("30"),
                start, end, "ACTIVE");

        assertEquals(0, new BigDecimal("30").compareTo(promotion.getDiscountPercent()));
        assertThrows(RuntimeException.class, () -> service.createProductPromotion(
                1L, ProductPromotionService.BLACK_FRIDAY, new BigDecimal("20"),
                start, end, "ACTIVE"));
        assertThrows(RuntimeException.class, () -> service.createProductPromotion(
                1L, ProductPromotionService.BLACK_FRIDAY, new BigDecimal("40"),
                start, end, "ACTIVE"));
    }
}
