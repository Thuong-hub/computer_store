package com.computerstore.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.computerstore.backend.entity.SupportMessage;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {
    List<SupportMessage> findTop100ByConversationConversationIdOrderByMessageIdDesc(Long conversationId);
    List<SupportMessage> findByConversationConversationIdAndMessageIdGreaterThanOrderByMessageIdAsc(Long conversationId, Long afterId);
    List<SupportMessage> findByConversationConversationIdAndSenderAndReadFalse(Long conversationId, String sender);
    long countByConversationConversationIdAndSenderAndReadFalse(Long conversationId, String sender);
}
