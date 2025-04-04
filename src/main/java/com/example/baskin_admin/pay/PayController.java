package com.example.baskin_admin.pay;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/pay")
public class PayController {
    
    @Autowired
    private PayService payService;

    // 🔹 HTML 페이지 반환 (http://localhost:8083/pay)
    @GetMapping
    public String showPayPage() {
        return "pay";  // ✅ templates/pay.html 렌더링
    }
}

// 🔹 REST API 컨트롤러 (JSON 응답용)
@RestController
@RequestMapping("/api/pay")
class PayApiController {

    @Autowired
    private PayService payService;

    // 전체 결제 내역 조회
    @GetMapping
    public ResponseEntity<List<Pay>> getAllPays() {
        return ResponseEntity.ok(payService.getAllPays());
    }

    // 특정 결제 내역 조회 (ID 기준)
    @GetMapping("/{id}")
    public ResponseEntity<Pay> getPayById(@PathVariable Long id) {
        Optional<Pay> pay = payService.getPayById(id);
        return pay.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 특정 지점의 결제 내역 조회
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<Pay>> getPaysByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(payService.getPaysByBranch(branchId));
    }

    // 새로운 결제 내역 추가
    @PostMapping
    public ResponseEntity<Pay> createPay(@RequestBody Pay pay) {
        Pay savedPay = payService.savePay(pay);
        return ResponseEntity.ok(savedPay);
    }

    // 결제 내역 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePay(@PathVariable Long id) {
        payService.deletePay(id);
        return ResponseEntity.noContent().build();
    }
}
