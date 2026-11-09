package com.computerstore.backend.dto.response;

import java.time.LocalDateTime;

public record SupportMessageResponse(
        Long messageId,
        String sender,
        String content,
        LocalDateTime createdAt) {
}
