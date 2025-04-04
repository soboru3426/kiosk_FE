package com.example.baskin_admin.pay;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/pay")
public class PayController {

    @Autowired
    private PayService payService;

    @GetMapping
    public String showPayPage() {
        return "pay";
    }

    // 🔹 전체 결제 내역 JSON 응답
    @ResponseBody
    @GetMapping("/api")
    public ResponseEntity<List<PayDTO>> getAllPays() {
        List<Pay> pays = payService.getAllPays();

        List<PayDTO> dtoList = pays.stream()
                                   .map(PayDTO::new)
                                   .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    // 🔹 ID로 결제 내역 조회
    @ResponseBody
    @GetMapping("/api/{id}")
    public ResponseEntity<PayDTO> getPayById(@PathVariable Long id) {
        Optional<Pay> payOpt = payService.getPayById(id);
        return payOpt.map(pay -> ResponseEntity.ok(new PayDTO(pay)))
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 🔹 지점별 결제 내역 조회
    @ResponseBody
    @GetMapping("/api/branch/{branchId}")
    public ResponseEntity<List<PayDTO>> getPaysByBranch(@PathVariable("branchId") Long branchId) {
        List<Pay> pays = payService.getPaysByBranch(branchId);

        List<PayDTO> dtoList = pays.stream()
                                   .map(PayDTO::new)
                                   .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }
}
