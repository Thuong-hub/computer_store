package com.computerstore.backend.controller.commerce;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.dto.request.CheckoutRequest;
import com.computerstore.backend.dto.response.OrderDetailResponse;
import com.computerstore.backend.dto.response.PaymentResponse;
import com.computerstore.backend.entity.Order;
import com.computerstore.backend.service.commerce.OrderService;
import com.computerstore.backend.service.commerce.PaymentService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

        private final OrderService orderService;
        private final PaymentService paymentService;

        public OrderController(
                OrderService orderService,
                PaymentService paymentService) {

        this.orderService = orderService;
        this.paymentService = paymentService;
        }


 
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            Authentication authentication,
            @RequestBody CheckoutRequest request) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        try {

            String username = authentication.getName();

            Order order = orderService.checkout(
                    username,
                    request
            );


            Map<String, Object> response = new HashMap<>();

            response.put(
                    "message",
                    "Đặt hàng thành công"
            );

            response.put(
                    "orderId",
                    order.getOrderId()
            );

            response.put(
                    "recipientName",
                    order.getRecipientName()
            );

            response.put(
                    "phone",
                    order.getPhone()
            );

            response.put(
                    "shippingAddress",
                    order.getShippingAddress()
            );

            response.put(
                    "totalAmount",
                    order.getTotalAmount()
            );

            response.put(
                    "status",
                    order.getStatus()
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

   
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        try {

            String username =
                    authentication.getName();

            List<Order> orders =
                    orderService.getMyOrders(username);

            return ResponseEntity.ok(orders);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                        "message",
                        e.getMessage()
                    )
            );
        }
        }

      
        @GetMapping("/{orderId}")
        public ResponseEntity<?> getOrderDetail(
                Authentication authentication,
                @PathVariable Long orderId) {

        if (authentication == null) {
                return ResponseEntity.status(401).body(
                        Map.of("message", "Chưa đăng nhập")
                );
        }

        try {

                String username =
                        authentication.getName();

                OrderDetailResponse response =
                        orderService.getOrderDetail(
                                username,
                                orderId
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

        
        @PutMapping("/{orderId}/cancel")
        public ResponseEntity<?> cancelOrder(
                Authentication authentication,
                @PathVariable Long orderId) {

        if (authentication == null) {
                return ResponseEntity.status(401).body(
                        Map.of("message", "Chưa đăng nhập")
                );
        }

        try {

                String username =
                        authentication.getName();

                Order order =
                        orderService.cancelOrder(
                                username,
                                orderId
                        );

                return ResponseEntity.ok(
                        Map.of(
                                "message", "Hủy đơn hàng thành công",
                                "orderId", order.getOrderId(),
                                "status", order.getStatus()
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

        
        @GetMapping("/{orderId}/payment")
        public ResponseEntity<?> getOrderPayment(
                Authentication authentication,
                @PathVariable Long orderId) {

        if (authentication == null) {
                return ResponseEntity.status(401).body(
                        Map.of("message", "Chưa đăng nhập")
                );
        }

        try {

                String username =
                        authentication.getName();

                PaymentResponse response =
                        paymentService.getPaymentForUser(
                                username,
                                orderId
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
}