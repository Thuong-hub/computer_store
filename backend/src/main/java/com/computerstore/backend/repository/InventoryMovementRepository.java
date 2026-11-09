package com.computerstore.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.computerstore.backend.entity.InventoryMovement;

public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    List<InventoryMovement> findTop200ByOrderByCreatedAtDescIdDesc();
    List<InventoryMovement> findTop200ByProductIdOrderByCreatedAtDescIdDesc(Long id);
}
