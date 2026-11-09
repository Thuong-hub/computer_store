package com.computerstore.backend.controller.catalog;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.entity.ComponentSpec;
import com.computerstore.backend.service.catalog.ComponentSpecService;

@RestController
@RequestMapping("/api/products")
public class ComponentSpecController {

    private final ComponentSpecService componentSpecService;

    public ComponentSpecController(
            ComponentSpecService componentSpecService) {

        this.componentSpecService = componentSpecService;
    }

    /**
     * GET /api/products/specs?categoryId=2
     * Thông số của mọi sản phẩm đang bán (tuỳ chọn lọc theo danh mục) trong 1 lần gọi.
     * Đường dẫn tĩnh "/specs" luôn được ưu tiên hơn "/{id}" của ProductController.
     */
    @GetMapping("/specs")
    public List<ComponentSpec> getActiveSpecs(
            @RequestParam(required = false) Long categoryId) {

        return componentSpecService.getActiveSpecs(categoryId);
    }

    @GetMapping("/{productId}/specs")
    public List<ComponentSpec> getSpecsByProductId(
            @PathVariable Long productId) {

        return componentSpecService.getSpecsByProductId(productId);
    }

   
    @PostMapping("/{productId}/specs")
    public ComponentSpec createSpec(
            @PathVariable Long productId,
            @RequestBody ComponentSpec componentSpec) {

        componentSpec.setProductId(productId);

        return componentSpecService.createSpec(componentSpec);
    }

   
    @PutMapping("/specs/{specId}")
    public Optional<ComponentSpec> updateSpec(
            @PathVariable Long specId,
            @RequestBody ComponentSpec componentSpec) {

        return componentSpecService.updateSpec(specId, componentSpec);
    }


    @DeleteMapping("/specs/{specId}")
    public void deleteSpec(@PathVariable Long specId) {
        componentSpecService.deleteSpec(specId);
    }
}