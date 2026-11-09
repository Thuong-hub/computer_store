package com.computerstore.backend.controller.commerce;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.dto.response.WishlistItemResponse;
import com.computerstore.backend.entity.Wishlist;
import com.computerstore.backend.service.commerce.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(
            WishlistService wishlistService) {

        this.wishlistService =
                wishlistService;
    }

    @GetMapping
    public ResponseEntity<?> getWishlist(
            Authentication authentication) {

        if (authentication == null) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Chưa đăng nhập"
                            )
                    );
        }

        try {

            List<WishlistItemResponse> items =
                    wishlistService.getWishlist(
                            authentication.getName()
                    );

            return ResponseEntity.ok(
                    items
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(
            Authentication authentication,
            @PathVariable Long productId) {

        if (authentication == null) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Chưa đăng nhập"
                            )
                    );
        }

        try {

            Wishlist wishlist =
                    wishlistService.addToWishlist(
                            authentication.getName(),
                            productId
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Đã thêm sản phẩm vào danh sách yêu thích",
                            "wishlistId",
                            wishlist.getWishlistId(),
                            "productId",
                            wishlist.getProductId()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(
            Authentication authentication,
            @PathVariable Long productId) {

        if (authentication == null) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Chưa đăng nhập"
                            )
                    );
        }

        try {

            wishlistService.removeFromWishlist(
                    authentication.getName(),
                    productId
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Đã xóa sản phẩm khỏi danh sách yêu thích"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}
