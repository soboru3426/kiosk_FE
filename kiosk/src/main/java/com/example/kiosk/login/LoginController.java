package com.example.kiosk.login;

import com.example.kiosk.security.RecaptchaService;
import com.example.kiosk.user.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class LoginController {

    @Value("${recaptcha.site-key}")
    private String siteKey;

    private final UserService userService;
    private final LoginService loginService;
    private final RecaptchaService recaptchaService;

    public LoginController(UserService userService,
                            LoginService loginService,
                            RecaptchaService recaptchaService) {
        this.userService = userService;
        this.loginService = loginService;
        this.recaptchaService = recaptchaService;
    }

    /**
     * 기본 로그인 페이지 (캡차 없이)
     */
    @GetMapping("/login")
    public String loginPage() {
        return "login"; // 기본 로그인 페이지
    }

    /**
     * 기본 로그인 처리
     */
    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password,
                        Model model) {

        if (username.isEmpty() || password.isEmpty()) {
            model.addAttribute("error", "아이디와 비밀번호를 모두 입력해주세요.");
            return "login"; // 빈 값 체크
        }

        // 로그인 처리
        boolean loginSuccess = userService.login(username, password);
        if (!loginSuccess) {
            model.addAttribute("error", "아이디 또는 비밀번호가 올바르지 않습니다.");
            return "login"; // 실패 시 다시 로그인 페이지
        }

        // 로그인 성공 후 권한별 페이지로 이동
        return redirectByRole(username);
    }

    /**
     * reCAPTCHA 로그인 페이지
     */
    @GetMapping("/login-captcha")
    public String loginCaptchaPage(Model model) {
        model.addAttribute("siteKey", siteKey); // reCAPTCHA 사이트 키 전달
        return "login-captcha"; // login-captcha.html (reCAPTCHA 포함된 페이지)
    }

    /**
     * reCAPTCHA 로그인 처리
     */
    @PostMapping("/login-captcha")
    public String loginWithCaptcha(@RequestParam String username,
                                @RequestParam String password,
                                @RequestParam("g-recaptcha-response") String token,
                                Model model) {

        // 1. reCAPTCHA 검증
        boolean recaptchaValid = recaptchaService.verify(token);
        System.out.println("✅ [reCAPTCHA] 검증 결과: " + recaptchaValid);

        if (!recaptchaValid) {
            System.out.println("❌ [reCAPTCHA] 인증 실패");
            model.addAttribute("error", "reCAPTCHA 인증에 실패했습니다.");
            model.addAttribute("siteKey", siteKey);
            return "login-captcha";
        }

        // 2. 로그인 검증
        System.out.println("📥 입력된 ID: " + username);
        System.out.println("📥 입력된 PW: " + password);

        if (username.isEmpty() || password.isEmpty()) {
            System.out.println("❌ [로그인] ID 또는 PW가 비어 있음");
            model.addAttribute("error", "아이디와 비밀번호를 모두 입력해주세요.");
            model.addAttribute("siteKey", siteKey);
            return "login-captcha";
        }

        boolean loginSuccess = userService.login(username, password);
        System.out.println("🔐 [로그인] 인증 성공 여부: " + loginSuccess);

        if (!loginSuccess) {
            System.out.println("❌ [로그인] ID 또는 PW 불일치");
            model.addAttribute("error", "아이디 또는 비밀번호가 올바르지 않습니다.");
            model.addAttribute("siteKey", siteKey);
            return "login-captcha";
        }

        // 3. 권한 분기
        System.out.println("✅ [로그인] 로그인 성공 → 권한 확인 중...");
        return redirectByRole(username);
    }


    /**
     * 공통: 사용자 이름(username)에 따라 리다이렉트
     */
    private String redirectByRole(String username) {
        // 사용자가 관리자인지 확인
        if (loginService.isAdmin(username)) {
            System.out.println("관리자 로그인: /admin/stock");
            return "redirect:/admin/stock"; // 관리자는 /admin/stock으로 리다이렉트
        } else {
            System.out.println("일반 사용자 로그인: /branch/stock");
            return "redirect:/branch/stock"; // 일반 사용자는 /branch/stock으로 리다이렉트
        }
    }
}
