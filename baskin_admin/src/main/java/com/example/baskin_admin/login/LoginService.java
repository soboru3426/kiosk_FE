package com.example.baskin_admin.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.baskin_admin.user.User;
import com.example.baskin_admin.user.UserRepository;


@Service
public class LoginService {
    
    @Autowired
    private UserRepository userRepository;
    
    public boolean login(String username, String password) {
        User user = userRepository.findByUsername(username);
        return user != null;
    }

    public boolean isAdmin(String username) {
        User user = userRepository.findByUsername(username);
        return user != null && "admin".equalsIgnoreCase(user.getRole());
    }
    
}