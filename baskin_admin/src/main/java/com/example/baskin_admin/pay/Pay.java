package com.example.baskin_admin.pay;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

import com.example.baskin_admin.branch.Branch;
import com.example.baskin_admin.menu.Menu;

import lombok.Data;

@Data
public class Pay {

    private static final Random RANDOM = new Random();

    private Long paymentId;

    private Menu menu;
    private Branch branch;

    private int quantity;
    private int totalPrice;

    private LocalDateTime paymentDate;

    private String serialNumber;
    private String paymentMethod;

    public void initBeforeInsert() {
        this.paymentDate = LocalDateTime.now();
        this.serialNumber = generateSerialNumber();
    }

    private String generateSerialNumber() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        String randomDigits = String.format("%04d", RANDOM.nextInt(10000));
        return timestamp + randomDigits;
    }
}
