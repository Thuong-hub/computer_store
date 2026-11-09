package com.computerstore.backend.service.catalog;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.entity.Product;
import com.computerstore.backend.repository.ProductRepository;
import com.computerstore.backend.service.commerce.ProductPromotionService;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductPromotionService productPromotionService;

    public ProductService(
            ProductRepository productRepository,
            ProductPromotionService productPromotionService) {
        this.productRepository = productRepository;
        this.productPromotionService = productPromotionService;
    }

    public List<Product> getAllProducts() {

        return onlyActive(
                productRepository.findAll()
        );
    }

    public Optional<Product> getProductById(
            Long id) {

        return productRepository
                .findById(id)
                .filter(this::isActive);
    }

    public List<Product> searchProducts(
            String keyword) {

        return onlyActive(
                productRepository
                        .findByNameContainingIgnoreCase(
                                keyword
                        )
        );
    }

    public List<Product> getProductsByCategory(
            Long categoryId) {

        return onlyActive(
                productRepository
                        .findByCategoryId(
                                categoryId
                        )
        );
    }

    public List<Product> getProductsByBrand(
            Long brandId) {

        return onlyActive(
                productRepository
                        .findByBrandId(
                                brandId
                        )
        );
    }

    public List<Product> getProductsByPriceRange(
            BigDecimal minPrice,
            BigDecimal maxPrice) {

        return onlyActive(
                productRepository
                        .findByPriceBetween(
                                minPrice,
                                maxPrice
                        )
        );
    }

    public List<Product> filterProducts(
            String keyword,
            Long categoryId,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice) {

        return onlyActive(
                productRepository
                        .filterProducts(
                                keyword,
                                categoryId,
                                brandId,
                                minPrice,
                                maxPrice
                        )
        );
    }

    public List<Product> sortProductsByPrice(
            String direction) {

        Sort sort;

        if ("desc".equalsIgnoreCase(direction)) {

            sort =
                    Sort.by("price")
                            .descending();

        } else {

            sort =
                    Sort.by("price")
                            .ascending();
        }

        return onlyActive(
                productRepository.findAll(sort)
        );
    }

    public Page<Product> getProductsByPage(
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );

        List<Product> activeProducts =
                onlyActive(
                        productRepository.findAll()
                );

        return toPage(
                activeProducts,
                pageable
        );
    }

    public Page<Product> getProductsByPageAndSort(
            int page,
            int size,
            String direction) {

        Sort sort;

        if ("desc".equalsIgnoreCase(direction)) {

            sort =
                    Sort.by("price")
                            .descending();

        } else {

            sort =
                    Sort.by("price")
                            .ascending();
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        sort
                );

        List<Product> activeProducts =
                onlyActive(
                        productRepository
                                .findAll(sort)
                );

        return toPage(
                activeProducts,
                pageable
        );
    }

    public List<Product> getAllProductsForAdmin() {

        return productRepository.findAll();
    }

    @Transactional
    public Product createProduct(
            Product product) {

        // Mọi sản phẩm mới bắt đầu với tồn kho 0.
        // Nhập hàng thực hiện tại Tổng kho để lưu lịch sử biến động.
        product.setStockQuantity(0);
        Product saved = productRepository.save(product);
        productPromotionService.createNewProductPromotion(saved.getProductId());
        return saved;
    }

    @Transactional
    public Optional<Product> updateProduct(
            Long id,
            Product newProduct) {

        return productRepository
                .findById(id)
                .map(product -> {

                    if ("DELETED".equalsIgnoreCase(product.getStatus())) {
                        throw new IllegalStateException("Sản phẩm đã xóa, cần khôi phục trước khi sửa");
                    }

                    if (!"ACTIVE".equalsIgnoreCase(newProduct.getStatus())
                            && !"INACTIVE".equalsIgnoreCase(newProduct.getStatus())) {
                        throw new IllegalArgumentException("Trạng thái sản phẩm không hợp lệ");
                    }

                    // Tuyệt đối không thay đổi stockQuantity tại API sản phẩm.
                    // Chỉ InventoryService và luồng đơn hàng được đổi tồn kho.
                    // Giá trị stockQuantity từ request (nếu có) bị bỏ qua.

                    product.setCategoryId(
                            newProduct.getCategoryId()
                    );

                    product.setBrandId(
                            newProduct.getBrandId()
                    );

                    product.setName(
                            newProduct.getName()
                    );

                    product.setDescription(
                            newProduct.getDescription()
                    );

                    product.setPrice(
                            newProduct.getPrice()
                    );

                    product.setImageUrl(
                            newProduct.getImageUrl()
                    );

                    product.setStatus(
                            newProduct.getStatus()
                    );

                    return productRepository.save(
                            product
                    );
                });
    }

    @Transactional
    public Product deleteProduct(
            Long id) {

        Product product =
                productRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sản phẩm không tồn tại"
                                )
                        );

        if ("DELETED".equalsIgnoreCase(product.getStatus())) {
            throw new IllegalStateException("Sản phẩm đã bị xóa");
        }

        product.setStatus(
                "INACTIVE"
        );

        return productRepository.save(
                product
        );
    }

    @Transactional
    public Product archiveProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

        if ("DELETED".equalsIgnoreCase(product.getStatus())) {
            throw new IllegalStateException("Sản phẩm đã được xóa trước đó");
        }

        product.setStatus("DELETED");
        return productRepository.save(product);
    }

    @Transactional
    public Product restoreProduct(
            Long id) {

        Product product =
                productRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sản phẩm không tồn tại"
                                )
                        );

        product.setStatus(
                "ACTIVE"
        );

        return productRepository.save(
                product
        );
    }

    private boolean isActive(
            Product product) {

        return product != null
                && "ACTIVE".equalsIgnoreCase(
                        product.getStatus()
                );
    }

    private List<Product> onlyActive(
            List<Product> products) {

        return products
                .stream()
                .filter(this::isActive)
                .toList();
    }

    private Page<Product> toPage(
            List<Product> products,
            Pageable pageable) {

        int start =
                (int) pageable.getOffset();

        if (start >= products.size()) {

            return new PageImpl<>(
                    List.of(),
                    pageable,
                    products.size()
            );
        }

        int end =
                Math.min(
                        start
                        + pageable.getPageSize(),
                        products.size()
                );

        List<Product> content =
                products.subList(
                        start,
                        end
                );

        return new PageImpl<>(
                content,
                pageable,
                products.size()
        );
    }
}
