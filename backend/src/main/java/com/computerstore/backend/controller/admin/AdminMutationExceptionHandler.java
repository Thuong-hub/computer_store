package com.computerstore.backend.controller.admin;

import com.computerstore.backend.controller.catalog.ProductController;

import jakarta.persistence.PersistenceException;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = { ProductController.class, AdminProductController.class, AdminInventoryController.class })
public class AdminMutationExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(AdminMutationExceptionHandler.class);

    @ExceptionHandler({ IllegalArgumentException.class, IllegalStateException.class })
    public ResponseEntity<Map<String, String>> badRequest(RuntimeException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler({ DataAccessException.class, PersistenceException.class })
    public ResponseEntity<Map<String, String>> databaseFailure(Exception exception) {
        log.error("Lỗi MySQL/JPA khi cập nhật sản phẩm hoặc kho", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Không thể ghi dữ liệu MySQL. Kiểm tra cấu trúc bảng inventory_movements và log Spring Boot."
        ));
    }
}
