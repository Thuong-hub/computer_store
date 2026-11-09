package com.computerstore.backend.dto.response;

import java.util.List;

public class PcBuildValidationResponse {

    private boolean valid;

    private String message;

    private List<String> missingComponents;


    public PcBuildValidationResponse(
            boolean valid,
            String message,
            List<String> missingComponents) {

        this.valid = valid;
        this.message = message;
        this.missingComponents = missingComponents;
    }


    public boolean isValid() {
        return valid;
    }


    public String getMessage() {
        return message;
    }


    public List<String> getMissingComponents() {
        return missingComponents;
    }
}