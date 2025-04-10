package com.example.kiosk.pay;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PayService {
    
    @Autowired
    private PayMapper payMapper;

    public void savePay(Pay pay) {
        pay.initBeforeInsert();
        payMapper.insertPay(pay);
    }

    public List<PayDTO> getAllPays() {
        return payMapper.findAllPays();
    }

    public List<PayDTO> getPaysByBranch(Long branchId) {
        return payMapper.findByBranchId(branchId);
    }

    public List<PayDTO> getPaysByBranchIds(List<Long> branchIds) {
        return payMapper.findByBranchIds(branchIds);
    }

    public Optional<PayDTO> getPayById(Long id) {
        return Optional.ofNullable(payMapper.findById(id));
    }
    
    public List<PayDTO> getFilteredPayments(List<Long> ids, LocalDateTime from, LocalDateTime to) {
        return payMapper.getFilteredPayments(ids, from, to);
    }
}
