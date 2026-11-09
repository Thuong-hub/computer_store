package com.computerstore.backend.service.auth;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.computerstore.backend.entity.EmailVerificationToken;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.EmailVerificationTokenRepository;
import com.computerstore.backend.repository.UserRepository;

@Service
public class EmailVerificationService {

    private final UserRepository users;
    private final EmailVerificationTokenRepository tokens;
    private final JavaMailSender sender;
    private final PasswordEncoder encoder;
    private final CustomerEmailHistoryService emailHistory;
    private final SecureRandom random = new SecureRandom();

    @Value("${SMTP_HOST:}")
    private String host;

    @Value("${SMTP_FROM:}")
    private String from;

    public EmailVerificationService(UserRepository users,
                                    EmailVerificationTokenRepository tokens,
                                    JavaMailSender sender,
                                    PasswordEncoder encoder,
                                    CustomerEmailHistoryService emailHistory) {
        this.users = users;
        this.tokens = tokens;
        this.sender = sender;
        this.encoder = encoder;
        this.emailHistory = emailHistory;
    }

    @Transactional
    public void sendForNewUser(User user) {
        sendCode(user);
    }

    @Transactional
    public void resend(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Vui lòng nhập email");
        }

        User user = users.findByEmailIgnoreCase(email.trim().toLowerCase(Locale.ROOT))
                .orElse(null);
        if (user == null || Boolean.TRUE.equals(user.getEmailVerified())) {
            return;
        }
        sendCode(user);
    }

    @Transactional(noRollbackFor = IllegalArgumentException.class)
    public void verify(String email, String code) {
        if (email == null || email.isBlank() || code == null || !code.matches("[0-9]{6}")) {
            throw new IllegalArgumentException("Email hoặc mã xác minh không hợp lệ");
        }

        User user = users.findByEmailIgnoreCase(email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new IllegalArgumentException("Email hoặc mã xác minh không hợp lệ"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new IllegalArgumentException("Email đã được xác minh");
        }

        EmailVerificationToken token = tokens.findFirstByUserIdOrderByCreatedAtDesc(user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Chưa có mã xác minh. Vui lòng gửi lại mã"));

        LocalDateTime now = LocalDateTime.now();
        if (token.getUsedAt() != null || !token.getExpiresAt().isAfter(now)) {
            throw new IllegalArgumentException("Mã đã hết hạn. Vui lòng gửi lại mã");
        }
        if (token.getAttempts() >= 5) {
            throw new IllegalArgumentException("Đã nhập sai quá số lần cho phép. Vui lòng gửi lại mã");
        }

        token.setAttempts(token.getAttempts() + 1);
        tokens.save(token);
        if (!encoder.matches(code, token.getCodeHash())) {
            throw new IllegalArgumentException("Mã xác minh không chính xác");
        }

        if (emailHistory.hasBeenUsedByAnotherAccount(user.getEmail(), user.getUserId())) {
            user.setFirstTimeEligible(false);
        }
        user.setEmailVerified(true);
        emailHistory.remember(user.getUserId(), user.getEmail());
        users.save(user);
        token.setUsedAt(now);
        tokens.save(token);
    }

    private void sendCode(User user) {
        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            return;
        }
        if (host == null || host.isBlank() || from == null || from.isBlank()) {
            throw new IllegalStateException("Chưa cấu hình Gmail SMTP để xác minh tài khoản");
        }

        LocalDateTime now = LocalDateTime.now();
        EmailVerificationToken previous = tokens.findFirstByUserIdOrderByCreatedAtDesc(user.getUserId())
                .orElse(null);

        if (previous != null && previous.getCreatedAt().isAfter(now.minusSeconds(60))) {
            throw new IllegalArgumentException("Vui lòng đợi 60 giây trước khi gửi lại mã");
        }
        if (tokens.countByUserIdAndCreatedAtAfter(user.getUserId(), now.minusDays(1)) >= 10) {
            throw new IllegalArgumentException("Đã đạt giới hạn 10 email xác minh trong 24 giờ");
        }

        String code = String.format(Locale.ROOT, "%06d", random.nextInt(1_000_000));
        EmailVerificationToken token = new EmailVerificationToken();
        token.setUserId(user.getUserId());
        token.setCodeHash(encoder.encode(code));
        token.setExpiresAt(now.plusMinutes(10));
        tokens.save(token);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(user.getEmail());
        message.setSubject("ComputerStore - Xác minh email đăng ký");
        message.setText("Mã xác minh của bạn: " + code
                + "\nMã có hiệu lực 10 phút và chỉ dùng một lần."
                + "\nNếu bạn không đăng ký, hãy bỏ qua email này.");
        sender.send(message);
    }
}
