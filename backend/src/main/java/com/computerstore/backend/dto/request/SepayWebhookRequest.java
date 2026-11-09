package com.computerstore.backend.dto.request;

import java.math.BigDecimal;

public record SepayWebhookRequest(
        Long id,
        String gateway,
        String transactionDate,
        String accountNumber,
        String code,
        String content,
        String transferType,
        BigDecimal transferAmount,
        String referenceCode,
        String description
) {
}
