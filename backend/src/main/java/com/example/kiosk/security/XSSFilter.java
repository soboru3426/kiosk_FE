package com.example.kiosk.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;

/**
 * JSON POST/PUT 요청에만 XSSBodyRequestWrapper로 감싸는 필터
 */
public class XSSFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException { /* noop */ }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        if (req instanceof HttpServletRequest) {
            HttpServletRequest httpReq = (HttpServletRequest) req;
            String ct = httpReq.getContentType();
            if (ct != null && ct.contains("application/json") && 
                ("POST".equalsIgnoreCase(httpReq.getMethod()) || "PUT".equalsIgnoreCase(httpReq.getMethod()))) {
                XSSBodyRequestWrapper wrapped = new XSSBodyRequestWrapper(httpReq);
                chain.doFilter(wrapped, res);
                return;
            }
        }
        chain.doFilter(req, res);
    }

    @Override public void destroy() { /* noop */ }
}