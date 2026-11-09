package com.computerstore.backend.dto.response;

import java.util.List;

public class PcBuildCompatibilityResponse {

    private boolean compatible;

    private String message;

    private List<String> issues;


    public PcBuildCompatibilityResponse(
            boolean compatible,
            String message,
            List<String> issues) {

        this.compatible = compatible;
        this.message = message;
        this.issues = issues;
    }


    public boolean isCompatible() {
        return compatible;
    }


    public String getMessage() {
        return message;
    }


    public List<String> getIssues() {
        return issues;
    }
}