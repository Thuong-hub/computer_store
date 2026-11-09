package com.computerstore.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.computerstore.backend.entity.MemberBenefitUsage;

public interface MemberBenefitUsageRepository extends JpaRepository<MemberBenefitUsage, Long> {
    Optional<MemberBenefitUsage> findByUserIdAndBenefitType(Long userId, String benefitType);
    Optional<MemberBenefitUsage> findByOrderId(Long orderId);
    boolean existsByUserIdInAndBenefitTypeAndStatus(List<Long> userIds, String benefitType, String status);
}
