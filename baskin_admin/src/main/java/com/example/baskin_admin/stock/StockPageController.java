package com.example.baskin_admin.stock;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StockPageController {

    @Autowired
    private StockService stockService;

    // 지점별 재고 데이터 반환 (JSON)
    @GetMapping("/stock/data/{branchId}")
    public List<StockDTO> getStockDataByBranch(@PathVariable("branchId") int branchId) {
        List<Stock> stocks = stockService.getStockByBranchId(branchId);

        // StockDTO를 사용하여 필요한 데이터만 반환 (지점명, 메뉴명, 재고량 등)
        return stocks.stream().map(stock -> new StockDTO(
                stock.getBranch().getBranchName(),  // branch에서 branchName을 가져옴
                stock.getMenu().getName(),  // menu에서 menuName을 가져옴
                stock.getQuantity(),
                stock.getStatus(),
                stock.getOrderStatus(),
                stock.getMenu().getImage()
        )).toList();
    }
}
