package com.example.kiosk.menu;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MenuMapper {
    
    @Select("SELECT * FROM menu")
    List<Menu> findAll();

    @Select("SELECT * FROM menu WHERE menu_id = #{menuId}")
    Menu findById(Integer menuId);
}
