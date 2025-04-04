package com.example.baskin_admin.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.baskin_admin.user.UserService;


@Controller
public class LoginController {
    
    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam("username") String username, @RequestParam("password") String password, Model model) {
        
        boolean isLoginSuccessful = userService.login(username, password);

        if (isLoginSuccessful) {
            return "redirect:/stock";  // 수정된 부분: /stock으로 리디렉션
        } else {
            model.addAttribute("error", "Invalid username or password");
            return "login";
        }
    }
}
