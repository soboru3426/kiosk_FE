package com.example.kiosk.pay;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PayMapper {
    List<PayDTO> findAllPays();

    List<PayDTO> findByBranchId(@Param("branchId") Integer branchId);

    List<PayDTO> findByBranchIds(@Param("branchIds") List<Integer> branchIds);

    void insertPay(Pay pay);

    void insertPayment(Pay pay);

    PayDTO findById(@Param("id") Integer id);

    List<PayDTO> getFilteredPayments(@Param("ids") List<Integer> ids,
                                    @Param("from") LocalDateTime from,
                                    @Param("to") LocalDateTime to);
    
    List<PayDTO> findByBranchIdAndPayDateBetween(@Param("branchId") Integer branchId,
                                    @Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end);

}