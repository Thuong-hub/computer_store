package com.computerstore.backend.service.commerce;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

import org.junit.jupiter.api.Test;

class SepayHmacVerifierTest {

    @Test
    void acceptsCorrectSignatureForOriginalUtf8Body() {
        String secret = "test-secret-for-unit-test-only";
        String timestamp = Long.toString(Instant.now().getEpochSecond());
        byte[] body = "{\"message\":\"Thanh toán TPBank\",\"amount\":8000}"
                .getBytes(StandardCharsets.UTF_8);
        String signature = SepayHmacVerifier.calculateSignature(secret, timestamp, body);

        assertDoesNotThrow(() -> SepayHmacVerifier.verify(
                secret,
                signature,
                timestamp,
                body
        ));
    }

    @Test
    void rejectsChangedRawBody() {
        String secret = "test-secret-for-unit-test-only";
        String timestamp = Long.toString(Instant.now().getEpochSecond());
        byte[] signedBody = "{\"amount\":8000}".getBytes(StandardCharsets.UTF_8);
        byte[] changedBody = "{ \"amount\":8000}".getBytes(StandardCharsets.UTF_8);
        String signature = SepayHmacVerifier.calculateSignature(secret, timestamp, signedBody);

        assertThrows(SecurityException.class, () -> SepayHmacVerifier.verify(
                secret,
                signature,
                timestamp,
                changedBody
        ));
    }

    @Test
    void rejectsWrongSecret() {
        String timestamp = Long.toString(Instant.now().getEpochSecond());
        byte[] body = "{\"amount\":8000}".getBytes(StandardCharsets.UTF_8);
        String signature = SepayHmacVerifier.calculateSignature(
                "first-test-secret",
                timestamp,
                body
        );

        assertThrows(SecurityException.class, () -> SepayHmacVerifier.verify(
                "another-test-secret",
                signature,
                timestamp,
                body
        ));
    }

    @Test
    void rejectsExpiredTimestamp() {
        String secret = "test-secret-for-unit-test-only";
        String timestamp = Long.toString(Instant.now().getEpochSecond() - 600);
        byte[] body = "{}".getBytes(StandardCharsets.UTF_8);
        String signature = SepayHmacVerifier.calculateSignature(secret, timestamp, body);

        assertThrows(SecurityException.class, () -> SepayHmacVerifier.verify(
                secret,
                signature,
                timestamp,
                body
        ));
    }
}
