package com.computerstore.backend.service.admin;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.dto.response.AdminDashboardResponse;
import com.computerstore.backend.dto.response.LowStockProductResponse;
import com.computerstore.backend.dto.response.MonthlyRevenueResponse;
import com.computerstore.backend.dto.response.TopSellingProductResponse;
import com.computerstore.backend.entity.Product;
import com.computerstore.backend.repository.OrderItemRepository;
import com.computerstore.backend.repository.OrderRepository;
import com.computerstore.backend.repository.PaymentRepository;
import com.computerstore.backend.repository.ProductRepository;
import com.computerstore.backend.repository.UserRepository;

@Service
public class AdminDashboardService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final OrderItemRepository orderItemRepository;

    public AdminDashboardService(
            ProductRepository productRepository,
            UserRepository userRepository,
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            OrderItemRepository orderItemRepository) {

        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.orderItemRepository = orderItemRepository;
    }


    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {

        
        long totalProducts = productRepository.count();

        
        long lowStockProducts =productRepository.countByStockQuantityLessThanEqual(5);

     
        long totalUsers = userRepository.count();


  
        long totalOrders = orderRepository.count();

        
        Long totalUnitsSoldValue =orderItemRepository.sumTotalUnitsSold();

        long totalUnitsSold =totalUnitsSoldValue == null? 0: totalUnitsSoldValue;

        
        long pendingOrders = orderRepository.countByStatus("PENDING");

        long confirmedOrders = orderRepository.countByStatus( "CONFIRMED");

        long shippingOrders = orderRepository.countByStatus("SHIPPING");

        long completedOrders = orderRepository.countByStatus("COMPLETED");

        long cancelledOrders = orderRepository.countByStatus("CANCELLED");


        
        BigDecimal totalRevenue = paymentRepository.sumPaidAmount();

           
        LocalDateTime startOfToday =LocalDate.now().atStartOfDay();


       
        LocalDateTime startOfTomorrow =LocalDate.now().plusDays(1).atStartOfDay();


      
        BigDecimal todayRevenue =paymentRepository.sumPaidAmountBetween(startOfToday,startOfTomorrow);
        
        LocalDateTime startOfMonth =LocalDate.now().withDayOfMonth(1).atStartOfDay();


        
        LocalDateTime startOfNextMonth =LocalDate.now().plusMonths(1).withDayOfMonth(1).atStartOfDay();


        
        BigDecimal thisMonthRevenue =paymentRepository.sumPaidAmountBetween(startOfMonth,startOfNextMonth);

        if (thisMonthRevenue == null) {
            thisMonthRevenue = BigDecimal.ZERO;
        }
        
        if (todayRevenue == null) {
            todayRevenue = BigDecimal.ZERO;
        }
    
        
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }


       
      return new AdminDashboardResponse(
        totalProducts,
        lowStockProducts,
        totalUsers,
        totalOrders,
        totalUnitsSold,
        pendingOrders,
        confirmedOrders,
        shippingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        todayRevenue,
        thisMonthRevenue
);
    }

    @Transactional(readOnly = true)
    public List<MonthlyRevenueResponse> getMonthlyRevenue(
            int year) {

        List<MonthlyRevenueResponse> result =
                new ArrayList<>();


        
        for (int month = 1; month <= 12; month++) {

            
            LocalDateTime startOfMonth =
                    LocalDate
                            .of(year, month, 1)
                            .atStartOfDay();


            
            LocalDateTime startOfNextMonth =
                    startOfMonth.plusMonths(1);


            
            BigDecimal revenue =
                    paymentRepository.sumPaidAmountBetween(
                            startOfMonth,
                            startOfNextMonth
                    );


            
            if (revenue == null) {
                revenue = BigDecimal.ZERO;
            }


            
            result.add(
                    new MonthlyRevenueResponse(
                            month,
                            year,
                            revenue
                    )
            );
        }


        return result;
    }

    @Transactional(readOnly = true)
    public List<TopSellingProductResponse> getTopSellingProducts(
            int limit) {

        
        if (limit <= 0) {
            throw new RuntimeException(
                    "Limit phải lớn hơn 0"
            );
        }

        
        if (limit > 20) {
            limit = 20;
        }


        Pageable pageable =
                PageRequest.of(
                        0,
                        limit
                );


        List<Object[]> rows =
                orderItemRepository
                        .findTopSellingProducts(
                                pageable
                        );


        return rows.stream()
                .map(row -> {

                    
                    Long productId =
                            ((Number) row[0])
                                    .longValue();


                    
                    Long totalSold =
                            ((Number) row[1])
                                    .longValue();


                    Product product =
                            productRepository
                                    .findById(productId)
                                    .orElseThrow(() ->
                                            new RuntimeException(
                                                    "Sản phẩm không tồn tại"
                                            )
                                    );


                    return new TopSellingProductResponse(
                            product.getProductId(),
                            product.getName(),
                            product.getImageUrl(),
                            product.getPrice(),
                            totalSold
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LowStockProductResponse> getLowStockProducts(
            int threshold) {

        
        if (threshold < 0) {
            throw new RuntimeException(
                    "Ngưỡng tồn kho không hợp lệ"
            );
        }


        List<Product> products =
                productRepository
                        .findByStockQuantityLessThanEqualOrderByStockQuantityAsc(
                                threshold
                        );


        return products.stream()
                .map(product ->
                        new LowStockProductResponse(
                                product.getProductId(),
                                product.getName(),
                                product.getImageUrl(),
                                product.getPrice(),
                                product.getStockQuantity()
                        )
                )
                .toList();
    }

    
}