package com.computerstore.backend.service.commerce;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.entity.CartItem;
import com.computerstore.backend.entity.Product;
import com.computerstore.backend.entity.ProductPromotion;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.ProductRepository;

@Service
public class SalePricingService {

    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final ProductRepository products;
    private final ProductPromotionService productPromotions;
    private final MembershipService membership;
    private final PromotionService promotions;

    public SalePricingService(
            ProductRepository products,
            ProductPromotionService productPromotions,
            MembershipService membership,
            PromotionService promotions) {
        this.products = products;
        this.productPromotions = productPromotions;
        this.membership = membership;
        this.promotions = promotions;
    }

    public record ItemPrice(
            Long productId,
            BigDecimal originalPrice,
            BigDecimal effectivePrice,
            int discountPercent,
            String discountType) {}

    public record Line(
            Long productId,
            String name,
            int quantity,
            BigDecimal originalPrice,
            BigDecimal originalSubtotal,
            BigDecimal salePrice,
            BigDecimal saleSubtotal,
            int salePercent,
            String saleType,
            BigDecimal finalSubtotal,
            BigDecimal finalPercent,
            String appliedSource) {}

    public record Quote(
            BigDecimal originalAmount,
            BigDecimal discountAmount,
            BigDecimal totalAmount,
            String promotionCode,
            String source,
            String description,
            String memberType,
            int memberPercent,
            List<Line> lines) {}

    private ItemPrice price(Product product, LocalDateTime now) {
        BigDecimal original = product.getPrice();
        if (!"ACTIVE".equalsIgnoreCase(product.getStatus())
                || product.getStockQuantity() == null
                || product.getStockQuantity() <= 0
                || original == null) {
            return new ItemPrice(product.getProductId(), original, original, 0, "NONE");
        }

        ProductPromotion promotion = productPromotions.findBestForProduct(product.getProductId(), now);
        if (promotion == null || promotion.getDiscountPercent() == null
                || promotion.getDiscountPercent().compareTo(BigDecimal.ZERO) <= 0) {
            return new ItemPrice(product.getProductId(), original, original, 0, "NONE");
        }

        int percent = ProductPromotionService.discountPercentForType(promotion.getPromotionType());
        BigDecimal effective = original
                .multiply(BigDecimal.valueOf(100 - percent))
                .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        return new ItemPrice(
                product.getProductId(),
                original,
                effective,
                percent,
                promotion.getPromotionType());
    }

    @Transactional(readOnly = true)
    public List<ItemPrice> publicPrices() {
        LocalDateTime now = LocalDateTime.now(VIETNAM_ZONE);
        return products.findAll().stream()
                .filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()))
                .map(p -> price(p, now))
                .toList();
    }

    @Transactional(readOnly = true)
    public Quote quote(User user, List<CartItem> cartItems, String enteredCode) {
        if (cartItems == null || cartItems.isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng đang trống");
        }

        LocalDateTime now = LocalDateTime.now(VIETNAM_ZONE);
        List<Line> lines = new ArrayList<>();
        BigDecimal original = BigDecimal.ZERO;
        BigDecimal saleTotal = BigDecimal.ZERO;
        String dominantProductType = null;

        for (CartItem cartItem : cartItems) {
            Product product = products.findById(cartItem.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));
            int quantity = cartItem.getQuantity() == null ? 0 : cartItem.getQuantity();
            if (!"ACTIVE".equalsIgnoreCase(product.getStatus())
                    || quantity <= 0
                    || product.getStockQuantity() == null
                    || quantity > product.getStockQuantity()) {
                throw new IllegalArgumentException("Sản phẩm " + product.getName()
                        + " đã ngừng bán hoặc không đủ tồn kho");
            }

            ItemPrice item = price(product, now);
            BigDecimal baseSubtotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            BigDecimal saleSubtotal = item.effectivePrice().multiply(BigDecimal.valueOf(quantity));
            original = original.add(baseSubtotal);
            saleTotal = saleTotal.add(saleSubtotal);

            if (item.discountPercent() > 0) {
                dominantProductType = dominantType(dominantProductType, item.discountType());
            }

            lines.add(new Line(
                    product.getProductId(),
                    product.getName(),
                    quantity,
                    product.getPrice(),
                    baseSubtotal,
                    item.effectivePrice(),
                    saleSubtotal,
                    item.discountPercent(),
                    item.discountType(),
                    saleSubtotal,
                    BigDecimal.valueOf(item.discountPercent()),
                    "PRODUCT"));
        }

        BigDecimal bestDiscount = original.subtract(saleTotal);
        String source = bestDiscount.signum() > 0 ? "PRODUCT" : "NONE";
        String code = bestDiscount.signum() > 0 ? productPromotionCode(dominantProductType) : null;
        String description = bestDiscount.signum() > 0
                ? "Ưu đãi sản phẩm được chọn theo mức giảm tốt nhất, không cộng dồn ưu đãi khác"
                : "Không có giảm giá";
        String memberType = null;
        int memberPercent = 0;

        MembershipService.Quote member = membership.quote(user, original);
        if (member.discountAmount().compareTo(bestDiscount) > 0) {
            bestDiscount = member.discountAmount();
            source = "MEMBERSHIP";
            code = member.code();
            description = member.description();
            memberType = member.type();
            memberPercent = member.percent();
        }

        if (enteredCode != null && !enteredCode.isBlank()) {
            String normalized = enteredCode.trim().toUpperCase(Locale.ROOT);
            BigDecimal coupon = promotions.calculateDiscountForUser(user, normalized, original);
            if (coupon.compareTo(bestDiscount) >= 0 && coupon.signum() > 0) {
                bestDiscount = coupon;
                source = "COUPON";
                code = normalized;
                description = "Mã " + normalized + " được chọn do có mức giảm tốt nhất";
                memberType = null;
                memberPercent = 0;
            } else {
                description += ". Mã " + normalized + " không cộng dồn vì ưu đãi hiện tại tốt hơn";
            }
        }

        BigDecimal total = original.subtract(bestDiscount);
        return new Quote(
                original,
                bestDiscount,
                total,
                code,
                source,
                description,
                memberType,
                memberPercent,
                allocateLines(lines, original, bestDiscount, source, memberType));
    }

    /**
     * Gán giá cuối cùng cho từng dòng; riêng VIP được giảm ở tổng đơn, không giảm từng dòng.
     * - PRODUCT: mỗi dòng dùng giá sale của chính nó.
     * - VIP: giữ giá từng dòng, áp dụng giảm giá ở tổng đơn hàng.
     * - Khách mới / COUPON: chia phần giảm theo tỉ lệ giá gốc, dòng cuối nhận phần dư.
     * - NONE: giữ nguyên giá gốc.
     */
    private List<Line> allocateLines(List<Line> lines, BigDecimal original,
            BigDecimal discount, String source, String memberType) {
        List<Line> result = new ArrayList<>();
        boolean spread = ("COUPON".equals(source)
                || ("MEMBERSHIP".equals(source) && !"VIP".equals(memberType)))
                && discount.signum() > 0 && original.signum() > 0;
        BigDecimal remaining = discount;
        for (int i = 0; i < lines.size(); i++) {
            Line line = lines.get(i);
            BigDecimal finalSubtotal;
            BigDecimal finalPercent;
            String applied;
            if (spread) {
                BigDecimal share = i == lines.size() - 1
                        ? remaining
                        : discount.multiply(line.originalSubtotal())
                                .divide(original, 0, java.math.RoundingMode.HALF_UP);
                share = share.min(line.originalSubtotal()).max(BigDecimal.ZERO);
                remaining = remaining.subtract(share);
                finalSubtotal = line.originalSubtotal().subtract(share);
                finalPercent = discount.multiply(BigDecimal.valueOf(100))
                        .divide(original, 1, java.math.RoundingMode.HALF_UP)
                        .stripTrailingZeros();
                if (finalPercent.scale() < 0) {
                    finalPercent = finalPercent.setScale(0);
                }
                applied = source;
            } else if ("PRODUCT".equals(source)) {
                finalSubtotal = line.saleSubtotal();
                finalPercent = BigDecimal.valueOf(line.salePercent());
                applied = line.salePercent() > 0 ? "PRODUCT" : "NONE";
            } else {
                finalSubtotal = line.originalSubtotal();
                finalPercent = BigDecimal.ZERO;
                applied = "NONE";
            }
            result.add(new Line(
                    line.productId(), line.name(), line.quantity(),
                    line.originalPrice(), line.originalSubtotal(),
                    line.salePrice(), line.saleSubtotal(),
                    line.salePercent(), line.saleType(),
                    finalSubtotal, finalPercent, applied));
        }
        return result;
    }

    /** Nhãn ngắn hiển thị cho từng dòng, ví dụ "SALE -15%", "VIP -20%". */
    public String lineLabel(Quote quote, Line line) {
        String percent = line.finalPercent() == null
                ? "0"
                : line.finalPercent().stripTrailingZeros().toPlainString();
        return switch (line.appliedSource()) {
            case "PRODUCT" -> productPromotionCode(line.saleType()).replace('-', ' ')
                    + " -" + line.salePercent() + "%";
            case "MEMBERSHIP" -> ("VIP".equals(quote.memberType()) ? "VIP" : "KHÁCH MỚI")
                    + " -" + percent + "%";
            case "COUPON" -> "MÃ " + quote.promotionCode() + " -" + percent + "%";
            default -> null;
        };
    }

    private String dominantType(String current, String candidate) {
        if (current == null) {
            return candidate;
        }
        int currentPriority = typePriority(current);
        int candidatePriority = typePriority(candidate);
        return candidatePriority > currentPriority ? candidate : current;
    }

    private int typePriority(String type) {
        return switch (type) {
            case ProductPromotionService.BLACK_FRIDAY -> 4;
            case ProductPromotionService.SALE -> 3;
            case ProductPromotionService.BESTSELLER -> 2;
            case ProductPromotionService.NEW_PRODUCT -> 1;
            default -> 0;
        };
    }

    private String productPromotionCode(String type) {
        return switch (type) {
            case ProductPromotionService.BLACK_FRIDAY -> "BLACK-FRIDAY";
            case ProductPromotionService.SALE -> "SALE";
            case ProductPromotionService.BESTSELLER -> "BESTSELLER";
            case ProductPromotionService.NEW_PRODUCT -> "NEW-PRODUCT";
            default -> "PRODUCT-PROMOTION";
        };
    }
}
