package com.example.baskin_admin.pay;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin/pay")
public class AdminPayController {

    @Autowired
    private PayService payService;

    // 본사 페이지 HTML
    @GetMapping
    public String showAdminPayPage(Model model) {
        List<PayDTO> dtoList = payService.getAllPays();
        model.addAttribute("pays", dtoList);
        return "admin/pay";
    }

    // 전체 JSON
    @ResponseBody
    @GetMapping("/api")
    public ResponseEntity<List<PayDTO>> getAllPays() {
        return ResponseEntity.ok(payService.getAllPays());
    }

    // 단일 지점
    @ResponseBody
    @GetMapping("/api/branch/{branchId}")
    public ResponseEntity<List<PayDTO>> getPaysByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(payService.getPaysByBranch(branchId));
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

    @GetMapping("/api/filter")
    public ResponseEntity<List<PayDTO>> filterPayments(
            @RequestParam List<Long> ids,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        // LocalDateTime 범위로 변환
        LocalDateTime fromDateTime = from.atStartOfDay(); // 00:00:00
        LocalDateTime toDateTime = to.atTime(23, 59, 59); // 23:59:59

        List<PayDTO> results = payService.getFilteredPayments(ids, fromDateTime, toDateTime);
        return ResponseEntity.ok(results);
    }


}
