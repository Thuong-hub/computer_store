package com.computerstore.backend.service.commerce;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.dto.request.SepayWebhookRequest;
import com.computerstore.backend.entity.Payment;
import com.computerstore.backend.repository.PaymentRepository;
import tools.jackson.databind.json.JsonMapper;

@Service
public class SepayWebhookService {

    private static final Logger log =
            LoggerFactory.getLogger(SepayWebhookService.class);

    private final JsonMapper objectMapper = JsonMapper.builder().build();
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;

    private final String webhookSecret;
    private final String webhookApiKey;
    private final boolean allowNoAuth;
    private final String webhookAuthMode;
    private final String bankAccount;
    private final String paymentPrefix;

    public SepayWebhookService(
            PaymentRepository paymentRepository,
            PaymentService paymentService,
            @Value("${sepay.webhook.secret:}") String webhookSecret,
            @Value("${sepay.webhook.api-key:}") String webhookApiKey,
            @Value("${sepay.webhook.allow-no-auth:false}") boolean allowNoAuth,
            @Value("${sepay.webhook.auth-mode:HMAC}") String webhookAuthMode,
            @Value("${sepay.bank.account:0123456789}") String bankAccount,
            @Value("${sepay.payment.prefix:CS}") String paymentPrefix) {

        this.paymentRepository = paymentRepository;
        this.paymentService = paymentService;
        this.webhookSecret = webhookSecret == null ? "" : webhookSecret.strip();
        this.webhookApiKey = webhookApiKey == null ? "" : webhookApiKey.strip();
        this.allowNoAuth = allowNoAuth;
        this.webhookAuthMode = webhookAuthMode == null
                ? "HMAC"
                : webhookAuthMode.strip().toUpperCase(Locale.ROOT);

        log.info(
                "[SEPAY] Authentication configuration: mode={}, secretConfigured={}, apiKeyConfigured={}, noAuthAllowed={}",
                this.webhookAuthMode,
                !this.webhookSecret.isEmpty(),
                !this.webhookApiKey.isEmpty(),
                this.allowNoAuth
        );
        this.bankAccount = bankAccount;
        this.paymentPrefix = paymentPrefix;
    }

    @Transactional
    public void processWebhook(
            byte[] rawBody,
            String signature,
            String timestampHeader,
            String authorization) {

        int bodyLength = rawBody == null ? 0 : rawBody.length;

        log.info(
                "[SEPAY] WEBHOOK RECEIVED: authMode={}, signaturePresent={}, timestampPresent={}, authorizationPresent={}, rawBodyLength={}, secretConfigured={}, apiKeyConfigured={}",
                webhookAuthMode,
                signature != null && !signature.isBlank(),
                timestampHeader != null && !timestampHeader.isBlank(),
                authorization != null && !authorization.isBlank(),
                bodyLength,
                !webhookSecret.isEmpty(),
                !webhookApiKey.isEmpty()
        );

        verifyAuthentication(rawBody, signature, timestampHeader, authorization);
        log.info("[SEPAY] AUTH VERIFIED: mode={}", webhookAuthMode);

        try {
            SepayWebhookRequest request =
                    objectMapper.readValue(rawBody, SepayWebhookRequest.class);

            if (!"in".equalsIgnoreCase(
                    String.valueOf(request.transferType()).trim())) {
                throw new RuntimeException("Không phải giao dịch tiền vào");
            }

            if (request.accountNumber() == null
                    || !bankAccount.equals(request.accountNumber().trim())) {
                log.warn("[SEPAY] BANK ACCOUNT MISMATCH: receivedAccountSuffix={}",
                        maskAccount(request.accountNumber()));
                throw new RuntimeException("Sai tài khoản nhận tiền");
            }

            log.info(
                    "[SEPAY] Transaction received: id={}, accountSuffix={}, transferType={}, amount={}, code={}, content={}, referenceCode={}",
                    request.id(),
                    maskAccount(request.accountNumber()),
                    request.transferType(),
                    request.transferAmount(),
                    request.code(),
                    request.content(),
                    request.referenceCode()
            );

            Long orderId = extractOrderId(
                    request.code(),
                    request.content(),
                    request.description()
            );

            log.info("[SEPAY] extractedOrderId={}", orderId);

            Payment payment = paymentRepository
                    .findByOrderId(orderId)
                    .orElseThrow(() -> {
                        log.warn("[SEPAY] PAYMENT NOT FOUND: orderId={}", orderId);
                        return new RuntimeException(
                                "Không tìm thấy thanh toán của đơn hàng"
                        );
                    });

            if (!"BANK_TRANSFER".equalsIgnoreCase(payment.getPaymentMethod())) {
                throw new RuntimeException(
                        "Đơn hàng không sử dụng chuyển khoản"
                );
            }

            BigDecimal receivedAmount = request.transferAmount();
            if (receivedAmount == null
                    || receivedAmount.compareTo(payment.getAmount()) != 0) {
                log.warn(
                        "[SEPAY] AMOUNT MISMATCH: orderId={}, receivedAmount={}, expectedAmount={}",
                        orderId,
                        receivedAmount,
                        payment.getAmount()
                );
                throw new RuntimeException(
                        "Số tiền chuyển khoản không khớp đơn hàng"
                );
            }

            String transactionCode = buildTransactionCode(request);
            Payment duplicate = paymentRepository
                    .findByTransactionCode(transactionCode)
                    .orElse(null);

            if (duplicate != null
                    && !duplicate.getOrderId().equals(orderId)) {
                throw new RuntimeException(
                        "Mã giao dịch đã được sử dụng cho đơn hàng khác"
                );
            }

            paymentService.markBankTransferAsPaidFromSepay(
                    orderId,
                    transactionCode
            );

            log.info(
                    "[SEPAY] PAYMENT CONFIRMED: orderId={}, transactionCode={}, amount={}",
                    orderId,
                    transactionCode,
                    receivedAmount
            );

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("[SEPAY] DATABASE OR PAYLOAD PROCESSING FAILED", e);
            throw new RuntimeException(
                    "Không thể xử lý webhook SePay",
                    e
            );
        }
    }

    private void verifyAuthentication(
            byte[] rawBody,
            String signature,
            String timestampHeader,
            String authorization) {

        switch (webhookAuthMode) {
            case "HMAC" -> {
                if (webhookSecret.isBlank()) {
                    log.error("[SEPAY] SECRET NOT CONFIGURED for HMAC mode");
                    throw new IllegalStateException(
                            "Webhook đang dùng HMAC nhưng chưa cấu hình SEPAY_WEBHOOK_SECRET"
                    );
                }

                SepayHmacVerifier.verify(
                        webhookSecret,
                        signature,
                        timestampHeader,
                        rawBody
                );
            }
            case "API_KEY" -> {
                if (webhookApiKey.isBlank()) {
                    log.error("[SEPAY] API KEY NOT CONFIGURED for API_KEY mode");
                    throw new IllegalStateException(
                            "Webhook đang dùng API Key nhưng chưa cấu hình SEPAY_WEBHOOK_API_KEY"
                    );
                }

                String expectedAuthorization = "Apikey " + webhookApiKey;
                String receivedAuthorization = authorization == null
                        ? ""
                        : authorization.strip();

                if (!java.security.MessageDigest.isEqual(
                        expectedAuthorization.getBytes(StandardCharsets.UTF_8),
                        receivedAuthorization.getBytes(StandardCharsets.UTF_8))) {
                    throw new SecurityException("API Key SePay không hợp lệ");
                }
            }
            case "NONE" -> {
                if (!allowNoAuth) {
                    throw new IllegalStateException(
                            "No Authentication chưa được cho phép trong cấu hình"
                    );
                }

                log.warn("[SEPAY] Webhook received without authentication by explicit configuration");
            }
            default -> throw new IllegalStateException(
                    "sepay.webhook.auth-mode không hợp lệ. Chọn HMAC, API_KEY hoặc NONE"
            );
        }
    }

    private String maskAccount(String accountNumber) {
        if (accountNumber == null || accountNumber.isBlank()) {
            return "unknown";
        }

        String normalized = accountNumber.trim();
        if (normalized.length() <= 4) {
            return "****";
        }

        return "****" + normalized.substring(normalized.length() - 4);
    }

    private Long extractOrderId(
            String code,
            String content,
            String description) {

        Pattern pattern = Pattern.compile(
                "(?i)\\b"
                + Pattern.quote(paymentPrefix)
                + "(\\d{6,8})\\b"
        );

        for (String value : new String[]{code, content, description}) {
            if (value == null || value.isBlank()) {
                continue;
            }

            Matcher matcher = pattern.matcher(value);
            if (matcher.find()) {
                return Long.parseLong(matcher.group(1));
            }
        }

        throw new RuntimeException(
                "Không tìm thấy mã thanh toán đơn hàng"
        );
    }

    private String buildTransactionCode(SepayWebhookRequest request) {
        if (request.id() != null) {
            return "SEPAY-ID-" + request.id();
        }

        if (request.referenceCode() != null
                && !request.referenceCode().isBlank()) {
            return request.referenceCode().trim();
        }

        throw new RuntimeException("Webhook không có mã giao dịch");
    }
}
