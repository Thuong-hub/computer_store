package com.computerstore.backend.service.catalog;

import java.util.List;
import java.util.Locale;

import com.computerstore.backend.dto.request.CreateReviewRequest;
import com.computerstore.backend.dto.response.ReviewResponse;
import com.computerstore.backend.dto.request.UpdateReviewRequest;
import com.computerstore.backend.entity.Product;
import com.computerstore.backend.entity.Review;
import com.computerstore.backend.entity.User;

import com.computerstore.backend.repository.OrderItemRepository;
import com.computerstore.backend.repository.ProductRepository;
import com.computerstore.backend.repository.ReviewRepository;
import com.computerstore.backend.repository.UserRepository;
import com.computerstore.backend.dto.response.AdminReviewResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            OrderItemRepository orderItemRepository) {

        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional
    public Review createReview(
            String username,
            Long productId,
            CreateReviewRequest request) {

        if (request.getRating() == null) {
            throw new RuntimeException(
                    "Vui lòng chọn số sao đánh giá"
            );
        }

        if (request.getRating() < 1
                || request.getRating() > 5) {

            throw new RuntimeException(
                    "Rating phải từ 1 đến 5"
            );
        }

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

        boolean purchased =
                orderItemRepository
                        .hasUserPurchasedProduct(
                                user.getUserId(),
                                product.getProductId()
                        );

        if (!purchased) {
            throw new RuntimeException(
                    "Bạn chỉ có thể đánh giá sản phẩm đã mua và đơn hàng đã hoàn thành"
            );
        }

        if (reviewRepository
                .existsByUserIdAndProductId(
                        user.getUserId(),
                        product.getProductId()
                )) {

            throw new RuntimeException(
                    "Bạn đã đánh giá sản phẩm này rồi"
            );
        }

        Review review = new Review();

        review.setUserId(
                user.getUserId()
        );

        review.setProductId(
                product.getProductId()
        );

        review.setRating(
                request.getRating()
        );

        review.setComment(
                request.getComment()
        );

        review.setStatus(
                "ACTIVE"
        );

        return reviewRepository.save(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProduct(
            Long productId) {

        productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sản phẩm không tồn tại"
                        )
                );

        List<Review> reviews =
                reviewRepository
                        .findByProductIdOrderByCreatedAtDesc(
                                productId
                        );

        return reviews.stream()

                .filter(review ->
                        "ACTIVE".equals(
                                review.getStatus()
                        )
                )

                .map(review -> {

                    User user = userRepository
                            .findById(review.getUserId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User của review không tồn tại"
                                    )
                            );

                    return new ReviewResponse(
                            review.getReviewId(),
                            review.getUserId(),
                            user.getUsername(),
                            review.getRating(),
                            review.getComment(),
                            review.getCreatedAt()
                    );
                })

                .toList();
    }

    @Transactional
    public Review updateReview(
            String username,
            Long productId,
            UpdateReviewRequest request) {

        if (request.getRating() == null) {
            throw new RuntimeException(
                    "Vui lòng chọn số sao đánh giá"
            );
        }

        if (request.getRating() < 1
                || request.getRating() > 5) {

            throw new RuntimeException(
                    "Rating phải từ 1 đến 5"
            );
        }

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

        Review review = reviewRepository
                .findByUserIdAndProductId(
                        user.getUserId(),
                        product.getProductId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bạn chưa đánh giá sản phẩm này"
                        )
                );

        review.setRating(
                request.getRating()
        );

        review.setComment(
                request.getComment()
        );

        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(
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

        Review review = reviewRepository
                .findByUserIdAndProductId(
                        user.getUserId(),
                        product.getProductId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bạn chưa đánh giá sản phẩm này"
                        )
                );

        reviewRepository.delete(review);
    }

    @Transactional(readOnly = true)
    public List<AdminReviewResponse> getAllReviewsForAdmin() {

        List<Review> reviews =
                reviewRepository.findAll();

        return reviews.stream()
                .map(review -> {

                    User user = userRepository
                            .findById(review.getUserId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User của review không tồn tại"
                                    )
                            );

                    Product product = productRepository
                            .findById(review.getProductId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Sản phẩm của review không tồn tại"
                                    )
                            );

                    return new AdminReviewResponse(
                            review.getReviewId(),

                            review.getUserId(),
                            user.getUsername(),

                            review.getProductId(),
                            product.getName(),

                            review.getRating(),
                            review.getComment(),

                            review.getStatus(),

                            review.getCreatedAt()
                    );
                })
                .toList();
    }

    @Transactional
    public Review updateReviewStatus(
            Long reviewId,
            String newStatus) {

        if (newStatus == null || newStatus.isBlank()) {
            throw new RuntimeException(
                    "Trạng thái review không được để trống"
            );
        }

        String status = newStatus
                .trim()
                .toUpperCase(Locale.ROOT);

        if (!"ACTIVE".equals(status)
                && !"HIDDEN".equals(status)) {

            throw new RuntimeException(
                    "Trạng thái review chỉ được là ACTIVE hoặc HIDDEN"
            );
        }

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Review không tồn tại"
                        )
                );

        review.setStatus(status);

        return reviewRepository.save(review);
    }
}
