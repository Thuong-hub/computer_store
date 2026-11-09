package com.computerstore.backend.service.catalog;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.computerstore.backend.entity.Category;
import com.computerstore.backend.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    
    public Optional<Category> updateCategory(Long id, Category newCategory) {

        return categoryRepository.findById(id).map(category -> {

            category.setName(newCategory.getName());
            category.setDescription(newCategory.getDescription());

            return categoryRepository.save(category);
        });
    }

    
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}