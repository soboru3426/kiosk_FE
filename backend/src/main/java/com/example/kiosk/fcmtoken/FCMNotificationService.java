// src/main/java/com/example/kiosk/fcmtoken/FCMNotificationService.java
package com.example.kiosk.fcmtoken;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

@Service
public class FCMNotificationService {
    private static final Logger logger = LoggerFactory.getLogger(FCMNotificationService.class);

    /**
     * 지정된 FCM 토큰으로 푸시 알림을 전송합니다.
     *
     * @param targetToken 푸시를 받을 디바이스의 FCM 토큰
     * @param title       알림 제목
     * @param body        알림 본문
     * @return Firebase로부터 반환된 메시지 ID
     */
    public String sendPushNotification(String targetToken, String title, String body) {
        Notification notification = Notification.builder()
            .setTitle(title)
            .setBody(body)
            .build();

        Message message = Message.builder()
            .setToken(targetToken)
            .setNotification(notification)
            .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            logger.info("FCM push sent successfully, response={}", response);
            return response;
        } catch (FirebaseMessagingException e) {
            logger.error("Failed to send FCM push notification", e);
            throw new RuntimeException("FCM 전송 실패: " + e.getMessage(), e);
        }
    }
}
