package com.example.baskin_admin.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public boolean login(String username, String password) {
        User user = userRepository.findByUsername(username);
        
        if (user != null && password.equals(user.getPassword())) {
            return true;
        }
        
        return false;
    }
}