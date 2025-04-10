package com.example.kiosk.pay;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/branch")
public class PayController {
    
    @Autowired
    private PayService payService;

    @GetMapping("/pay")
    public String showPayPage() {
        return "branch/pay";
    }

    // 전체 결제 내역
    @ResponseBody
    @GetMapping("/api")
    public ResponseEntity<List<PayDTO>> getAllPays() {
        return ResponseEntity.ok(payService.getAllPays());
    }

    // 단건
    @ResponseBody
    @GetMapping("/api/{id}")
    public ResponseEntity<PayDTO> getPayById(@PathVariable Long id) {
        Optional<PayDTO> pay = payService.getPayById(id);
        return pay.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 단일 지점
    @ResponseBody
    @GetMapping("/api/branch/{branchId}")
    public ResponseEntity<List<PayDTO>> getPaysByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(payService.getPaysByBranch(branchId));
    }

    @ResponseBody
    @GetMapping("/api/branch/{branchId}/filter")
    public ResponseEntity<List<PayDTO>> getFilteredPayments(
        @PathVariable Long branchId,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        List<PayDTO> data;
        if (start != null && end != null) {
            data = payService.getPaysByBranchAndDateRange(branchId, start, end);
        } else {
            data = payService.getPaysByBranch(branchId);
        }

        return ResponseEntity.ok(data);
    }


    // ✅ 다중 지점
    @ResponseBody
    @GetMapping("/api/branches")
    public ResponseEntity<List<PayDTO>> getPaysByBranchIds(@RequestParam("ids") String ids) {
        List<Long> branchIds = Arrays.stream(ids.split(","))
                                     .map(Long::parseLong)
                                     .collect(Collectors.toList());
        return ResponseEntity.ok(payService.getPaysByBranchIds(branchIds));
    }
}   
