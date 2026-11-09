package com.computerstore.backend.controller.routing;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.net.URI;
import java.util.Map;

@Controller
public class LegacyAdminPageRedirectController {

    private static final Map<String, String> ROUTES = Map.ofEntries(
            Map.entry("/pages/admin.html", "/pages/admin/index.html"),
            Map.entry("/pages/admin-products.html", "/pages/admin/products.html"),
            Map.entry("/pages/admin-inventory.html", "/pages/admin/inventory.html"),
            Map.entry("/pages/admin-orders.html", "/pages/admin/orders.html"),
            Map.entry("/pages/admin-order-detail.html", "/pages/admin/order-detail.html"),
            Map.entry("/pages/admin-users.html", "/pages/admin/users.html"),
            Map.entry("/pages/admin-promotions.html", "/pages/admin/promotions.html"),
            Map.entry("/pages/admin-reports.html", "/pages/admin/reports.html"),
            Map.entry("/pages/admin-reviews.html", "/pages/admin/reviews.html"),
            Map.entry("/pages/admin-sales.html", "/pages/admin/sales.html"),
            Map.entry("/pages/admin-support.html", "/pages/admin/support.html")
    );

    @GetMapping({
            "/pages/admin.html",
            "/pages/admin-products.html",
            "/pages/admin-inventory.html",
            "/pages/admin-orders.html",
            "/pages/admin-order-detail.html",
            "/pages/admin-users.html",
            "/pages/admin-promotions.html",
            "/pages/admin-reports.html",
            "/pages/admin-reviews.html",
            "/pages/admin-sales.html",
            "/pages/admin-support.html"
    })
    public ResponseEntity<Void> redirect(HttpServletRequest request) {
        String path = request.getRequestURI().substring(request.getContextPath().length());
        String destination = ROUTES.get(path);
        if (destination == null) {
            return ResponseEntity.notFound().build();
        }

        String query = request.getQueryString();
        String target = query == null || query.isBlank()
                ? destination
                : destination + "?" + query;

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(target))
                .build();
    }
}
