package com.example.baskin_admin.Stock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    // 메뉴 ID로 재고 조회
    public List<Stock> getStockByMenuId(Integer menuId) {
        return stockRepository.findByMenu_Id(menuId);
    }

    // 지점 ID로 재고 조회
    public List<Stock> getStockByBranchId(Integer branchId) {
        return stockRepository.findByBranch_BranchId(branchId);
    }

    // 전체 재고 조회
    public List<Stock> getAllStock() {
        return stockRepository.findAll();
    }
}
