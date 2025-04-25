// src/main/java/com/example/kiosk/fcmtoken/FCMTokenController.java
package com.example.kiosk.fcmtoken;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class FCMTokenController {

    private final FCMTokenService service;

    public FCMTokenController(FCMTokenService service) {
        this.service = service;
    }

    /** 
     * 안드로이드 앱에서 토큰을 전송하면 저장 또는 갱신합니다.
     */
    @PostMapping("/receive-token")
    public ResponseEntity<Void> receiveToken(@RequestBody FCMToken dto) {
        System.out.println(dto); // ✅ [수신 확인 로그]
        System.out.println("[RECEIVE-TOKEN] 토큰 수신: userId=" + dto.getUserId() + ", token=" + dto.getToken()); // ✅ [수신 확인 로그]
        service.saveOrUpdateToken(dto.getUserId(), dto.getToken());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send-notification")
    public ResponseEntity<Void> sendNotification(@RequestParam Long userId,
                                                @RequestParam String title,
                                                @RequestParam String body) {
        System.out.println("📤 [SEND-NOTIFICATION] userId=" + userId + ", title=" + title + ", body=" + body); // ✅ [알림 전송 시도 로그]
        service.sendPush(userId, title, body);
        return ResponseEntity.ok().build();
    }

}
