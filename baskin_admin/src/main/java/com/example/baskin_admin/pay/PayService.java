package com.example.baskin_admin.pay;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import jakarta.transaction.Transactional;

@Service
@Transactional
public class PayService {
    
    @Autowired
    private PayRepository payRepository;

    // 결제 내역 저장
    public Pay savePay(Pay pay) {
        return payRepository.save(pay);
    }

    // 모든 결제 내역 조회
    public List<Pay> getAllPays() {
        return payRepository.findAll();
    }

    // 특정 결제 내역 조회
    public Optional<Pay> getPayById(Long payId) {
        return payRepository.findById(payId);
    }

    // 특정 지점의 결제 내역 조회
    public List<Pay> getPaysByBranch(Long branchId) {
        return payRepository.findByBranch_BranchId(branchId);
    }

    // 결제 내역 삭제
    public void deletePay(Long payId) {
        payRepository.deleteById(payId);
    }
}

