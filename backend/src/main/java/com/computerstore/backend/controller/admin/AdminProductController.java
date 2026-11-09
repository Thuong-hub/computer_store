package com.computerstore.backend.controller.admin;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.entity.Product;
import com.computerstore.backend.service.catalog.ProductService;


@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {


    private final ProductService productService;


    public AdminProductController(
            ProductService productService) {

        this.productService =
                productService;
    }



    @GetMapping
    public ResponseEntity<List<Product>>
            getAllProducts() {

        return ResponseEntity.ok(
                productService
                        .getAllProductsForAdmin()
        );
    }




    @DeleteMapping("/{productId}/archive")
    public ResponseEntity<Product> archiveProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.archiveProduct(productId));
    }

    @PutMapping("/{productId}/restore")
    public ResponseEntity<Product>
            restoreProduct(
                    @PathVariable Long productId) {

        Product product =
                productService.restoreProduct(
                        productId
                );


        return ResponseEntity.ok(
                product
        );
    }
}