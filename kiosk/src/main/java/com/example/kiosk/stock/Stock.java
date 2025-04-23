package com.example.kiosk.stock;

import org.apache.ibatis.type.Alias;

import com.example.kiosk.branch.Branch;
import com.example.kiosk.menu.Menu;

import lombok.Data;

@Data
@Alias("Stock")
public class Stock {
    private Integer stockId;
    private Branch branch;
    private Menu menu;
    private Integer quantity;
    private String productStatus;
    private String orderStatus;
}
