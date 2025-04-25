package com.example.kiosk.pay;

import com.example.kiosk.pay.PayDTO;
import com.example.kiosk.kiosk.SubItemDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;               // ✅ 배열 관련
import java.util.List;                // ✅ 리스트
import java.util.Optional;            // ✅ 옵셔널
import java.util.Collections;         // ✅ 빈 리스트
import java.util.stream.Collectors;   // ✅ stream 처리

@RestController
@RequestMapping("/api/admin/pay")
public class AdminPayApiController {

    @Autowired
    private PayService payService;

    // ✅ 전체 결제 내역
    @GetMapping
    public ResponseEntity<List<PayDTO>> getAllPays() {
        return ResponseEntity.ok(payService.getAllPays());
    }

    // ✅ 단일 지점의 결제 내역
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<PayDTO>> getPaysByBranch(@PathVariable Integer branchId) {
        return ResponseEntity.ok(payService.getPaysByBranch(branchId));
    }

    // ✅ 다중 지점의 결제 내역
    @GetMapping("/branches")
    public ResponseEntity<List<PayDTO>> getPaysByBranchIds(@RequestParam("ids") String ids) {
        List<Integer> branchIds = Arrays.stream(ids.split(","))
                .map(Integer::parseInt)
                .collect(Collectors.toList());
        return ResponseEntity.ok(payService.getPaysByBranchIds(branchIds));
    }

    // ✅ 날짜 필터링
    @GetMapping("/filter")
    public ResponseEntity<List<PayDTO>> filterPayments(
            @RequestParam List<Integer> ids,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.atTime(23, 59, 59);

        List<PayDTO> results = payService.getFilteredPayments(ids, fromDateTime, toDateTime);
        return ResponseEntity.ok(results);
    }

    // ✅ 단일 결제 상세 보기
    @GetMapping("/detail/{id}")
    public ResponseEntity<PayDetailDTO> getPaymentDetail(@PathVariable Integer id) {
        Optional<PayDTO> optional = payService.getPayById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PayDTO pay = optional.get();
        List<SubItemDTO> subItems = Collections.emptyList();

        try {
            String json = pay.getSubItemsJson();
            if (json != null && !json.isBlank()) {
                ObjectMapper mapper = new ObjectMapper();
                subItems = mapper.readValue(json, new TypeReference<List<SubItemDTO>>() {});
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        PayDetailDTO detail = new PayDetailDTO();
        detail.setPay(pay);
        detail.setSubItems(subItems);
        return ResponseEntity.ok(detail);
    }
}
