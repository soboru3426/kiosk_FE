package com.example.baskin_admin.pay;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PayService {
    
    @Autowired
    private PayMapper payMapper;

    // 결제 저장
    public void savePay(Pay pay) {
        pay.initBeforeInsert();
        payMapper.insertPay(pay);
    }

    // 전체 결제 내역
    public List<PayDTO> getAllPays() {
        return payMapper.findAllPays();
    }

    // 지점별 결제 내역 (단일)
    public List<PayDTO> getPaysByBranch(Long branchId) {
        return payMapper.findByBranchId(branchId);
    }

    // 다중 지점 결제 내역
    public List<PayDTO> getPaysByBranchIds(List<Long> branchIds) {
        return payMapper.findByBranchIds(branchIds);
    }

    // 단건 조회
    public Optional<PayDTO> getPayById(Long id) {
        return Optional.ofNullable(payMapper.findById(id));
    }

    // 다중 지점 + 날짜 필터링
    public List<PayDTO> getFilteredPayments(List<Long> ids, LocalDateTime from, LocalDateTime to) {
        return payMapper.getFilteredPayments(ids, from, to);
    }

}
