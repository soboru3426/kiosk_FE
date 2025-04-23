package com.example.kiosk.login;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.kiosk.security.RecaptchaService;
import com.example.kiosk.user.UserService;

@RestController
@RequestMapping("/api/login")
public class LoginApiController {

    private final UserService userService;
    private final LoginService loginService;
    private final RecaptchaService recaptchaService;

    public LoginApiController(UserService userService,
                              LoginService loginService,
                              RecaptchaService recaptchaService) {
        this.userService = userService;
        this.loginService = loginService;
        this.recaptchaService = recaptchaService;
    }

    @PostMapping
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null || username.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body("아이디와 비밀번호는 필수입니다.");
        }

        boolean success = userService.login(username, password);
        if (!success) {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 잘못되었습니다.");
        }

        boolean isAdmin = loginService.isAdmin(username);
        String role = isAdmin ? "admin" : "branch";

        Map<String, String> response = new HashMap<>();
        response.put("message", "로그인 성공");
        response.put("role", role);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recaptcha")
    public ResponseEntity<?> loginWithCaptcha(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String token = request.get("token");

        if (!recaptchaService.verify(token)) {
            return ResponseEntity.status(403).body("reCAPTCHA 인증 실패");
        }

        return login(request);
    }
}
