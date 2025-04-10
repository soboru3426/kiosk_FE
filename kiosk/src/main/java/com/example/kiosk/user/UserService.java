package com.example.kiosk.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;

    public boolean login(String username, String password) {
        User user = userMapper.findByUsername(username);

        // 단순 문자열 비교 (추후에 암호화 방식 적용 권장)
        return user != null && password.equals(user.getPassword());
    }
}
