// src/main/java/com/example/kiosk/fcmtoken/FCMTokenService.java
package com.example.kiosk.fcmtoken;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FCMTokenService {

    private static final Logger logger = LoggerFactory.getLogger(FCMTokenService.class);

    private final FCMTokenMapper mapper;
    private final FCMNotificationService notificationService;

    @Autowired
    public FCMTokenService(FCMTokenMapper mapper, FCMNotificationService notificationService) {
        this.mapper = mapper;
        this.notificationService = notificationService;
    }

    /**
     * userId 기반으로 FCM 토큰을 저장하거나 갱신합니다.
     * DB에 대한 INSERT/UPDATE 는 트랜잭션으로 보장됩니다.
     */
    @Transactional
    public void saveOrUpdateToken(Long userId, String token) {
        FCMToken existing = mapper.getTokenByUserId(userId);
        LocalDateTime now = LocalDateTime.now();

        if (existing == null) {
            FCMToken newToken = new FCMToken();
            newToken.setUserId(userId);
            newToken.setToken(token);
            newToken.setCreatedAt(now);
            newToken.setUpdatedAt(now);
            mapper.insertFCMToken(newToken);
            logger.info("Inserted new FCM token for userId={}", userId);
        } else {
            existing.setToken(token);
            existing.setUpdatedAt(now);
            mapper.updateFCMToken(existing);
            logger.info("Updated FCM token for userId={}", userId);
        }
    }

    /**
     * 지정된 userId 에 푸시 알림을 전송하고, 실패 시 WARN 레벨로 로깅합니다.
     */
    public void sendPush(Long userId, String title, String body) {
        FCMToken tokenEntity = mapper.getTokenByUserId(userId);
        if (tokenEntity == null) {
            logger.warn("Cannot send push: no FCM token found for userId={}", userId);
            return;
        }
        try {
            notificationService.sendPushNotification(tokenEntity.getToken(), title, body);
            logger.info("Push notification sent to userId={}", userId);
        } catch (Exception e) {
            logger.error("Failed to send push for userId={}", userId, e);
        }
    }
}
