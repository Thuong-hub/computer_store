package com.computerstore.backend.controller.auth;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.computerstore.backend.service.auth.EmailVerificationService;

@RestController
@RequestMapping("/api/auth")
public class EmailVerificationController {

    private final EmailVerificationService service;

    public EmailVerificationController(EmailVerificationService service) {
        this.service = service;
    }

    public record VerifyRequest(String email, String code) {}
    public record ResendRequest(String email) {}

    @PostMapping("/verify-email")
    public ResponseEntity<?> verify(@RequestBody VerifyRequest request) {
        try {
            service.verify(request.email(), request.code());
            return ResponseEntity.ok(Map.of("message", "Xác minh email thành công. Bạn có thể đăng nhập"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resend(@RequestBody ResendRequest request) {
        try {
            service.resend(request.email());
            return ResponseEntity.ok(Map.of("message", "Nếu tài khoản chưa xác minh, mã đã được gửi tới email"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
