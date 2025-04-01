package com.example.baskin_admin.Login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.baskin_admin.User.User;
import com.example.baskin_admin.User.UserRepository;

@Service
public class LoginService {
    
    @Autowired
    private UserRepository userRepository;
    
    public boolean login(String username, String password) {
        User user = userRepository.findByUsernameAndPassword(username, password);
        return user != null;
    }
}