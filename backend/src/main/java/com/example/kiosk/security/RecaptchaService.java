package com.example.kiosk.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class RecaptchaService {
    
    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    @Value("${recaptcha.secret}")
    private String secretKey;

    private final RestTemplate restTemplate;

    public RecaptchaService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean verify(String token) {
    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
    params.add("secret", secretKey);
    params.add("response", token);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

    try {
        ResponseEntity<RecaptchaResponse> response = restTemplate.exchange(
            VERIFY_URL, HttpMethod.POST, request, RecaptchaResponse.class);

        RecaptchaResponse body = response.getBody();

        if (body != null) {
            if (body.isSuccess()) {
                return true;
            } else {
                System.err.println("[reCAPTCHA 실패] 에러 코드: " + String.join(", ", body.getErrorCodes()));
            }
        } else {
            System.err.println("[reCAPTCHA 실패] 응답 본문이 null입니다.");
        }
    } catch (RestClientException e) {
        System.err.println("[reCAPTCHA 서버 통신 실패] " + e.getMessage());
    }

    return false;
  }

}
