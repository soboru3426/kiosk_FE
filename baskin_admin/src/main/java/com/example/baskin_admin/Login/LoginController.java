package com.example.baskin_admin.Login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {
    
    @Autowired
    private LoginService loginService;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam("username") String username, @RequestParam("password") String password, Model model) {
        
        boolean isLoginSuccessful = loginService.login(username, password);

        if (isLoginSuccessful) {
            return "redirect:/stock/gangseo";
        } else {
            model.addAttribute("error", "Invalid username or password");
            return "login";
        }
    }
}
