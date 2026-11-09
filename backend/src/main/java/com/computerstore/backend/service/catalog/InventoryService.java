package com.computerstore.backend.service.catalog;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import com.computerstore.backend.entity.InventoryMovement;
import com.computerstore.backend.entity.Product;
import com.computerstore.backend.repository.InventoryMovementRepository;
import com.computerstore.backend.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {
    private final ProductRepository products;
    private final InventoryMovementRepository history;
    @PersistenceContext private EntityManager em;
    public InventoryService(ProductRepository products, InventoryMovementRepository history) {
        this.products = products;
        this.history = history;
    }

    @Transactional
    public Product change(Long productId, int delta, String action, Long orderId, String actor, String note) {
        Product p = products.findByIdLocked(productId)
            .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));
        em.refresh(p);
        int before = p.getStockQuantity();
        long after = (long) before + delta;
        if (after < 0 || after > Integer.MAX_VALUE) {
            throw new IllegalArgumentException("Số lượng tồn kho không hợp lệ hoặc không đủ hàng: " + p.getName());
        }
        if (delta == 0) return p;
        p.setStockQuantity((int)after);
        products.save(p);
        InventoryMovement m = new InventoryMovement();
        m.setProductId(productId);
        m.setOrderId(orderId);
        m.setQuantityDelta(delta);
        m.setQuantityBefore(before);
        m.setQuantityAfter((int)after);
        m.setAction(action);
        m.setActor(actor);
        m.setNote(note == null ? "" : note.trim().substring(0, Math.min(255, note.trim().length())));
        history.save(m);
        return p;
    }

    @Transactional
    public Product set(Long productId, int quantity, String action, String actor, String note) {
        if (quantity < 0) throw new IllegalArgumentException("Tồn kho không được âm");
        Product p = products.findByIdLocked(productId)
            .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));
        em.refresh(p);
        return change(productId, quantity - p.getStockQuantity(), action, null, actor, note);
    }

    @Transactional
    public void opening(Product p, String actor) {
        if (p.getStockQuantity() == null || p.getStockQuantity() < 0)
            throw new IllegalArgumentException("Tồn kho không hợp lệ");
        if (p.getStockQuantity() == 0) return;
        InventoryMovement m = new InventoryMovement();
        m.setProductId(p.getProductId());
        m.setQuantityDelta(p.getStockQuantity());
        m.setQuantityBefore(0);
        m.setQuantityAfter(p.getStockQuantity());
        m.setAction("OPENING");
        m.setActor(actor);
        m.setNote("Số lượng khi tạo sản phẩm");
        history.save(m);
    }

    @Transactional(readOnly = true)
    public Map<String,Object> overview() {
        List<Product> list = products.findAll();
        long totalUnits = list.stream().mapToLong(p -> p.getStockQuantity()).sum();
        BigDecimal value = list.stream().reduce(BigDecimal.ZERO,
            (sum,p) -> sum.add(p.getPrice().multiply(BigDecimal.valueOf(p.getStockQuantity()))), BigDecimal::add);
        long low = list.stream().filter(p -> p.getStockQuantity() <= 5).count();
        return Map.of("totalProducts",list.size(), "totalUnits",totalUnits,
            "inventoryRetailValue",value,"lowStockProducts",low,"products",list.stream().map(p ->
              Map.of("productId",p.getProductId(),"name",p.getName(),"stockQuantity",p.getStockQuantity(),
                     "price",p.getPrice(),"status",p.getStatus() == null ? "" : p.getStatus(),
                     "imageUrl",p.getImageUrl() == null ? "" : p.getImageUrl())).toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryMovement> movements(Long productId) {
        return productId == null ? history.findTop200ByOrderByCreatedAtDescIdDesc()
              : history.findTop200ByProductIdOrderByCreatedAtDescIdDesc(productId);
    }
}
