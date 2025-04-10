package com.example.kiosk.stock;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class StockController {

    @Autowired
    private StockService stockService;

    // 기존: 지점용 페이지 렌더링
    @GetMapping("/branch/stock")
    public String stockPage(Model model) {
        List<Stock> stocks = stockService.getAllStock();
        model.addAttribute("stocks", stocks);
        return "branch/stock";
    }

    // 추가: 지점별 데이터 JSON으로 반환
    @GetMapping("/stock/data/{branchId}")
    @ResponseBody
    public List<StockDTO> getStockByBranch(@PathVariable Integer branchId) {
        List<Stock> stocks = stockService.getStockByBranchId(branchId);

        return stocks.stream().map(stock -> new StockDTO(
                stock.getBranch() != null ? stock.getBranch().getBranchName() : "N/A",
                stock.getMenu() != null ? stock.getMenu().getMenuName() : "N/A",
                stock.getQuantity(),
                stock.getProductStatus(),
                stock.getOrderStatus(),
                stock.getMenu() != null ? stock.getMenu().getImage() : null
        )).collect(Collectors.toList());
    }

    @GetMapping("/stock/data")
    @ResponseBody
    public List<StockDTO> getMultipleStockByBranches(@RequestParam List<Integer> branches) {
        List<Stock> stocks = new ArrayList<>();
        for (Integer branchId : branches) {
            stocks.addAll(stockService.getStockByBranchId(branchId));
        }

        return stocks.stream().map(stock -> new StockDTO(
                stock.getBranch() != null ? stock.getBranch().getBranchName() : "N/A",
                stock.getMenu() != null ? stock.getMenu().getMenuName() : "N/A",
                stock.getQuantity(),
                stock.getProductStatus(),
                stock.getOrderStatus(),
                stock.getMenu() != null ? stock.getMenu().getImage() : null
        )).collect(Collectors.toList());
    }

}