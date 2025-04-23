package com.example.kiosk.stock;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface StockMapper {
    List<Stock> findAll();

    List<Stock> findByMenuId(@Param("menuId") Integer menuId);

    List<Stock> findByBranchId(@Param("branchId") Integer branchId);

    List<Stock> findByBranchIdAndMenuId(@Param("branchId") Integer branchId, @Param("menuId") Integer menuId);

    Stock findById(@Param("stockId") Integer stockId);
    
    void updateOrderStatus(@Param("stockId") Integer stockId, @Param("orderStatus") String orderStatus);
}
