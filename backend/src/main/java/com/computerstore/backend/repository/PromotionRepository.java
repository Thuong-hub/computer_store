package com.computerstore.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;

import com.computerstore.backend.entity.Promotion;

public interface PromotionRepository
        extends JpaRepository<Promotion, Long> {

    
    Optional<Promotion> findByCodeIgnoreCase(
            String code
    );

    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Promotion p WHERE UPPER(p.code) = UPPER(:code)")
    Optional<Promotion> findByCodeLocked(@Param("code") String code);

    boolean existsByCodeIgnoreCase(
            String code
    );
}