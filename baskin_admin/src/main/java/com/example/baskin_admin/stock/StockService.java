package com.example.baskin_admin.stock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    // 메뉴 ID로 재고 조회
    public List<Stock> getStockByMenuId(Integer menuId) {
        return stockRepository.findByMenu_MenuId(menuId);
    }

    // 지점 ID로 재고 조회
    public List<Stock> getStockByBranchId(Integer branchId) {
        return stockRepository.findByBranch_BranchId(branchId);
    }

    // 전체 재고 조회
    public List<Stock> getAllStock() {
        return stockRepository.findAll();
    }

    public Stock updateOrderStatus(Integer stockId, String newStatus) {
        // stockId로 해당 재고를 찾기
        Stock stock = stockRepository.findById(stockId).orElse(null);

        if (stock != null) {
            // 재고의 상태를 새로 받은 상태로 업데이트
            stock.setOrderStatus(newStatus);
            // 변경된 재고 정보를 저장
            stockRepository.save(stock);
        }

        return stock;
    }
}