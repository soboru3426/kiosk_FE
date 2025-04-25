package com.example.kiosk.menu;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class MenuApiController {

    @Autowired
    private MenuService menuService;

    // ✅ 메뉴 전체 조회
    @GetMapping("/menus")
    public List<Menu> getAllMenus() {
        return menuService.getAllMenus();
    }

    // ✅ 메뉴 단건 조회
    @GetMapping("/menus/{menuId}")
    public Menu getMenuById(@PathVariable Integer menuId) {
        return menuService.getMenuById(menuId);
    }

    // ✅ 메뉴 추가
    @PostMapping("/menus")
    public void addMenu(@RequestParam("menuName") String menuName,
                        @RequestParam("menuCode") String menuCode,
                        @RequestParam("image") MultipartFile image) {
        menuService.addMenu(menuName, menuCode, image);
    }

    // ✅ 판매 상태 변경
    @PatchMapping("/menus/{menuId}/status")
    public void updateMenuStatus(@PathVariable Integer menuId,
                                 @RequestBody Map<String, String> body) {
        String productStatus = body.get("productStatus");
        menuService.updateProductStatusByMenuId(menuId, productStatus);
    }
}
