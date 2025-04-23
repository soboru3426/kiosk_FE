package com.example.kiosk.pay;

import java.util.List;

import com.example.kiosk.kiosk.SubItemDTO;

import lombok.Data;

@Data
public class PayDetailDTO {
    private PayDTO pay; // 기본 결제 정보
    private List<SubItemDTO> subItems; // 주문된 맛 정보들
}
