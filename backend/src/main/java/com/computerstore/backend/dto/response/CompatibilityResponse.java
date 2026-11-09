package com.computerstore.backend.dto.response;

public class CompatibilityResponse {

    private boolean compatible;

    private String message;


    public CompatibilityResponse(
            boolean compatible,
            String message) {

        this.compatible = compatible;
        this.message = message;
    }


    public boolean isCompatible() {
        return compatible;
    }


    public String getMessage() {
        return message;
    }
}