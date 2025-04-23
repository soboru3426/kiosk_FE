package com.example.baskin_admin.stock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HeadStockDTO {
    private int stockId;
    private int branchId;
    private String branchName;
    private String menuName;
    private int quantity;
    private String productStatus;
    private String orderStatus;
    private String menuImage;
}
