package com.computerstore.backend.controller.catalog;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.dto.request.CreateReviewRequest;
import com.computerstore.backend.dto.response.ReviewResponse;
import com.computerstore.backend.dto.request.UpdateReviewRequest;
import com.computerstore.backend.entity.Review;
import com.computerstore.backend.service.catalog.ReviewService;

@RestController
@RequestMapping("/api/products")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(
            ReviewService reviewService) {

        this.reviewService = reviewService;
    }


    
    @PostMapping("/{productId}/reviews")
    public ResponseEntity<?> createReview(
            Authentication authentication,
            @PathVariable Long productId,
            @RequestBody CreateReviewRequest request) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        try {

            String username =
                    authentication.getName();

            Review review =
                    reviewService.createReview(
                            username,
                            productId,
                            request
                    );


            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Đánh giá sản phẩm thành công"
            );

            response.put(
                    "reviewId",
                    review.getReviewId()
            );

            response.put(
                    "productId",
                    review.getProductId()
            );

            response.put(
                    "rating",
                    review.getRating()
            );

            response.put(
                    "comment",
                    review.getComment()
            );

            response.put(
                    "status",
                    review.getStatus()
            );


            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

    
    @GetMapping("/{productId}/reviews")
    public ResponseEntity<?> getReviewsByProduct(
            @PathVariable Long productId) {

        try {

            List<ReviewResponse> reviews =
                    reviewService.getReviewsByProduct(
                            productId
                    );

            return ResponseEntity.ok(reviews);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

    
    @PutMapping("/{productId}/reviews")
    public ResponseEntity<?> updateReview(
            Authentication authentication,
            @PathVariable Long productId,
            @RequestBody UpdateReviewRequest request) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        try {

            String username =
                    authentication.getName();

            Review review =
                    reviewService.updateReview(
                            username,
                            productId,
                            request
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Cập nhật đánh giá thành công"
            );

            response.put(
                    "reviewId",
                    review.getReviewId()
            );

            response.put(
                    "productId",
                    review.getProductId()
            );

            response.put(
                    "rating",
                    review.getRating()
            );

            response.put(
                    "comment",
                    review.getComment()
            );

            response.put(
                    "status",
                    review.getStatus()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

   
    @DeleteMapping("/{productId}/reviews")
    public ResponseEntity<?> deleteReview(
            Authentication authentication,
            @PathVariable Long productId) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        try {

            String username =
                    authentication.getName();

            reviewService.deleteReview(
                    username,
                    productId
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Xóa đánh giá thành công"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }
}