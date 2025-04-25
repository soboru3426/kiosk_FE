package com.example.kiosk.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;

/**
 * firebase.config-path 프로퍼티가 설정된 경우에만 빈을 생성합니다.
 */
@Configuration
@ConditionalOnProperty(name = "firebase.config-path")
public class FirebaseConfig {

    /**
     * application.yml 에 정의된 서비스 계정 JSON 파일 경로
     */
    @Value("${firebase.config-path}") 
    private String configPath;

    /**
     * FirebaseApp 빈 생성 및 초기화
     */
    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        Resource resource = new ClassPathResource(configPath);
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                .build();
        return FirebaseApp.initializeApp(options);
    }
}
