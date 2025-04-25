package com.example.kiosk.pay;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/branch/pay")
public class PayApiController {

    @Autowired
    private PayService payService;

    // ✅ 전체 결제 내역 조회
    @GetMapping
    public ResponseEntity<List<PayDTO>> getAllPays() {
        return ResponseEntity.ok(payService.getAllPays());
    }

    // ✅ 결제 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<PayDTO> getPayById(@PathVariable Integer id) {
        Optional<PayDTO> pay = payService.getPayById(id);
        return pay.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ 특정 지점의 전체 결제 내역 조회
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<PayDTO>> getPaysByBranch(@PathVariable Integer branchId) {
        return ResponseEntity.ok(payService.getPaysByBranch(branchId));
    }

    // ✅ 특정 지점 + 날짜 필터링된 결제 내역 조회
    @GetMapping("/branch/{branchId}/filter")
    public ResponseEntity<List<PayDTO>> getFilteredPaymentsByBranch(
            @PathVariable Integer branchId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        List<PayDTO> data = (start != null && end != null)
                ? payService.getPaymentList(branchId, start, end)
                : payService.getPaysByBranch(branchId);

        return ResponseEntity.ok(data);
    }

    // ✅ 다중 지점 전체 결제 내역 조회
    @GetMapping("/branches")
    public ResponseEntity<List<PayDTO>> getPaysByBranchIds(@RequestParam("ids") String ids) {
        List<Integer> branchIds = Arrays.stream(ids.split(","))
                                        .map(Integer::parseInt)
                                        .collect(Collectors.toList());
        return ResponseEntity.ok(payService.getPaysByBranchIds(branchIds));
    }

    // ✅ 다중 지점 + 기간 필터링 결제 내역
    @GetMapping("/payments/filter")
    public ResponseEntity<List<PayDTO>> getFilteredPayments(
            @RequestParam("ids") String ids,
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {

        List<Integer> branchIds = Arrays.stream(ids.split(","))
                                        .map(Integer::parseInt)
                                        .collect(Collectors.toList());

        return ResponseEntity.ok(payService.getFilteredPayments(branchIds, from, to));
    }
}
