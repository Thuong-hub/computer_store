package com.computerstore.backend.service.auth;

import com.computerstore.backend.entity.PasswordResetToken;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.PasswordResetTokenRepository;
import com.computerstore.backend.repository.UserRepository;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PasswordResetService {
    private final UserRepository users;
    private final PasswordResetTokenRepository tokens;
    private final PasswordEncoder encoder;
    private final ObjectProvider<JavaMailSender> mailProvider;
    private final SecureRandom random = new SecureRandom();
    @Value("${SMTP_HOST:}") private String smtpHost;
    @Value("${SMTP_FROM:}") private String from;
    @Value("${PUBLIC_BASE_URL:http://localhost:8080}") private String baseUrl;

    public PasswordResetService(UserRepository users, PasswordResetTokenRepository tokens,
                                PasswordEncoder encoder, ObjectProvider<JavaMailSender> mailProvider) {
        this.users = users;
        this.tokens = tokens;
        this.encoder = encoder;
        this.mailProvider = mailProvider;
    }

    @Transactional
    public void requestReset(String email) {
        if (email == null || email.isBlank()) throw new IllegalArgumentException("Vui lòng nhập email");
        if (smtpHost.isBlank() || from.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                "Chưa cấu hình email SMTP. Xem README_NANG_CAP.md");
        }
        // Trả kết quả giống nhau dù email có tồn tại hay không.
        User user = users.findByEmail(email.trim()).orElse(null);
        if (user == null || !"ACTIVE".equalsIgnoreCase(user.getStatus())) return;
        var recent = tokens.findFirstByUserIdOrderByCreatedAtDesc(user.getUserId());
        if (recent.isPresent() && recent.get().getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(60))) return;

        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        PasswordResetToken item = new PasswordResetToken();
        item.setUserId(user.getUserId());
        item.setTokenHash(hash(rawToken));
        item.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        tokens.save(item);

        String resetLink = baseUrl.replaceAll("/+$", "")
            + "/pages/reset-password.html?token=" + URLEncoder.encode(rawToken, StandardCharsets.UTF_8);
        JavaMailSender mail = mailProvider.getIfAvailable();
        if (mail == null) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Dịch vụ email chưa được cấu hình");
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(user.getEmail());
        message.setSubject("ComputerStore - Dat lai mat khau");
        message.setText("Ban da yeu cau dat lai mat khau. Mo lien ket sau trong 15 phut:\n"
                + resetLink + "\n\nNeu khong phai ban yeu cau, hay bo qua email nay.");
        mail.send(message);
    }

    @Transactional
    public void reset(String rawToken, String newPassword) {
        if (rawToken == null || rawToken.length() < 30 || rawToken.length() > 150) {
            throw new IllegalArgumentException("Liên kết đặt lại mật khẩu không hợp lệ");
        }
        if (newPassword == null || newPassword.length() < 8 || newPassword.length() > 128) {
            throw new IllegalArgumentException("Mật khẩu cần từ 8 đến 128 ký tự");
        }
        PasswordResetToken token = tokens.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new IllegalArgumentException("Liên kết không hợp lệ hoặc đã hết hạn"));
        if (token.getUsedAt() != null || !token.getExpiresAt().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Liên kết đã sử dụng hoặc hết hạn");
        }
        User user = users.findById(token.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new IllegalArgumentException("Tài khoản đã bị khóa");
        }
        user.setPassword(encoder.encode(newPassword));
        user.setPasswordVersion(user.getPasswordVersion() + 1);
        for (PasswordResetToken active : tokens.findByUserIdAndUsedAtIsNull(user.getUserId())) {
            active.setUsedAt(LocalDateTime.now());
            tokens.save(active);
        }
        users.save(user);
    }

    private String hash(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) { throw new IllegalStateException(e); }
    }
}
