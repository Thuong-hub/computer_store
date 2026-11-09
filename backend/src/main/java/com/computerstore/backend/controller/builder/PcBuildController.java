package com.computerstore.backend.controller.builder;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.computerstore.backend.dto.request.AddPcBuildItemRequest;
import com.computerstore.backend.dto.response.CartResponse;
import com.computerstore.backend.dto.request.CreatePcBuildRequest;
import com.computerstore.backend.dto.response.PcBuildCompatibilityResponse;
import com.computerstore.backend.dto.response.PcBuildDetailResponse;
import com.computerstore.backend.dto.response.PcBuildItemResponse;
import com.computerstore.backend.dto.response.PcBuildReadyResponse;
import com.computerstore.backend.dto.response.PcBuildResponse;
import com.computerstore.backend.dto.response.PcBuildValidationResponse;
import com.computerstore.backend.dto.request.UpdatePcBuildItemRequest;
import com.computerstore.backend.dto.request.UpdatePcBuildRequest;
import com.computerstore.backend.service.builder.PcBuildService;

@RestController
@RequestMapping("/api/pc-builds")
public class PcBuildController {

    private final PcBuildService pcBuildService;


    public PcBuildController(
            PcBuildService pcBuildService) {

        this.pcBuildService = pcBuildService;
    }


   
    @PostMapping
    public ResponseEntity<?> createBuild(
            Authentication authentication,
            @RequestBody CreatePcBuildRequest request) {

        try {

            String username =
                    authentication.getName();


            PcBuildResponse response =
                    pcBuildService.createBuild(
                            username,
                            request
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

   
    @GetMapping
    public ResponseEntity<?> getMyBuilds(
            Authentication authentication) {

        try {

            String username =
                    authentication.getName();


            List<PcBuildResponse> builds =
                    pcBuildService.getMyBuilds(
                            username
                    );


            return ResponseEntity.ok(builds);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

    
    @GetMapping("/{buildId}")
    public ResponseEntity<?> getBuildById(
            Authentication authentication,
            @PathVariable Long buildId) {

        try {

            String username =
                    authentication.getName();


            PcBuildResponse response =
                    pcBuildService.getBuildById(
                            username,
                            buildId
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

       
        @PostMapping("/{buildId}/items")
        public ResponseEntity<?> addItemToBuild(
                Authentication authentication,
                @PathVariable Long buildId,
                @RequestBody AddPcBuildItemRequest request) {

        try {

                String username =
                        authentication.getName();


                PcBuildItemResponse response =
                        pcBuildService.addItemToBuild(
                                username,
                                buildId,
                                request
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

       
        @GetMapping("/{buildId}/items")
        public ResponseEntity<?> getBuildItems(
                Authentication authentication,
                @PathVariable Long buildId) {

        try {

                String username =
                        authentication.getName();


                List<PcBuildItemResponse> items =
                        pcBuildService.getBuildItems(
                                username,
                                buildId
                        );


                return ResponseEntity.ok(items);

        } catch (RuntimeException e) {

                return ResponseEntity.badRequest().body(
                        java.util.Map.of(
                                "message",
                                e.getMessage()
                        )
                );
        }
        }

       
        @PutMapping("/{buildId}/items/{buildItemId}")
        public ResponseEntity<?> updateBuildItem(
                Authentication authentication,
                @PathVariable Long buildId,
                @PathVariable Long buildItemId,
                @RequestBody UpdatePcBuildItemRequest request) {

        try {

                String username =
                        authentication.getName();


                PcBuildItemResponse response =
                        pcBuildService.updateBuildItem(
                                username,
                                buildId,
                                buildItemId,
                                request
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

       
        @DeleteMapping("/{buildId}/items/{buildItemId}")
        public ResponseEntity<?> removeBuildItem(
                Authentication authentication,
                @PathVariable Long buildId,
                @PathVariable Long buildItemId) {

        try {

                String username =
                        authentication.getName();


                pcBuildService.removeBuildItem(
                        username,
                        buildId,
                        buildItemId
                );


                return ResponseEntity.ok(
                        java.util.Map.of(
                                "message",
                                "Xóa linh kiện khỏi PC Build thành công"
                        )
                );

        } catch (RuntimeException e) {

                return ResponseEntity.badRequest().body(
                        java.util.Map.of(
                                "message",
                                e.getMessage()
                        )
                );
        }
        }

        
        @DeleteMapping("/{buildId}")
        public ResponseEntity<?> deleteBuild(
                Authentication authentication,
                @PathVariable Long buildId) {

        try {

                String username =
                        authentication.getName();


                pcBuildService.deleteBuild(
                        username,
                        buildId
                );


                return ResponseEntity.ok(
                        java.util.Map.of(
                                "message",
                                "Xóa PC Build thành công"
                        )
                );

        } catch (RuntimeException e) {

                return ResponseEntity.badRequest().body(
                        java.util.Map.of(
                                "message",
                                e.getMessage()
                        )
                );
        }
        }

       
        @PutMapping("/{buildId}")
        public ResponseEntity<?> updateBuild(
                Authentication authentication,
                @PathVariable Long buildId,
                @RequestBody UpdatePcBuildRequest request) {

        try {

                String username =
                        authentication.getName();


                PcBuildResponse response =
                        pcBuildService.updateBuild(
                                username,
                                buildId,
                                request
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

        
        @GetMapping("/{buildId}/detail")
        public ResponseEntity<?> getBuildDetail(
                Authentication authentication,
                @PathVariable Long buildId) {

        try {

                String username =
                        authentication.getName();

                PcBuildDetailResponse response =
                        pcBuildService.getBuildDetail(
                                username,
                                buildId
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

        
        @GetMapping("/{buildId}/validate")
        public ResponseEntity<?> validateBuild(
                Authentication authentication,
                @PathVariable Long buildId) {

        try {

                String username =
                        authentication.getName();

                PcBuildValidationResponse response =
                        pcBuildService.validateBuild(
                                username,
                                buildId
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

        
        @GetMapping("/{buildId}/compatibility")
        public ResponseEntity<?> checkBuildCompatibility(
                Authentication authentication,
                @PathVariable Long buildId) {

        try {

                String username =
                        authentication.getName();

                PcBuildCompatibilityResponse response =
                        pcBuildService.checkBuildCompatibility(
                                username,
                                buildId
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

        
        @GetMapping("/{buildId}/ready")
        public ResponseEntity<?> checkBuildReady(
                Authentication authentication,
                @PathVariable Long buildId) {

        try {

                String username =
                        authentication.getName();

                PcBuildReadyResponse response =
                        pcBuildService.checkBuildReady(
                                username,
                                buildId
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

      
        @PostMapping("/{buildId}/add-to-cart")
        public ResponseEntity<?> addBuildToCart(
                Authentication authentication,
                @PathVariable Long buildId) {

        try {

                String username =
                        authentication.getName();

                CartResponse response =
                        pcBuildService.addBuildToCart(
                                username,
                                buildId
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