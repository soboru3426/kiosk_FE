package com.example.kiosk.config;

import com.example.kiosk.security.XSSFilter;
import com.example.kiosk.security.AuthFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    /**
     * JSON XSS 필터 등록 (모든 요청 대상)
     */
    @Bean
    public FilterRegistrationBean<XSSFilter> xssFilterRegistrationBean() {
        FilterRegistrationBean<XSSFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(new XSSFilter());
        reg.addUrlPatterns("/*");
        reg.setOrder(1);
        return reg;
    }

    /**
     * 인증·인가 필터 등록 (/admin/*, /branch/*)
     */
    @Bean
    public FilterRegistrationBean<AuthFilter> authFilterRegistrationBean(AuthFilter authFilter) {
        FilterRegistrationBean<AuthFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(authFilter);  // @Component로 등록된 AuthFilter 빈 주입
        reg.addUrlPatterns("/admin/*", "/branch/*");
        reg.setOrder(2);
        return reg;
    }
}
