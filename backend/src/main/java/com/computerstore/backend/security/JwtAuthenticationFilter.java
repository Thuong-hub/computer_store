package com.computerstore.backend.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Lấy Authorization header
        String authHeader =request.getHeader("Authorization");


        // Nếu không có token hoặc không bắt đầu bằng Bearer
        // thì cho request đi tiếp
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }


        // Bỏ chữ "Bearer " để lấy JWT
        String token = authHeader.substring(7);


        try {

            // Kiểm tra token
            if (jwtService.isTokenValid(token)) {

                // Lấy username từ token
                String username = jwtService.extractUsername(token);


                // Chỉ xác thực nếu chưa có authentication
                if (SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

                    User user = userRepository
                            .findByUsername(username)
                            .orElse(null);


                        // Chỉ xác thực nếu user tồn tại
                        // và tài khoản đang ACTIVE
                        if (user != null
                                && Boolean.TRUE.equals(user.getEmailVerified())
                                && "ACTIVE".equalsIgnoreCase(
                                        user.getStatus()
                                )
                                && jwtService.hasCurrentPasswordVersion(token, user)) {

                        SimpleGrantedAuthority authority =
                                new SimpleGrantedAuthority(
                                        "ROLE_" + user.getRole()
                                );


                        UsernamePasswordAuthenticationToken
                                authentication =
                                new UsernamePasswordAuthenticationToken(
                                        user.getUsername(),
                                        null,
                                        List.of(authority)
                                );


                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);
                        }
                }
            }

        } catch (Exception e) {

            // Token lỗi thì không xác thực.
            // SecurityConfig sẽ quyết định API có được truy cập hay không.
        }


        filterChain.doFilter(request, response);
    }
}