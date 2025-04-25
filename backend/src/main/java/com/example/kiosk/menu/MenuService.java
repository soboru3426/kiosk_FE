package com.example.kiosk.menu;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
        System.out.println("✅ addMenu 진입");
        
        String imagePath = saveImage(image, image.getOriginalFilename());
    
        Menu menu = new Menu(menuName, menuCode, imagePath);
        menu.setDescription(null);
        menu.setCategory(null);
        menu.setOther(null);
    
        // 🔥 문제 위치: DB 저장 시도
        try {
            System.out.println("🟡 insert 직전 menu 객체: " + menu);
            menuMapper.insert(menu);
            System.out.println("✅ DB 저장 완료");
        } catch (Exception e) {
            System.out.println("❌ DB 저장 중 오류 발생!");
            e.printStackTrace(); // 🔥 여기 로그가 핵심!
            throw e; // 에러 다시 던져서 500 유지 (로그는 콘솔로)
        }
    }

    // 이미지 저장 메서드
    private String saveImage(MultipartFile file, String originalFileNameForDB) {
        System.out.println("✅ saveImage 호출됨");

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("이미지 파일이 존재하지 않습니다.");
        }

        try {
            String originalFileName = file.getOriginalFilename();
            System.out.println("✅ 원본 파일 이름: " + originalFileName);

            if (originalFileName == null || !originalFileName.contains(".")) {
                throw new RuntimeException("유효한 이미지 파일명이 아닙니다.");
            }

            // 🔒 파일 시스템에 저장할 때는 안전하게 URL 인코딩
            String encodedFileName = URLEncoder.encode(originalFileName, StandardCharsets.UTF_8);

            Path folderPath = Paths.get("/app/frontend/flavor-images");
            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
            }

            Path fullPath = folderPath.resolve(encodedFileName);
            System.out.println("✅ 저장 경로: " + fullPath);

            Files.copy(file.getInputStream(), fullPath, StandardCopyOption.REPLACE_EXISTING);

            // 📌 DB에는 원래 파일명 그대로 저장 (예: "초코나무숲.png")
            return originalFileNameForDB;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("파일 저장에 실패했습니다: " + e.getMessage(), e);
        }
    }
    
    
    public void updateProductStatusByMenuId(Integer menuId, String status) {
        menuMapper.updateProductStatus(menuId, status);
    }    
    
}