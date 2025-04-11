package com.example.kiosk.pay;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PayMapper {
    List<PayDTO> findAllPays();

    List<PayDTO> findByBranchId(@Param("branchId") Long branchId);

    List<PayDTO> findByBranchIds(@Param("branchIds") List<Long> branchIds);

    void insertPay(Pay pay);

    PayDTO findById(@Param("id") Long id);

    List<PayDTO> getFilteredPayments(@Param("ids") List<Long> ids,
                                    @Param("from") LocalDateTime from,
                                    @Param("to") LocalDateTime to);
    
    List<PayDTO> findByBranchIdAndPayDateBetween(@Param("branchId") Long branchId,
                                    @Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end);

}