package com.example.baskin_admin.stock;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping("/branch/stock")
    public String stockPage(Model model) {
        List<Stock> stocks = stockService.getAllStock();  // 전체 재고 목록 가져오기
        model.addAttribute("stocks", stocks);  // 모델에 데이터 추가
        return "branch/stock";  // stock.html 렌더링
    }
}
