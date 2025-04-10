package com.example.baskin_admin.stock;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
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
        this.quantity = quantity;
        this.productStatus = productStatus;
        this.orderStatus = orderStatus;
        this.image = image;
    }

}
