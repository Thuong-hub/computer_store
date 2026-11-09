package com.computerstore.backend.controller.commerce;

import java.util.HashMap;
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

import com.computerstore.backend.dto.request.AddCartItemRequest;
import com.computerstore.backend.dto.response.CartResponse;
import com.computerstore.backend.dto.request.UpdateCartItemRequest;
import com.computerstore.backend.entity.Cart;
import com.computerstore.backend.entity.CartItem;
import com.computerstore.backend.service.commerce.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }


    
    @GetMapping
    public ResponseEntity<?> getMyCart(
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        String username = authentication.getName();

        Cart cart = cartService.getOrCreateCart(username);

        Map<String, Object> response = new HashMap<>();

        response.put("cartId", cart.getCartId());
        response.put("userId", cart.getUserId());
        response.put("createdAt", cart.getCreatedAt());
        response.put("updatedAt", cart.getUpdatedAt());

        return ResponseEntity.ok(response);
    }

   
    @PostMapping("/items")
    public ResponseEntity<?> addItem(
            Authentication authentication,
            @RequestBody AddCartItemRequest request) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        try {

            String username = authentication.getName();

            CartItem cartItem = cartService.addItem(
                    username,
                    request.getProductId(),
                    request.getQuantity()
            );

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Thêm vào giỏ hàng thành công");
            response.put("cartItemId", cartItem.getCartItemId());
            response.put("cartId", cartItem.getCartId());
            response.put("productId", cartItem.getProductId());
            response.put("quantity", cartItem.getQuantity());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    
    @GetMapping("/items")
    public ResponseEntity<?> getCartItems(
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        try {

            String username = authentication.getName();

            CartResponse cartResponse =
                    cartService.getCartDetails(username);

            return ResponseEntity.ok(cartResponse);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

   
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<?> updateCartItem(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @RequestBody UpdateCartItemRequest request) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        try {

            String username = authentication.getName();

            CartItem cartItem =
                    cartService.updateItemQuantity(
                            username,
                            cartItemId,
                            request.getQuantity()
                    );

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Cập nhật số lượng thành công");
            response.put("cartItemId", cartItem.getCartItemId());
            response.put("productId", cartItem.getProductId());
            response.put("quantity", cartItem.getQuantity());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<?> deleteCartItem(
            Authentication authentication,
            @PathVariable Long cartItemId) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        try {

            String username = authentication.getName();

            cartService.deleteCartItem(
                    username,
                    cartItemId
            );

            return ResponseEntity.ok(
                    Map.of(
                        "message",
                        "Xóa sản phẩm khỏi giỏ thành công"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }


    @DeleteMapping("/items")
    public ResponseEntity<?> clearCart(
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Chưa đăng nhập")
            );
        }

        try {

            String username = authentication.getName();

            cartService.clearCart(username);

            return ResponseEntity.ok(
                    Map.of(
                        "message",
                        "Đã xóa toàn bộ sản phẩm trong giỏ"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }
}