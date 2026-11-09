package com.computerstore.backend.controller.commerce;

import java.math.BigDecimal;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.UserRepository;
import com.computerstore.backend.service.commerce.MembershipService;

@RestController
@RequestMapping("/api/membership")
public class MembershipController {
    private final MembershipService membership;
    private final UserRepository users;

    public MembershipController(MembershipService membership, UserRepository users) {
        this.membership = membership;
        this.users = users;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập"));
        }
        return ResponseEntity.ok(membership.summary(getUser(authentication)));
    }

    @GetMapping("/quote")
    public ResponseEntity<?> quote(Authentication authentication,
            @RequestParam BigDecimal amount) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập"));
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Giá trị đơn không hợp lệ"));
        }
        return ResponseEntity.ok(membership.quote(getUser(authentication), amount));
    }

    private User getUser(Authentication auth) {
        return users.findByUsername(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));
    }
}
