package com.computerstore.backend.controller.commerce;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.entity.InvoicePrintRequest;
import com.computerstore.backend.service.commerce.InvoicePrintRequestService;

@RestController
@RequestMapping("/api/orders/{orderId}/invoice-request")
public class InvoicePrintRequestController {

    private final InvoicePrintRequestService requestService;

    public InvoicePrintRequestController(InvoicePrintRequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public ResponseEntity<?> getMyRequest(Authentication authentication, @PathVariable Long orderId) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Chưa đăng nhập"));
        }

        try {
            Optional<InvoicePrintRequest> request = requestService.getMyRequest(authentication.getName(), orderId);
            if (request.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(request.get());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> requestInvoice(Authentication authentication, @PathVariable Long orderId) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Chưa đăng nhập"));
        }

        try {
            InvoicePrintRequest request = requestService.createRequest(authentication.getName(), orderId);
            return ResponseEntity.ok(request);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
