package com.computerstore.backend.service.commerce;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.entity.Product;
import com.computerstore.backend.entity.ProductPromotion;
import com.computerstore.backend.repository.ProductPromotionRepository;
import com.computerstore.backend.repository.ProductRepository;

@Service
public class ProductPromotionService {

    public static final String NEW_PRODUCT = "NEW_PRODUCT";
    public static final String BESTSELLER = "BESTSELLER";
    public static final String SALE = "SALE";
    public static final String BLACK_FRIDAY = "BLACK_FRIDAY";
    public static final int BLACK_FRIDAY_DISCOUNT_PERCENT = 30;

    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final ProductPromotionRepository promotionRepository;
    private final ProductRepository productRepository;

    public ProductPromotionService(
            ProductPromotionRepository promotionRepository,
            ProductRepository productRepository) {
        this.promotionRepository = promotionRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductPromotion> getAll() {
        return promotionRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<ProductPromotion> getActiveForProduct(Long productId, LocalDateTime now) {
        return promotionRepository.findByProductIdAndStatusAndStartAtLessThanEqualAndEndAtGreaterThan(
                productId, "ACTIVE", now, now);
    }

    @Transactional(readOnly = true)
    public ProductPromotion findBestForProduct(Long productId, LocalDateTime now) {
        return getActiveForProduct(productId, now).stream()
                .filter(this::isValidType)
                .max(Comparator
                        .comparing(ProductPromotion::getDiscountPercent)
                        .thenComparingInt(item -> typePriority(item.getPromotionType())))
                .orElse(null);
    }

    @Transactional
    public ProductPromotion createProductPromotion(
            Long productId,
            String promotionType,
            BigDecimal requestedPercent,
            LocalDateTime startAt,
            LocalDateTime endAt,
            String status) {

        validateProduct(productId);

        String type = normalizeType(promotionType);
        BigDecimal percent = resolvePercent(type, requestedPercent);
        validatePeriod(startAt, endAt);

        Integer campaignYear = type.equals(BLACK_FRIDAY)
                ? validateBlackFridayPeriod(startAt, endAt)
                : null;

        if (type.equals(BLACK_FRIDAY)) {
            validateBlackFridayCampaignYear(campaignYear, startAt, endAt);
        }

        ProductPromotion promotion = new ProductPromotion();
        promotion.setProductId(productId);
        promotion.setPromotionType(type);
        promotion.setDiscountPercent(percent);
        promotion.setStartAt(startAt);
        promotion.setEndAt(endAt);
        promotion.setStatus(normalizeStatus(status));
        promotion.setCampaignYear(campaignYear);
        return promotionRepository.save(promotion);
    }

    @Transactional
    public ProductPromotion updateProductPromotion(
            Long promotionId,
            String promotionType,
            BigDecimal requestedPercent,
            LocalDateTime startAt,
            LocalDateTime endAt,
            String status) {

        ProductPromotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Ưu đãi sản phẩm không tồn tại"));

        validateProduct(promotion.getProductId());

        String type = normalizeType(promotionType);
        BigDecimal percent = resolvePercent(type, requestedPercent);
        validatePeriod(startAt, endAt);

        Integer campaignYear = type.equals(BLACK_FRIDAY)
                ? validateBlackFridayPeriod(startAt, endAt)
                : null;

        if (type.equals(BLACK_FRIDAY)) {
            validateBlackFridayCampaignYear(campaignYear, startAt, endAt, promotionId);
        }

        promotion.setPromotionType(type);
        promotion.setDiscountPercent(percent);
        promotion.setStartAt(startAt);
        promotion.setEndAt(endAt);
        promotion.setStatus(normalizeStatus(status));
        promotion.setCampaignYear(campaignYear);
        return promotionRepository.save(promotion);
    }

    @Transactional
    public ProductPromotion updateStatus(Long promotionId, String status) {
        ProductPromotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Ưu đãi sản phẩm không tồn tại"));
        promotion.setStatus(normalizeStatus(status));
        return promotionRepository.save(promotion);
    }

    @Transactional
    public ProductPromotion createNewProductPromotion(Long productId) {
        Product product = validateProduct(productId);
        LocalDateTime start = LocalDateTime.now(VIETNAM_ZONE).withNano(0);
        LocalDateTime end = start.plusDays(30);
        ProductPromotion promotion = new ProductPromotion();
        promotion.setProductId(product.getProductId());
        promotion.setPromotionType(NEW_PRODUCT);
        promotion.setDiscountPercent(new BigDecimal("5"));
        promotion.setStartAt(start);
        promotion.setEndAt(end);
        promotion.setStatus("ACTIVE");
        return promotionRepository.save(promotion);
    }

    @Transactional
    public Map<String, Object> saveBlackFridayCampaign(
            Integer year,
            LocalDate saleDate,
            boolean enabled,
            List<Map<String, Object>> items) {

        if (year == null) {
            throw new RuntimeException("Năm Black Friday không được để trống");
        }
        if (saleDate == null || saleDate.getYear() != year) {
            throw new RuntimeException("Ngày Black Friday phải thuộc đúng năm đã chọn");
        }
        requireBlackFridayDate(saleDate, year);

        List<ProductPromotion> existing = promotionRepository
                .findByPromotionTypeAndCampaignYearOrderByProductIdAsc(BLACK_FRIDAY, year);

        LocalDateTime start = saleDate.atStartOfDay();
        LocalDateTime end = saleDate.plusDays(1).atStartOfDay();

        for (ProductPromotion promotion : existing) {
            promotion.setStatus("INACTIVE");
        }
        if (!existing.isEmpty()) {
            promotionRepository.saveAll(existing);
        }

        List<Long> productIds = new ArrayList<>();
        if (enabled) {
            if (items == null || items.isEmpty()) {
                throw new RuntimeException("Cần chọn ít nhất một sản phẩm tham gia Black Friday");
            }
            Set<Long> seen = new HashSet<>();
            for (Map<String, Object> item : items) {
                Long productId = toLong(item.get("productId"));
                BigDecimal percent = toDecimal(item.get("discountPercent"));
                if (productId == null || !seen.add(productId)) {
                    throw new RuntimeException("Danh sách sản phẩm Black Friday không hợp lệ");
                }
                validateProduct(productId);
                BigDecimal validPercent = resolvePercent(BLACK_FRIDAY, percent);
                ProductPromotion promotion = existing.stream()
                        .filter(p -> Objects.equals(p.getProductId(), productId))
                        .findFirst()
                        .orElseGet(ProductPromotion::new);
                promotion.setProductId(productId);
                promotion.setPromotionType(BLACK_FRIDAY);
                promotion.setDiscountPercent(validPercent);
                promotion.setStartAt(start);
                promotion.setEndAt(end);
                promotion.setStatus("ACTIVE");
                promotion.setCampaignYear(year);
                promotionRepository.save(promotion);
                productIds.add(productId);
            }
        }

        return Map.of(
                "year", year,
                "saleDate", saleDate,
                "enabled", enabled,
                "productIds", productIds
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getBlackFridayCampaign(Integer year) {
        int resolvedYear = year == null ? LocalDate.now(VIETNAM_ZONE).getYear() : year;
        List<ProductPromotion> promotions = promotionRepository
                .findByPromotionTypeAndCampaignYearOrderByProductIdAsc(BLACK_FRIDAY, resolvedYear);
        ProductPromotion first = promotions.stream().findFirst().orElse(null);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("year", resolvedYear);
        result.put("saleDate", first == null ? null : first.getStartAt().toLocalDate());
        result.put("enabled", promotions.stream().anyMatch(p -> "ACTIVE".equalsIgnoreCase(p.getStatus())));
        result.put("items", promotions);
        return result;
    }

    /** Black Friday = ngày sau Lễ Tạ ơn (thứ Năm thứ 4 của tháng 11). */
    public static LocalDate blackFridayDate(int year) {
        return LocalDate.of(year, 11, 1)
                .with(TemporalAdjusters.dayOfWeekInMonth(4, DayOfWeek.THURSDAY))
                .plusDays(1);
    }

    private void requireBlackFridayDate(LocalDate date, int year) {
        LocalDate expected = blackFridayDate(year);
        if (!expected.equals(date)) {
            throw new RuntimeException("Black Friday năm " + year + " là ngày "
                    + expected.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        }
    }

    public String displayType(String type) {
        return switch (normalizeType(type)) {
            case NEW_PRODUCT -> "Sản phẩm mới";
            case BESTSELLER -> "Bestseller";
            case SALE -> "Sale";
            case BLACK_FRIDAY -> "Black Friday";
            default -> type;
        };
    }

    private Product validateProduct(Long productId) {
        return productRepository.findById(productId)
                .filter(product -> !"DELETED".equalsIgnoreCase(product.getStatus()))
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
    }

    private String normalizeType(String value) {
        String type = value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
        if (!Set.of(NEW_PRODUCT, BESTSELLER, SALE, BLACK_FRIDAY).contains(type)) {
            throw new RuntimeException("Loại ưu đãi sản phẩm không hợp lệ");
        }
        return type;
    }

    private String normalizeStatus(String value) {
        String status = value == null || value.isBlank()
                ? "ACTIVE"
                : value.trim().toUpperCase(Locale.ROOT);
        if (!Set.of("ACTIVE", "INACTIVE").contains(status)) {
            throw new RuntimeException("Trạng thái chỉ được là ACTIVE hoặc INACTIVE");
        }
        return status;
    }

    private BigDecimal resolvePercent(String type, BigDecimal requested) {
        return switch (type) {
            case NEW_PRODUCT, BESTSELLER, SALE ->
                    BigDecimal.valueOf(discountPercentForType(type));
            case BLACK_FRIDAY -> {
                if (requested == null
                        || requested.compareTo(BigDecimal.valueOf(BLACK_FRIDAY_DISCOUNT_PERCENT)) != 0) {
                    throw new RuntimeException("Black Friday chỉ được giảm đúng 30%");
                }
                yield requested;
            }
            default -> throw new RuntimeException("Loại ưu đãi sản phẩm không hợp lệ");
        };
    }

    public static int discountPercentForType(String type) {
        return switch (type == null ? "" : type.trim().toUpperCase(Locale.ROOT)) {
            case NEW_PRODUCT -> 5;
            case BESTSELLER -> 10;
            case SALE -> 15;
            case BLACK_FRIDAY -> BLACK_FRIDAY_DISCOUNT_PERCENT;
            default -> throw new IllegalArgumentException("Loại ưu đãi sản phẩm không hợp lệ");
        };
    }

    private void validatePeriod(LocalDateTime startAt, LocalDateTime endAt) {
        if (startAt == null || endAt == null || !startAt.isBefore(endAt)) {
            throw new RuntimeException("Thời gian bắt đầu phải trước thời gian kết thúc");
        }
    }

    private Integer validateBlackFridayPeriod(LocalDateTime startAt, LocalDateTime endAt) {
        if (!startAt.toLocalDate().equals(endAt.minusNanos(1).toLocalDate())) {
            throw new RuntimeException("Black Friday chỉ áp dụng trong một ngày");
        }
        requireBlackFridayDate(startAt.toLocalDate(), startAt.getYear());
        return startAt.getYear();
    }

    private void validateBlackFridayCampaignYear(
            Integer year, LocalDateTime startAt, LocalDateTime endAt) {
        validateBlackFridayCampaignYear(year, startAt, endAt, null);
    }

    private void validateBlackFridayCampaignYear(
            Integer year, LocalDateTime startAt, LocalDateTime endAt, Long currentPromotionId) {
        List<ProductPromotion> existing = promotionRepository
                .findByPromotionTypeAndCampaignYearOrderByProductIdAsc(BLACK_FRIDAY, year);
        for (ProductPromotion promotion : existing) {
            if (currentPromotionId != null && Objects.equals(promotion.getPromotionId(), currentPromotionId)) {
                continue;
            }
            if (!promotion.getStartAt().toLocalDate().equals(startAt.toLocalDate())
                    || !promotion.getEndAt().equals(endAt)) {
                throw new RuntimeException("Mỗi năm chỉ được có một lịch Black Friday");
            }
        }
    }

    private boolean isValidType(ProductPromotion promotion) {
        return Set.of(NEW_PRODUCT, BESTSELLER, SALE, BLACK_FRIDAY)
                .contains(promotion.getPromotionType());
    }

    private int typePriority(String type) {
        return switch (type) {
            case BLACK_FRIDAY -> 4;
            case SALE -> 3;
            case BESTSELLER -> 2;
            case NEW_PRODUCT -> 1;
            default -> 0;
        };
    }

    private Long toLong(Object value) {
        if (value == null) {
            return null;
        }
        return Long.valueOf(String.valueOf(value));
    }

    private BigDecimal toDecimal(Object value) {
        if (value == null || String.valueOf(value).isBlank()) {
            return null;
        }
        return new BigDecimal(String.valueOf(value));
    }
}
