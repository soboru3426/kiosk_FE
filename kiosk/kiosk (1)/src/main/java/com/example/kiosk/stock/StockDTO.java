package com.example.kiosk.stock;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("StockDTO")
public class StockDTO {
    private String branchName;
    private String menuName;
    private int quantity;
    private String productStatus;
    private String orderStatus;
    private String image;

    public StockDTO(String branchName, String menuName, int quantity, String productStatus, String orderStatus, String image) {
        this.branchName = branchName;
        this.menuName = menuName;
        this.image = image;
        this.quantity = quantity;
        this.productStatus = productStatus;
        this.orderStatus = orderStatus;
    }
}
