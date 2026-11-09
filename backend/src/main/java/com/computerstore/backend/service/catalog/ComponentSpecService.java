package com.computerstore.backend.service.catalog;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.computerstore.backend.entity.ComponentSpec;
import com.computerstore.backend.repository.ComponentSpecRepository;

@Service
public class ComponentSpecService {

    private final ComponentSpecRepository componentSpecRepository;


    public ComponentSpecService(
            ComponentSpecRepository componentSpecRepository) {

        this.componentSpecRepository =
                componentSpecRepository;
    }



    public List<ComponentSpec> getSpecsByProductId(
            Long productId) {

        return componentSpecRepository
                .findByProductId(productId);
    }

    public List<ComponentSpec> getActiveSpecs(
            Long categoryId) {

        return componentSpecRepository
                .findActiveSpecs(categoryId);
    }



    public ComponentSpec createSpec(
            ComponentSpec componentSpec) {

        if (componentSpec.getSpecName() == null
                || componentSpec.getSpecName().isBlank()) {

            throw new RuntimeException(
                    "Tên thông số không được để trống"
            );
        }


        if (componentSpec.getSpecValue() == null
                || componentSpec.getSpecValue().isBlank()) {

            throw new RuntimeException(
                    "Giá trị thông số không được để trống"
            );
        }


        componentSpec.setSpecName(
                normalizeSpecName(
                        componentSpec.getSpecName()
                )
        );


        componentSpec.setSpecValue(
                componentSpec
                        .getSpecValue()
                        .trim()
        );


        if (componentSpec.getSpecUnit() != null) {

            String unit =
                    componentSpec
                            .getSpecUnit()
                            .trim();

            componentSpec.setSpecUnit(
                    unit.isEmpty()
                            ? null
                            : unit
            );
        }


        try {

            return componentSpecRepository
                    .save(componentSpec);

        } catch (DataIntegrityViolationException e) {

            throw new RuntimeException(
                    "Sản phẩm đã có thông số "
                    + componentSpec.getSpecName()
            );
        }
    }



    public Optional<ComponentSpec> updateSpec(
            Long specId,
            ComponentSpec newSpec) {

        if (newSpec.getSpecName() == null
                || newSpec.getSpecName().isBlank()) {

            throw new RuntimeException(
                    "Tên thông số không được để trống"
            );
        }


        if (newSpec.getSpecValue() == null
                || newSpec.getSpecValue().isBlank()) {

            throw new RuntimeException(
                    "Giá trị thông số không được để trống"
            );
        }


        return componentSpecRepository
                .findById(specId)
                .map(spec -> {

                    spec.setSpecName(
                            normalizeSpecName(
                                    newSpec.getSpecName()
                            )
                    );


                    spec.setSpecValue(
                            newSpec
                                    .getSpecValue()
                                    .trim()
                    );


                    if (newSpec.getSpecUnit() != null) {

                        String unit =
                                newSpec
                                        .getSpecUnit()
                                        .trim();

                        spec.setSpecUnit(
                                unit.isEmpty()
                                        ? null
                                        : unit
                        );

                    } else {

                        spec.setSpecUnit(null);
                    }


                    try {

                        return componentSpecRepository
                                .save(spec);

                    } catch (
                        DataIntegrityViolationException e
                    ) {

                        throw new RuntimeException(
                                "Sản phẩm đã có thông số "
                                + spec.getSpecName()
                        );
                    }
                });
    }



    public void deleteSpec(Long specId) {

        componentSpecRepository
                .deleteById(specId);
    }



    private String normalizeSpecName(
            String specName) {

        return specName

                .trim()

                .replaceAll("\\s+", "_")

                .replaceAll("_+", "_")

                .toUpperCase(
                        Locale.ROOT
                );
    }
}