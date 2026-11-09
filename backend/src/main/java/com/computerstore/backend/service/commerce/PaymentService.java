package com.computerstore.backend.service.commerce;

import java.time.LocalDateTime;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.dto.response.PaymentResponse;
import com.computerstore.backend.entity.Order;
import com.computerstore.backend.entity.Payment;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.OrderRepository;
import com.computerstore.backend.repository.PaymentRepository;
import com.computerstore.backend.repository.UserRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MembershipService membershipService;

    public PaymentService(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            MembershipService membershipService) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.membershipService = membershipService;
    }

    @Transactional
    public Payment createPaymentForOrder(
            Order order,
            String paymentMethod) {

        if (order == null || order.getOrderId() == null) {
            throw new RuntimeException("Đơn hàng không hợp lệ");
        }

        if (paymentMethod == null || paymentMethod.isBlank()) {
            throw new RuntimeException("Vui lòng chọn phương thức thanh toán");
        }

        String method = paymentMethod.trim().toUpperCase(Locale.ROOT);

        if (!"COD".equals(method) && !"BANK_TRANSFER".equals(method)) {
            throw new RuntimeException("Phương thức thanh toán không hợp lệ");
        }

        if (paymentRepository.existsByOrderId(order.getOrderId())) {
            throw new RuntimeException("Đơn hàng đã có thông tin thanh toán");
        }

        Payment payment = new Payment();
        payment.setOrderId(order.getOrderId());
        payment.setPaymentMethod(method);
        payment.setPaymentStatus("PENDING");
        payment.setAmount(order.getTotalAmount());
        payment.setTransactionCode(null);
        payment.setPaidAt(null);

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment markBankTransferAsPaidFromSepay(
            Long orderId,
            String transactionCode) {

        Order order = orderRepository
                .findByIdLocked(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        Payment payment = paymentRepository
                .findByOrderIdForUpdate(orderId)
                .orElseThrow(() -> new RuntimeException("Thông tin thanh toán không tồn tại"));

        if ("PAID".equalsIgnoreCase(payment.getPaymentStatus())) {
            return payment;
        }

        if (!"BANK_TRANSFER".equalsIgnoreCase(payment.getPaymentMethod())) {
            throw new RuntimeException("Đơn hàng không sử dụng chuyển khoản");
        }

        if ("CANCELLED".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Đơn hàng đã hủy");
        }

        if (!"PENDING".equalsIgnoreCase(payment.getPaymentStatus())) {
            throw new RuntimeException("Trạng thái thanh toán hiện tại không hợp lệ");
        }

        payment.setPaymentStatus("PAID");
        payment.setPaidAt(LocalDateTime.now());
        payment.setTransactionCode(transactionCode);

        if ("PENDING".equalsIgnoreCase(order.getStatus())) {
            order.setStatus("CONFIRMED");
            orderRepository.save(order);
        }

        Payment savedPayment = paymentRepository.saveAndFlush(payment);
        membershipService.refreshTier(order.getUserId());
        return savedPayment;
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentForUser(
            String username,
            Long orderId) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if (!order.getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Bạn không có quyền xem thanh toán của đơn hàng này");
        }

        Payment payment = paymentRepository
                .findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Thông tin thanh toán không tồn tại"));

        return toResponse(payment);
    }

    @Transactional
    public Payment markPaymentAsPaid(Long orderId) {

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        Payment payment = paymentRepository
                .findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Thông tin thanh toán không tồn tại"));

        if ("PAID".equals(payment.getPaymentStatus())) {
            throw new RuntimeException("Đơn hàng đã được thanh toán");
        }

        if (!"PENDING".equals(payment.getPaymentStatus())) {
            throw new RuntimeException("Trạng thái thanh toán hiện tại không hợp lệ");
        }

        String method = String.valueOf(payment.getPaymentMethod()).toUpperCase(Locale.ROOT);

        if ("COD".equals(method)) {
            if (!"COMPLETED".equals(order.getStatus())) {
                throw new RuntimeException("COD chỉ xác nhận thanh toán khi đơn hàng đã hoàn thành");
            }
        } else if ("BANK_TRANSFER".equals(method)) {
            if ("CANCELLED".equals(order.getStatus())) {
                throw new RuntimeException("Đơn hàng đã hủy, không thể xác nhận chuyển khoản");
            }

            if ("PENDING".equals(order.getStatus())) {
                order.setStatus("CONFIRMED");
                orderRepository.save(order);
            }
        } else {
            throw new RuntimeException("Phương thức thanh toán không hợp lệ");
        }

        payment.setPaymentStatus("PAID");
        payment.setPaidAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.saveAndFlush(payment);
        membershipService.refreshTier(order.getUserId());
        return savedPayment;
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentForAdmin(Long orderId) {

        orderRepository
                .findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        Payment payment = paymentRepository
                .findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Thông tin thanh toán không tồn tại"));

        return toResponse(payment);
    }

    private PaymentResponse toResponse(Payment payment) {

        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getOrderId(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getAmount(),
                payment.getTransactionCode(),
                payment.getPaidAt(),
                payment.getCreatedAt()
        );
    }
}
