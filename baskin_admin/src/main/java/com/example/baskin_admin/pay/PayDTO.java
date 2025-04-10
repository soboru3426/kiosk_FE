package com.example.baskin_admin.pay;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PayDTO {
    private Long paymentId;
    private String paymentMethod;
    private String menuName;
    private int totalPrice;
    private LocalDateTime paymentDate;
    private String branchName;
    private String serialNumber;
}
