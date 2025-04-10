package com.example.kiosk.stock;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Alias("AdminStockDTO")
public class AdminStockDTO {
    private int stockId;
    private int branchId;
    private String branchName;
    private String menuName;
    private int quantity;
    private String productStatus;
    private String orderStatus;
    private String menuImage;
}
