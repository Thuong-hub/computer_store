package com.computerstore.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.computerstore.backend.entity.Category;

public interface CategoryRepository
        extends JpaRepository<Category, Long> {

}