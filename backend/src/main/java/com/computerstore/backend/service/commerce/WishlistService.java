package com.computerstore.backend.service.commerce;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.dto.response.WishlistItemResponse;
import com.computerstore.backend.entity.Product;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.entity.Wishlist;
import com.computerstore.backend.repository.ProductRepository;
import com.computerstore.backend.repository.UserRepository;
import com.computerstore.backend.repository.WishlistRepository;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistService(
            WishlistRepository wishlistRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {

        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Wishlist addToWishlist(
            String username,
            Long productId) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sản phẩm không tồn tại"
                        )
                );

        if (wishlistRepository
                .existsByUserIdAndProductId(
                        user.getUserId(),
                        product.getProductId()
                )) {

            throw new RuntimeException(
                    "Sản phẩm đã có trong danh sách yêu thích"
            );
        }

        Wishlist wishlist = new Wishlist();

        wishlist.setUserId(
                user.getUserId()
        );

        wishlist.setProductId(
                product.getProductId()
        );

        return wishlistRepository.save(wishlist);
    }

    @Transactional(readOnly = true)
    public List<WishlistItemResponse> getWishlist(
            String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        List<Wishlist> wishlistItems =
                wishlistRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                user.getUserId()
                        );

        return wishlistItems.stream()
                .map(wishlist -> {

                    Product product = productRepository
                            .findById(
                                    wishlist.getProductId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Sản phẩm không tồn tại"
                                    )
                            );

                    return new WishlistItemResponse(
                            wishlist.getWishlistId(),
                            product.getProductId(),
                            product.getName(),
                            product.getPrice(),
                            product.getImageUrl(),
                            product.getStockQuantity(),
                            wishlist.getCreatedAt()
                    );

                })
                .toList();
    }

    @Transactional
    public void removeFromWishlist(
            String username,
            Long productId) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        Wishlist wishlist = wishlistRepository
                .findByUserIdAndProductId(
                        user.getUserId(),
                        productId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sản phẩm không có trong danh sách yêu thích"
                        )
                );

        wishlistRepository.delete(wishlist);
    }
}
