package com.computerstore.backend.service.commerce;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.computerstore.backend.entity.Product;
import com.computerstore.backend.entity.ProductPromotion;
import com.computerstore.backend.entity.CartItem;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.ProductRepository;

class SalePricingServiceTest {

    @Test
    void legacyBlackFridayPromotionIsPricedAtThirtyPercent() {
        ProductRepository products = mock(ProductRepository.class);
        ProductPromotionService productPromotions = mock(ProductPromotionService.class);
        MembershipService membership = mock(MembershipService.class);
        PromotionService promotions = mock(PromotionService.class);

        Product product = new Product();
        product.setProductId(1L);
        product.setPrice(new BigDecimal("1000000"));
        product.setStockQuantity(1);
        product.setStatus("ACTIVE");
        when(products.findAll()).thenReturn(List.of(product));

        ProductPromotion oldPromotion = new ProductPromotion();
        oldPromotion.setPromotionType(ProductPromotionService.BLACK_FRIDAY);
        oldPromotion.setDiscountPercent(new BigDecimal("40"));
        when(productPromotions.findBestForProduct(
                eq(1L), any(LocalDateTime.class))).thenReturn(oldPromotion);

        SalePricingService service = new SalePricingService(
                products, productPromotions, membership, promotions);
        SalePricingService.ItemPrice price = service.publicPrices().get(0);

        assertEquals(30, price.discountPercent());
        assertEquals(0, new BigDecimal("700000.00").compareTo(price.effectivePrice()));
    }

    @Test
    void legacySalePromotionCannotExceedItsConfiguredFifteenPercent() {
        ProductRepository products = mock(ProductRepository.class);
        ProductPromotionService productPromotions = mock(ProductPromotionService.class);
        MembershipService membership = mock(MembershipService.class);
        PromotionService promotions = mock(PromotionService.class);

        Product product = product(1L, "1000000");
        product.setStockQuantity(1);
        when(products.findAll()).thenReturn(List.of(product));

        ProductPromotion oldPromotion = new ProductPromotion();
        oldPromotion.setPromotionType(ProductPromotionService.SALE);
        oldPromotion.setDiscountPercent(new BigDecimal("35"));
        when(productPromotions.findBestForProduct(
                eq(1L), any(LocalDateTime.class))).thenReturn(oldPromotion);

        SalePricingService service = new SalePricingService(
                products, productPromotions, membership, promotions);
        SalePricingService.ItemPrice price = service.publicPrices().get(0);

        assertEquals(15, price.discountPercent());
        assertEquals(0, new BigDecimal("850000.00").compareTo(price.effectivePrice()));
    }

    @Test
    void vipCartQuoteUsesTwentyPercentWhenLegacySaleDataClaimsThirtyFivePercent() {
        ProductRepository products = mock(ProductRepository.class);
        ProductPromotionService productPromotions = mock(ProductPromotionService.class);
        MembershipService membership = mock(MembershipService.class);
        PromotionService promotions = mock(PromotionService.class);

        Product product = product(1L, "1000000");
        product.setStockQuantity(1);
        when(products.findById(1L)).thenReturn(java.util.Optional.of(product));
        ProductPromotion legacySale = new ProductPromotion();
        legacySale.setPromotionType(ProductPromotionService.SALE);
        legacySale.setDiscountPercent(new BigDecimal("35"));
        when(productPromotions.findBestForProduct(
                eq(1L), any(LocalDateTime.class))).thenReturn(legacySale);
        when(membership.quote(any(), eq(new BigDecimal("1000000"))))
                .thenReturn(new MembershipService.Quote(
                        "VIP", "VIP-CUS-1", 20, new BigDecimal("12000000"),
                        new BigDecimal("200000"), new BigDecimal("800000"),
                        "Ưu đãi VIP 20% trên tổng đơn"));

        SalePricingService service = new SalePricingService(
                products, productPromotions, membership, promotions);
        SalePricingService.Quote quote = service.quote(
                new User(), List.of(cartItem(1L)), null);

        assertEquals("MEMBERSHIP", quote.source());
        assertEquals(20, quote.memberPercent());
        assertEquals(0, new BigDecimal("200000").compareTo(quote.discountAmount()));
        assertEquals(0, new BigDecimal("800000").compareTo(quote.totalAmount()));
        assertEquals(0, new BigDecimal("1000000").compareTo(quote.lines().get(0).finalSubtotal()));
    }

    @Test
    void vipDiscountIsAppliedToTheOrderTotalNotEachProductLine() {
        ProductRepository products = mock(ProductRepository.class);
        ProductPromotionService productPromotions = mock(ProductPromotionService.class);
        MembershipService membership = mock(MembershipService.class);
        PromotionService promotions = mock(PromotionService.class);

        Product firstProduct = product(1L, "1000000");
        Product secondProduct = product(2L, "3000000");
        when(products.findById(1L)).thenReturn(java.util.Optional.of(firstProduct));
        when(products.findById(2L)).thenReturn(java.util.Optional.of(secondProduct));
        when(membership.quote(any(), eq(new BigDecimal("4000000"))))
                .thenReturn(new MembershipService.Quote(
                        "VIP", "VIP-CUS-1", 20, new BigDecimal("12000000"),
                        new BigDecimal("800000"), new BigDecimal("3200000"),
                        "Ưu đãi VIP 20%"));

        CartItem firstItem = cartItem(1L);
        CartItem secondItem = cartItem(2L);
        SalePricingService service = new SalePricingService(
                products, productPromotions, membership, promotions);

        SalePricingService.Quote quote = service.quote(
                new User(), List.of(firstItem, secondItem), null);

        assertEquals(0, new BigDecimal("800000").compareTo(quote.discountAmount()));
        assertEquals(0, new BigDecimal("3200000").compareTo(quote.totalAmount()));
        assertEquals(20, quote.memberPercent());
        assertEquals(0, new BigDecimal("1000000").compareTo(quote.lines().get(0).finalSubtotal()));
        assertEquals(0, new BigDecimal("3000000").compareTo(quote.lines().get(1).finalSubtotal()));
        assertEquals("NONE", quote.lines().get(0).appliedSource());
        assertEquals("NONE", quote.lines().get(1).appliedSource());
    }

    private Product product(Long id, String price) {
        Product product = new Product();
        product.setProductId(id);
        product.setName("Product " + id);
        product.setPrice(new BigDecimal(price));
        product.setStockQuantity(5);
        product.setStatus("ACTIVE");
        return product;
    }

    private CartItem cartItem(Long productId) {
        CartItem item = new CartItem();
        item.setProductId(productId);
        item.setQuantity(1);
        return item;
    }
}
