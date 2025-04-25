package com.example.kiosk.login;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.kiosk.security.RecaptchaService;
import com.example.kiosk.user.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
public class LoginApiController {
    private final UserService userService;
    private final LoginService loginService;
    private final RecaptchaService recaptchaService;

    public LoginApiController(UserService userService,
                              LoginService loginService,
                              RecaptchaService recaptchaService) {
        this.userService     = userService;
        this.loginService    = loginService;
        this.recaptchaService = recaptchaService;
    }

    @PostMapping("/recaptcha")
    public ResponseEntity<?> loginWithCaptcha(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        String username = request.get("username");
        String password = request.get("password");
        String token    = request.get("token");

        // 입력 검증
        if (username == null || password == null || username.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body("아이디와 비밀번호는 필수입니다.");
        }
        if (!recaptchaService.verify(token)) {
            return ResponseEntity.status(403).body("reCAPTCHA 인증 실패");
        }

        // 실제 로그인
        boolean success = userService.login(username, password);
        if (!success) {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 잘못되었습니다.");
        }
        boolean isAdmin = loginService.isAdmin(username);
        String  role    = isAdmin ? "admin" : "branch";

        // 세션에 인증 정보 저장
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("username", username);
        session.setAttribute("role", role);

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "로그인 성공");
        resp.put("role", role);
        return ResponseEntity.ok(resp);
    }
}
