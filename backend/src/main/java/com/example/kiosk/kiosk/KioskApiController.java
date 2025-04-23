package com.example.kiosk.kiosk;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class KioskApiController {

    @Autowired
    private KioskPayService kioskPayService;

    @PostMapping("/pay")
    public ResponseEntity<String> processCustomerPayment(@RequestBody PaymentDTO paymentDTO) {
        try {
            kioskPayService.processCustomerOrder(paymentDTO);
            return ResponseEntity.ok("결제가 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("결제 처리 중 오류 발생: " + e.getMessage());
        }
    }
}
