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
        logger.debug("🔍 [saveOrUpdateToken] 호출됨 - userId={}, token={}", userId, token);

        FCMToken existing = mapper.getTokenByUserId(userId);
        logger.debug("🔍 getTokenByUserId 결과: {}", existing != null ? "존재함 (업데이트)" : "없음 (신규)");

        LocalDateTime now = LocalDateTime.now();

        if (existing == null) {
            FCMToken newToken = new FCMToken();
            newToken.setUserId(userId);
            newToken.setToken(token);
            newToken.setCreatedAt(now);
            newToken.setUpdatedAt(now);

            logger.debug("➡️ INSERT 준비: userId={}, token={}", newToken.getUserId(), newToken.getToken());

            mapper.insertFCMToken(newToken);
            logger.info("✅ 신규 FCM 토큰 저장 완료 - userId={}", userId);

            // 테스트용 강제 예외 (트랜잭션이 제대로 동작하는지 확인용)
            // throw new RuntimeException("🚨 테스트: insert 후 강제 예외 발생");
        } else {
            existing.setToken(token);
            existing.setUpdatedAt(now);

            logger.debug("➡️ UPDATE 준비: userId={}, token={}", existing.getUserId(), existing.getToken());

            mapper.updateFCMToken(existing);
            logger.info("♻️ 기존 FCM 토큰 갱신 완료 - userId={}", userId);
        }
        
    }



    /**
     * 지정된 userId 에 푸시 알림을 전송하고, 실패 시 WARN 레벨로 로깅합니다.
     */
    public void sendPush(Long userId, String title, String body) {
        logger.debug("📤 [sendPush] 호출됨 - userId={}, title={}, body={}", userId, title, body); // ✅ 추가
    
        FCMToken tokenEntity = mapper.getTokenByUserId(userId);
        if (tokenEntity == null) {
            logger.warn("⚠️ 푸시 실패: FCM 토큰이 존재하지 않음 - userId={}", userId);
            return;
        }
    
        try {
            notificationService.sendPushNotification(tokenEntity.getToken(), title, body);
            logger.info("📨 푸시 알림 전송 완료 - userId={}", userId);
        } catch (Exception e) {
            logger.error("❌ 푸시 알림 전송 실패 - userId={}", userId, e);
        }
    }
    
}
