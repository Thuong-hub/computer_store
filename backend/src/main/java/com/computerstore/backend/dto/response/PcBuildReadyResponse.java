package com.computerstore.backend.dto.response;

import java.util.List;

public class PcBuildReadyResponse {

    private boolean ready;

    private String message;

    private List<String> missingComponents;

    private List<String> compatibilityIssues;


    public PcBuildReadyResponse(
            boolean ready,
            String message,
            List<String> missingComponents,
            List<String> compatibilityIssues) {

        this.ready = ready;
        this.message = message;
        this.missingComponents = missingComponents;
        this.compatibilityIssues = compatibilityIssues;
    }


    public boolean isReady() {
        return ready;
    }


    public String getMessage() {
        return message;
    }


    public List<String> getMissingComponents() {
        return missingComponents;
    }


    public List<String> getCompatibilityIssues() {
        return compatibilityIssues;
    }
}