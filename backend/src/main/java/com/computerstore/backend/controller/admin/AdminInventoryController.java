package com.computerstore.backend.controller.admin;

import java.util.Map;
import com.computerstore.backend.service.catalog.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/inventory")
public class AdminInventoryController {
    private final InventoryService service;
    public AdminInventoryController(InventoryService service) { this.service = service; }
    public record AdjustRequest(String mode, Integer quantity, String note) {}

    @GetMapping
    public Object overview() { return service.overview(); }

    @GetMapping("/movements")
    public Object movements(@RequestParam(required = false) Long productId) {
        return service.movements(productId);
    }

    @PostMapping("/{id}/adjust")
    public ResponseEntity<?> adjust(@PathVariable Long id, @RequestBody AdjustRequest req,
                                    Authentication auth) {
        if (req.quantity() == null || req.quantity() < 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Số lượng mới phải >= 0"));
        }
        if (req.note() == null || req.note().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng ghi lý do điều chỉnh"));
        }
        if (!"SET".equals(req.mode()) && !"IN".equals(req.mode()) && !"OUT".equals(req.mode())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thao tác không hợp lệ"));
        }
        if (!"SET".equals(req.mode()) && req.quantity() == 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Số lượng nhập/xuất phải lớn hơn 0"));
        }
        try {
            var p = "SET".equals(req.mode())
                ? service.set(id, req.quantity(), "ADJUSTMENT", auth.getName(), req.note())
                : service.change(id, "IN".equals(req.mode()) ? req.quantity() : -req.quantity(),
                     "IN".equals(req.mode()) ? "MANUAL_IN" : "MANUAL_OUT", null, auth.getName(), req.note());
            return ResponseEntity.ok(Map.of("message", "Cập nhật tổng kho thành công", "stockQuantity",p.getStockQuantity()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }
}
