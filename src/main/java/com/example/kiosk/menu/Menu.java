package com.example.kiosk.menu;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("Menu")
public class Menu {
    private Integer menuId;
    private String menuName;
    private Integer price;
    private String description;
    private String category;
    private String image;
}
