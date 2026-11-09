package com.computerstore.backend.service.commerce;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Locale;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public final class SepayHmacVerifier {

    private static final long ALLOWED_TIMESTAMP_DRIFT_SECONDS = 300;
    private static final String SIGNATURE_PREFIX = "sha256=";

    private SepayHmacVerifier() {
    }

    public static void verify(
            String secret,
            String signatureHeader,
            String timestampHeader,
            byte[] rawBody) {

        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("SEPAY_WEBHOOK_SECRET chưa được cấu hình");
        }

        if (rawBody == null || rawBody.length == 0) {
            throw new SecurityException("Webhook body rỗng");
        }

        if (signatureHeader == null || signatureHeader.isBlank()) {
            throw new SecurityException("Thiếu chữ ký X-SePay-Signature");
        }

        if (timestampHeader == null || timestampHeader.isBlank()) {
            throw new SecurityException("Thiếu timestamp X-SePay-Timestamp");
        }

        String timestamp = timestampHeader.strip();
        if (!timestamp.matches("\\d{1,12}")) {
            throw new SecurityException("Timestamp SePay không hợp lệ");
        }

        long timestampSeconds;
        try {
            timestampSeconds = Long.parseLong(timestamp);
        } catch (NumberFormatException exception) {
            throw new SecurityException("Timestamp SePay không hợp lệ");
        }

        long now = Instant.now().getEpochSecond();
        long drift = timestampSeconds >= now
                ? timestampSeconds - now
                : now - timestampSeconds;

        if (timestampSeconds <= 0 || drift > ALLOWED_TIMESTAMP_DRIFT_SECONDS) {
            throw new SecurityException("Webhook SePay đã hết hạn");
        }

        String provided = signatureHeader.strip().toLowerCase(Locale.ROOT);
        if (!provided.matches("sha256=[0-9a-f]{64}")) {
            throw new SecurityException("Định dạng chữ ký SePay không hợp lệ");
        }

        byte[] expected = calculateSignature(secret.strip(), timestamp, rawBody)
                .getBytes(StandardCharsets.US_ASCII);
        byte[] actual = provided.getBytes(StandardCharsets.US_ASCII);

        if (!MessageDigest.isEqual(expected, actual)) {
            throw new SecurityException("Chữ ký SePay không hợp lệ");
        }
    }

    public static String calculateSignature(
            String secret,
            String timestamp,
            byte[] rawBody) {

        if (secret == null || secret.isBlank()) {
            throw new IllegalArgumentException("Secret Key không được để trống");
        }
        if (timestamp == null || timestamp.isBlank()) {
            throw new IllegalArgumentException("Timestamp không được để trống");
        }
        if (rawBody == null) {
            throw new IllegalArgumentException("Raw body không được null");
        }

        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec key = new SecretKeySpec(
                    secret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            mac.init(key);
            mac.update(timestamp.getBytes(StandardCharsets.UTF_8));
            mac.update((byte) '.');
            mac.update(rawBody);

            return SIGNATURE_PREFIX + HexFormat.of().formatHex(mac.doFinal());
        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Không thể tính chữ ký HMAC-SHA256",
                    exception
            );
        }
    }
}
