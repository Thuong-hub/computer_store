package com.computerstore.backend.controller.commerce;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.service.commerce.SepayWebhookService;

@RestController
@RequestMapping("/api/webhooks/sepay")
public class SepayWebhookController {

    private static final Logger log =
            LoggerFactory.getLogger(SepayWebhookController.class);

    private final SepayWebhookService sepayWebhookService;

    public SepayWebhookController(
            SepayWebhookService sepayWebhookService) {
        this.sepayWebhookService = sepayWebhookService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> receiveWebhook(
            @RequestBody byte[] rawBody,
            @RequestHeader(
                    value = "X-SePay-Signature",
                    required = false
            ) String signature,
            @RequestHeader(
                    value = "X-SePay-Timestamp",
                    required = false
            ) String timestamp,
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authorization) {

        try {
            sepayWebhookService.processWebhook(
                    rawBody,
                    signature,
                    timestamp,
                    authorization
            );

            return ResponseEntity.ok(
                    Map.of("success", true)
            );

        } catch (SecurityException e) {
            log.warn("[SEPAY] AUTH FAILED: {}", e.getMessage());

            return ResponseEntity
                    .status(401)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));

        } catch (IllegalStateException e) {
            log.error("[SEPAY] Webhook configuration error: {}", e.getMessage());

            return ResponseEntity
                    .status(503)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));

        } catch (RuntimeException e) {
            log.error("[SEPAY] Webhook processing rejected: {}", e.getMessage());

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        }
    }
}
