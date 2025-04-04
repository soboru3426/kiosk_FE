package com.example.baskin_admin.pay;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PayDTO {
    private Long paymentId;
    private String paymentMethod;
    private String menuName;
    private int totalPrice;
    private LocalDateTime paymentDate;
    private String branchName;
    private String serialNumber;

    public PayDTO(Pay pay) {
        this.paymentId = pay.getPaymentId();
        this.paymentMethod = pay.getPaymentMethod();
        this.menuName = (pay.getMenu() != null) ? pay.getMenu().getName() : "N/A";
        this.totalPrice = pay.getTotalPrice();
        this.paymentDate = pay.getPaymentDate();
        this.branchName = (pay.getBranch() != null) ? pay.getBranch().getBranchName() : "N/A";
        this.serialNumber = pay.getSerialNumber();
    }
}
