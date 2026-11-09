package com.computerstore.backend.controller.admin;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.dto.response.AdminUserResponse;
import com.computerstore.backend.dto.request.UpdateUserStatusRequest;
import com.computerstore.backend.service.admin.AdminUserService;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;


    public AdminUserController(
            AdminUserService adminUserService) {

        this.adminUserService = adminUserService;
    }


    
    @GetMapping
    public ResponseEntity<List<AdminUserResponse>>
            getAllUsers() {

        List<AdminUserResponse> users =
                adminUserService.getAllUsers();

        return ResponseEntity.ok(users);
    }

    
    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserResponse>
            getUserById(
                    @PathVariable Long userId) {

        AdminUserResponse user =
                adminUserService.getUserById(userId);

        return ResponseEntity.ok(user);
    }

    
    @GetMapping("/search")
    public ResponseEntity<List<AdminUserResponse>>
            searchUsers(@RequestParam(required = false) String keyword) {

        List<AdminUserResponse> users =
                adminUserService.searchUsers(keyword);

        return ResponseEntity.ok(users);
    }

    
    @PutMapping("/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UpdateUserStatusRequest request) {

        try {

            AdminUserResponse user =
                    adminUserService.updateUserStatus(
                            userId,
                            request.getStatus()
                    );


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Cập nhật trạng thái tài khoản thành công",
                            "userId",
                            user.getUserId(),
                            "username",
                            user.getUsername(),
                            "status",
                            user.getStatus()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            adminUserService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "Đã xóa tài khoản. Lịch sử giao dịch vẫn được giữ nguyên"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PutMapping("/{userId}/restore")
    public ResponseEntity<?> restoreUser(@PathVariable Long userId) {
        try {
            adminUserService.restoreUser(userId);
            return ResponseEntity.ok(Map.of("message", "Khôi phục tài khoản thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{userId}/allow-registration")
    public ResponseEntity<?> allowRegistrationAgain(@PathVariable Long userId) {
        try {
            adminUserService.allowRegistrationAgain(userId);
            return ResponseEntity.ok(Map.of(
                    "message", "Đã cho phép đăng ký lại username/Gmail. Lịch sử tài khoản cũ vẫn được lưu"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

}
