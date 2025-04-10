package com.example.baskin_admin.stock;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Integer> {

    // Menu의 menuId로 Stock 조회
    List<Stock> findByMenu_MenuId(Integer menuId);  // 수정된 부분

    // Branch의 branchId로 Stock 조회
    List<Stock> findByBranch_BranchId(Integer branchId);   // 수정된 부분

    // Branch와 MenuId로 Stock 조회
    List<Stock> findByBranch_BranchIdAndMenu_MenuId(Integer branchId, Integer menuId);  // 수정된 부분

}
