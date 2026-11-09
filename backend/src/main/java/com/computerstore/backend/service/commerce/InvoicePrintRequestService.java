package com.computerstore.backend.service.commerce;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.entity.InvoicePrintRequest;
import com.computerstore.backend.entity.Order;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.InvoicePrintRequestRepository;
import com.computerstore.backend.repository.OrderRepository;
import com.computerstore.backend.repository.UserRepository;

@Service
public class InvoicePrintRequestService {

    private final InvoicePrintRequestRepository requestRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public InvoicePrintRequestService(
            InvoicePrintRequestRepository requestRepository,
            OrderRepository orderRepository,
            UserRepository userRepository) {

        this.requestRepository = requestRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public InvoicePrintRequest createRequest(String username, Long orderId) {
        User user = getUser(username);
        Order order = orderRepository.findByIdLocked(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Đơn hàng không tồn tại"));

        if (!order.getUserId().equals(user.getUserId())) {
            throw new SecurityException("Bạn không có quyền yêu cầu in hóa đơn này");
        }

        if ("CANCELLED".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Đơn hàng đã hủy không thể yêu cầu in hóa đơn");
        }

        Optional<InvoicePrintRequest> existing = requestRepository.findByOrderId(orderId);
        if (existing.isPresent()) {
            return existing.get();
        }

        InvoicePrintRequest request = new InvoicePrintRequest();
        request.setOrderId(order.getOrderId());
        request.setUserId(user.getUserId());
        request.setStatus("PENDING");
        request.setRequestedAt(LocalDateTime.now());
        return requestRepository.saveAndFlush(request);
    }

    @Transactional(readOnly = true)
    public Optional<InvoicePrintRequest> getMyRequest(String username, Long orderId) {
        User user = getUser(username);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Đơn hàng không tồn tại"));

        if (!order.getUserId().equals(user.getUserId())) {
            throw new SecurityException("Bạn không có quyền xem yêu cầu này");
        }

        return requestRepository.findByOrderId(orderId);
    }

    @Transactional(readOnly = true)
    public List<InvoicePrintRequest> getAllRequests() {
        return requestRepository.findAllByOrderByRequestedAtDesc();
    }

    @Transactional
    public InvoicePrintRequest markProcessed(Long requestId, String adminUsername) {
        InvoicePrintRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Yêu cầu in hóa đơn không tồn tại"));

        if (!"PROCESSED".equals(request.getStatus())) {
            request.setStatus("PROCESSED");
            request.setProcessedAt(LocalDateTime.now());
            request.setProcessedBy(adminUsername);
        }

        return requestRepository.save(request);
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));
    }
}
