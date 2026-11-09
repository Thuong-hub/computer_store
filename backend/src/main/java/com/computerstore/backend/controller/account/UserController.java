package com.computerstore.backend.controller.account;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.dto.request.ChangePasswordRequest;
import com.computerstore.backend.dto.request.UpdateProfileRequest;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.service.account.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;


    public UserController(
            UserService userService) {

        this.userService = userService;
    }


    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {

        try {

            String username =
                    authentication.getName();


            User user =
                    userService.updateProfile(
                            username,
                            request
                    );


            Map<String, Object> response =
                    new LinkedHashMap<>();

            response.put(
                    "message",
                    "Cập nhật thông tin cá nhân thành công"
            );

            response.put(
                    "userId",
                    user.getUserId()
            );

            response.put(
                    "username",
                    user.getUsername()
            );

            response.put(
                    "email",
                    user.getEmail()
            );

            response.put(
                    "fullName",
                    user.getFullName()
            );

            response.put(
                    "phone",
                    user.getPhone()
            );

            response.put(
                    "address",
                    user.getAddress()
            );


            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

    
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {

        try {

            String username =
                    authentication.getName();


            userService.changePassword(
                    username,
                    request
            );


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Đổi mật khẩu thành công"
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
}