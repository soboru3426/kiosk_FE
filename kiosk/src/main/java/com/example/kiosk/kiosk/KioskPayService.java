package com.example.kiosk.kiosk;

import com.example.kiosk.branch.Branch;
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

    public void processCustomerOrder(List<CartOrderDTO> cartOrders) {
        if (cartOrders == null || cartOrders.isEmpty()) return;

        // 총 금액 계산
        int totalPrice = 0;
        for (CartOrderDTO order : cartOrders) {
            Product product = productService.findByName(order.getName().trim());
            if (product == null) {
                throw new RuntimeException("제품 정보를 찾을 수 없습니다: " + order.getName());
            }
            totalPrice += product.getPrice() * order.getTotalQuantity();
        }

        // Pay 객체 1건 생성
        Branch branch = new Branch();
        branch.setBranchId(1);

        Pay pay = new Pay();
        pay.setBranch(branch);
        pay.setTotalPrice(totalPrice);
        pay.setPaymentMethod(cartOrders.get(0).getPaymentMethod());
        pay.initBeforeInsert();

        // 대표 상품의 product_id만 저장
        Product firstProduct = productService.findByName(cartOrders.get(0).getName().trim());
        if (firstProduct == null) {
            throw new RuntimeException("대표 제품을 찾을 수 없습니다: " + cartOrders.get(0).getName());
        }
        pay.setProduct(firstProduct);  // product_id 저장

        // JSON 직렬화
        try {
            ObjectMapper mapper = new ObjectMapper();
            String subItemsJson = mapper.writeValueAsString(cartOrders);
            pay.setSubItemsJson(subItemsJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("subItems 직렬화 실패: " + e.getMessage());
        }

        // 저장
        payMapper.insertPayment(pay);

        // 재고 차감
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

        for (Map.Entry<String, Integer> entry : flavorCount.entrySet()) {
            Map<String, Object> param = new HashMap<>();
            param.put("flavor", entry.getKey());
            param.put("quantity", entry.getValue());
            param.put("branchId", branch.getBranchId());
            stockMapper.decreaseStockQuantity(param);
        }
    }
}
