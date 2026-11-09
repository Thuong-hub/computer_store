package com.computerstore.backend.controller.catalog;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.entity.Product;
import com.computerstore.backend.service.catalog.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;


    public ProductController(
            ProductService productService) {

        this.productService =
                productService;
    }


  
    @GetMapping
    public List<Product> getAllProducts() {

        return productService
                .getAllProducts();
    }


  
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id) {

        return productService
                .getProductById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


 
    @PostMapping
    public Product createProduct(
            @RequestBody Product product) {

        return productService
                .createProduct(product);
    }


    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        return productService
                .updateProduct(
                        id,
                        product
                )
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


  
    @DeleteMapping("/{id}")
    public Product deleteProduct(
            @PathVariable Long id) {

        return productService
                .deleteProduct(id);
    }



    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam String keyword) {

        return productService
                .searchProducts(keyword);
    }


    
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(
            @PathVariable Long categoryId) {

        return productService
                .getProductsByCategory(
                        categoryId
                );
    }


    
    @GetMapping("/brand/{brandId}")
    public List<Product> getProductsByBrand(
            @PathVariable Long brandId) {

        return productService
                .getProductsByBrand(
                        brandId
                );
    }


    
    @GetMapping("/price")
    public List<Product> getProductsByPriceRange(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {

        return productService
                .getProductsByPriceRange(
                        min,
                        max
                );
    }


    
    @GetMapping("/filter")
    public List<Product> filterProducts(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            Long categoryId,

            @RequestParam(required = false)
            Long brandId,

            @RequestParam(required = false)
            BigDecimal min,

            @RequestParam(required = false)
            BigDecimal max) {

        return productService
                .filterProducts(
                        keyword,
                        categoryId,
                        brandId,
                        min,
                        max
                );
    }


  
    @GetMapping("/sort")
    public List<Product> sortProductsByPrice(
            @RequestParam(
                    defaultValue = "asc"
            )
            String direction) {

        return productService
                .sortProductsByPrice(
                        direction
                );
    }


    
    @GetMapping("/page")
    public Page<Product> getProductsByPage(

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "3"
            )
            int size) {

        return productService
                .getProductsByPage(
                        page,
                        size
                );
    }


    
    @GetMapping("/page-sort")
    public Page<Product> getProductsByPageAndSort(

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "3"
            )
            int size,

            @RequestParam(
                    defaultValue = "asc"
            )
            String direction) {

        return productService
                .getProductsByPageAndSort(
                        page,
                        size,
                        direction
                );
    }
}
