package com.computerstore.backend.service.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.computerstore.backend.entity.CustomerEmailHistory;
import com.computerstore.backend.repository.CustomerEmailHistoryRepository;

@Service
public class CustomerEmailHistoryService {
    private final CustomerEmailHistoryRepository records;

    public CustomerEmailHistoryService(CustomerEmailHistoryRepository records) {
        this.records = records;
    }

    public String hash(String email) {
        try {
            String normalized = email.trim().toLowerCase(Locale.ROOT);
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(normalized.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Không thể tạo mã đối chiếu Gmail", e);
        }
    }

    @Transactional(readOnly = true)
    public boolean hasBeenUsedByAnotherAccount(String email, Long userId) {
        return records.existsByEmailHashAndUserIdNot(hash(email), userId);
    }

    @Transactional
    public void remember(Long userId, String email) {
        String emailHash = hash(email);
        if (!records.existsByEmailHashAndUserId(emailHash, userId)) {
            CustomerEmailHistory record = new CustomerEmailHistory();
            record.setUserId(userId);
            record.setEmailHash(emailHash);
            records.saveAndFlush(record);
        }
    }

    @Transactional(readOnly = true)
    public List<Long> relatedUserIds(Long userId) {
        Set<Long> related = new HashSet<>();
        List<Long> pending = new ArrayList<>();
        related.add(userId);
        pending.add(userId);
        for (int index = 0; index < pending.size(); index++) {
            for (Long otherId : records.findRelatedUserIds(pending.get(index))) {
                if (related.add(otherId)) {
                    pending.add(otherId);
                }
            }
        }
        return pending;
    }
}
