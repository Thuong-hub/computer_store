package com.computerstore.backend.service.commerce;

import com.computerstore.backend.service.auth.CustomerEmailHistoryService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.dto.request.CreatePromotionRequest;
import com.computerstore.backend.dto.request.UpdatePromotionRequest;
import com.computerstore.backend.entity.Promotion;
import com.computerstore.backend.entity.PromotionRedemption;
import com.computerstore.backend.repository.PromotionRedemptionRepository;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.PromotionRepository;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionRedemptionRepository redemptionRepository;
    private final CustomerEmailHistoryService emailHistory;
    private final com.computerstore.backend.repository.OrderRepository orderRepository;

    public PromotionService(
            PromotionRepository promotionRepository,
            PromotionRedemptionRepository redemptionRepository,
            CustomerEmailHistoryService emailHistory,
            com.computerstore.backend.repository.OrderRepository orderRepository) {

        this.promotionRepository = promotionRepository;
        this.redemptionRepository = redemptionRepository;
        this.emailHistory = emailHistory;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Promotion createPromotion(
            CreatePromotionRequest request) {

        if (request.getCode() == null
                || request.getCode().isBlank()) {

            throw new RuntimeException(
                    "Mã giảm giá không được để trống"
            );
        }

        String code = request.getCode()
                .trim()
                .toUpperCase(Locale.ROOT);

        if (promotionRepository
                .existsByCodeIgnoreCase(code)) {

            throw new RuntimeException(
                    "Mã giảm giá đã tồn tại"
            );
        }

        if (request.getName() == null
                || request.getName().isBlank()) {

            throw new RuntimeException(
                    "Tên chương trình không được để trống"
            );
        }

        if (request.getDiscountPercent() == null) {

            throw new RuntimeException(
                    "Phần trăm giảm không được để trống"
            );
        }

        if (request.getDiscountPercent()
                .compareTo(BigDecimal.ZERO) <= 0
                ||
            request.getDiscountPercent()
                .compareTo(new BigDecimal("100")) > 0) {

            throw new RuntimeException(
                    "Phần trăm giảm phải lớn hơn 0 và không vượt quá 100"
            );
        }

        if (request.getMaxDiscount() != null
                && request.getMaxDiscount()
                .compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Số tiền giảm tối đa không được âm"
            );
        }

        BigDecimal minOrderValue =
                request.getMinOrderValue();

        if (minOrderValue == null) {
            minOrderValue = BigDecimal.ZERO;
        }

        if (minOrderValue.compareTo(
                BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Giá trị đơn tối thiểu không được âm"
            );
        }

        if (request.getStartAt() == null
                || request.getEndAt() == null) {

            throw new RuntimeException(
                    "Thời gian bắt đầu và kết thúc không được để trống"
            );
        }

        if (!request.getStartAt()
                .isBefore(request.getEndAt())) {

            throw new RuntimeException(
                    "Thời gian bắt đầu phải trước thời gian kết thúc"
            );
        }

        String status = request.getStatus();

        if (status == null || status.isBlank()) {

            status = "ACTIVE";

        } else {

            status = status
                    .trim()
                    .toUpperCase(Locale.ROOT);

            if (!"ACTIVE".equals(status)
                    && !"INACTIVE".equals(status)) {

                throw new RuntimeException(
                        "Trạng thái chỉ được là ACTIVE hoặc INACTIVE"
                );
            }
        }

        Promotion promotion =
                new Promotion();

        promotion.setCode(code);

        promotion.setName(
                request.getName().trim()
        );

        promotion.setDescription(
                request.getDescription()
        );

        promotion.setDiscountPercent(
                request.getDiscountPercent()
        );

        promotion.setMaxDiscount(
                request.getMaxDiscount()
        );

        promotion.setMinOrderValue(
                minOrderValue
        );

        promotion.setStartAt(
                request.getStartAt()
        );

        promotion.setEndAt(
                request.getEndAt()
        );

        promotion.setStatus(status);

        return promotionRepository.save(
                promotion
        );
    }

    @Transactional(readOnly = true)
    public List<Promotion> getAllPromotions() {

        return promotionRepository.findAll();
    }

    @Transactional
    public Promotion updatePromotion(
            Long promotionId,
            UpdatePromotionRequest request) {

        Promotion promotion = promotionRepository
                .findById(promotionId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Mã giảm giá không tồn tại"
                        )
                );

        if (request.getCode() == null
                || request.getCode().isBlank()) {

            throw new RuntimeException(
                    "Mã giảm giá không được để trống"
            );
        }

        String code = request.getCode()
                .trim()
                .toUpperCase(Locale.ROOT);

        if (!code.equalsIgnoreCase(
                promotion.getCode())) {

            if (promotionRepository
                    .existsByCodeIgnoreCase(code)) {

                throw new RuntimeException(
                        "Mã giảm giá đã tồn tại"
                );
            }
        }

        if (request.getName() == null
                || request.getName().isBlank()) {

            throw new RuntimeException(
                    "Tên chương trình không được để trống"
            );
        }

        if (request.getDiscountPercent() == null) {

            throw new RuntimeException(
                    "Phần trăm giảm không được để trống"
            );
        }

        if (request.getDiscountPercent()
                .compareTo(BigDecimal.ZERO) <= 0
                ||
            request.getDiscountPercent()
                .compareTo(new BigDecimal("100")) > 0) {

            throw new RuntimeException(
                    "Phần trăm giảm phải lớn hơn 0 và không vượt quá 100"
            );
        }

        if (request.getMaxDiscount() != null
                && request.getMaxDiscount()
                .compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Số tiền giảm tối đa không được âm"
            );
        }

        BigDecimal minOrderValue =
                request.getMinOrderValue();

        if (minOrderValue == null) {
            minOrderValue = BigDecimal.ZERO;
        }

        if (minOrderValue.compareTo(
                BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Giá trị đơn tối thiểu không được âm"
            );
        }

        if (request.getStartAt() == null
                || request.getEndAt() == null) {

            throw new RuntimeException(
                    "Thời gian bắt đầu và kết thúc không được để trống"
            );
        }

        if (!request.getStartAt()
                .isBefore(request.getEndAt())) {

            throw new RuntimeException(
                    "Thời gian bắt đầu phải trước thời gian kết thúc"
            );
        }

        String status = request.getStatus();

        if (status == null || status.isBlank()) {

            status = promotion.getStatus();

        } else {

            status = status
                    .trim()
                    .toUpperCase(Locale.ROOT);

            if (!"ACTIVE".equals(status)
                    && !"INACTIVE".equals(status)) {

                throw new RuntimeException(
                        "Trạng thái chỉ được là ACTIVE hoặc INACTIVE"
                );
            }
        }

        promotion.setCode(code);

        promotion.setName(
                request.getName().trim()
        );

        promotion.setDescription(
                request.getDescription()
        );

        promotion.setDiscountPercent(
                request.getDiscountPercent()
        );

        promotion.setMaxDiscount(
                request.getMaxDiscount()
        );

        promotion.setMinOrderValue(
                minOrderValue
        );

        promotion.setStartAt(
                request.getStartAt()
        );

        promotion.setEndAt(
                request.getEndAt()
        );

        promotion.setStatus(status);

        return promotionRepository.save(
                promotion
        );
    }

    @Transactional
    public Promotion updatePromotionStatus(
            Long promotionId,
            String newStatus) {

        if (newStatus == null
                || newStatus.isBlank()) {

            throw new RuntimeException(
                    "Trạng thái không được để trống"
            );
        }

        String status = newStatus
                .trim()
                .toUpperCase(Locale.ROOT);

        if (!"ACTIVE".equals(status)
                && !"INACTIVE".equals(status)) {

            throw new RuntimeException(
                    "Trạng thái chỉ được là ACTIVE hoặc INACTIVE"
            );
        }

        Promotion promotion = promotionRepository
                .findById(promotionId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Mã giảm giá không tồn tại"
                        )
                );

        promotion.setStatus(status);

        return promotionRepository.save(promotion);
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateDiscountForUser(User user, String code, BigDecimal amount) {
        Promotion promotion = getAvailablePromotion(user, code);
        return calculateDiscount(promotion.getCode(), amount);
    }

    @Transactional
    public void redeem(User user, String code, Long orderId) {
        if (code == null || code.isBlank()) {
            throw new RuntimeException("Mã giảm giá không được để trống");
        }
        Promotion promotion = promotionRepository.findByCodeLocked(code.trim())
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));
        assertPromotionAllowed(user, promotion);
        PromotionRedemption redemption = redemptionRepository
                .findByUserIdAndPromotionId(user.getUserId(), promotion.getPromotionId())
                .orElseGet(PromotionRedemption::new);
        redemption.setUserId(user.getUserId());
        redemption.setPromotionId(promotion.getPromotionId());
        redemption.setOrderId(orderId);
        redemption.setStatus("USED");
        redemption.setUsedAt(LocalDateTime.now());
        redemption.setReleasedAt(null);
        redemptionRepository.saveAndFlush(redemption);
    }

    @Transactional
    public void release(Long orderId) {
        redemptionRepository.findByOrderId(orderId).ifPresent(redemption -> {
            redemption.setOrderId(null);
            redemption.setStatus("RELEASED");
            redemption.setReleasedAt(LocalDateTime.now());
            redemptionRepository.save(redemption);
        });
    }

    private Promotion getAvailablePromotion(User user, String code) {
        if (user == null || !Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException("Bạn cần xác minh email để sử dụng khuyến mãi");
        }
        if (code == null || code.isBlank()) {
            throw new RuntimeException("Mã giảm giá không được để trống");
        }
        Promotion promotion = promotionRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));
        assertPromotionAllowed(user, promotion);
        return promotion;
    }

    private void assertPromotionAllowed(User user, Promotion promotion) {
        if (user == null || !Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException("Bạn cần xác minh email để sử dụng khuyến mãi");
        }
        if (isFirstOrderCode(promotion.getCode())
                && (!Boolean.TRUE.equals(user.getFirstTimeEligible())
                    || orderRepository.countPaidOrCompletedByUserId(user.getUserId()) > 0)) {
            throw new RuntimeException("Ưu đãi khách mới chỉ áp dụng cho khách mua lần đầu");
        }
        List<Long> relatedUserIds = emailHistory.relatedUserIds(user.getUserId());
        if (redemptionRepository.existsByUserIdInAndPromotionIdAndStatus(
                relatedUserIds, promotion.getPromotionId(), "USED")) {
            throw new RuntimeException("Gmail này hoặc tài khoản liên quan đã dùng mã giảm giá này");
        }
    }

    private boolean isFirstOrderCode(String code) {
        String value = code.toUpperCase(Locale.ROOT);
        return value.startsWith("WELCOME") || value.startsWith("NEW") || value.startsWith("FIRST");
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateDiscount(
            String code,
            BigDecimal orderAmount) {

        if (code == null || code.isBlank()) {
            throw new RuntimeException(
                    "Mã giảm giá không được để trống"
            );
        }

        if (orderAmount == null
                || orderAmount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Giá trị đơn hàng không hợp lệ"
            );
        }

        Promotion promotion = promotionRepository
                .findByCodeIgnoreCase(
                        code.trim()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Mã giảm giá không tồn tại"
                        )
                );

        if (!"ACTIVE".equals(
                promotion.getStatus())) {

            throw new RuntimeException(
                    "Mã giảm giá hiện không hoạt động"
            );
        }

        LocalDateTime now =
                LocalDateTime.now();

        if (now.isBefore(
                promotion.getStartAt())) {

            throw new RuntimeException(
                    "Mã giảm giá chưa đến thời gian sử dụng"
            );
        }

        if (now.isAfter(
                promotion.getEndAt())) {

            throw new RuntimeException(
                    "Mã giảm giá đã hết hạn"
            );
        }

        if (orderAmount.compareTo(
                promotion.getMinOrderValue()) < 0) {

            throw new RuntimeException(
                    "Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã"
            );
        }

        BigDecimal discountAmount =
                orderAmount
                        .multiply(
                                promotion.getDiscountPercent()
                        )
                        .divide(
                                new BigDecimal("100")
                        )
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        if (promotion.getMaxDiscount() != null
                && discountAmount.compareTo(
                        promotion.getMaxDiscount()
                ) > 0) {

            discountAmount =
                    promotion.getMaxDiscount();
        }

        if (discountAmount.compareTo(
                orderAmount) > 0) {

            discountAmount =
                    orderAmount;
        }

        return discountAmount;
    }
}
