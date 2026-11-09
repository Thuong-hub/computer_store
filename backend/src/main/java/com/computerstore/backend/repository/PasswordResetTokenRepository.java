package com.computerstore.backend.repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import com.computerstore.backend.entity.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<PasswordResetToken> findByTokenHash(String hash);
    Optional<PasswordResetToken> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
    List<PasswordResetToken> findByUserIdAndUsedAtIsNull(Long userId);
}
