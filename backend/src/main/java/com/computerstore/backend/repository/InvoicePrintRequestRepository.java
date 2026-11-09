package com.computerstore.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.computerstore.backend.entity.InvoicePrintRequest;

public interface InvoicePrintRequestRepository extends JpaRepository<InvoicePrintRequest, Long> {

    Optional<InvoicePrintRequest> findByOrderId(Long orderId);

    List<InvoicePrintRequest> findAllByOrderByRequestedAtDesc();
}
