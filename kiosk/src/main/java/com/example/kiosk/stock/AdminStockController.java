package com.example.kiosk.stock;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/admin/stock")
public class AdminStockController {
    
    @Autowired
    private StockService stockService;

    @GetMapping
    public String adminStockPage(Model model) {
        return "admin/stock";
    }

    // ✅ branchId 파라미터 이름 명시
    @GetMapping("/data/{branchId}")
    @ResponseBody
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


    @PostMapping("/update/{stockId}")
    @ResponseBody
    public ResponseEntity<?> updateOrderStatus(@PathVariable("stockId") Integer stockId,
                                            @RequestBody Map<String, String> request) {
        String newStatus = request.get("orderStatus");
        Stock updatedStock = stockService.updateOrderStatus(stockId, newStatus);

        if (updatedStock == null) {
            return ResponseEntity.notFound().build();
        }

        // 🛠 순환참조 방지: 직접 DTO로 매핑해서 응답
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
