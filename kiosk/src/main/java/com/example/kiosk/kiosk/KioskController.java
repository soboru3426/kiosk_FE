package com.example.kiosk.kiosk;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/customer")
public class KioskController {
    
    @GetMapping("/{page}")
    public String renderPage(@PathVariable String page) {
        return "customer/" + page; // templates/customer/{page}.html
    }
    
    @GetMapping("/intro")
    public String introPage() {
        return "customer/kioskintro";
    }

    @Autowired
    private KioskPayService kioskPayService;

    @PostMapping("/pay")
    @ResponseBody
    public ResponseEntity<String> processCustomerPayment(@RequestBody List<CartOrderDTO> cartOrders) {
        try {
            kioskPayService.processCustomerOrder(cartOrders);
            return ResponseEntity.ok("결제가 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();  // 콘솔에 전체 오류 출력
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("결제 처리 중 오류 발생: " + e.getMessage()); // 상세 메시지 같이 보내기
        }
    }
}
