package com.example.kiosk.stock;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface StockMapper {
    List<Stock> findAll();

    List<Stock> findByMenuId(@Param("menuId") Integer menuId);

    List<Stock> findByBranchId(@Param("branchId") Integer branchId);

    List<Stock> findByBranchIds(@Param("branchIds") List<Integer> branchIds);

    List<Stock> findByBranchIdAndMenuId(@Param("branchId") Integer branchId, @Param("menuId") Integer menuId);

    Stock findById(@Param("stockId") Integer stockId);
    
    void updateOrderStatus(@Param("stockId") Integer stockId, @Param("orderStatus") String orderStatus);

    void decreaseStockQuantity(Map<String, Object> param);

}
