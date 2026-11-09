package com.computerstore.backend.controller.admin;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.dto.response.AdminReviewResponse;
import com.computerstore.backend.dto.request.UpdateReviewStatusRequest;
import com.computerstore.backend.entity.Review;
import com.computerstore.backend.service.catalog.ReviewService;

@RestController
@RequestMapping("/api/admin/reviews")
public class AdminReviewController {

    private final ReviewService reviewService;


    public AdminReviewController(
            ReviewService reviewService) {

        this.reviewService = reviewService;
    }


    
    @GetMapping
    public ResponseEntity<List<AdminReviewResponse>>
            getAllReviews() {

        List<AdminReviewResponse> reviews =
                reviewService.getAllReviewsForAdmin();

        return ResponseEntity.ok(reviews);
    }

    
    @PutMapping("/{reviewId}/status")
    public ResponseEntity<?> updateReviewStatus(
            @PathVariable Long reviewId,
            @RequestBody UpdateReviewStatusRequest request) {

        try {

            Review review =
                    reviewService.updateReviewStatus(
                            reviewId,
                            request.getStatus()
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Cập nhật trạng thái review thành công",
                            "reviewId",
                            review.getReviewId(),
                            "status",
                            review.getStatus()
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