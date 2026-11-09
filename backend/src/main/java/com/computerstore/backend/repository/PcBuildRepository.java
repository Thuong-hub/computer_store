package com.computerstore.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.computerstore.backend.entity.PcBuild;

public interface PcBuildRepository
        extends JpaRepository<PcBuild, Long> {

    
    List<PcBuild> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );


    
    Optional<PcBuild> findByBuildIdAndUserId(
            Long buildId,
            Long userId
    );
}