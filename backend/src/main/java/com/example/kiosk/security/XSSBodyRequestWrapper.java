package com.example.kiosk.security;

import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import org.apache.commons.text.StringEscapeUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 모든 JSON POST/PUT 요청의 본문을 읽고 XSS 필터링을 적용하는 래퍼
 */
public class XSSBodyRequestWrapper extends HttpServletRequestWrapper {
    private final String sanitizedBody;

    public XSSBodyRequestWrapper(HttpServletRequest request) throws IOException {
        super(request);
        String body = new BufferedReader(new InputStreamReader(request.getInputStream(), StandardCharsets.UTF_8))
            .lines().collect(Collectors.joining("\n"));
        sanitizedBody = sanitizeJson(body);
    }

    @Override
    public ServletInputStream getInputStream() {
        ByteArrayInputStream bais = new ByteArrayInputStream(sanitizedBody.getBytes(StandardCharsets.UTF_8));
        return new ServletInputStream() {
            @Override
            public int read() { return bais.read(); }
            @Override public boolean isFinished() { return bais.available() == 0; }
            @Override public boolean isReady() { return true; }
            @Override public void setReadListener(ReadListener listener) { /* noop */ }
        };
    }

    @Override
    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new InputStreamReader(getInputStream(), StandardCharsets.UTF_8));
    }

    private String sanitizeJson(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> map = mapper.readValue(json, new TypeReference<>() {});
            Map<String, Object> sanitized = sanitizeMap(map);
            return mapper.writeValueAsString(sanitized);
        } catch (Exception e) {
            return json;
        }
    }

    private Map<String, Object> sanitizeMap(Map<String, Object> input) {
        Map<String, Object> result = new HashMap<>();
        input.forEach((k, v) -> {
            if (v instanceof String) {
                result.put(k, StringEscapeUtils.escapeHtml4((String) v));
            } else if (v instanceof Map) {
                //noinspection unchecked
                result.put(k, sanitizeMap((Map<String, Object>) v));
            } else if (v instanceof List) {
                result.put(k, sanitizeList((List<?>) v));
            } else {
                result.put(k, v);
            }
        });
        return result;
    }

    private List<Object> sanitizeList(List<?> list) {
        List<Object> result = new ArrayList<>();
        list.forEach(item -> {
            if (item instanceof String) {
                result.add(StringEscapeUtils.escapeHtml4((String) item));
            } else if (item instanceof Map) {
                //noinspection unchecked
                result.add(sanitizeMap((Map<String, Object>) item));
            } else {
                result.add(item);
            }
        });
        return result;
    }
}