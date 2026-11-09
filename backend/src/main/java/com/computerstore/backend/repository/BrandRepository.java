package com.computerstore.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.computerstore.backend.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {

}