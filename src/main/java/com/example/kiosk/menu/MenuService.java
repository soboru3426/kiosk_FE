package com.example.kiosk.menu;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MenuService {
    
    @Autowired
    private MenuMapper menuMapper;

    public List<Menu> getAllMenus() {
        return menuMapper.findAll();
    }

    public Menu getMenuById(Integer menuId) {
        return menuMapper.findById(menuId);
    }
}
