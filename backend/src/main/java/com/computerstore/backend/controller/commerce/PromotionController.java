package com.computerstore.backend.controller.commerce;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import com.computerstore.backend.repository.UserRepository;
import com.computerstore.backend.entity.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.service.commerce.PromotionService;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionService promotionService;
    private final UserRepository users;

    public PromotionController(PromotionService promotionService, UserRepository users) {
        this.promotionService = promotionService;
        this.users = users;
    }

    @PostMapping("/preview")
    public ResponseEntity<?> previewPromotion(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {

        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập"));
            }
            User user = users.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
            String code = request.get("code") == null
                    ? null
                    : String.valueOf(request.get("code"))
                            .trim()
                            .toUpperCase(Locale.ROOT);

            BigDecimal orderAmount = new BigDecimal(
                    String.valueOf(request.get("orderAmount"))
            );

            BigDecimal discountAmount = promotionService.calculateDiscountForUser(
                    user,
                    code,
                    orderAmount
            );

            BigDecimal totalAmount = orderAmount.subtract(discountAmount);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("code", code);
            response.put("originalAmount", orderAmount);
            response.put("discountAmount", discountAmount);
            response.put("totalAmount", totalAmount);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage() == null
                                    ? "Không thể áp dụng mã giảm giá"
                                    : e.getMessage()
                    )
            );
        }
    }
}
