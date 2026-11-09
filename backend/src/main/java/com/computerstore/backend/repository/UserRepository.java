package com.computerstore.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.computerstore.backend.entity.User;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsernameLocked(@org.springframework.data.repository.query.Param("username") String username);


    boolean existsByUsername(String username);

    boolean existsByEmail(String email);


    
    List<User>
            findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    String username,
                    String email
            );

    @org.springframework.data.jpa.repository.Query(
        "SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) "
        + "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) "
        + "OR LOWER(u.releasedUsername) LIKE LOWER(CONCAT('%', :keyword, '%')) "
        + "OR LOWER(u.releasedEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> searchAccountsIncludingReleased(
            @org.springframework.data.repository.query.Param("keyword") String keyword);

}