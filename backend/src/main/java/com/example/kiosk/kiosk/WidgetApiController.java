package com.example.kiosk.kiosk;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@RestController
@RequestMapping("/api/widget")
public class WidgetApiController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @PostMapping("/confirm")
    public ResponseEntity<JSONObject> confirmPayment(@RequestBody String jsonBody) throws Exception {

        JSONParser parser = new JSONParser();
        String orderId;
        String amount;
        String paymentKey;
        try {
            JSONObject requestData = (JSONObject) parser.parse(jsonBody);
            paymentKey = requestData.get("paymentKey").toString();  // ✅ 안전하게 변환
            orderId = requestData.get("orderId").toString();        // ✅ 안전하게 변환
            amount = requestData.get("amount").toString();          // ✅ 여기 중요!
        } catch (ParseException e) {
            throw new RuntimeException("Invalid JSON data", e);
        }
        

        JSONObject obj = new JSONObject();
        obj.put("orderId", orderId);
        obj.put("amount", amount);
        obj.put("paymentKey", paymentKey);

        String widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode((widgetSecretKey + ":").getBytes(StandardCharsets.UTF_8));
        String authorizations = "Basic " + new String(encodedBytes);

        URL url = new URL("https://api.tosspayments.com/v1/payments/confirm");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("Authorization", authorizations);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);

        OutputStream outputStream = connection.getOutputStream();
        outputStream.write(obj.toString().getBytes(StandardCharsets.UTF_8));

        int code = connection.getResponseCode();
        boolean isSuccess = code == 200;

        InputStream responseStream = isSuccess ? connection.getInputStream() : connection.getErrorStream();

        Reader reader = new InputStreamReader(responseStream, StandardCharsets.UTF_8);
        JSONObject jsonObject = (JSONObject) parser.parse(reader);
        responseStream.close();

        return ResponseEntity.status(code).body(jsonObject);
    }

    @GetMapping("/success")
    public ResponseEntity<JSONObject> successResponse() {
        JSONObject result = new JSONObject();
        result.put("status", "success");
        result.put("message", "결제가 성공적으로 완료되었습니다.");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/fail")
    public ResponseEntity<JSONObject> failResponse(@RequestParam String code, @RequestParam String message) {
        JSONObject result = new JSONObject();
        result.put("status", "fail");
        result.put("code", code);
        result.put("message", message);
        return ResponseEntity.badRequest().body(result);
    }

    @GetMapping("/")
    public ResponseEntity<JSONObject> index() {
        JSONObject result = new JSONObject();
        result.put("message", "Widget API Index");
        return ResponseEntity.ok(result);
    }
}