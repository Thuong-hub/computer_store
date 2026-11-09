package com.computerstore.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.computerstore.backend.entity.Review;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    
    List<Review> findByProductIdOrderByCreatedAtDesc(
            Long productId
    );


    
    Optional<Review> findByUserIdAndProductId(
            Long userId,
            Long productId
    );


    
    boolean existsByUserIdAndProductId(
            Long userId,
            Long productId
    );
}