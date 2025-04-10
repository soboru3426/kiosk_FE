package com.example.kiosk.menu;

import org.apache.ibatis.type.Alias;
import lombok.Data;

@Data
@Alias("Menu")
public class Menu {
    private Integer menuId;
    private String menuName;
    private String menuCode;
    private Integer price = null;
    private String description = null;
    private String category = null;
    private String image;
    private String other = null;
    private String productStatus;

    public Menu(String menuName, String menuCode, String image) {
        this.menuName = menuName;
        this.menuCode = menuCode;
        this.image = image;
    }
}
