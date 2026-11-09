package com.computerstore.backend.service.account;

import com.computerstore.backend.service.auth.CustomerEmailHistoryService;
import com.computerstore.backend.service.auth.EmailVerificationService;

import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.dto.request.ChangePasswordRequest;
import com.computerstore.backend.dto.request.LoginRequest;
import com.computerstore.backend.dto.request.RegisterRequest;
import com.computerstore.backend.dto.request.UpdateProfileRequest;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final CustomerEmailHistoryService emailHistory;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailVerificationService emailVerificationService,
            CustomerEmailHistoryService emailHistory) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
        this.emailHistory = emailHistory;
    }

    @Transactional
    public User register(RegisterRequest request) {

        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new RuntimeException("Tên đăng nhập không được để trống");
        }
        if (request.getUsername().trim().matches("(?i)deleted_u[0-9]+")) {
            throw new RuntimeException("Tên đăng nhập này được hệ thống giữ riêng");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email không được để trống");
        }
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (normalizedEmail.matches("deleted_u[0-9]+@invalid[.]local")) {
            throw new RuntimeException("Địa chỉ email không hợp lệ");
        }
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(normalizedEmail);
        user.setEmailVerified(false);

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        user.setRole("USER");

        User savedUser = userRepository.saveAndFlush(user);

        savedUser.setCustomerCode(
                String.format(Locale.ROOT, "KH%06d", savedUser.getUserId())
        );

        savedUser.setFirstTimeEligible(
                !emailHistory.hasBeenUsedByAnotherAccount(normalizedEmail, savedUser.getUserId())
        );
        savedUser = userRepository.save(savedUser);
        emailVerificationService.sendForNewUser(savedUser);
        return savedUser;
    }

    public User login(LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Username không tồn tại"
                        )
                );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new RuntimeException(
                    "Mật khẩu không chính xác"
            );
        }

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException("Email chưa được xác minh. Vui lòng kiểm tra Gmail");
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException(
                    "Tài khoản không còn hoạt động hoặc đã bị xóa"
            );
        }

        return user;
    }

    public User getUserByUsername(String username) {

    return userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                    new RuntimeException("User không tồn tại")
            );
    }

    @Transactional
    public User updateProfile(
            String username,
            UpdateProfileRequest request) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        if (request.getFullName() == null
                || request.getFullName().isBlank()) {

            throw new RuntimeException(
                    "Họ tên không được để trống"
            );
        }

        user.setFullName(
                request.getFullName().trim()
        );

        if (request.getPhone() == null
                || request.getPhone().isBlank()) {

            user.setPhone(null);

        } else {

            user.setPhone(
                    request.getPhone().trim()
            );
        }

        if (request.getAddress() == null
                || request.getAddress().isBlank()) {

            user.setAddress(null);

        } else {

            user.setAddress(
                    request.getAddress().trim()
            );
        }

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(
            String username,
            ChangePasswordRequest request) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        if (request.getOldPassword() == null
                || request.getOldPassword().isBlank()) {

            throw new RuntimeException(
                    "Mật khẩu cũ không được để trống"
            );
        }

        if (request.getNewPassword() == null
                || request.getNewPassword().isBlank()) {

            throw new RuntimeException(
                    "Mật khẩu mới không được để trống"
            );
        }

        boolean oldPasswordMatches =
                passwordEncoder.matches(
                        request.getOldPassword(),
                        user.getPassword()
                );

        if (!oldPasswordMatches) {

            throw new RuntimeException(
                    "Mật khẩu cũ không chính xác"
            );
        }

        boolean sameAsOldPassword =
                passwordEncoder.matches(
                        request.getNewPassword(),
                        user.getPassword()
                );

        if (sameAsOldPassword) {

            throw new RuntimeException(
                    "Mật khẩu mới không được giống mật khẩu cũ"
            );
        }

        if (request.getNewPassword().length() < 8) {

            throw new RuntimeException(
                    "Mật khẩu mới phải có ít nhất 8 ký tự"
            );
        }

        String encodedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );

        user.setPassword(encodedPassword);
        user.setPasswordVersion(user.getPasswordVersion() + 1);

        userRepository.save(user);
    }

}
