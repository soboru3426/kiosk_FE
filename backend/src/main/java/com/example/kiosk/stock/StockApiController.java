package com.example.kiosk.stock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/branch/stock")
public class StockApiController {

    @Autowired
    private StockService stockService;

    // ✅ 다중 지점 재고 조회: /api/branch/stock/data?branches=1,2,3
    @GetMapping("/data")
    public List<StockDTO> getMultipleStockByBranches(@RequestParam("branches") List<Integer> branches) {
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

    // ✅ 단일 지점 재고 조회: /api/branch/stock/data/1
    @GetMapping("/data/{branchId}")
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
}
