package com.computerstore.backend.controller.admin;

import java.util.LinkedHashMap;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.dto.request.CreatePromotionRequest;
import com.computerstore.backend.dto.request.UpdatePromotionRequest;
import com.computerstore.backend.dto.request.UpdatePromotionStatusRequest;
import com.computerstore.backend.entity.Promotion;
import com.computerstore.backend.service.commerce.PromotionService;
import com.computerstore.backend.service.commerce.ProductPromotionService;
import com.computerstore.backend.service.commerce.BestsellerAutoService;
import com.computerstore.backend.entity.ProductPromotion;

@RestController
@RequestMapping("/api/admin/promotions")
public class AdminPromotionController {

    private final PromotionService promotionService;
    private final ProductPromotionService productPromotionService;
    private final BestsellerAutoService bestsellerAutoService;


    public AdminPromotionController(
            PromotionService promotionService,
            ProductPromotionService productPromotionService,
            BestsellerAutoService bestsellerAutoService) {

        this.promotionService = promotionService;
        this.productPromotionService = productPromotionService;
        this.bestsellerAutoService = bestsellerAutoService;
    }



    @PostMapping
    public ResponseEntity<?> createPromotion(
            @RequestBody CreatePromotionRequest request) {

        try {

            Promotion promotion =
                    promotionService.createPromotion(
                            request
                    );


            Map<String, Object> response =
                    new LinkedHashMap<>();

            response.put(
                    "message",
                    "Tạo mã giảm giá thành công"
            );

            response.put(
                    "promotionId",
                    promotion.getPromotionId()
            );

            response.put(
                    "code",
                    promotion.getCode()
            );

            response.put(
                    "name",
                    promotion.getName()
            );

            response.put(
                    "discountPercent",
                    promotion.getDiscountPercent()
            );

            response.put(
                    "maxDiscount",
                    promotion.getMaxDiscount()
            );

            response.put(
                    "minOrderValue",
                    promotion.getMinOrderValue()
            );

            response.put(
                    "startAt",
                    promotion.getStartAt()
            );

            response.put(
                    "endAt",
                    promotion.getEndAt()
            );

            response.put(
                    "status",
                    promotion.getStatus()
            );


            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

  
    @GetMapping
    public ResponseEntity<?> getAllPromotions() {

        try {

            List<Promotion> promotions =
                    promotionService.getAllPromotions();

            return ResponseEntity.ok(promotions);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

   
    @PutMapping("/{promotionId}")
    public ResponseEntity<?> updatePromotion(
            @PathVariable Long promotionId,
            @RequestBody UpdatePromotionRequest request) {

        try {

            Promotion promotion =
                    promotionService.updatePromotion(
                            promotionId,
                            request
                    );


            Map<String, Object> response =
                    new LinkedHashMap<>();

            response.put(
                    "message",
                    "Cập nhật mã giảm giá thành công"
            );

            response.put(
                    "promotionId",
                    promotion.getPromotionId()
            );

            response.put(
                    "code",
                    promotion.getCode()
            );

            response.put(
                    "name",
                    promotion.getName()
            );

            response.put(
                    "discountPercent",
                    promotion.getDiscountPercent()
            );

            response.put(
                    "maxDiscount",
                    promotion.getMaxDiscount()
            );

            response.put(
                    "minOrderValue",
                    promotion.getMinOrderValue()
            );

            response.put(
                    "startAt",
                    promotion.getStartAt()
            );

            response.put(
                    "endAt",
                    promotion.getEndAt()
            );

            response.put(
                    "status",
                    promotion.getStatus()
            );


            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

   
    @PutMapping("/{promotionId}/status")
    public ResponseEntity<?> updatePromotionStatus(
            @PathVariable Long promotionId,
            @RequestBody UpdatePromotionStatusRequest request) {

        try {

            Promotion promotion =
                    promotionService.updatePromotionStatus(
                            promotionId,
                            request.getStatus()
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Cập nhật trạng thái mã giảm giá thành công",
                            "promotionId",
                            promotion.getPromotionId(),
                            "code",
                            promotion.getCode(),
                            "status",
                            promotion.getStatus()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

    public record ProductPromotionInput(
            Long productId,
            String promotionType,
            BigDecimal discountPercent,
            LocalDateTime startAt,
            LocalDateTime endAt,
            String status) {}

    public record BlackFridayItem(Long productId, BigDecimal discountPercent) {}

    public record BlackFridayInput(
            Integer year,
            LocalDate saleDate,
            boolean enabled,
            List<BlackFridayItem> items) {}

    @GetMapping("/product")
    public ResponseEntity<?> getProductPromotions() {
        return ResponseEntity.ok(productPromotionService.getAll());
    }

    @PostMapping("/product")
    public ResponseEntity<?> createProductPromotion(
            @RequestBody ProductPromotionInput request) {
        try {
            ProductPromotion promotion = productPromotionService.createProductPromotion(
                    request.productId(),
                    request.promotionType(),
                    request.discountPercent(),
                    request.startAt(),
                    request.endAt(),
                    request.status());
            return ResponseEntity.ok(promotion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/product/{promotionId}")
    public ResponseEntity<?> updateProductPromotion(
            @PathVariable Long promotionId,
            @RequestBody ProductPromotionInput request) {
        try {
            ProductPromotion promotion = productPromotionService.updateProductPromotion(
                    promotionId,
                    request.promotionType(),
                    request.discountPercent(),
                    request.startAt(),
                    request.endAt(),
                    request.status());
            return ResponseEntity.ok(promotion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/product/{promotionId}/status")
    public ResponseEntity<?> updateProductPromotionStatus(
            @PathVariable Long promotionId,
            @RequestBody Map<String, String> request) {
        try {
            return ResponseEntity.ok(productPromotionService.updateStatus(
                    promotionId, request.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/bestseller/refresh")
    public ResponseEntity<?> refreshBestsellers() {
        try {
            return ResponseEntity.ok(bestsellerAutoService.refresh());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    e.getMessage() == null ? "Không thể cập nhật Bestseller" : e.getMessage()));
        }
    }

    @GetMapping("/black-friday")
    public ResponseEntity<?> getBlackFriday(
            @org.springframework.web.bind.annotation.RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(productPromotionService.getBlackFridayCampaign(year));
    }

    @PutMapping("/black-friday")
    public ResponseEntity<?> saveBlackFriday(
            @RequestBody BlackFridayInput request) {
        try {
            List<Map<String, Object>> items = request.items() == null
                    ? List.of()
                    : request.items().stream()
                        .map(item -> {
                            Map<String, Object> row = new LinkedHashMap<>();
                            row.put("productId", item.productId());
                            row.put("discountPercent", item.discountPercent());
                            return row;
                        })
                        .toList();
            return ResponseEntity.ok(productPromotionService.saveBlackFridayCampaign(
                    request.year(), request.saleDate(), request.enabled(), items));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    e.getMessage() == null ? "Dữ liệu Black Friday không hợp lệ" : e.getMessage()));
        }
    }

}