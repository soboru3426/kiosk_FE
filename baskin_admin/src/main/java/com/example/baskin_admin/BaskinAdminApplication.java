package com.example.baskin_admin;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.baskin_admin.pay")
public class BaskinAdminApplication {

	public static void main(String[] args) {
		SpringApplication.run(BaskinAdminApplication.class, args);
	}

}
