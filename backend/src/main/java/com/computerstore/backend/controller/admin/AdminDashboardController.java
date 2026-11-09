package com.computerstore.backend.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.dto.response.AdminDashboardResponse;
import com.computerstore.backend.dto.response.LowStockProductResponse;
import com.computerstore.backend.dto.response.MonthlyRevenueResponse;
import com.computerstore.backend.dto.response.TopSellingProductResponse;
import com.computerstore.backend.service.admin.AdminDashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;


    public AdminDashboardController(
            AdminDashboardService adminDashboardService) {

        this.adminDashboardService = adminDashboardService;
    }


    
    @GetMapping
    public ResponseEntity<AdminDashboardResponse> getDashboard() {

        AdminDashboardResponse response =
                adminDashboardService.getDashboard();

        return ResponseEntity.ok(response);
    }

    
    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<MonthlyRevenueResponse>>
            getMonthlyRevenue(
                    @RequestParam int year) {

        List<MonthlyRevenueResponse> response =
                adminDashboardService
                        .getMonthlyRevenue(year);

        return ResponseEntity.ok(response);
    }

    
    @GetMapping("/top-products")
    public ResponseEntity<List<TopSellingProductResponse>>
            getTopSellingProducts(
                    @RequestParam(defaultValue = "5") int limit) {

        List<TopSellingProductResponse> response =
                adminDashboardService
                        .getTopSellingProducts(limit);

        return ResponseEntity.ok(response);
    }

    
    @GetMapping("/low-stock")
    public ResponseEntity<List<LowStockProductResponse>>
            getLowStockProducts(
                    @RequestParam(defaultValue = "5") int threshold) {

        List<LowStockProductResponse> response =
                adminDashboardService
                        .getLowStockProducts(threshold);

        return ResponseEntity.ok(response);
    }
}