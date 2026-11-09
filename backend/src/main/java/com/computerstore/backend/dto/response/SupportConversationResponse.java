package com.computerstore.backend.dto.response;

import java.time.LocalDateTime;

public record SupportConversationResponse(
        Long conversationId,
        String username,
        String customerCode,
        String email,
        LocalDateTime lastMessageAt,
        long unreadCount) {
}
