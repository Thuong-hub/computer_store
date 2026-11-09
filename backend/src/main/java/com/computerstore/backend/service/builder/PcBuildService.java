package com.computerstore.backend.service.builder;

import com.computerstore.backend.service.commerce.CartService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.dto.request.AddPcBuildItemRequest;
import com.computerstore.backend.dto.response.CartResponse;
import com.computerstore.backend.dto.response.CompatibilityResponse;
import com.computerstore.backend.dto.request.CreatePcBuildRequest;
import com.computerstore.backend.dto.response.PcBuildCompatibilityResponse;
import com.computerstore.backend.dto.response.PcBuildDetailResponse;
import com.computerstore.backend.dto.response.PcBuildItemResponse;
import com.computerstore.backend.dto.response.PcBuildReadyResponse;
import com.computerstore.backend.dto.response.PcBuildResponse;
import com.computerstore.backend.dto.response.PcBuildValidationResponse;
import com.computerstore.backend.dto.request.UpdatePcBuildItemRequest;
import com.computerstore.backend.dto.request.UpdatePcBuildRequest;
import com.computerstore.backend.entity.Category;
import com.computerstore.backend.entity.ComponentSpec;
import com.computerstore.backend.entity.PcBuild;
import com.computerstore.backend.entity.PcBuildItem;
import com.computerstore.backend.entity.Product;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.CategoryRepository;
import com.computerstore.backend.repository.ComponentSpecRepository;
import com.computerstore.backend.repository.PcBuildItemRepository;
import com.computerstore.backend.repository.PcBuildRepository;
import com.computerstore.backend.repository.ProductRepository;
import com.computerstore.backend.repository.UserRepository;

@Service
public class PcBuildService {

        private final PcBuildRepository pcBuildRepository;
        private final UserRepository userRepository;
        private final PcBuildItemRepository pcBuildItemRepository;
        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;
        private final CompatibilityService compatibilityService;
        private final ComponentSpecRepository componentSpecRepository;
        private final CartService cartService;

        public PcBuildService(
                PcBuildRepository pcBuildRepository,
                UserRepository userRepository,
                PcBuildItemRepository pcBuildItemRepository,
                ProductRepository productRepository,
                CategoryRepository categoryRepository,
                CompatibilityService compatibilityService,
                ComponentSpecRepository componentSpecRepository,
                CartService cartService) {

        this.pcBuildRepository = pcBuildRepository;
        this.userRepository = userRepository;
        this.pcBuildItemRepository = pcBuildItemRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.compatibilityService = compatibilityService;
        this.componentSpecRepository = componentSpecRepository;
        this.cartService = cartService;
        }

    @Transactional
    public PcBuildResponse createBuild(
            String username,
            CreatePcBuildRequest request) {

        if (request.getBuildName() == null
                || request.getBuildName().isBlank()) {

            throw new RuntimeException(
                    "Tên cấu hình PC không được để trống"
            );
        }

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User không tồn tại"
                                )
                        );

        PcBuild build = new PcBuild();

        build.setUserId(
                user.getUserId()
        );

        build.setBuildName(
                request.getBuildName().trim()
        );

        build.setTotalPrice(
                BigDecimal.ZERO
        );

        PcBuild savedBuild =
                pcBuildRepository.save(build);

        return new PcBuildResponse(
                savedBuild.getBuildId(),
                savedBuild.getBuildName(),
                savedBuild.getTotalPrice(),
                savedBuild.getCreatedAt(),
                savedBuild.getUpdatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<PcBuildResponse> getMyBuilds(
            String username) {

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User không tồn tại"
                                )
                        );

        List<PcBuild> builds =
                pcBuildRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                user.getUserId()
                        );

        return builds.stream()
                .map(build ->
                        new PcBuildResponse(
                                build.getBuildId(),
                                build.getBuildName(),
                                build.getTotalPrice(),
                                build.getCreatedAt(),
                                build.getUpdatedAt()
                        )
                )
                .toList();
    }

    @Transactional(readOnly = true)
    public PcBuildResponse getBuildById(
            String username,
            Long buildId) {

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User không tồn tại"
                                )
                        );

        PcBuild build =
                pcBuildRepository
                        .findByBuildIdAndUserId(
                                buildId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "PC Build không tồn tại hoặc không thuộc tài khoản này"
                                )
                        );

        return new PcBuildResponse(
                build.getBuildId(),
                build.getBuildName(),
                build.getTotalPrice(),
                build.getCreatedAt(),
                build.getUpdatedAt()
        );
    }

@Transactional
public PcBuildItemResponse addItemToBuild(
        String username,
        Long buildId,
        AddPcBuildItemRequest request) {

    if (request.getProductId() == null) {
        throw new RuntimeException(
                "Sản phẩm không được để trống"
        );
    }

    if (request.getQuantity() == null
            || request.getQuantity() <= 0) {

        throw new RuntimeException(
                "Số lượng phải lớn hơn 0"
        );
    }

    User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                    new RuntimeException(
                            "User không tồn tại"
                    )
            );

    PcBuild build = pcBuildRepository
            .findByBuildIdAndUserId(
                    buildId,
                    user.getUserId()
            )
            .orElseThrow(() ->
                    new RuntimeException(
                            "PC Build không tồn tại hoặc không thuộc tài khoản này"
                    )
            );

    Product product = productRepository
            .findById(request.getProductId())
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

    if (request.getQuantity()
            > product.getStockQuantity()) {

        throw new RuntimeException(
                "Sản phẩm không đủ tồn kho"
        );
    }

    validateSingleComponent(
            build,
            product
    );

    List<PcBuildItem> slotExistingItems = pcBuildItemRepository
            .findAllByBuildIdAndProductId(build.getBuildId(), product.getProductId());

    int slotExpectedQuantity = request.getQuantity()
            + slotExistingItems.stream().mapToInt(PcBuildItem::getQuantity).sum();

    validateSlotCapacities(build, product, slotExpectedQuantity, null);

    validateCompatibility(
            build,
            product
    );

    List<PcBuildItem> existingItems =
            pcBuildItemRepository
                    .findAllByBuildIdAndProductId(
                            build.getBuildId(),
                            product.getProductId()
                    );

    if (!existingItems.isEmpty()) {

        int currentQuantity =
                existingItems.stream()
                        .mapToInt(PcBuildItem::getQuantity)
                        .sum();

        int newQuantity =
                currentQuantity + request.getQuantity();

        if (newQuantity > product.getStockQuantity()) {
            throw new RuntimeException(
                    "Số lượng sau khi cộng vượt quá tồn kho"
            );
        }

        PcBuildItem existingItem = existingItems.get(0);
        existingItem.setQuantity(newQuantity);

        PcBuildItem savedExistingItem =
                pcBuildItemRepository.save(existingItem);

        if (existingItems.size() > 1) {
            pcBuildItemRepository.deleteAll(
                    existingItems.subList(1, existingItems.size())
            );
        }

        recalculateBuildTotal(build);

        Category category =
                categoryRepository
                        .findById(product.getCategoryId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Danh mục sản phẩm không tồn tại"
                                )
                        );

        BigDecimal subtotal =
                product.getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        savedExistingItem.getQuantity()
                                )
                        );

        return new PcBuildItemResponse(
                savedExistingItem.getBuildItemId(),
                product.getProductId(),
                product.getName(),
                category.getName(),
                product.getImageUrl(),
                product.getPrice(),
                savedExistingItem.getQuantity(),
                subtotal
        );
    }

        PcBuildItem item = new PcBuildItem();
    item.setBuildId(
            build.getBuildId()
    );

    item.setProductId(
            product.getProductId()
    );

    item.setQuantity(
            request.getQuantity()
    );

    PcBuildItem savedItem =
            pcBuildItemRepository.save(item);

    recalculateBuildTotal(build);

    Category category =
            categoryRepository
                    .findById(product.getCategoryId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Danh mục sản phẩm không tồn tại"
                            )
                    );

    BigDecimal subtotal =
            product.getPrice()
                    .multiply(
                            BigDecimal.valueOf(
                                    savedItem.getQuantity()
                            )
                    );

    return new PcBuildItemResponse(
            savedItem.getBuildItemId(),
            product.getProductId(),
            product.getName(),
            category.getName(),
            product.getImageUrl(),
            product.getPrice(),
            savedItem.getQuantity(),
            subtotal
    );
}

        private void recalculateBuildTotal(
                PcBuild build) {

        List<PcBuildItem> items =
                pcBuildItemRepository
                        .findByBuildId(
                                build.getBuildId()
                        );

        BigDecimal total =
                BigDecimal.ZERO;

        for (PcBuildItem item : items) {

                Product product =
                        productRepository
                                .findById(
                                        item.getProductId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Sản phẩm không tồn tại"
                                        )
                                );

                BigDecimal subtotal =
                        product.getPrice()
                                .multiply(
                                        BigDecimal.valueOf(
                                                item.getQuantity()
                                        )
                                );

                total = total.add(subtotal);
        }

        build.setTotalPrice(total);

        pcBuildRepository.save(build);
        }

        @Transactional(readOnly = true)
        public List<PcBuildItemResponse> getBuildItems(
                String username,
                Long buildId) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        PcBuild build = pcBuildRepository
                .findByBuildIdAndUserId(
                        buildId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "PC Build không tồn tại hoặc không thuộc tài khoản này"
                        )
                );

        List<PcBuildItem> items =
                pcBuildItemRepository
                        .findByBuildId(
                                build.getBuildId()
                        );

        return items.stream()
                .map(item -> {

                        Product product = productRepository
                                .findById(item.getProductId())
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Sản phẩm không tồn tại"
                                        )
                                );

                        Category category =
                                categoryRepository
                                        .findById(
                                                product.getCategoryId()
                                        )
                                        .orElseThrow(() ->
                                                new RuntimeException(
                                                        "Danh mục sản phẩm không tồn tại"
                                                )
                                        );

                        BigDecimal subtotal =
                                product.getPrice()
                                        .multiply(
                                                BigDecimal.valueOf(
                                                        item.getQuantity()
                                                )
                                        );

                        return new PcBuildItemResponse(
                                item.getBuildItemId(),
                                product.getProductId(),
                                product.getName(),
                                category.getName(),
                                product.getImageUrl(),
                                product.getPrice(),
                                item.getQuantity(),
                                subtotal
                        );
                })
                .toList();
        }

        @Transactional
        public PcBuildItemResponse updateBuildItem(
                String username,
                Long buildId,
                Long buildItemId,
                UpdatePcBuildItemRequest request) {

        if (request.getQuantity() == null
                || request.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Số lượng phải lớn hơn 0"
                );
        }

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        PcBuild build = pcBuildRepository
                .findByBuildIdAndUserId(
                        buildId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "PC Build không tồn tại hoặc không thuộc tài khoản này"
                        )
                );

        PcBuildItem item = pcBuildItemRepository
                .findByBuildItemIdAndBuildId(
                        buildItemId,
                        build.getBuildId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Linh kiện không tồn tại trong PC Build này"
                        )
                );

        Product product = productRepository
                .findById(item.getProductId())
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

        if (request.getQuantity()
                > product.getStockQuantity()) {

                throw new RuntimeException(
                        "Sản phẩm không đủ tồn kho"
                );
        }

        validateSlotCapacities(build, product, request.getQuantity(), item.getBuildItemId());

        item.setQuantity(
                request.getQuantity()
        );

        PcBuildItem savedItem =
                pcBuildItemRepository.save(item);

        recalculateBuildTotal(build);

        Category category = categoryRepository
                .findById(product.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Danh mục sản phẩm không tồn tại"
                        )
                );

        BigDecimal subtotal =
                product.getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        savedItem.getQuantity()
                                )
                        );

        return new PcBuildItemResponse(
                savedItem.getBuildItemId(),
                product.getProductId(),
                product.getName(),
                category.getName(),
                product.getImageUrl(),
                product.getPrice(),
                savedItem.getQuantity(),
                subtotal
        );
        }

        @Transactional
        public void removeBuildItem(
                String username,
                Long buildId,
                Long buildItemId) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        PcBuild build = pcBuildRepository
                .findByBuildIdAndUserId(
                        buildId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "PC Build không tồn tại hoặc không thuộc tài khoản này"
                        )
                );

        PcBuildItem item = pcBuildItemRepository
                .findByBuildItemIdAndBuildId(
                        buildItemId,
                        build.getBuildId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Linh kiện không tồn tại trong PC Build này"
                        )
                );

        pcBuildItemRepository.delete(item);

        recalculateBuildTotal(build);
        }

        @Transactional
        public void deleteBuild(
                String username,
                Long buildId) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        PcBuild build = pcBuildRepository
                .findByBuildIdAndUserId(
                        buildId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "PC Build không tồn tại hoặc không thuộc tài khoản này"
                        )
                );

        pcBuildRepository.delete(build);
        }

        @Transactional
        public PcBuildResponse updateBuild(
                String username,
                Long buildId,
                UpdatePcBuildRequest request) {

        if (request.getBuildName() == null
                || request.getBuildName().isBlank()) {

                throw new RuntimeException(
                        "Tên cấu hình PC không được để trống"
                );
        }

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        PcBuild build = pcBuildRepository
                .findByBuildIdAndUserId(
                        buildId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "PC Build không tồn tại hoặc không thuộc tài khoản này"
                        )
                );

        build.setBuildName(
                request.getBuildName().trim()
        );

        PcBuild savedBuild =
                pcBuildRepository.save(build);

        return new PcBuildResponse(
                savedBuild.getBuildId(),
                savedBuild.getBuildName(),
                savedBuild.getTotalPrice(),
                savedBuild.getCreatedAt(),
                savedBuild.getUpdatedAt()
        );
        }

        private Integer getSlotSpec(Long productId, String specName) {

                return componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(productId, specName)
                        .map(ComponentSpec::getSpecValue)
                        .map(String::trim)
                        .filter(value -> value.matches("[0-9]+"))
                        .map(value -> {
                                try {
                                        int parsed = Integer.parseInt(value);
                                        return parsed >= 0 ? parsed : null;
                                } catch (NumberFormatException error) {
                                        return null;
                                }
                        })
                        .orElse(null);
        }

        private String storageConnection(Product product, String categoryName) {

                if ("HDD".equals(categoryName)) {
                        return "SATA";
                }

                if (!"SSD".equals(categoryName)) {
                        return null;
                }

                String interfaceName = componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(product.getProductId(), "INTERFACE")
                        .map(ComponentSpec::getSpecValue)
                        .orElse("")
                        .trim()
                        .toUpperCase(java.util.Locale.ROOT);

                String name = product.getName() == null
                        ? ""
                        : product.getName().toUpperCase(java.util.Locale.ROOT);

                if (interfaceName.contains("NVME") || interfaceName.contains("M.2")
                        || interfaceName.contains("PCIE") || name.contains("NVME")
                        || name.contains("M.2")) {
                        return "M2";
                }

                if (interfaceName.contains("SATA") || name.contains("SATA")) {
                        return "SATA";
                }

                return null;
        }

        private void validateSlotCapacities(
                PcBuild build,
                Product changedProduct,
                int changedQuantity,
                Long updatedItemId) {

                List<PcBuildItem> existing = pcBuildItemRepository.findByBuildId(build.getBuildId());

                Product board = null;
                int ramUsed = 0;
                int m2Used = 0;
                int sataUsed = 0;

                List<PcBuildItem> simulated = new ArrayList<>(existing);

                for (PcBuildItem item : simulated) {
                        if ((updatedItemId != null && updatedItemId.equals(item.getBuildItemId()))
                                || (updatedItemId == null
                                && changedProduct.getProductId().equals(item.getProductId()))) {
                                continue;
                        }

                        Product product = productRepository.findById(item.getProductId())
                                .orElseThrow(() -> new RuntimeException("Linh kiện trong cấu hình không tồn tại"));

                        Category category = categoryRepository.findById(product.getCategoryId())
                                .orElseThrow(() -> new RuntimeException("Danh mục linh kiện không tồn tại"));

                        String type = category.getName().trim().toUpperCase(java.util.Locale.ROOT);

                        if ("MAINBOARD".equals(type)) {
                                board = product;
                        }

                        if ("RAM".equals(type)) {
                                Integer moduleCount = getSlotSpec(product.getProductId(), "MODULE_COUNT");
                                ramUsed += item.getQuantity() * (moduleCount != null && moduleCount > 0 ? moduleCount : 1);
                        }

                        String storageType = storageConnection(product, type);
                        if ("M2".equals(storageType)) {
                                m2Used += item.getQuantity();
                        } else if ("SATA".equals(storageType)) {
                                sataUsed += item.getQuantity();
                        }
                }

                Category changedCategory = categoryRepository.findById(changedProduct.getCategoryId())
                        .orElseThrow(() -> new RuntimeException("Danh mục sản phẩm không tồn tại"));
                String changedType = changedCategory.getName().trim().toUpperCase(java.util.Locale.ROOT);

                if ("MAINBOARD".equals(changedType)) {
                        board = changedProduct;
                }

                if ("RAM".equals(changedType)) {
                        Integer moduleCount = getSlotSpec(changedProduct.getProductId(), "MODULE_COUNT");
                        ramUsed += changedQuantity * (moduleCount != null && moduleCount > 0 ? moduleCount : 1);
                }

                String changedStorage = storageConnection(changedProduct, changedType);
                if ("M2".equals(changedStorage)) {
                        m2Used += changedQuantity;
                } else if ("SATA".equals(changedStorage)) {
                        sataUsed += changedQuantity;
                }

                if (board == null) {
                        return;
                }

                Integer ramSlots = getSlotSpec(board.getProductId(), "RAM_SLOTS");
                Integer m2Slots = getSlotSpec(board.getProductId(), "M2_SLOTS");
                Integer sataPorts = getSlotSpec(board.getProductId(), "SATA_PORTS");

                if (ramSlots != null && ramUsed > ramSlots) {
                        throw new RuntimeException("Vượt số khe RAM của Mainboard: " + ramUsed
                                + "/" + ramSlots + " thanh. Hãy giảm số lượng RAM.");
                }

                if (m2Slots != null && m2Used > m2Slots) {
                        throw new RuntimeException("Vượt số khe M.2 của Mainboard: " + m2Used
                                + "/" + m2Slots + " ổ. Hãy giảm số lượng SSD NVMe.");
                }

                if (sataPorts != null && sataUsed > sataPorts) {
                        throw new RuntimeException("Vượt số cổng SATA của Mainboard: " + sataUsed
                                + "/" + sataPorts + " ổ. Hãy giảm số lượng SSD/HDD SATA.");
                }
        }

        private void validateCompatibility(
                PcBuild build,
                Product newProduct) {

        Category newCategory =
                categoryRepository
                        .findById(
                                newProduct.getCategoryId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Danh mục sản phẩm không tồn tại"
                                )
                        );

        String newCategoryName =
                newCategory.getName()
                        .trim()
                        .toUpperCase();

        List<PcBuildItem> existingItems =
                pcBuildItemRepository
                        .findByBuildId(
                                build.getBuildId()
                        );

        for (PcBuildItem existingItem : existingItems) {

                Product existingProduct =
                        productRepository
                                .findById(
                                        existingItem.getProductId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Sản phẩm trong PC Build không tồn tại"
                                        )
                                );

                Category existingCategory =
                        categoryRepository
                                .findById(
                                        existingProduct.getCategoryId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Danh mục sản phẩm không tồn tại"
                                        )
                                );

                String existingCategoryName =
                        existingCategory.getName()
                                .trim()
                                .toUpperCase();

                CompatibilityResponse compatibility;

                if ("CPU".equals(newCategoryName)
                        && "MAINBOARD".equals(existingCategoryName)) {

                        compatibility =
                                compatibilityService
                                        .checkCpuMainboard(
                                                newProduct.getProductId(),
                                                existingProduct.getProductId()
                                        );

                        if (!compatibility.isCompatible()) {
                                throw new RuntimeException(
                                        compatibility.getMessage()
                                );
                        }
                }

                if ("MAINBOARD".equals(newCategoryName)
                        && "CPU".equals(existingCategoryName)) {

                        compatibility =
                                compatibilityService
                                        .checkCpuMainboard(
                                                existingProduct.getProductId(),
                                                newProduct.getProductId()
                                        );

                        if (!compatibility.isCompatible()) {
                                throw new RuntimeException(
                                        compatibility.getMessage()
                                );
                        }
                }

                if ("RAM".equals(newCategoryName)
                        && "MAINBOARD".equals(existingCategoryName)) {

                        compatibility =
                                compatibilityService
                                        .checkMainboardRam(
                                                existingProduct.getProductId(),
                                                newProduct.getProductId()
                                        );

                        if (!compatibility.isCompatible()) {
                                throw new RuntimeException(
                                        compatibility.getMessage()
                                );
                        }
                }

                if ("MAINBOARD".equals(newCategoryName)
                        && "RAM".equals(existingCategoryName)) {

                        compatibility =
                                compatibilityService
                                        .checkMainboardRam(
                                                newProduct.getProductId(),
                                                existingProduct.getProductId()
                                        );

                        if (!compatibility.isCompatible()) {
                                throw new RuntimeException(
                                        compatibility.getMessage()
                                );
                        }
                }

                if ("PSU".equals(newCategoryName)
                        && "GPU".equals(existingCategoryName)) {

                compatibility =
                        compatibilityService
                                .checkGpuPsu(
                                        existingProduct.getProductId(),
                                        newProduct.getProductId()
                                );

                if (!compatibility.isCompatible()) {

                        throw new RuntimeException(
                                compatibility.getMessage()
                        );
                }
                }

                if ("GPU".equals(newCategoryName)
                        && "PSU".equals(existingCategoryName)) {

                compatibility =
                        compatibilityService
                                .checkGpuPsu(
                                        newProduct.getProductId(),
                                        existingProduct.getProductId()
                                );

                if (!compatibility.isCompatible()) {

                        throw new RuntimeException(
                                compatibility.getMessage()
                        );
                }
                }

                if ("CASE".equals(newCategoryName)
                        && "GPU".equals(existingCategoryName)) {

                compatibility =
                        compatibilityService
                                .checkGpuCase(
                                        existingProduct.getProductId(),
                                        newProduct.getProductId()
                                );

                if (!compatibility.isCompatible()) {

                        throw new RuntimeException(
                                compatibility.getMessage()
                        );
                }
                }

                if ("GPU".equals(newCategoryName)
                        && "CASE".equals(existingCategoryName)) {

                compatibility =
                        compatibilityService
                                .checkGpuCase(
                                        newProduct.getProductId(),
                                        existingProduct.getProductId()
                                );

                if (!compatibility.isCompatible()) {

                        throw new RuntimeException(
                                compatibility.getMessage()
                        );
                }
                }
        }
        }

        private void validateSingleComponent(
                PcBuild build,
                Product newProduct) {

        Category newCategory =
                categoryRepository
                        .findById(
                                newProduct.getCategoryId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Danh mục sản phẩm không tồn tại"
                                )
                        );

        String newCategoryName =
                newCategory.getName()
                        .trim()
                        .toUpperCase();

        if (!"CPU".equals(newCategoryName)
                && !"MAINBOARD".equals(newCategoryName)
                && !"GPU".equals(newCategoryName)
                && !"PSU".equals(newCategoryName)
                && !"CASE".equals(newCategoryName)) {

                return;
        }

        List<PcBuildItem> existingItems =
                pcBuildItemRepository
                        .findByBuildId(
                                build.getBuildId()
                        );

        for (PcBuildItem item : existingItems) {

                Product existingProduct =
                        productRepository
                                .findById(
                                        item.getProductId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Sản phẩm trong PC Build không tồn tại"
                                        )
                                );

                Category existingCategory =
                        categoryRepository
                                .findById(
                                        existingProduct.getCategoryId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Danh mục sản phẩm không tồn tại"
                                        )
                                );

                String existingCategoryName =
                        existingCategory.getName()
                                .trim()
                                .toUpperCase();

                if (newCategoryName.equals(
                        existingCategoryName)) {

                throw new RuntimeException(
                        "PC Build đã có "
                                + newCategory.getName()
                                + ": "
                                + existingProduct.getName()
                );
                }
        }
        }

        @Transactional(readOnly = true)
        public PcBuildDetailResponse getBuildDetail(
                String username,
                Long buildId) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        PcBuild build = pcBuildRepository
                .findByBuildIdAndUserId(
                        buildId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "PC Build không tồn tại hoặc không thuộc tài khoản này"
                        )
                );

        List<PcBuildItemResponse> items =
                getBuildItems(
                        username,
                        buildId
                );

        return new PcBuildDetailResponse(
                build.getBuildId(),
                build.getBuildName(),
                build.getTotalPrice(),
                build.getCreatedAt(),
                build.getUpdatedAt(),
                items
        );
        }

        @Transactional(readOnly = true)
        public PcBuildValidationResponse validateBuild(
                String username,
                Long buildId) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        PcBuild build = pcBuildRepository
                .findByBuildIdAndUserId(
                        buildId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "PC Build không tồn tại hoặc không thuộc tài khoản này"
                        )
                );

        List<PcBuildItem> items =
                pcBuildItemRepository
                        .findByBuildId(
                                build.getBuildId()
                        );

        boolean hasCpu = false;
        boolean hasGpu = false;
        boolean hasRam = false;
        boolean hasMainboard = false;
        boolean hasSsd = false;
        boolean hasHdd = false;
        boolean hasPsu = false;
        boolean hasCase = false;

        for (PcBuildItem item : items) {

                Product product = productRepository
                        .findById(item.getProductId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sản phẩm trong PC Build không tồn tại"
                                )
                        );

                Category category = categoryRepository
                        .findById(product.getCategoryId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Danh mục sản phẩm không tồn tại"
                                )
                        );

                String categoryName =
                        category.getName()
                                .trim()
                                .toUpperCase();

                if ("CPU".equals(categoryName)) {
                hasCpu = true;
                }

                if ("GPU".equals(categoryName)) {
                hasGpu = true;
                }

                if ("RAM".equals(categoryName)) {
                hasRam = true;
                }

                if ("MAINBOARD".equals(categoryName)) {
                hasMainboard = true;
                }

                if ("SSD".equals(categoryName)) {
                hasSsd = true;
                }

                if ("HDD".equals(categoryName)) {
                hasHdd = true;
                }

                if ("PSU".equals(categoryName)) {
                hasPsu = true;
                }

                if ("CASE".equals(categoryName)) {
                hasCase = true;
                }
        }

        List<String> missingComponents =
                new ArrayList<>();

                if (!hasCpu) {
                missingComponents.add("CPU");
                }

                if (!hasGpu) {
                missingComponents.add("GPU");
                }

                if (!hasRam) {
                missingComponents.add("RAM");
                }

                if (!hasMainboard) {
                missingComponents.add("Mainboard");
                }

                if (!hasPsu) {
                missingComponents.add("PSU");
                }

                if (!hasCase) {
                missingComponents.add("Case");
                }

                if (!hasSsd && !hasHdd) {
                missingComponents.add("SSD hoặc HDD");
                }

        if (missingComponents.isEmpty()) {

                return new PcBuildValidationResponse(
                        true,
                        "PC Build đã đủ các linh kiện bắt buộc",
                        missingComponents
                );
        }

        return new PcBuildValidationResponse(
                false,
                "PC Build chưa đầy đủ linh kiện",
                missingComponents
        );
        }

        @Transactional(readOnly = true)
        public PcBuildCompatibilityResponse checkBuildCompatibility(
                String username,
                Long buildId) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        PcBuild build = pcBuildRepository
                .findByBuildIdAndUserId(
                        buildId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "PC Build không tồn tại hoặc không thuộc tài khoản này"
                        )
                );

        List<PcBuildItem> items =
                pcBuildItemRepository
                        .findByBuildId(
                                build.getBuildId()
                        );

        Product cpu = null;
        Product mainboard = null;
        Product gpu = null;
        Product psu = null;
        Product pcCase = null;

        List<Product> ramProducts =
                new ArrayList<>();

        for (PcBuildItem item : items) {

                Product product = productRepository
                        .findById(item.getProductId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sản phẩm trong PC Build không tồn tại"
                                )
                        );

                Category category = categoryRepository
                        .findById(product.getCategoryId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Danh mục sản phẩm không tồn tại"
                                )
                        );

                String categoryName =
                        category.getName()
                                .trim()
                                .toUpperCase();

                switch (categoryName) {

                case "CPU":
                        cpu = product;
                        break;

                case "MAINBOARD":
                        mainboard = product;
                        break;

                case "RAM":
                        ramProducts.add(product);
                        break;

                case "GPU":
                        gpu = product;
                        break;

                case "PSU":
                        psu = product;
                        break;

                case "CASE":
                        pcCase = product;
                        break;

                default:
                        break;
                }
        }

        List<String> issues =
                new ArrayList<>();

        if (cpu != null
                && mainboard != null) {

                try {

                CompatibilityResponse result =
                        compatibilityService
                                .checkCpuMainboard(
                                        cpu.getProductId(),
                                        mainboard.getProductId()
                                );

                if (!result.isCompatible()) {
                        issues.add(result.getMessage());
                }

                } catch (RuntimeException e) {

                issues.add(e.getMessage());
                }
        }

        if (mainboard != null) {

                for (Product ram : ramProducts) {

                try {

                        CompatibilityResponse result =
                                compatibilityService
                                        .checkMainboardRam(
                                                mainboard.getProductId(),
                                                ram.getProductId()
                                        );

                        if (!result.isCompatible()) {
                        issues.add(result.getMessage());
                        }

                } catch (RuntimeException e) {

                        issues.add(e.getMessage());
                }
                }
        }

        if (gpu != null
                && psu != null) {

                try {

                CompatibilityResponse result =
                        compatibilityService
                                .checkGpuPsu(
                                        gpu.getProductId(),
                                        psu.getProductId()
                                );

                if (!result.isCompatible()) {
                        issues.add(result.getMessage());
                }

                } catch (RuntimeException e) {

                issues.add(e.getMessage());
                }
        }

        if (mainboard != null
                && pcCase != null) {

                try {

                CompatibilityResponse result =
                        compatibilityService
                                .checkMainboardCase(
                                        mainboard.getProductId(),
                                        pcCase.getProductId()
                                );

                if (!result.isCompatible()) {
                        issues.add(result.getMessage());
                }

                } catch (RuntimeException e) {

                issues.add(e.getMessage());
                }
        }

        if (gpu != null
                && pcCase != null) {

                try {

                CompatibilityResponse result =
                        compatibilityService
                                .checkGpuCase(
                                        gpu.getProductId(),
                                        pcCase.getProductId()
                                );

                if (!result.isCompatible()) {
                        issues.add(result.getMessage());
                }

                } catch (RuntimeException e) {

                issues.add(e.getMessage());
                }
        }

        if (mainboard != null) {
                try {
                        validateSlotCapacities(
                                pcBuildRepository.findByBuildIdAndUserId(buildId, user.getUserId())
                                        .orElseThrow(() -> new RuntimeException("PC Build không tồn tại")),
                                mainboard,
                                1,
                                null
                        );
                } catch (RuntimeException error) {
                        issues.add(error.getMessage());
                }
        }

        if (issues.isEmpty()) {

                return new PcBuildCompatibilityResponse(
                        true,
                        "Tất cả linh kiện trong PC Build đều tương thích",
                        issues
                );
        }

        return new PcBuildCompatibilityResponse(
                false,
                "PC Build có linh kiện không tương thích",
                issues
        );
        }

        @Transactional(readOnly = true)
        public PcBuildReadyResponse checkBuildReady(
                String username,
                Long buildId) {

        PcBuildValidationResponse validationResponse =
                validateBuild(
                        username,
                        buildId
                );

        PcBuildCompatibilityResponse compatibilityResponse =
                checkBuildCompatibility(
                        username,
                        buildId
                );

        boolean ready =
                validationResponse.isValid()
                        && compatibilityResponse.isCompatible();

        if (ready) {

                return new PcBuildReadyResponse(
                        true,
                        "PC Build đã sẵn sàng hoàn tất",
                        validationResponse.getMissingComponents(),
                        compatibilityResponse.getIssues()
                );
        }

        return new PcBuildReadyResponse(
                false,
                "PC Build chưa sẵn sàng hoàn tất",
                validationResponse.getMissingComponents(),
                compatibilityResponse.getIssues()
        );
        }

        @Transactional
        public CartResponse addBuildToCart(
                String username,
                Long buildId) {

        PcBuildReadyResponse readyResponse =
                checkBuildReady(
                        username,
                        buildId
                );

        if (!readyResponse.isReady()) {
                throw new RuntimeException(
                        "PC Build chưa sẵn sàng để thêm vào giỏ hàng"
                );
        }

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User không tồn tại"
                        )
                );

        PcBuild build = pcBuildRepository
                .findByBuildIdAndUserId(
                        buildId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "PC Build không tồn tại hoặc không thuộc tài khoản này"
                        )
                );

        List<PcBuildItem> buildItems =
                pcBuildItemRepository
                        .findByBuildId(
                                build.getBuildId()
                        );

        for (PcBuildItem buildItem : buildItems) {

                Product product = productRepository
                        .findById(buildItem.getProductId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sản phẩm trong PC Build không tồn tại"
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
        }

        for (PcBuildItem buildItem : buildItems) {

                cartService.addItem(
                        username,
                        buildItem.getProductId(),
                        buildItem.getQuantity()
                );
        }

        return cartService.getCartDetails(username);
        }

}
