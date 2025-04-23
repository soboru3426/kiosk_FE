package com.example.kiosk.pay;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.kiosk.kiosk.SubItemDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    public ResponseEntity<List<PayDTO>> getPaysByBranch(@PathVariable Integer branchId) {
        return ResponseEntity.ok(payService.getPaysByBranch(branchId));
    }

    // ✅ 다중 지점
    @ResponseBody
    @GetMapping("/api/branches")
    public ResponseEntity<List<PayDTO>> getPaysByBranchIds(@RequestParam("ids") String ids) {
        List<Integer> branchIds = Arrays.stream(ids.split(","))
                                     .map(Integer::parseInt)  // 수정: Integer.parseInteger -> Integer.parseInt
                                     .collect(Collectors.toList());
        return ResponseEntity.ok(payService.getPaysByBranchIds(branchIds));
    }

    // ✅ 날짜 필터링
    @GetMapping("/api/filter")
    public ResponseEntity<List<PayDTO>> filterPayments(
            @RequestParam List<Integer> ids,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        // LocalDateTime 범위로 변환
        LocalDateTime fromDateTime = from.atStartOfDay(); // 00:00:00
        LocalDateTime toDateTime = to.atTime(23, 59, 59); // 23:59:59

        List<PayDTO> results = payService.getFilteredPayments(ids, fromDateTime, toDateTime);
        return ResponseEntity.ok(results);
    }

    // ✅ 단일 결제 상세 보기 (subItems 포함)
    @ResponseBody
    @GetMapping("/api/detail/{id}")
    public PayDetailDTO getPaymentDetail(@PathVariable Integer id) {
        Optional<PayDTO> optional = payService.getPayById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("해당 ID의 결제 정보를 찾을 수 없습니다.");
        }
        PayDTO pay = optional.get();

        List<SubItemDTO> subItems = Collections.emptyList();
        try {
            String json = pay.getSubItemsJson();
            if (json != null && !json.isBlank()) {
                ObjectMapper mapper = new ObjectMapper();
                subItems = mapper.readValue(json, new TypeReference<List<SubItemDTO>>() {});
            }
        } catch (Exception e) {
            e.printStackTrace();  // 로깅 정도만
        }

        PayDetailDTO detail = new PayDetailDTO();
        detail.setPay(pay);
        detail.setSubItems(subItems);
        return detail;
    }

}
