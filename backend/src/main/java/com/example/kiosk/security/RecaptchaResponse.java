package com.example.kiosk.security;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RecaptchaResponse {

    private boolean success;

    @JsonProperty("error-codes")
    private List<String> errorCodes;

    // 기본 생성자
    public RecaptchaResponse() {
    }

    // Getter
    public boolean isSuccess() {
        return success;
    }

    public List<String> getErrorCodes() {
        return errorCodes;
    }

    // 디버깅용 toString
    @Override
    public String toString() {
        return "RecaptchaResponse{" +
                "success=" + success +
                ", errorCodes=" + errorCodes +
                '}';
    }
}
