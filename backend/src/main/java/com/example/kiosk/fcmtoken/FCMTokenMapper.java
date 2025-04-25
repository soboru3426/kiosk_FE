// src/main/java/com/example/kiosk/fcmtoken/FCMTokenMapper.java
package com.example.kiosk.fcmtoken;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FCMTokenMapper {

    /**
     * userId로 저장된 토큰 조회
     */
    FCMToken getTokenByUserId(@Param("userId") Long userId);

    /**
     * 새 토큰 INSERT
     */
    void insertFCMToken(FCMToken token);

    /**
     * 기존 토큰 UPDATE
     */
    void updateFCMToken(FCMToken token);
}
