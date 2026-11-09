package com.computerstore.backend.service.admin;

import com.computerstore.backend.service.auth.CustomerEmailHistoryService;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.dto.response.AdminUserResponse;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.UserRepository;
import com.computerstore.backend.repository.OrderRepository;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final CustomerEmailHistoryService emailHistory;


    public AdminUserService(
            UserRepository userRepository,
            OrderRepository orderRepository,
            CustomerEmailHistoryService emailHistory) {

        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.emailHistory = emailHistory;
    }


    
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {

        List<User> users =
                userRepository.findAll();


        return users.stream()
                .map(this::toAdminUserResponse)
                .toList();
    }


   
    private AdminUserResponse toAdminUserResponse(
            User user) {

                AdminUserResponse response = new AdminUserResponse(
                user.getUserId(),
                user.getCustomerCode(),
                Boolean.TRUE.equals(user.getRegistrationReleased())
                        ? user.getReleasedUsername() : user.getUsername(),
                Boolean.TRUE.equals(user.getRegistrationReleased())
                        ? user.getReleasedEmail() : user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getAddress(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt(),
                Boolean.TRUE.equals(user.getRegistrationReleased())
        );
        long completed = orderRepository.countQualifiedVipOrders(user.getUserId());
        java.math.BigDecimal spending = orderRepository.sumQualifiedVipSpending(user.getUserId());
        if (spending == null) {
            spending = java.math.BigDecimal.ZERO;
        }
        response.setCompletedPaidOrders(completed);
        response.setQualifiedSpending(spending);
        response.setCustomerTier("VIP".equalsIgnoreCase(user.getCustomerTier())
                || completed >= 10 || spending.compareTo(new java.math.BigDecimal("300000000")) >= 0
                ? "VIP" : "NORMAL");
        return response;
    }

    
    @Transactional(readOnly = true)
    public AdminUserResponse getUserById(
            Long userId) {

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Tài khoản không tồn tại"
                                )
                        );

        return toAdminUserResponse(user);
    }

    
    @Transactional(readOnly = true)
    public List<AdminUserResponse> searchUsers(
            String keyword) {

        
        if (keyword == null || keyword.isBlank()) {
            return getAllUsers();
        }

        String searchKeyword =
                keyword.trim();

        List<User> users =
                userRepository.searchAccountsIncludingReleased(searchKeyword);

        return users.stream()
                .map(this::toAdminUserResponse)
                .toList();
    }

    
    @Transactional
    public AdminUserResponse updateUserStatus(
            Long userId,
            String newStatus) {

        if (newStatus == null
                || newStatus.isBlank()) {

            throw new RuntimeException(
                    "Trạng thái không được để trống"
            );
        }


        String status =
                newStatus
                        .trim()
                        .toUpperCase(Locale.ROOT);


        if (!"ACTIVE".equals(status)
                && !"BLOCKED".equals(status)) {

            throw new RuntimeException(
                    "Trạng thái chỉ được là ACTIVE hoặc BLOCKED"
            );
        }


        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Tài khoản không tồn tại"
                                )
                        );


       
        if ("ADMIN".equals(user.getRole())) {

            throw new RuntimeException(
                    "Không thể thay đổi trạng thái tài khoản ADMIN"
            );
        }


        if ("DELETED".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Tài khoản đã xóa không thể khóa hoặc mở khóa");
        }

        user.setStatus(status);

        User savedUser =
                userRepository.save(user);


        return toAdminUserResponse(savedUser);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Không thể xóa tài khoản quản trị viên");
        }

        if ("DELETED".equalsIgnoreCase(user.getStatus())) {
            throw new IllegalArgumentException("Tài khoản đã được xóa trước đó");
        }

        if (orderRepository.existsByUserIdAndStatusIn(
                userId,
                List.of("PENDING", "CONFIRMED", "SHIPPING"))) {
            throw new IllegalArgumentException("Tài khoản còn đơn hàng đang xử lý. Hãy hoàn tất hoặc hủy đơn trước");
        }

        user.setStatus("DELETED");
        user.setPasswordVersion(user.getPasswordVersion() + 1);
        userRepository.save(user);
    }
    @Transactional
    public void restoreUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));
        if (!"DELETED".equalsIgnoreCase(user.getStatus())) {
            throw new IllegalArgumentException("Chỉ có thể khôi phục tài khoản đã xóa");
        }
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Không được thay đổi tài khoản Admin");
        }
        if (Boolean.TRUE.equals(user.getRegistrationReleased())) {
            String originalUsername = user.getReleasedUsername();
            String originalEmail = user.getReleasedEmail();
            if (originalUsername == null || originalEmail == null) {
                throw new IllegalArgumentException("Không tìm thấy thông tin tài khoản cũ");
            }
            if (userRepository.existsByUsername(originalUsername)
                    || userRepository.existsByEmailIgnoreCase(originalEmail)) {
                throw new IllegalArgumentException(
                        "Username hoặc Gmail đã được đăng ký lại. Không thể khôi phục trực tiếp; cần xử lý trùng tài khoản trước");
            }
            user.setUsername(originalUsername);
            user.setEmail(originalEmail);
            user.setReleasedUsername(null);
            user.setReleasedEmail(null);
            user.setRegistrationReleased(false);
        }
        user.setStatus("ACTIVE");
        user.setPasswordVersion(user.getPasswordVersion() + 1);
        userRepository.saveAndFlush(user);
    }

    @Transactional
    public void allowRegistrationAgain(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Không được thay đổi tài khoản Admin");
        }
        if (!"DELETED".equalsIgnoreCase(user.getStatus())) {
            throw new IllegalArgumentException("Chỉ áp dụng cho tài khoản đã xóa");
        }
        if (Boolean.TRUE.equals(user.getRegistrationReleased())) {
            throw new IllegalArgumentException("Đã cho phép đăng ký lại trước đó");
        }
        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            emailHistory.remember(user.getUserId(), user.getEmail());
        }
        String anonymousUsername = "deleted_u" + user.getUserId();
        String anonymousEmail = "deleted_u" + user.getUserId() + "@invalid.local";
        if (userRepository.existsByUsername(anonymousUsername)
                || userRepository.existsByEmailIgnoreCase(anonymousEmail)) {
            throw new IllegalArgumentException("Định danh lưu trữ nội bộ đã tồn tại. Vui lòng liên hệ quản trị hệ thống");
        }
        user.setReleasedUsername(user.getUsername());
        user.setReleasedEmail(user.getEmail());
        user.setUsername(anonymousUsername);
        user.setEmail(anonymousEmail);
        user.setRegistrationReleased(true);
        user.setPasswordVersion(user.getPasswordVersion() + 1);
        userRepository.saveAndFlush(user);
    }

}

