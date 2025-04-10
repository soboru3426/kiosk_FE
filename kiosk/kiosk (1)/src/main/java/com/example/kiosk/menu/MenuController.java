package com.example.kiosk.menu;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/admin")
public class MenuController {

    @Autowired
    private MenuService menuService;

    // ✅ HTML 페이지 반환
    @GetMapping("/menu")
    public String showMenuPage() {
        return "admin/menu"; // → templates/admin/menu.html
    }

    // ✅ JSON 응답 (메뉴 전체)
    @GetMapping("/menus")
    @ResponseBody
    public List<Menu> getAllMenus() {
        return menuService.getAllMenus();
    }

    // ✅ JSON 응답 (단건)
    @GetMapping("/menus/{menuId}")
    @ResponseBody
    public Menu getMenuById(@PathVariable Integer menuId) {
        return menuService.getMenuById(menuId);
    }

    // ✅ JSON 응답 (추가)
    @PostMapping("/menus")
    @ResponseBody
    public void addMenu(@RequestParam("menuName") String menuName,
                        @RequestParam("menuCode") String menuCode,
                        @RequestParam("image") MultipartFile image) {
        // 메뉴 등록 처리 (null 값들을 기본으로 설정)
        menuService.addMenu(menuName, menuCode, image);
    }


    @PatchMapping("/{menuId}/status")
    @ResponseBody
    public void updateMenuStatus(@PathVariable Integer menuId, @RequestBody Map<String, String> body) {
        String productStatus = body.get("productStatus");
        menuService.updateProductStatusByMenuId(menuId, productStatus);
    }
}
