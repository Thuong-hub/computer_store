package com.computerstore.backend.repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.computerstore.backend.entity.PromotionRedemption;

public interface PromotionRedemptionRepository extends JpaRepository<PromotionRedemption, Long> {

    Optional<PromotionRedemption> findByUserIdAndPromotionId(Long userId, Long promotionId);

    Optional<PromotionRedemption> findByOrderId(Long orderId);

    boolean existsByUserIdInAndPromotionIdAndStatus(List<Long> userIds, Long promotionId, String status);
}
