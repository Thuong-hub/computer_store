package com.computerstore.backend.controller.admin;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.service.commerce.InvoicePrintRequestService;

@RestController
@RequestMapping("/api/admin/invoice-requests")
public class AdminInvoicePrintRequestController {

    private final InvoicePrintRequestService requestService;

    public AdminInvoicePrintRequestController(InvoicePrintRequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public ResponseEntity<?> getRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @PutMapping("/{requestId}/complete")
    public ResponseEntity<?> completeRequest(
            Authentication authentication,
            @PathVariable Long requestId) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Chưa đăng nhập"));
        }

        try {
            return ResponseEntity.ok(requestService.markProcessed(requestId, authentication.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }
}
