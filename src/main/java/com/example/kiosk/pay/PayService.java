package com.example.kiosk.pay;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public List<PayDTO> getPaymentList(Long branchId, LocalDate start, LocalDate end) {
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(LocalTime.MAX);
        return payMapper.findByBranchIdAndPayDateBetween(branchId, startDateTime, endDateTime);
    }

    
    // Pay 객체를 PayDTO로 변환하는 메서드
    private PayDTO convertToDto(Pay pay) {
        PayDTO dto = new PayDTO();
        dto.setPaymentId(pay.getPaymentId());
        dto.setPaymentMethod(pay.getPaymentMethod());
        dto.setMenuName(pay.getMenu() != null ? pay.getMenu().getMenuName() : null);
        dto.setTotalPrice(pay.getTotalPrice());
        dto.setPaymentDate(pay.getPaymentDate());
        dto.setBranchName(pay.getBranch() != null ? pay.getBranch().getBranchName() : null);
        dto.setSerialNumber(pay.getSerialNumber());
        return dto;
    }
}