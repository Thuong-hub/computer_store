package com.computerstore.backend.controller.builder;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.dto.response.CompatibilityResponse;
import com.computerstore.backend.service.builder.CompatibilityService;

@RestController
@RequestMapping("/api/compatibility")
public class CompatibilityController {

    private final CompatibilityService compatibilityService;


    public CompatibilityController(
            CompatibilityService compatibilityService) {

        this.compatibilityService = compatibilityService;
    }


    
    @GetMapping("/cpu-mainboard")
    public ResponseEntity<?> checkCpuMainboard(
            @RequestParam Long cpuId,
            @RequestParam Long mainboardId) {

        try {

            CompatibilityResponse response =
                    compatibilityService
                            .checkCpuMainboard(
                                    cpuId,
                                    mainboardId
                            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }


    @GetMapping("/mainboard-ram")
    public ResponseEntity<?> checkMainboardRam(
            @RequestParam Long mainboardId,
            @RequestParam Long ramId) {

        try {

            CompatibilityResponse response =
                    compatibilityService
                            .checkMainboardRam(
                                    mainboardId,
                                    ramId
                            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }


    @GetMapping("/gpu-psu")
    public ResponseEntity<?> checkGpuPsu(
            @RequestParam Long gpuId,
            @RequestParam Long psuId) {

        try {

            CompatibilityResponse response =
                    compatibilityService
                            .checkGpuPsu(
                                    gpuId,
                                    psuId
                            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

   
    @GetMapping("/mainboard-case")
    public ResponseEntity<?> checkMainboardCase(
            @RequestParam Long mainboardId,
            @RequestParam Long caseId) {

        try {

            CompatibilityResponse response =
                    compatibilityService
                            .checkMainboardCase(
                                    mainboardId,
                                    caseId
                            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

  
    @GetMapping("/gpu-case")
    public ResponseEntity<?> checkGpuCase(
            @RequestParam Long gpuId,
            @RequestParam Long caseId) {

        try {

            CompatibilityResponse response =
                    compatibilityService
                            .checkGpuCase(
                                    gpuId,
                                    caseId
                            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }
}