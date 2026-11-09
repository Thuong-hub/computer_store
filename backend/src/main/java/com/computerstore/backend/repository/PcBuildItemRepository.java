package com.computerstore.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.computerstore.backend.entity.PcBuildItem;

public interface PcBuildItemRepository
        extends JpaRepository<PcBuildItem, Long> {

    List<PcBuildItem> findByBuildId(Long buildId);

    Optional<PcBuildItem> findByBuildItemIdAndBuildId(
            Long buildItemId,
            Long buildId
    );

    List<PcBuildItem> findAllByBuildIdAndProductId(
            Long buildId,
            Long productId
    );

    void deleteByBuildId(Long buildId);
}