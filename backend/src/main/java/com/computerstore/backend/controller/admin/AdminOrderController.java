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

import com.computerstore.backend.dto.response.OrderDetailResponse;
import com.computerstore.backend.dto.response.PaymentResponse;
import com.computerstore.backend.dto.request.UpdateOrderStatusRequest;
import com.computerstore.backend.entity.Order;
import com.computerstore.backend.entity.Payment;
import com.computerstore.backend.service.commerce.OrderService;
import com.computerstore.backend.service.commerce.PaymentService;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;

    public AdminOrderController(
            OrderService orderService,
            PaymentService paymentService) {

        this.orderService = orderService;
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusRequest request) {

        try {
            Order order = orderService.updateOrderStatus(orderId, request.getStatus());

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Cập nhật trạng thái đơn hàng thành công",
                            "orderId", order.getOrderId(),
                            "status", order.getStatus()
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetail(
            @PathVariable Long orderId) {

        try {
            OrderDetailResponse response = orderService.getOrderDetailForAdmin(orderId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{orderId}/payment/paid")
    public ResponseEntity<?> markPaymentAsPaid(
            @PathVariable Long orderId) {

        try {
            Payment payment = paymentService.markPaymentAsPaid(orderId);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Xác nhận thanh toán thành công",
                            "orderId", payment.getOrderId(),
                            "paymentId", payment.getPaymentId(),
                            "paymentMethod", payment.getPaymentMethod(),
                            "paymentStatus", payment.getPaymentStatus(),
                            "paidAt", payment.getPaidAt()
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{orderId}/payment")
    public ResponseEntity<?> getPayment(
            @PathVariable Long orderId) {

        try {
            PaymentResponse response = paymentService.getPaymentForAdmin(orderId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
