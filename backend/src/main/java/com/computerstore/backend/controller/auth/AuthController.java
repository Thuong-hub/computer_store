package com.computerstore.backend.controller.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.dto.request.ChangePasswordRequest;
import com.computerstore.backend.dto.request.LoginRequest;
import com.computerstore.backend.dto.request.RegisterRequest;
import com.computerstore.backend.dto.request.UpdateProfileRequest;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.security.JwtService;
import com.computerstore.backend.service.account.UserService;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
   public AuthController(
        UserService userService,
        JwtService jwtService) {

    this.userService = userService;
    this.jwtService = jwtService;
}


    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            User user = userService.register(request);

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Đăng ký thành công. Vui lòng nhập mã xác minh được gửi đến Gmail");
            response.put("userId", user.getUserId());
            response.put("customerCode", user.getCustomerCode());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("emailVerified", user.getEmailVerified());
            response.put("fullName", user.getFullName());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            User user = userService.login(request);

            String token = jwtService.generateToken(user);

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Đăng nhập thành công");
            response.put("token", token);
            response.put("userId", user.getUserId());
            response.put("customerCode", user.getCustomerCode());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        String username = authentication.getName();

        User user = userService.getUserByUsername(username);

        Map<String, Object> response = new HashMap<>();

        response.put("userId", user.getUserId());
        response.put("customerCode", user.getCustomerCode());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("phone", user.getPhone());
        response.put("address", user.getAddress());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }


@PutMapping("/me")
public ResponseEntity<?> updateProfile(
        Authentication authentication,
        @RequestBody UpdateProfileRequest request) {

    if (authentication == null) {

        return ResponseEntity
                .status(401)
                .body(
                        Map.of(
                                "message",
                                "Chưa đăng nhập"
                        )
                );
    }


    try {

        String username =
                authentication.getName();


        User user =
                userService.updateProfile(
                        username,
                        request
                );


        Map<String, Object> response =
                new HashMap<>();


        response.put(
                "message",
                "Cập nhật thông tin thành công"
        );

        response.put(
                "userId",
                user.getUserId()
        );

        response.put(
                "customerCode",
                user.getCustomerCode()
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

        response.put(
                "role",
                user.getRole()
        );


        return ResponseEntity.ok(
                response
        );


    } catch (RuntimeException e) {

        return ResponseEntity
                .badRequest()
                .body(
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

    if (authentication == null) {

        return ResponseEntity
                .status(401)
                .body(
                        Map.of(
                                "message",
                                "Chưa đăng nhập"
                        )
                );
    }


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

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                e.getMessage()
                        )
                );
    }
}
}