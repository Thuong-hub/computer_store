package com.computerstore.backend.service.commerce;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.computerstore.backend.entity.Product;
import com.computerstore.backend.repository.OrderItemRepository;
import com.computerstore.backend.repository.ProductPromotionRepository;
import com.computerstore.backend.repository.ProductRepository;

/**
 * Tự động tạo lịch Black Friday mỗi năm.
 *
 * - Chạy khi khởi động và mỗi ngày lúc 00:20 (giờ Việt Nam).
 * - Từ ngày 01/11 đến hết ngày Black Friday của năm đó (thứ Sáu sau Lễ Tạ ơn), nếu năm đó
 *   CHƯA có bất kỳ bản ghi Black Friday nào thì tự tạo lịch cho đúng ngày Black Friday:
 *   top N sản phẩm bán chạy (đơn COMPLETED trong N ngày gần nhất), còn bán và còn hàng,
 *   với mức giảm cố định 30%.
 * - Không bao giờ ghi đè admin: chỉ cần năm đó đã có bản ghi Black Friday (kể cả đã tắt)
 *   thì bỏ qua. Admin vẫn chỉnh/tắt lịch tự tạo ở trang Khuyến mãi như bình thường.
 * - Tắt hẳn tính năng: store.blackfriday.auto-enabled=false
 */
@Service
public class BlackFridayAutoService {

    private static final Logger log = LoggerFactory.getLogger(BlackFridayAutoService.class);
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final OrderItemRepository orderItems;
    private final ProductPromotionRepository promotions;
    private final ProductRepository products;
    private final ProductPromotionService promotionService;

    private final boolean enabled;
    private final int topN;
    private final int windowDays;
    private final long minUnits;

    public BlackFridayAutoService(
            OrderItemRepository orderItems,
            ProductPromotionRepository promotions,
            ProductRepository products,
            ProductPromotionService promotionService,
            @Value("${store.blackfriday.auto-enabled:true}") boolean enabled,
            @Value("${store.blackfriday.top-n:10}") int topN,
            @Value("${store.blackfriday.window-days:30}") int windowDays,
            @Value("${store.blackfriday.min-units:1}") long minUnits) {
        this.orderItems = orderItems;
        this.promotions = promotions;
        this.products = products;
        this.promotionService = promotionService;
        this.enabled = enabled;
        this.topN = topN;
        this.windowDays = windowDays;
        this.minUnits = minUnits;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void refreshOnStartup() {
        safeRun();
    }

    @Scheduled(cron = "0 20 0 * * *", zone = "Asia/Ho_Chi_Minh")
    public void refreshDaily() {
        safeRun();
    }

    private void safeRun() {
        if (!enabled) {
            return;
        }
        try {
            log.info("Black Friday auto: {}", createIfMissing());
        } catch (Exception e) {
            log.warn("Black Friday auto failed: {}", e.getMessage());
        }
    }

    public Map<String, Object> createIfMissing() {
        Map<String, Object> result = new LinkedHashMap<>();
        LocalDate today = LocalDate.now(VIETNAM_ZONE);
        int year = today.getYear();
        LocalDate saleDate = ProductPromotionService.blackFridayDate(year);
        result.put("year", year);
        result.put("saleDate", saleDate);

        if (today.isBefore(LocalDate.of(year, 11, 1)) || today.isAfter(saleDate)) {
            result.put("action", "SKIP_OUT_OF_SEASON");
            return result;
        }
        if (!promotions.findByPromotionTypeAndCampaignYearOrderByProductIdAsc(
                ProductPromotionService.BLACK_FRIDAY, year).isEmpty()) {
            result.put("action", "SKIP_ALREADY_CONFIGURED");
            return result;
        }

        LocalDateTime since = LocalDateTime.now(VIETNAM_ZONE).minusDays(windowDays);
        List<Object[]> rows = orderItems.findTopSellingSince(
                since, minUnits, PageRequest.of(0, topN * 3));

        Set<Long> ids = new LinkedHashSet<>();
        for (Object[] row : rows) {
            if (ids.size() >= topN) {
                break;
            }
            Long productId = ((Number) row[0]).longValue();
            Product product = products.findById(productId).orElse(null);
            if (product != null
                    && "ACTIVE".equalsIgnoreCase(product.getStatus())
                    && product.getStockQuantity() != null
                    && product.getStockQuantity() > 0) {
                ids.add(productId);
            }
        }
        if (ids.isEmpty()) {
            // Chưa đủ dữ liệu bán hàng: không tạo, ngày mai sẽ thử lại.
            result.put("action", "SKIP_NO_ELIGIBLE_PRODUCT");
            return result;
        }

        List<Map<String, Object>> items = new ArrayList<>();
        for (Long id : ids) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("productId", id);
            item.put("discountPercent", ProductPromotionService.BLACK_FRIDAY_DISCOUNT_PERCENT);
            items.add(item);
        }
        promotionService.saveBlackFridayCampaign(year, saleDate, true, items);
        result.put("action", "CREATED");
        result.put("discountPercent", ProductPromotionService.BLACK_FRIDAY_DISCOUNT_PERCENT);
        result.put("productIds", ids);
        return result;
    }
}
