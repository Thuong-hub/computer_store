package com.computerstore.backend.service.commerce;

import com.computerstore.backend.service.catalog.InventoryService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.dto.request.CheckoutRequest;
import com.computerstore.backend.dto.response.OrderDetailResponse;
import com.computerstore.backend.dto.response.OrderItemResponse;
import com.computerstore.backend.entity.Cart;
import com.computerstore.backend.entity.CartItem;
import com.computerstore.backend.entity.Order;
import com.computerstore.backend.entity.OrderItem;
import com.computerstore.backend.entity.Product;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.CartItemRepository;
import com.computerstore.backend.repository.CartRepository;
import com.computerstore.backend.repository.OrderItemRepository;
import com.computerstore.backend.repository.OrderRepository;
import com.computerstore.backend.repository.ProductRepository;
import com.computerstore.backend.repository.UserRepository;

@Service
public class OrderService {

        private final UserRepository userRepository;
        private final CartRepository cartRepository;
        private final CartItemRepository cartItemRepository;
        private final ProductRepository productRepository;
        private final OrderRepository orderRepository;
        private final OrderItemRepository orderItemRepository;
        private final PaymentService paymentService;
        private final PromotionService promotionService;
        private final MembershipService membershipService;
        private final SalePricingService salePricingService;
        private final InventoryService inventoryService;

    public OrderService(
        UserRepository userRepository,
        CartRepository cartRepository,
        CartItemRepository cartItemRepository,
        ProductRepository productRepository,
        OrderRepository orderRepository,
        OrderItemRepository orderItemRepository,
        PaymentService paymentService,
        PromotionService promotionService,
        MembershipService membershipService,
        SalePricingService salePricingService,
        InventoryService inventoryService) {

    this.userRepository = userRepository;
    this.cartRepository = cartRepository;
    this.cartItemRepository = cartItemRepository;
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.orderItemRepository = orderItemRepository;
    this.paymentService = paymentService;
    this.promotionService = promotionService;
    this.membershipService = membershipService;
    this.salePricingService = salePricingService;
    this.inventoryService = inventoryService;
}


    @Transactional
    public Order checkout(
            String username,
            CheckoutRequest request) {

        if (request.getRecipientName() == null || request.getRecipientName().isBlank()) {

            throw new RuntimeException(
                    "Tên người nhận không được để trống"
            );
        }

        if (request.getPhone() == null || request.getPhone().isBlank()) {

            throw new RuntimeException(
                    "Số điện thoại không được để trống"
            );
        }

        if (request.getShippingAddress() == null || request.getShippingAddress().isBlank()) {

            throw new RuntimeException(
                    "Địa chỉ giao hàng không được để trống"
            );
        }


        User user = userRepository
                .findByUsernameLocked(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );


        Cart cart = cartRepository
                .findByUserId(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Giỏ hàng không tồn tại"
                        )
                );


        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getCartId());


        if (cartItems.isEmpty()) {
            throw new RuntimeException(
                    "Giỏ hàng đang trống"
            );
        }


        BigDecimal originalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {

            Product product = productRepository
                    .findById(cartItem.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Sản phẩm không tồn tại"
                            )
                    );


            if (!"ACTIVE".equalsIgnoreCase(
                    product.getStatus()
            )) {

                throw new RuntimeException(
                        "Sản phẩm "
                        + product.getName()
                        + " hiện đã ngừng bán"
                );
            }


            if (cartItem.getQuantity()
                    > product.getStockQuantity()) {

                throw new RuntimeException(
                        "Sản phẩm "
                        + product.getName()
                        + " không đủ tồn kho"
                );
            }


            BigDecimal subtotal = product.getPrice().multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()
                            )
                    );


            originalAmount = originalAmount.add(subtotal);
        }


        SalePricingService.Quote quote = salePricingService.quote(
                user, cartItems, request.getPromotionCode());
        originalAmount = quote.originalAmount();
        BigDecimal discountAmount = quote.discountAmount();
        BigDecimal totalAmount = quote.totalAmount();
        String promotionCode = quote.promotionCode();

        Order order = new Order();

        order.setUserId(user.getUserId());

        order.setRecipientName(
                request.getRecipientName()
        );

        order.setPhone(
                request.getPhone()
        );

        order.setShippingAddress(
                request.getShippingAddress()
        );

        order.setNote(
                request.getNote()
        );

        order.setOriginalAmount(originalAmount);

        order.setDiscountAmount(discountAmount);

        order.setPromotionCode(promotionCode);
        if (quote.memberType() != null) {
            order.setMemberDiscountType(quote.memberType());
            order.setMemberDiscountPercent(BigDecimal.valueOf(quote.memberPercent()));
        }

        order.setTotalAmount(totalAmount);

        order.setStatus("PENDING");


        order = orderRepository.save(order);

        if ("MEMBERSHIP".equals(quote.source()) && "WELCOME".equals(quote.memberType())) {
            membershipService.reserveWelcome(user, order.getOrderId());
        } else if ("COUPON".equals(quote.source())) {
            promotionService.redeem(user, promotionCode, order.getOrderId());
        }


        for (CartItem cartItem : cartItems) {

            Product product = productRepository
                    .findById(cartItem.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Sản phẩm không tồn tại"
                            )
                    );


            if (!"ACTIVE".equalsIgnoreCase(
                    product.getStatus()
            )) {

                throw new RuntimeException(
                        "Sản phẩm "
                        + product.getName()
                        + " hiện đã ngừng bán"
                );
            }


            BigDecimal price =
                    product.getPrice();

            BigDecimal subtotal =
                    price.multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()
                            )
                    );


            OrderItem orderItem =
                    new OrderItem();

            orderItem.setOrderId(
                    order.getOrderId()
            );

            orderItem.setProductId(
                    product.getProductId()
            );

            orderItem.setQuantity(
                    cartItem.getQuantity()
            );

            orderItem.setPrice(price);

            orderItem.setSubtotal(subtotal);

            quote.lines().stream()
                    .filter(l -> l.productId().equals(product.getProductId()))
                    .findFirst()
                    .ifPresent(l -> {
                        BigDecimal lineDiscount = l.originalSubtotal()
                                .subtract(l.finalSubtotal())
                                .max(BigDecimal.ZERO);
                        orderItem.setDiscountAmount(lineDiscount);
                        orderItem.setDiscountLabel(lineDiscount.signum() > 0
                                ? salePricingService.lineLabel(quote, l)
                                : null);
                    });


            orderItemRepository.save(orderItem);


            inventoryService.change(product.getProductId(), -cartItem.getQuantity(),
                "ORDER_OUT", order.getOrderId(), username, "Xuất kho theo đơn hàng");
        }


        paymentService.createPaymentForOrder(
                order,
                request.getPaymentMethod()
        );


        cartItemRepository.deleteByCartId(
                cart.getCartId()
        );


        return order;
    }

    @Transactional(readOnly = true)
    public List<Order> getMyOrders(String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(
                        user.getUserId()
                );
    }

        @Transactional(readOnly = true)
        public OrderDetailResponse getOrderDetail(
                String username,
                Long orderId) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );


        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Đơn hàng không tồn tại"
                        )
                );


        if (!order.getUserId().equals(user.getUserId())) {

                throw new RuntimeException(
                        "Bạn không có quyền xem đơn hàng này"
                );
        }


        List<OrderItem> orderItems =
                orderItemRepository
                        .findByOrderId(orderId);


        List<OrderItemResponse> itemResponses =
                orderItems.stream()
                        .map(orderItem -> {

                                Product product =
                                        productRepository
                                                .findById(
                                                        orderItem.getProductId()
                                                )
                                                .orElseThrow(() ->
                                                        new RuntimeException(
                                                                "Sản phẩm không tồn tại"
                                                        )
                                                );


                                return new OrderItemResponse(
                                        orderItem.getOrderItemId(),
                                        orderItem.getProductId(),
                                        product.getName(),
                                        product.getImageUrl(),
                                        orderItem.getQuantity(),

                                        orderItem.getPrice(),

                                        orderItem.getSubtotal(),

                                        orderItem.getDiscountAmount(),

                                        orderItem.getDiscountLabel()
                                );

                        })
                        .toList();


                return new OrderDetailResponse(
                order.getOrderId(),
                order.getRecipientName(),
                order.getPhone(),
                order.getShippingAddress(),

                order.getOriginalAmount(),
                order.getDiscountAmount(),
                order.getPromotionCode(),

                order.getTotalAmount(),
                order.getStatus(),
                order.getNote(),
                order.getCreatedAt(),
                itemResponses
        );
        }

        @Transactional
        public Order cancelOrder(
                String username,
                Long orderId) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );


        Order order = orderRepository
                .findByIdLocked(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Đơn hàng không tồn tại"
                        )
                );


        if (!order.getUserId().equals(user.getUserId())) {

                throw new RuntimeException(
                        "Bạn không có quyền hủy đơn hàng này"
                );
        }


        if (!"PENDING".equals(order.getStatus())) {

                throw new RuntimeException(
                        "Chỉ có thể hủy đơn hàng đang ở trạng thái PENDING"
                );
        }


        List<OrderItem> orderItems =
                orderItemRepository
                        .findByOrderId(orderId);


        for (OrderItem orderItem : orderItems) {

                Product product = productRepository
                        .findById(orderItem.getProductId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sản phẩm không tồn tại"
                                )
                        );


                inventoryService.change(product.getProductId(), orderItem.getQuantity(),
                    "ORDER_CANCEL", orderId, username, "Hoàn kho khi khách hủy đơn");
        }


        order.setStatus("CANCELLED");
        promotionService.release(order.getOrderId());
        membershipService.releaseWelcome(order.getOrderId());

        return orderRepository.save(order);
        }

        @Transactional(readOnly = true)
        public List<Order> getAllOrders() {

        return orderRepository
                .findAllByOrderByCreatedAtDesc();
        }

        @Transactional
        public Order updateOrderStatus(
                Long orderId,
                String newStatus) {

        if (newStatus == null || newStatus.isBlank()) {
                throw new RuntimeException(
                        "Trạng thái không được để trống"
                );
        }


        newStatus = newStatus
                .trim()
                .toUpperCase(Locale.ROOT);


        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Đơn hàng không tồn tại"
                        )
                );


        String currentStatus =
                order.getStatus();


        switch (currentStatus) {

                case "PENDING":

                if (!"CONFIRMED".equals(newStatus)) {
                        throw new RuntimeException(
                                "Đơn hàng PENDING chỉ có thể chuyển sang CONFIRMED"
                        );
                }

                break;


                case "CONFIRMED":

                if (!"SHIPPING".equals(newStatus)) {
                        throw new RuntimeException(
                                "Đơn hàng CONFIRMED chỉ có thể chuyển sang SHIPPING"
                        );
                }

                break;


                case "SHIPPING":

                if (!"COMPLETED".equals(newStatus)) {
                        throw new RuntimeException(
                                "Đơn hàng SHIPPING chỉ có thể chuyển sang COMPLETED"
                        );
                }

                break;


                case "COMPLETED":

                throw new RuntimeException(
                        "Đơn hàng đã hoàn thành, không thể thay đổi trạng thái"
                );


                case "CANCELLED":

                throw new RuntimeException(
                        "Đơn hàng đã bị hủy, không thể thay đổi trạng thái"
                );


                default:

                throw new RuntimeException(
                        "Trạng thái đơn hàng hiện tại không hợp lệ"
                );
        }


        order.setStatus(newStatus);


        Order savedOrder = orderRepository.saveAndFlush(order);
        if ("COMPLETED".equals(newStatus)) {
            membershipService.refreshTier(savedOrder.getUserId());
        }
        return savedOrder;
        }

        @Transactional(readOnly = true)
        public OrderDetailResponse getOrderDetailForAdmin(
                Long orderId) {

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Đơn hàng không tồn tại"
                        )
                );


        List<OrderItem> orderItems =
                orderItemRepository
                        .findByOrderId(orderId);


        List<OrderItemResponse> itemResponses =
                orderItems.stream()
                        .map(orderItem -> {

                                Product product =
                                        productRepository
                                                .findById(
                                                        orderItem.getProductId()
                                                )
                                                .orElseThrow(() ->
                                                        new RuntimeException(
                                                                "Sản phẩm không tồn tại"
                                                        )
                                                );


                                return new OrderItemResponse(
                                        orderItem.getOrderItemId(),
                                        orderItem.getProductId(),

                                        product.getName(),
                                        product.getImageUrl(),

                                        orderItem.getQuantity(),

                                        orderItem.getPrice(),

                                        orderItem.getSubtotal(),

                                        orderItem.getDiscountAmount(),

                                        orderItem.getDiscountLabel()
                                );

                        })
                        .toList();


                return new OrderDetailResponse(
                order.getOrderId(),
                order.getRecipientName(),
                order.getPhone(),
                order.getShippingAddress(),

                order.getOriginalAmount(),
                order.getDiscountAmount(),
                order.getPromotionCode(),

                order.getTotalAmount(),
                order.getStatus(),
                order.getNote(),
                order.getCreatedAt(),
                itemResponses
        );
        }
}