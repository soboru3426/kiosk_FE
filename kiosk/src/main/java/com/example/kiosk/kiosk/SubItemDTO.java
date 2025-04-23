package com.example.kiosk.kiosk;

import lombok.Data;
import java.util.List;

@Data
public class SubItemDTO {
    private String type; // cup, cone, waffle
    private List<String> flavors; // ex. [딸기, 초코]
    private int unitPrice;
    private int quantity;
    private String productName; // 메뉴명 (예: 쿼터, 싱글킹)
}
