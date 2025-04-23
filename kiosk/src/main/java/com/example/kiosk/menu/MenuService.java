package com.example.kiosk.menu;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    // 메뉴 등록 처리 (이미지, 메뉴명, 메뉴코드만)
    public void addMenu(String menuName, String menuCode, MultipartFile image) {
        String imagePath = saveImage(image, menuName); // 메뉴명 전달
        Menu menu = new Menu(menuName, menuCode, imagePath);
        menu.setDescription(null);  // 기본값 null로 설정
        menu.setCategory(null);  // 기본값 null로 설정
        menu.setOther(null);  // 기본값 null로 설정
        menuMapper.insert(menu);  // DB에 메뉴 추가
    }
    

    // 이미지 저장 메서드
    private String saveImage(MultipartFile file, String menuName) {
        try {
            String originalFileName = file.getOriginalFilename();
    
            // 파일명이 null이거나 확장자가 없을 경우 예외 발생 방지
            if (originalFileName == null || !originalFileName.contains(".")) {
                throw new RuntimeException("유효한 이미지 파일명이 아닙니다.");
            }
    
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String sanitizedMenuName = menuName.replaceAll("[^a-zA-Z0-9가-힣]", "");
    
            String newFileName = sanitizedMenuName + fileExtension;
    
            Path folderPath = Paths.get("src/main/resources/static/flavor-images");
            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
            }
    
            Path fullPath = folderPath.resolve(newFileName);
            Files.copy(file.getInputStream(), fullPath, StandardCopyOption.REPLACE_EXISTING);
    
            return newFileName;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장에 실패했습니다.", e);
        }
    }
    
    public void updateProductStatusByMenuId(Integer menuId, String status) {
        menuMapper.updateProductStatus(menuId, status);
    }    
    
}
