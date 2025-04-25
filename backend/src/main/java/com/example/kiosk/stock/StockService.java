package com.example.kiosk.stock;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StockService {
    
    @Autowired
    private StockMapper stockMapper;

    public List<Stock> getStockByMenuId(Integer menuId) {
        return stockMapper.findByMenuId(menuId);
    }

    public List<Stock> getStockByBranchId(Integer branchId) {
        return stockMapper.findByBranchId(branchId);
    }

    public List<Stock> getStockByBranchIds(List<Integer> branchIds) {
        return stockMapper.findByBranchIds(branchIds);
    }    

    public List<Stock> getAllStock() {
        return stockMapper.findAll();
    }

    public Stock updateOrderStatus(Integer stockId, String newStatus) {
        Stock stock = stockMapper.findById(stockId);
        if (stock != null) {
            stockMapper.updateOrderStatus(stockId, newStatus);
            stock.setOrderStatus(newStatus);
        }
        return stock;
    }
}
