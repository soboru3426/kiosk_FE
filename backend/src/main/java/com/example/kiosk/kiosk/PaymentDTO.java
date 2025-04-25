package com.example.kiosk.kiosk;

import java.util.List;

import lombok.Data;

@Data
public class PaymentDTO {
    private int finalAmount; // ✅ 할인 포함된 총 결제 금액
    private List<CartOrderDTO> cartOrders; // ✅ 주문 항목 리스트
}
