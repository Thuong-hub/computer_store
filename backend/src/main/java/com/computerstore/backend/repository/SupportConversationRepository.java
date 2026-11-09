package com.computerstore.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.computerstore.backend.entity.SupportConversation;

public interface SupportConversationRepository extends JpaRepository<SupportConversation, Long> {
    Optional<SupportConversation> findByUserUserId(Long userId);
    List<SupportConversation> findAllByOrderByLastMessageAtDesc();
}
