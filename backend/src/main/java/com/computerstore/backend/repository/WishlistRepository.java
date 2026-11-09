package com.computerstore.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.computerstore.backend.entity.Wishlist;

public interface WishlistRepository
        extends JpaRepository<Wishlist, Long> {

    
    List<Wishlist> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );


    
    Optional<Wishlist> findByUserIdAndProductId(
            Long userId,
            Long productId
    );


    
    boolean existsByUserIdAndProductId(
            Long userId,
            Long productId
    );
}