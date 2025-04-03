package com.example.baskin_admin.Stock;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StockController {

    @Autowired
    private StockService stockService;

    // 기본적으로 강서지점 재고 조회
    @GetMapping("/stock/gangseo")
    public String getStockByGangseo(Model model) {
        List<Stock> stocks = stockService.getStockByBranchId(1); // 강서 지점 ID가 1이라고 가정
        model.addAttribute("stocks", stocks);
        return "stock";  // stock.html 템플릿에 데이터 전달
    }

    // 상봉지점 재고 조회
    @GetMapping("/stock/sangbong")
    public String getStockBySangbong(Model model) {
        List<Stock> stocks = stockService.getStockByBranchId(2); // 상봉 지점 ID가 2라고 가정
        model.addAttribute("stocks", stocks);
        return "stock";  // stock.html 템플릿에 데이터 전달
    }

    // 하남지점 재고 조회
    @GetMapping("/stock/hanam")
    public String getStockByHanam(Model model) {
        List<Stock> stocks = stockService.getStockByBranchId(3); // 하남 지점 ID가 3이라고 가정
        model.addAttribute("stocks", stocks);
        return "stock";  // stock.html 템플릿에 데이터 전달
    }
}
