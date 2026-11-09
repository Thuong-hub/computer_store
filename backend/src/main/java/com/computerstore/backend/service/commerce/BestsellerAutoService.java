package com.computerstore.backend.service.commerce;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.entity.Product;
import com.computerstore.backend.entity.ProductPromotion;
import com.computerstore.backend.repository.OrderItemRepository;
import com.computerstore.backend.repository.ProductPromotionRepository;
import com.computerstore.backend.repository.ProductRepository;

/**
 * Tự động gán ưu đãi BESTSELLER (giảm 10%) cho các sản phẩm bán chạy nhất.
 *
 * - Chỉ tính đơn COMPLETED trong N ngày gần nhất (mặc định 30), lấy top M sản phẩm (mặc định 10),
 *   mỗi sản phẩm phải bán ít nhất K cái (mặc định 3).
 * - Ưu đãi tự động được đánh dấu bằng campaign_year = 0 và có hạn 2 ngày, mỗi lần chạy sẽ gia hạn.
 *   Sản phẩm rớt khỏi top sẽ bị tắt ngay ở lần chạy kế tiếp.
 * - Ưu đãi BESTSELLER do admin tạo tay (campaign_year = null) không bị đụng tới; sản phẩm đã có
 *   BESTSELLER thủ công đang hiệu lực thì bỏ qua. Nếu admin sửa một ưu đãi tự động, nó trở thành thủ công.
 */
@Service
public class BestsellerAutoService {

    public static final int AUTO_MARKER = 0;

    private static final Logger log = LoggerFactory.getLogger(BestsellerAutoService.class);
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final OrderItemRepository orderItems;
    private final ProductPromotionRepository promotions;
    private final ProductRepository products;

    private final int topN;
    private final int windowDays;
    private final long minUnits;

    public BestsellerAutoService(
            OrderItemRepository orderItems,
            ProductPromotionRepository promotions,
            ProductRepository products,
            @Value("${store.bestseller.top-n:10}") int topN,
            @Value("${store.bestseller.window-days:30}") int windowDays,
            @Value("${store.bestseller.min-units:3}") long minUnits) {
        this.orderItems = orderItems;
        this.promotions = promotions;
        this.products = products;
        this.topN = topN;
        this.windowDays = windowDays;
        this.minUnits = minUnits;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void refreshOnStartup() {
        safeRefresh();
    }

    @Scheduled(cron = "0 10 0 * * *", zone = "Asia/Ho_Chi_Minh")
    public void refreshDaily() {
        safeRefresh();
    }

    private void safeRefresh() {
        try {
            Map<String, Object> result = refresh();
            log.info("Bestseller auto refresh: {}", result);
        } catch (Exception e) {
            log.warn("Bestseller auto refresh failed: {}", e.getMessage());
        }
    }

    @Transactional
    public Map<String, Object> refresh() {
        LocalDateTime now = LocalDateTime.now(VIETNAM_ZONE).withNano(0);
        LocalDateTime since = now.minusDays(windowDays);

        List<Object[]> rows = orderItems.findTopSellingSince(
                since, minUnits, PageRequest.of(0, topN * 3));

        // Chỉ giữ sản phẩm còn bán và còn hàng, tối đa topN
        Set<Long> topIds = new LinkedHashSet<>();
        for (Object[] row : rows) {
            if (topIds.size() >= topN) {
                break;
            }
            Long productId = ((Number) row[0]).longValue();
            Product product = products.findById(productId).orElse(null);
            if (product != null
                    && "ACTIVE".equalsIgnoreCase(product.getStatus())
                    && product.getStockQuantity() != null
                    && product.getStockQuantity() > 0) {
                topIds.add(productId);
            }
        }

        List<ProductPromotion> autoPromos = promotions
                .findByPromotionTypeAndCampaignYearOrderByProductIdAsc(
                        ProductPromotionService.BESTSELLER, AUTO_MARKER);
        Map<Long, ProductPromotion> autoByProduct = autoPromos.stream()
                .collect(Collectors.toMap(
                        ProductPromotion::getProductId, Function.identity(), (a, b) -> a));

        List<ProductPromotion> changed = new ArrayList<>();
        int deactivated = 0;
        int extended = 0;
        int created = 0;

        // 1. Tắt ưu đãi tự động của sản phẩm đã rớt khỏi top
        for (ProductPromotion promo : autoPromos) {
            if (!topIds.contains(promo.getProductId()) && "ACTIVE".equalsIgnoreCase(promo.getStatus())) {
                promo.setStatus("INACTIVE");
                changed.add(promo);
                deactivated++;
            }
        }

        // 2. Gia hạn hoặc tạo mới cho sản phẩm trong top
        LocalDateTime end = now.plusDays(2);
        for (Long productId : topIds) {
            ProductPromotion existing = autoByProduct.get(productId);
            if (existing != null) {
                existing.setStatus("ACTIVE");
                existing.setStartAt(now.isBefore(existing.getStartAt()) ? now : existing.getStartAt());
                existing.setEndAt(end);
                existing.setDiscountPercent(new BigDecimal("10"));
                changed.add(existing);
                extended++;
                continue;
            }

            boolean hasManual = promotions
                    .findByProductIdAndStatusAndStartAtLessThanEqualAndEndAtGreaterThan(
                            productId, "ACTIVE", now, now)
                    .stream()
                    .anyMatch(p -> ProductPromotionService.BESTSELLER.equals(p.getPromotionType()));
            if (hasManual) {
                continue;
            }

            ProductPromotion promo = new ProductPromotion();
            promo.setProductId(productId);
            promo.setPromotionType(ProductPromotionService.BESTSELLER);
            promo.setDiscountPercent(new BigDecimal("10"));
            promo.setStartAt(now);
            promo.setEndAt(end);
            promo.setStatus("ACTIVE");
            promo.setCampaignYear(AUTO_MARKER);
            changed.add(promo);
            created++;
        }

        if (!changed.isEmpty()) {
            promotions.saveAll(changed);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("windowDays", windowDays);
        result.put("topN", topN);
        result.put("minUnits", minUnits);
        result.put("bestsellerProductIds", topIds);
        result.put("created", created);
        result.put("extended", extended);
        result.put("deactivated", deactivated);
        return result;
    }
}
