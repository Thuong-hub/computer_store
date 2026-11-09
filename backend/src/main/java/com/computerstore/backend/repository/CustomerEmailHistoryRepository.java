package com.computerstore.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.computerstore.backend.entity.CustomerEmailHistory;

public interface CustomerEmailHistoryRepository extends JpaRepository<CustomerEmailHistory, Long> {
    boolean existsByEmailHashAndUserIdNot(String hash, Long userId);
    boolean existsByEmailHashAndUserId(String hash, Long userId);

    @Query("SELECT DISTINCT e.userId FROM CustomerEmailHistory e WHERE e.emailHash IN "
            + "(SELECT e2.emailHash FROM CustomerEmailHistory e2 WHERE e2.userId = :userId)")
    List<Long> findRelatedUserIds(@Param("userId") Long userId);
}
