package com.computerstore.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.computerstore.backend.entity.ProductPromotion;

public interface ProductPromotionRepository extends JpaRepository<ProductPromotion, Long> {

    List<ProductPromotion> findByProductIdAndStatusAndStartAtLessThanEqualAndEndAtGreaterThan(
            Long productId,
            String status,
            LocalDateTime startAt,
            LocalDateTime endAt);

    List<ProductPromotion> findByPromotionTypeAndCampaignYearOrderByProductIdAsc(
            String promotionType,
            Integer campaignYear);

    List<ProductPromotion> findAllByOrderByCreatedAtDesc();
}
