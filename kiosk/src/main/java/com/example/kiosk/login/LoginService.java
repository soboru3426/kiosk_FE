package com.example.kiosk.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.kiosk.user.User;
import com.example.kiosk.user.UserMapper;

@Service
public class LoginService {
    
    @Autowired
    private UserMapper userMapper;

    public boolean login(String username, String password) {
        User user = userMapper.findByUsername(username);
            return user != null && user.getPassword().equals(password);
    }

    public boolean isAdmin(String username) {
        User user = userMapper.findByUsername(username);
            return user != null && "admin".equalsIgnoreCase(user.getRole());
    }
}
