package com.computerstore.backend.service.commerce;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.dto.response.CartItemResponse;
import com.computerstore.backend.dto.response.CartResponse;
import com.computerstore.backend.entity.Cart;
import com.computerstore.backend.entity.CartItem;
import com.computerstore.backend.entity.Product;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.CartItemRepository;
import com.computerstore.backend.repository.CartRepository;
import com.computerstore.backend.repository.ProductRepository;
import com.computerstore.backend.repository.UserRepository;
@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }


    
    public Cart getOrCreateCart(String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User không tồn tại")
                );

        return cartRepository
                .findByUserId(user.getUserId())
                .orElseGet(() -> {

                    Cart cart = new Cart();
                    cart.setUserId(user.getUserId());

                    return cartRepository.save(cart);
                });
    }


    
    @Transactional
    public CartItem addItem(
            String username,
            Long productId,
            Integer quantity) {

        
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Số lượng phải lớn hơn 0"
            );
        }


      
        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sản phẩm không tồn tại"
                        )
                );

        
        if (!"ACTIVE".equalsIgnoreCase(
                product.getStatus()
        )) {

            throw new RuntimeException(
                    "Sản phẩm này hiện đã ngừng bán"
            );
        }
      
        Cart cart = getOrCreateCart(username);


        
        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(
                        cart.getCartId(),
                        productId
                )
                .orElse(null);


        
        if (cartItem != null) {

            int newQuantity =
                    cartItem.getQuantity() + quantity;

           
            if (newQuantity > product.getStockQuantity()) {
                throw new RuntimeException(
                        "Số lượng vượt quá tồn kho"
                );
            }

            cartItem.setQuantity(newQuantity);

            return cartItemRepository.save(cartItem);
        }


        
        if (quantity > product.getStockQuantity()) {
            throw new RuntimeException(
                    "Số lượng vượt quá tồn kho"
            );
        }


        CartItem newItem = new CartItem();

        newItem.setCartId(cart.getCartId());
        newItem.setProductId(productId);
        newItem.setQuantity(quantity);

        return cartItemRepository.save(newItem);
    }

    @Transactional
    public CartResponse getCartDetails(String username) {

        Cart cart = getOrCreateCart(username);

        List<CartItem> cartItems =
                cartItemRepository.findByCartId(cart.getCartId());

        List<CartItemResponse> itemResponses =
                new ArrayList<>();

        int totalQuantity = 0;

        BigDecimal totalPrice = BigDecimal.ZERO;


        for (CartItem cartItem : cartItems) {

            Product product = productRepository
                    .findById(cartItem.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Sản phẩm không tồn tại"
                            )
                    );


            BigDecimal subtotal =
                    product.getPrice().multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()
                            )
                    );


            CartItemResponse itemResponse =
                    new CartItemResponse();

            itemResponse.setCartItemId(
                    cartItem.getCartItemId()
            );

            itemResponse.setProductId(
                    product.getProductId()
            );

            itemResponse.setProductName(
                    product.getName()
            );

            itemResponse.setImageUrl(
                    product.getImageUrl()
            );

            itemResponse.setPrice(
                    product.getPrice()
            );

            itemResponse.setQuantity(
                    cartItem.getQuantity()
            );

            itemResponse.setSubtotal(
                    subtotal
            );


            itemResponses.add(itemResponse);


            totalQuantity += cartItem.getQuantity();

            totalPrice = totalPrice.add(subtotal);
        }


        CartResponse response = new CartResponse();

        response.setCartId(cart.getCartId());

        response.setItems(itemResponses);

        response.setTotalQuantity(totalQuantity);

        response.setTotalPrice(totalPrice);


        return response;
    }

    @Transactional
    public CartItem updateItemQuantity(
            String username,
            Long cartItemId,
            Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Số lượng phải lớn hơn 0"
            );
        }


        Cart cart = getOrCreateCart(username);


        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sản phẩm không tồn tại trong giỏ"
                        )
                );


        if (!cartItem.getCartId().equals(cart.getCartId())) {

            throw new RuntimeException(
                    "Bạn không có quyền sửa sản phẩm này"
            );
        }


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
                    "Sản phẩm này hiện đã ngừng bán"
            );
        }


        if (quantity > product.getStockQuantity()) {

            throw new RuntimeException(
                    "Số lượng vượt quá tồn kho"
            );
        }


        cartItem.setQuantity(quantity);

        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public void deleteCartItem(
            String username,
            Long cartItemId) {

        Cart cart = getOrCreateCart(username);

        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sản phẩm không tồn tại trong giỏ"
                        )
                );

        if (!cartItem.getCartId().equals(cart.getCartId())) {

            throw new RuntimeException(
                    "Bạn không có quyền xóa sản phẩm này"
            );
        }

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(String username) {

        Cart cart = getOrCreateCart(username);

        cartItemRepository.deleteByCartId(
                cart.getCartId()
        );
    }
}