package com.example.kiosk.pay;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

import org.apache.ibatis.type.Alias;

import com.example.kiosk.branch.Branch;
import com.example.kiosk.product.Product;

import lombok.Data;

@Data
@Alias("Pay")
public class Pay {
    private static final Random RANDOM = new Random();

    private Long paymentId;

    private Product product;   // ✅ 외래키로 연결될 제품
    private Branch branch;     // ✅ 외래키로 연결될 지점

    private int quantity;
    private int finalAmount;

    private LocalDateTime paymentDate;

    private String produtName;
    private String serialNumber;
    private String paymentMethod;

    private String subItemsJson;
    
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
