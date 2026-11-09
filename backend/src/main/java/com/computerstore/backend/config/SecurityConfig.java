package com.computerstore.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import jakarta.servlet.DispatcherType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.computerstore.backend.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

            // REST API dùng JWT nên tạm tắt CSRF
            .csrf(csrf -> csrf.disable())

            // Không dùng session đăng nhập
            .sessionManagement(session ->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Cho phép Spring Boot trả về mã lỗi gốc khi backend phát sinh lỗi.
            // Nếu không, dispatch /error có thể bị biến thành 403.
            .authorizeHttpRequests(auth -> auth
                .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()

                // ================= FRONTEND PUBLIC =================
            .requestMatchers(
                "/",
                "/index.html",
                "/css/**",
                "/js/**",
                "/images/**",
                "/pages/**",
                "/favicon.ico"
            ).permitAll()
                
            // SePay webhook public endpoint
            .requestMatchers(
                HttpMethod.POST,
                "/api/webhooks/sepay"
            ).permitAll()

            // Auth public
            .requestMatchers(
                HttpMethod.POST,
                "/api/auth/register","/api/auth/login",
                "/api/auth/verify-email", "/api/auth/resend-verification",
                "/api/auth/forgot-password", "/api/auth/reset-password"
                
            ).permitAll()


            // Product public
            .requestMatchers(
                HttpMethod.GET,
                "/api/products/**"
            ).permitAll()


            .requestMatchers(HttpMethod.GET, "/api/pricing/products").permitAll()

            // Category public
            .requestMatchers(
                HttpMethod.GET,
                "/api/categories/**"
            ).permitAll()


            // Brand public
            .requestMatchers(
                HttpMethod.GET,
                "/api/brands/**"
            ).permitAll()

           
            // User tạo review
            .requestMatchers(
                HttpMethod.POST,
                "/api/products/*/reviews"
            ).authenticated()


            // User sửa review
            .requestMatchers(
                HttpMethod.PUT,
                "/api/products/*/reviews"
            ).authenticated()

            // User xóa review
            .requestMatchers(
                HttpMethod.DELETE,
                "/api/products/*/reviews"
            ).authenticated()

            // ADMIN quản lý product
            // PRODUCTS - CHỈ ADMIN ĐƯỢC THÊM/SỬA/XÓA

            .requestMatchers(
                    HttpMethod.POST,
                    "/api/products/**"
            ).hasRole("ADMIN")

            .requestMatchers(
                    HttpMethod.PUT,
                    "/api/products/**"
            ).hasRole("ADMIN")

            .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/products/**"
            ).hasRole("ADMIN")


            // ADMIN quản lý brand
            .requestMatchers(
                HttpMethod.POST,
                "/api/brands/**"
            ).hasRole("ADMIN")

            .requestMatchers(
                HttpMethod.PUT,
                "/api/brands/**"
            ).hasRole("ADMIN")

            .requestMatchers(
                HttpMethod.DELETE,
                "/api/brands/**"
            ).hasRole("ADMIN")


            // Tất cả API bắt đầu bằng /api/admin/
            // chỉ ADMIN mới được truy cập
            .requestMatchers(
                "/api/admin/**"
            ).hasRole("ADMIN")


            // Các API còn lại phải đăng nhập
            .anyRequest().authenticated()
        )

            // Gắn JWT Filter trước filter đăng nhập mặc định
            .addFilterBefore(jwtAuthenticationFilter,UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}