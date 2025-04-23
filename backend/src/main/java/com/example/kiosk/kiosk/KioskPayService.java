package com.example.kiosk.kiosk;

import com.example.kiosk.branch.Branch;
import com.example.kiosk.fcmtoken.FCMTokenService;
import com.example.kiosk.pay.Pay;
import com.example.kiosk.pay.PayMapper;
import com.example.kiosk.product.Product;
import com.example.kiosk.product.ProductService;
import com.example.kiosk.stock.StockMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KioskPayService {

    private final PayMapper payMapper;
    private final StockMapper stockMapper;
    private final ProductService productService;
    private final FCMTokenService fcmService;

    public void processCustomerOrder(PaymentDTO paymentDTO) {
        List<CartOrderDTO> cartOrders = paymentDTO.getCartOrders();
        if (cartOrders == null || cartOrders.isEmpty()) return;

        int finalAmount = paymentDTO.getFinalAmount();

        Branch branch = new Branch();
        branch.setBranchId(1); // 지점 하드코딩

        Pay pay = new Pay();
        pay.setBranch(branch);
        pay.setFinalAmount(finalAmount); // 전달받은 할인 포함 금액 사용
        pay.setPaymentMethod(cartOrders.get(0).getPaymentMethod());
        pay.initBeforeInsert();

        Product firstProduct = productService.findByName(cartOrders.get(0).getName().trim());
        if (firstProduct == null) {
            throw new RuntimeException("대표 제품을 찾을 수 없습니다: " + cartOrders.get(0).getName());
        }
        pay.setProduct(firstProduct);

        try {
            ObjectMapper mapper = new ObjectMapper();
            String subItemsJson = mapper.writeValueAsString(cartOrders);
            pay.setSubItemsJson(subItemsJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("subItems 직렬화 실패: " + e.getMessage());
        }

        payMapper.insertPayment(pay);

        Map<String, Integer> flavorCount = new HashMap<>();
        for (CartOrderDTO order : cartOrders) {
            if (order.getSubItems() != null) {
                for (SubItemDTO sub : order.getSubItems()) {
                    for (String flavor : sub.getFlavors()) {
                        flavorCount.put(flavor, flavorCount.getOrDefault(flavor, 0) + 1);
                    }
                }
            }
        }

        sendPushNotification(cartOrders, finalAmount);

        for (Map.Entry<String, Integer> entry : flavorCount.entrySet()) {
            Map<String, Object> param = new HashMap<>();
            param.put("flavor", entry.getKey());
            param.put("quantity", entry.getValue());
            param.put("branchId", branch.getBranchId());
            stockMapper.decreaseStockQuantity(param);
        }
    }

    private void sendPushNotification(List<CartOrderDTO> cartOrders, int finalAmount) {
        // CartOrderDTO에서 userId 추출
        // Long userId = cartOrders.get(0).getUserId();  // cartOrders에서 userId를 가져옵니다.
        Long userId = 5L;
        // FCMToken을 통해 푸시 알림 전송
        String title = "결제 완료";
        String message = String.format("총 금액 %,d원 결제되었습니다.", finalAmount);

        try {
            // FCMTokenService를 사용하여 푸시 알림을 보냅니다.
            fcmService.sendPush(userId, title, message);

        } catch (Exception e) {
            // 푸시 전송 실패해도 주문 처리에는 영향 없도록 로그만 남깁니다.
            //log.error("푸시 알림 전송 실패 (userId={}): {}", userId, e.getMessage());
        }
    }
}
