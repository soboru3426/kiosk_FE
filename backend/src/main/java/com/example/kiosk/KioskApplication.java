package com.example.kiosk;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.example.kiosk")
@SpringBootApplication(scanBasePackages = "com.example.kiosk")
public class KioskApplication {

	public static void main(String[] args) {
		SpringApplication.run(KioskApplication.class, args);
	}
}
