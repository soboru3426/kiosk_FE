package com.example.kiosk.pay;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import com.example.kiosk.kiosk.CartOrderDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
        List<PayDTO> list = payMapper.findAllPays();
        for (PayDTO dto : list) {
            enrichDisplayName(dto);
        }
        return list;
    }

    public List<PayDTO> getPaysByBranch(Integer branchId) {
        List<PayDTO> list = payMapper.findByBranchId(branchId);
        for (PayDTO dto : list) {
            enrichDisplayName(dto);
        }
        return list;
    }

    public List<PayDTO> getPaysByBranchIds(List<Integer> branchIds) {
        List<PayDTO> list = payMapper.findByBranchIds(branchIds);
        for (PayDTO dto : list) {
            enrichDisplayName(dto);
        }
        return list;
    }

    public Optional<PayDTO> getPayById(Integer id) {
        PayDTO dto = payMapper.findById(id);
        enrichDisplayName(dto);
        return Optional.ofNullable(dto);
    }

    public List<PayDTO> getFilteredPayments(List<Integer> ids, LocalDateTime from, LocalDateTime to) {
        List<PayDTO> list = payMapper.getFilteredPayments(ids, from, to);
        for (PayDTO dto : list) {
            enrichDisplayName(dto);
        }
        return list;
    }

    public List<PayDTO> getPaymentList(Integer branchId, LocalDate start, LocalDate end) {
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(LocalTime.MAX);
        List<PayDTO> list = payMapper.findByBranchIdAndPayDateBetween(branchId, startDateTime, endDateTime);
        for (PayDTO dto : list) {
            enrichDisplayName(dto);
        }
        return list;
    }

    // ✅ productName 가공 로직
    private void enrichDisplayName(PayDTO dto) {
        if (dto == null || dto.getSubItemsJson() == null) return;
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<CartOrderDTO> orders = mapper.readValue(dto.getSubItemsJson(), new TypeReference<List<CartOrderDTO>>() {});
            if (!orders.isEmpty()) {
                String main = orders.get(0).getName();
                int extra = orders.size() - 1;
                dto.setProductName(extra > 0 ? main + " 외 " + extra + "건" : main);
            }
        } catch (Exception e) {
            dto.setProductName("상품 정보 오류");
        }
    }
}
