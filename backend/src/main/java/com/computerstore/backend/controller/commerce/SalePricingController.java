package com.computerstore.backend.controller.commerce;

import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.computerstore.backend.entity.Cart;
import com.computerstore.backend.entity.CartItem;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.CartItemRepository;
import com.computerstore.backend.repository.CartRepository;
import com.computerstore.backend.repository.UserRepository;
import com.computerstore.backend.service.commerce.SalePricingService;

@RestController
@RequestMapping("/api/pricing")
public class SalePricingController {

    private final SalePricingService pricing;
    private final UserRepository users;
    private final CartRepository carts;
    private final CartItemRepository cartItems;

    public SalePricingController(SalePricingService pricing, UserRepository users,
            CartRepository carts, CartItemRepository cartItems) {
        this.pricing = pricing;
        this.users = users;
        this.carts = carts;
        this.cartItems = cartItems;
    }

    @GetMapping("/products")
    public ResponseEntity<?> products() {
        return ResponseEntity.ok(pricing.publicPrices());
    }

    @GetMapping("/cart-quote")
    public ResponseEntity<?> cartQuote(Principal principal,
            @RequestParam(required = false) String promotionCode) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập");
        }
        User user = users.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));
        Cart cart = carts.findByUserId(user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Giỏ hàng đang trống"));
        List<CartItem> items = cartItems.findByCartId(cart.getCartId());
        return ResponseEntity.ok(pricing.quote(user, items, promotionCode));
    }
}
