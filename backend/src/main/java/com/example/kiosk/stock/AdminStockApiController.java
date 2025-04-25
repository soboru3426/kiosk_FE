package com.example.kiosk.stock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stock")
public class AdminStockApiController {

    @Autowired
    private StockService stockService;

    // ✅ 단일 지점의 재고 정보
    @GetMapping("/data/{branchId}")
    public List<AdminStockDTO> getStockData(@PathVariable("branchId") int branchId) {
        List<Stock> stocks = stockService.getStockByBranchId(branchId);

        return stocks.stream().map(stock -> new AdminStockDTO(
                stock.getStockId(),
                stock.getBranch().getBranchId(),
                stock.getBranch().getBranchName(),
                stock.getMenu().getMenuName(),
                stock.getQuantity(),
                stock.getProductStatus(),
                stock.getOrderStatus(),
                stock.getMenu().getImage()
        )).toList();
    }

    // ✅ 다중 지점의 재고 정보 (중복 제거 로직 제거)
    @GetMapping("/data")
    public List<AdminStockDTO> getStockByBranches(@RequestParam("branches") List<Integer> branchIds) {
        List<Stock> stocks = stockService.getStockByBranchIds(branchIds);

        return stocks.stream().map(stock -> new AdminStockDTO(
                stock.getStockId(),
                stock.getBranch().getBranchId(),
                stock.getBranch().getBranchName(),
                stock.getMenu().getMenuName(),
                stock.getQuantity(),
                stock.getProductStatus(),
                stock.getOrderStatus(),
                stock.getMenu().getImage()
        )).toList();
    }

    // ✅ 발주 상태 업데이트
    @PostMapping("/update/{stockId}")
    public ResponseEntity<AdminStockDTO> updateOrderStatus(
            @PathVariable("stockId") Integer stockId,
            @RequestBody Map<String, String> request
    ) {
        String newStatus = request.get("orderStatus");
        Stock updatedStock = stockService.updateOrderStatus(stockId, newStatus);

        if (updatedStock == null) {
            return ResponseEntity.notFound().build();
        }

        AdminStockDTO dto = new AdminStockDTO(
                updatedStock.getStockId(),
                updatedStock.getBranch().getBranchId(),
                updatedStock.getBranch().getBranchName(),
                updatedStock.getMenu().getMenuName(),
                updatedStock.getQuantity(),
                updatedStock.getProductStatus(),
                updatedStock.getOrderStatus(),
                updatedStock.getMenu().getImage()
        );

        return ResponseEntity.ok(dto);
    }
}

