package com.example.kiosk.pay;

import java.time.LocalDateTime;
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

    @ResponseBody
    @GetMapping("/api")
    public ResponseEntity<List<PayDTO>> getAllPays() {
        return ResponseEntity.ok(payService.getAllPays());
    }

    @ResponseBody
    @GetMapping("/api/{id}")
    public ResponseEntity<PayDTO> getPayById(@PathVariable Long id) {
        Optional<PayDTO> pay = payService.getPayById(id);
        return pay.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @ResponseBody
    @GetMapping("/api/branch/{branchId}")
    public ResponseEntity<List<PayDTO>> getPaysByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(payService.getPaysByBranch(branchId));
    }

    @ResponseBody
    @GetMapping("/api/branches")
    public ResponseEntity<List<PayDTO>> getPaysByBranchIds(@RequestParam("ids") String ids) {
        List<Long> branchIds = Arrays.stream(ids.split(","))
                                     .map(Long::parseLong)
                                     .collect(Collectors.toList());
        return ResponseEntity.ok(payService.getPaysByBranchIds(branchIds));
    }

    // ✅ 추가: 날짜 + 다중 지점 필터
    @ResponseBody
    @GetMapping("/api/payments/filter")
    public ResponseEntity<List<PayDTO>> getFilteredPayments(
        @RequestParam("ids") String ids,
        @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        List<Long> branchIds = Arrays.stream(ids.split(","))
                                     .map(Long::parseLong)
                                     .collect(Collectors.toList());

        return ResponseEntity.ok(payService.getFilteredPayments(branchIds, from, to));
    }
}
