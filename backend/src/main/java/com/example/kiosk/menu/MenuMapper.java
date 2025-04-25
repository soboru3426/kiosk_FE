package com.example.kiosk.menu;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MenuMapper {
    
    List<Menu> findAll();

    Menu findById(Integer menuId);

    void insert(Menu menu);

    void updateProductStatus(@Param("menuId") Integer menuId, @Param("productStatus") String productStatus);

    Integer findMenuIdByName(@Param("name") String name);
}
