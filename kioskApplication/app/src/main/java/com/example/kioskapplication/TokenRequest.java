// app/src/main/java/com/example/kioskapplication/TokenRequest.java
package com.example.kioskapplication;

public class TokenRequest {
    private Long userId;
    private String token;

    // 기본 생성자 (Gson 역직렬화용)
    public TokenRequest() { }

    public TokenRequest(Long userId, String token) {
        this.userId = userId;
        this.token = token;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
