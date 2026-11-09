package com.computerstore.backend.service.catalog;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.computerstore.backend.entity.Brand;
import com.computerstore.backend.repository.BrandRepository;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

   
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    
    public Optional<Brand> getBrandById(Long id) {
        return brandRepository.findById(id);
    }

    
    public Brand createBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    
    public Optional<Brand> updateBrand(Long id, Brand newBrand) {

        return brandRepository.findById(id).map(brand -> {

            brand.setName(newBrand.getName());
            brand.setDescription(newBrand.getDescription());

            return brandRepository.save(brand);
        });
    }

    
    public void deleteBrand(Long id) {
        brandRepository.deleteById(id);
    }
}