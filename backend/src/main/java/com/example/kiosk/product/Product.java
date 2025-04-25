package com.example.kiosk.product;

import org.apache.ibatis.type.Alias;
import lombok.Data;

@Data
@Alias("Product")
public class Product {
    private Integer productId;   // 제품 ID
    private String productName; // 제품명 (ex. 싱글레귤러, 쿼터 등)
    private int price;           // 가격
    private int maxFlavors;     // 선택 가능한 최대 맛 수
}