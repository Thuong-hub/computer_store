package com.computerstore.backend.service.commerce;

import com.computerstore.backend.service.auth.CustomerEmailHistoryService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.computerstore.backend.entity.MemberBenefitUsage;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.MemberBenefitUsageRepository;
import com.computerstore.backend.repository.OrderRepository;
import com.computerstore.backend.repository.UserRepository;

@Service
public class MembershipService {

    private static final BigDecimal VIP_SPENDING = new BigDecimal("300000000");
    private static final BigDecimal NEW_CAP = new BigDecimal("5000000");
    private static final BigDecimal VIP_CAP = new BigDecimal("12000000");
    private static final int VIP_DISCOUNT_PERCENT = 20;

    private final UserRepository users;
    private final OrderRepository orders;
    private final MemberBenefitUsageRepository usages;
    private final CustomerEmailHistoryService emails;

    public MembershipService(UserRepository users, OrderRepository orders,
            MemberBenefitUsageRepository usages, CustomerEmailHistoryService emails) {
        this.users = users;
        this.orders = orders;
        this.usages = usages;
        this.emails = emails;
    }

    public record Summary(String customerCode, String tier, long completedPaidOrders,
            BigDecimal qualifiedSpending, long remainingOrdersForVip,
            BigDecimal remainingSpendingForVip, boolean firstPurchaseEligible,
            String benefitDescription) {}

    public record Quote(String type, String code, int percent, BigDecimal maxDiscount,
            BigDecimal discountAmount, BigDecimal totalAmount, String description) {}

    @Transactional
    public Summary summary(User user) {
        long count = orders.countQualifiedVipOrders(user.getUserId());
        BigDecimal spending = orders.sumQualifiedVipSpending(user.getUserId());
        if (spending == null) {
            spending = BigDecimal.ZERO;
        }
        boolean vip = "VIP".equalsIgnoreCase(user.getCustomerTier())
                || count >= 10 || spending.compareTo(VIP_SPENDING) >= 0;
        if (vip && !"VIP".equalsIgnoreCase(user.getCustomerTier())) {
            user.setCustomerTier("VIP");
            user.setVipSince(LocalDateTime.now());
            users.save(user);
        }
        boolean first = !vip && canReceiveWelcome(user);
        return new Summary(user.getCustomerCode(), vip ? "VIP" : "NORMAL", count, spending,
                Math.max(0, 10 - count), VIP_SPENDING.subtract(spending).max(BigDecimal.ZERO),
                first, vip ? "Thành viên VIP: giảm 20% trên tổng đơn hàng"
                        : first ? "Khách mới: tự động giảm 10–30% ở đơn đầu tiên"
                        : "Mua đủ 10 đơn đã thanh toán và hoàn thành hoặc đạt 300 triệu để lên VIP");
    }

    @Transactional
    public Quote quote(User user, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return new Quote("NONE", null, 0, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO, "Chưa có sản phẩm để áp dụng ưu đãi");
        }
        Summary membership = summary(user);
        String type = "NONE";
        int percent = 0;
        BigDecimal cap = BigDecimal.ZERO;
        if ("VIP".equals(membership.tier())) {
            type = "VIP";
            cap = VIP_CAP;
            percent = rate(amount, true);
        } else if (membership.firstPurchaseEligible()) {
            type = "WELCOME";
            cap = NEW_CAP;
            percent = rate(amount, false);
        }
        BigDecimal discount = BigDecimal.ZERO;
        String code = null;
        String message = "Không có ưu đãi thành viên khả dụng";
        if (!"NONE".equals(type)) {
            discount = amount.multiply(BigDecimal.valueOf(percent))
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP)
                    .min(cap).min(amount);
            code = ("VIP".equals(type) ? "VIP-" : "NEW-") + user.getCustomerCode();
            message = "VIP".equals(type)
                    ? "Ưu đãi VIP " + percent + "% trên tổng đơn (tối đa " + cap.toPlainString() + "đ)"
                    : "Ưu đãi đơn hàng đầu tiên " + percent + "% (tối đa "
                            + cap.toPlainString() + "đ)";
        }
        return new Quote(type, code, percent, cap, discount,
                amount.subtract(discount), message);
    }

    private int rate(BigDecimal amount, boolean vip) {
        if (vip) {
            return VIP_DISCOUNT_PERCENT;
        }
        int base;
        if (amount.compareTo(new BigDecimal("50000000")) >= 0) {
            base = 30;
        } else if (amount.compareTo(new BigDecimal("30000000")) >= 0) {
            base = 25;
        } else if (amount.compareTo(new BigDecimal("15000000")) >= 0) {
            base = 20;
        } else if (amount.compareTo(new BigDecimal("5000000")) >= 0) {
            base = 15;
        } else {
            base = 10;
        }
        return base;
    }

    private boolean canReceiveWelcome(User user) {
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())
                || !Boolean.TRUE.equals(user.getEmailVerified())
                || !Boolean.TRUE.equals(user.getFirstTimeEligible())) {
            return false;
        }
        List<Long> linked = emails.relatedUserIds(user.getUserId());
        if (orders.countByUserIdInAndStatusNot(linked, "CANCELLED") > 0) {
            return false;
        }
        return !usages.existsByUserIdInAndBenefitTypeAndStatus(linked, "WELCOME", "USED");
    }

    @Transactional
    public void reserveWelcome(User user, Long orderId) {
        List<Long> linked = emails.relatedUserIds(user.getUserId());
        if (usages.existsByUserIdInAndBenefitTypeAndStatus(linked, "WELCOME", "USED")) {
            throw new IllegalStateException("Ưu đãi khách mới đã được sử dụng");
        }
        MemberBenefitUsage usage = usages.findByUserIdAndBenefitType(user.getUserId(), "WELCOME")
                .orElseGet(MemberBenefitUsage::new);
        usage.setUserId(user.getUserId());
        usage.setBenefitType("WELCOME");
        usage.setOrderId(orderId);
        usage.setStatus("USED");
        usage.setUsedAt(LocalDateTime.now());
        usage.setReleasedAt(null);
        usages.saveAndFlush(usage);
    }

    @Transactional
    public void releaseWelcome(Long orderId) {
        usages.findByOrderId(orderId).ifPresent(usage -> {
            if ("WELCOME".equals(usage.getBenefitType()) && "USED".equals(usage.getStatus())) {
                usage.setStatus("RELEASED");
                usage.setOrderId(null);
                usage.setReleasedAt(LocalDateTime.now());
                usages.save(usage);
            }
        });
    }

    @Transactional
    public void refreshTier(Long userId) {
        users.findById(userId).ifPresent(this::summary);
    }
}
