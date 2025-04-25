package com.example.kiosk.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    /**
     * ✅ 로그인 검증 (아이디 + 비밀번호 체크)
     */
    public boolean login(String username, String password) {
        System.out.println("username: " + username);
        User user = userMapper.findByUsername(username);
    
        if (user == null) {
            System.out.println("사용자가 존재하지 않습니다.");
            return false;
        }
    
        // 디버깅 로그 추가
        System.out.println("조회된 사용자: " + user.getUsername());
        System.out.println("저장된 비밀번호: " + user.getPassword());
        System.out.println("입력된 비밀번호: " + password);
    
        return password.equals(user.getPassword());
    }

    /**
     * ✅ 사용자 정보 가져오기
     */
    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }
}
