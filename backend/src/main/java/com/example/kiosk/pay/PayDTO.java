package com.example.kiosk.pay;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("PayDTO")
public class PayDTO {
    private Long paymentId;
    private String paymentMethod;
    private String productName;
    private int finalAmount;
    private LocalDateTime paymentDate;
    private String branchName;
    private String serialNumber;

    private String subItemsJson;
}
