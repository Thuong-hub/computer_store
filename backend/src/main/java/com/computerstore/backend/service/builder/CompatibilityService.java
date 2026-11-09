package com.computerstore.backend.service.builder;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.dto.response.CompatibilityResponse;
import com.computerstore.backend.entity.ComponentSpec;
import com.computerstore.backend.entity.Product;
import com.computerstore.backend.repository.ComponentSpecRepository;
import com.computerstore.backend.repository.ProductRepository;

@Service
public class CompatibilityService {

    private final ProductRepository productRepository;
    private final ComponentSpecRepository componentSpecRepository;


    public CompatibilityService(
            ProductRepository productRepository,
            ComponentSpecRepository componentSpecRepository) {

        this.productRepository = productRepository;
        this.componentSpecRepository = componentSpecRepository;
    }


    @Transactional(readOnly = true)
    public CompatibilityResponse checkCpuMainboard(
            Long cpuProductId,
            Long mainboardProductId) {

        Product cpu = productRepository
                .findById(cpuProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "CPU không tồn tại"
                        )
                );


        Product mainboard = productRepository
                .findById(mainboardProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Mainboard không tồn tại"
                        )
                );


        ComponentSpec cpuSocketSpec =
                componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(
                                cpu.getProductId(),
                                "SOCKET"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "CPU chưa có thông tin SOCKET"
                                )
                        );


        ComponentSpec mainboardSocketSpec =
                componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(
                                mainboard.getProductId(),
                                "SOCKET"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Mainboard chưa có thông tin SOCKET"
                                )
                        );


        String cpuSocket =
                cpuSocketSpec
                        .getSpecValue()
                        .trim();


        String mainboardSocket =
                mainboardSocketSpec
                        .getSpecValue()
                        .trim();


        boolean compatible =
                cpuSocket.equalsIgnoreCase(
                        mainboardSocket
                );


        if (compatible) {

            return new CompatibilityResponse(
                    true,
                    "CPU "
                            + cpu.getName()
                            + " và Mainboard "
                            + mainboard.getName()
                            + " tương thích socket "
                            + cpuSocket
            );
        }


        return new CompatibilityResponse(
                false,
                "CPU "
                        + cpu.getName()
                        + " dùng socket "
                        + cpuSocket
                        + " nhưng Mainboard "
                        + mainboard.getName()
                        + " dùng socket "
                        + mainboardSocket
        );
    }

    @Transactional(readOnly = true)
    public CompatibilityResponse checkMainboardRam(
            Long mainboardProductId,
            Long ramProductId) {

        Product mainboard = productRepository
                .findById(mainboardProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Mainboard không tồn tại"
                        )
                );


        Product ram = productRepository
                .findById(ramProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "RAM không tồn tại"
                        )
                );


        ComponentSpec mainboardRamTypeSpec =
                componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(
                                mainboard.getProductId(),
                                "RAM_TYPE"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Mainboard chưa có thông tin RAM_TYPE"
                                )
                        );


        ComponentSpec ramTypeSpec =
                componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(
                                ram.getProductId(),
                                "RAM_TYPE"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "RAM chưa có thông tin RAM_TYPE"
                                )
                        );


        String mainboardRamType =
                mainboardRamTypeSpec
                        .getSpecValue()
                        .trim();

        String ramType =
                ramTypeSpec
                        .getSpecValue()
                        .trim();


        boolean compatible =
                mainboardRamType.equalsIgnoreCase(
                        ramType
                );


        if (compatible) {

            return new CompatibilityResponse(
                    true,
                    "Mainboard "
                            + mainboard.getName()
                            + " và RAM "
                            + ram.getName()
                            + " tương thích loại RAM "
                            + ramType
            );
        }


        return new CompatibilityResponse(
                false,
                "Mainboard "
                        + mainboard.getName()
                        + " hỗ trợ "
                        + mainboardRamType
                        + " nhưng RAM "
                        + ram.getName()
                        + " là "
                        + ramType
        );
    }

    @Transactional(readOnly = true)
    public CompatibilityResponse checkGpuPsu(
            Long gpuProductId,
            Long psuProductId) {

        Product gpu = productRepository
                .findById(gpuProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "GPU không tồn tại"
                        )
                );


        Product psu = productRepository
                .findById(psuProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "PSU không tồn tại"
                        )
                );


        ComponentSpec recommendedPsuSpec =
                componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(
                                gpu.getProductId(),
                                "RECOMMENDED_PSU"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "GPU chưa có thông tin RECOMMENDED_PSU"
                                )
                        );


        ComponentSpec psuWattageSpec =
                componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(
                                psu.getProductId(),
                                "WATTAGE"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "PSU chưa có thông tin WATTAGE"
                                )
                        );


        BigDecimal recommendedPsu;

        BigDecimal psuWattage;


        try {

            recommendedPsu =
                    new BigDecimal(
                            recommendedPsuSpec
                                    .getSpecValue()
                                    .trim()
                    );


            psuWattage =
                    new BigDecimal(
                            psuWattageSpec
                                    .getSpecValue()
                                    .trim()
                    );

        } catch (NumberFormatException e) {

            throw new RuntimeException(
                    "Thông số công suất GPU hoặc PSU không hợp lệ"
            );
        }


        boolean compatible =
                psuWattage.compareTo(
                        recommendedPsu
                ) >= 0;


        if (compatible) {

            return new CompatibilityResponse(
                    true,
                    "PSU "
                            + psu.getName()
                            + " có công suất "
                            + psuWattage
                            + "W, đáp ứng GPU "
                            + gpu.getName()
                            + " yêu cầu tối thiểu "
                            + recommendedPsu
                            + "W"
            );
        }


        return new CompatibilityResponse(
                false,
                "GPU "
                        + gpu.getName()
                        + " yêu cầu PSU tối thiểu "
                        + recommendedPsu
                        + "W nhưng PSU "
                        + psu.getName()
                        + " chỉ có "
                        + psuWattage
                        + "W"
        );
    }

    @Transactional(readOnly = true)
    public CompatibilityResponse checkMainboardCase(
            Long mainboardProductId,
            Long caseProductId) {

        Product mainboard = productRepository
                .findById(mainboardProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Mainboard không tồn tại"
                        )
                );


        Product pcCase = productRepository
                .findById(caseProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Case không tồn tại"
                        )
                );


        ComponentSpec mainboardFormFactorSpec =
                componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(
                                mainboard.getProductId(),
                                "FORM_FACTOR"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Mainboard chưa có thông tin FORM_FACTOR"
                                )
                        );


        ComponentSpec caseFormFactorSpec =
                componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(
                                pcCase.getProductId(),
                                "SUPPORTED_FORM_FACTOR"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Case chưa có thông tin SUPPORTED_FORM_FACTOR"
                                )
                        );


        String mainboardFormFactor =
                normalizeFormFactor(
                        mainboardFormFactorSpec
                                .getSpecValue()
                );


        String supportedValue =
                caseFormFactorSpec
                        .getSpecValue();


        String[] supportedFormFactors =
                supportedValue.split(",");


        boolean compatible = false;


        for (String supported : supportedFormFactors) {

            if (mainboardFormFactor.equals(
                    normalizeFormFactor(supported))) {

                compatible = true;
                break;
            }
        }


        if (compatible) {

            return new CompatibilityResponse(
                    true,
                    "Mainboard "
                            + mainboard.getName()
                            + " có Form Factor "
                            + mainboardFormFactorSpec.getSpecValue()
                            + " và tương thích với Case "
                            + pcCase.getName()
            );
        }


        return new CompatibilityResponse(
                false,
                "Mainboard "
                        + mainboard.getName()
                        + " có Form Factor "
                        + mainboardFormFactorSpec.getSpecValue()
                        + " nhưng Case "
                        + pcCase.getName()
                        + " chỉ hỗ trợ "
                        + supportedValue
        );
    }

    private String normalizeFormFactor(String value) {

        if (value == null) {
            return "";
        }

        return value
                .trim()
                .toUpperCase()
                .replace("-", "")
                .replace("_", "")
                .replace(" ", "");
    }

    @Transactional(readOnly = true)
    public CompatibilityResponse checkGpuCase(
            Long gpuProductId,
            Long caseProductId) {

        Product gpu = productRepository
                .findById(gpuProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "GPU không tồn tại"
                        )
                );


        Product pcCase = productRepository
                .findById(caseProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Case không tồn tại"
                        )
                );


        ComponentSpec gpuLengthSpec =
                componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(
                                gpu.getProductId(),
                                "GPU_LENGTH"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "GPU chưa có thông tin GPU_LENGTH"
                                )
                        );


        ComponentSpec maxGpuLengthSpec =
                componentSpecRepository
                        .findByProductIdAndSpecNameIgnoreCase(
                                pcCase.getProductId(),
                                "MAX_GPU_LENGTH"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Case chưa có thông tin MAX_GPU_LENGTH"
                                )
                        );


        BigDecimal gpuLength;
        BigDecimal maxGpuLength;


        try {

            gpuLength =
                    new BigDecimal(
                            gpuLengthSpec
                                    .getSpecValue()
                                    .trim()
                    );


            maxGpuLength =
                    new BigDecimal(
                            maxGpuLengthSpec
                                    .getSpecValue()
                                    .trim()
                    );

        } catch (NumberFormatException e) {

            throw new RuntimeException(
                    "Thông số chiều dài GPU hoặc Case không hợp lệ"
            );
        }


        boolean compatible =
                gpuLength.compareTo(
                        maxGpuLength
                ) <= 0;


        if (compatible) {

            return new CompatibilityResponse(
                    true,
                    "GPU "
                            + gpu.getName()
                            + " dài "
                            + gpuLength
                            + "mm và vừa với Case "
                            + pcCase.getName()
                            + " hỗ trợ tối đa "
                            + maxGpuLength
                            + "mm"
            );
        }


        return new CompatibilityResponse(
                false,
                "GPU "
                        + gpu.getName()
                        + " dài "
                        + gpuLength
                        + "mm nhưng Case "
                        + pcCase.getName()
                        + " chỉ hỗ trợ tối đa "
                        + maxGpuLength
                        + "mm"
        );
    }
}