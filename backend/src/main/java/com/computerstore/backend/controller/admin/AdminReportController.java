package com.computerstore.backend.controller.admin;

import com.computerstore.backend.service.admin.AdminReportService;
import java.time.LocalDate;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {
    private final AdminReportService service;
    public AdminReportController(AdminReportService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<?> report(@RequestParam LocalDate from, @RequestParam LocalDate to,
                                    @RequestParam(defaultValue = "month") String group) {
        try {
            return ResponseEntity.ok(service.report(from,to,group));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }
}
