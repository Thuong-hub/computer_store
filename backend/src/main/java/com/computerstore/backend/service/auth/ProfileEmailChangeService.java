package com.computerstore.backend.service.auth;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.computerstore.backend.entity.EmailChangeRequest;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.EmailChangeRequestRepository;
import com.computerstore.backend.repository.UserRepository;

@Service
public class ProfileEmailChangeService {

    private static final Pattern EMAIL_FORMAT = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final UserRepository users;
    private final EmailChangeRequestRepository requests;
    private final JavaMailSender sender;
    private final PasswordEncoder encoder;
    private final CustomerEmailHistoryService emailHistory;
    private final SecureRandom random = new SecureRandom();

    @Value("${SMTP_FROM:}")
    private String from;

    @Value("${SMTP_HOST:}")
    private String host;

    public ProfileEmailChangeService(
            UserRepository users,
            EmailChangeRequestRepository requests,
            JavaMailSender sender,
            PasswordEncoder encoder,
            CustomerEmailHistoryService emailHistory) {
        this.users = users;
        this.requests = requests;
        this.sender = sender;
        this.encoder = encoder;
        this.emailHistory = emailHistory;
    }

    @Transactional
    public void requestChange(String username, String desiredEmail, String currentPassword) {
        if (desiredEmail == null || desiredEmail.isBlank()
                || currentPassword == null || currentPassword.isBlank()) {
            throw new IllegalArgumentException("Vui lòng nhập email mới và mật khẩu hiện tại");
        }

        String email = desiredEmail.trim().toLowerCase(Locale.ROOT);
        if (email.length() > 100 || !EMAIL_FORMAT.matcher(email).matches()) {
            throw new IllegalArgumentException("Định dạng email không hợp lệ");
        }

        User user = users.findByUsernameLocked(username)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus()) || !Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new IllegalArgumentException("Tài khoản chưa đủ điều kiện đổi email");
        }
        if (!encoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác");
        }
        if (email.equalsIgnoreCase(user.getEmail())) {
            throw new IllegalArgumentException("Email mới phải khác email hiện tại");
        }
        if (users.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email này đã được đăng ký");
        }
        if (host == null || host.isBlank() || from == null || from.isBlank()) {
            throw new IllegalStateException("Chưa cấu hình Gmail SMTP");
        }

        LocalDateTime now = LocalDateTime.now();
        EmailChangeRequest previous = requests.findFirstByUserIdOrderByCreatedAtDesc(user.getUserId())
                .orElse(null);
        if (previous != null && previous.getCreatedAt().isAfter(now.minusSeconds(60))) {
            throw new IllegalArgumentException("Vui lòng đợi 60 giây trước khi gửi lại mã");
        }
        if (requests.countByUserIdAndCreatedAtAfter(user.getUserId(), now.minusDays(1)) >= 10) {
            throw new IllegalArgumentException("Đã đạt giới hạn 10 email trong 24 giờ");
        }

        String code = String.format(Locale.ROOT, "%06d", random.nextInt(1_000_000));
        EmailChangeRequest entry = new EmailChangeRequest();
        entry.setUserId(user.getUserId());
        entry.setOldEmail(user.getEmail());
        entry.setNewEmail(email);
        entry.setCodeHash(encoder.encode(code));
        entry.setExpiresAt(now.plusMinutes(10));
        requests.save(entry);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(from);
        mail.setTo(email);
        mail.setSubject("ComputerStore - Xác minh thay đổi Gmail");
        mail.setText("Mã xác minh đổi email của bạn: " + code
                + "\nMã có hiệu lực 10 phút và chỉ dùng một lần."
                + "\nNếu bạn không yêu cầu thay đổi, hãy bỏ qua email này.");
        sender.send(mail);
    }

    @Transactional(noRollbackFor = IllegalArgumentException.class)
    public void confirmChange(String username, String code) {
        if (code == null || !code.matches("[0-9]{6}")) {
            throw new IllegalArgumentException("Mã xác minh phải gồm 6 chữ số");
        }

        User user = users.findByUsernameLocked(username)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus()) || !Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new IllegalArgumentException("Tài khoản chưa đủ điều kiện đổi email");
        }

        EmailChangeRequest entry = requests.findFirstByUserIdOrderByCreatedAtDesc(user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Chưa yêu cầu đổi email"));
        LocalDateTime now = LocalDateTime.now();
        if (entry.getUsedAt() != null || !entry.getExpiresAt().isAfter(now)) {
            throw new IllegalArgumentException("Mã xác minh đã hết hạn hoặc đã dùng");
        }
        if (!entry.getOldEmail().equalsIgnoreCase(user.getEmail())) {
            throw new IllegalArgumentException("Email hiện tại đã thay đổi. Vui lòng gửi lại yêu cầu");
        }
        if (entry.getAttempts() >= 5) {
            throw new IllegalArgumentException("Đã nhập sai quá 5 lần. Vui lòng gửi lại mã");
        }

        entry.setAttempts(entry.getAttempts() + 1);
        requests.save(entry);
        if (!encoder.matches(code, entry.getCodeHash())) {
            throw new IllegalArgumentException("Mã xác minh không chính xác");
        }
        if (users.existsByEmailIgnoreCase(entry.getNewEmail())) {
            throw new IllegalArgumentException("Email mới đã được tài khoản khác sử dụng");
        }

        if (emailHistory.hasBeenUsedByAnotherAccount(entry.getNewEmail(), user.getUserId())) {
            user.setFirstTimeEligible(false);
        }
        emailHistory.remember(user.getUserId(), user.getEmail());
        emailHistory.remember(user.getUserId(), entry.getNewEmail());
        user.setEmail(entry.getNewEmail());
        user.setEmailVerified(true);
        user.setPasswordVersion(user.getPasswordVersion() + 1);
        users.saveAndFlush(user);
        entry.setUsedAt(now);
        requests.save(entry);
    }
}
