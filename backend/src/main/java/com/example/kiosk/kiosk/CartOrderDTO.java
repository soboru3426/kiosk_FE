package com.example.kiosk.kiosk;

import java.util.List;

import lombok.Data;

@Data
public class CartOrderDTO {
    private String name; // 메뉴명 (쿼터, 더블주니어 등)
    private int totalQuantity; // 총 수량
    private List<SubItemDTO> subItems; // ✅ cup/cone/waffle 타입별 맛 정보
    private String paymentMethod; // 결제 수단
}
