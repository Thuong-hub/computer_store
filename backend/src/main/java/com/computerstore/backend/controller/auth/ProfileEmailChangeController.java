package com.computerstore.backend.controller.auth;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.computerstore.backend.service.auth.ProfileEmailChangeService;

@RestController
@RequestMapping("/api/auth/me/email-change")
public class ProfileEmailChangeController {

    private final ProfileEmailChangeService service;

    public ProfileEmailChangeController(ProfileEmailChangeService service) {
        this.service = service;
    }

    public record EmailRequest(String newEmail, String currentPassword) {}
    public record ConfirmRequest(String code) {}

    @PostMapping("/request")
    public ResponseEntity<?> requestChange(Authentication authentication, @RequestBody EmailRequest request) {
        try {
            service.requestChange(authentication.getName(), request.newEmail(), request.currentPassword());
            return ResponseEntity.ok(Map.of("message", "Mã xác minh đã được gửi tới email mới"));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmChange(Authentication authentication, @RequestBody ConfirmRequest request) {
        try {
            service.confirmChange(authentication.getName(), request.code());
            return ResponseEntity.ok(Map.of("message", "Đổi email thành công. Vui lòng đăng nhập lại"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
