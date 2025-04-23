package com.example.baskin_admin.login;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.baskin_admin.user.UserService;


@Controller
public class LoginController {
    
    private final UserService userService;
    private final LoginService loginService;

    // 생성자 주입
    public LoginController(UserService userService, LoginService loginService) {
        this.userService = userService;
        this.loginService = loginService;
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        Model model) {

    boolean isLoginSuccessful = userService.login(username, password);

    if (isLoginSuccessful) {
        if (loginService.isAdmin(username)) {
            return "redirect:/admin/stock";
        } else {
            return "redirect:/branch/stock";
        }
    } else {
        model.addAttribute("error", "Invalid username or password");
        return "login";
    }
}
}
