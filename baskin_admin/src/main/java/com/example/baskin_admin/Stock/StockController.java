package com.example.baskin_admin.Stock;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StockController {
    
    @GetMapping("/stock/gangseo")
    public String gangseoPage() {
        return "stock/gangseo";
    }

    @GetMapping("/stock/sangbong")
    public String sangbongPage() {
        return "stock/sangbong";
    }

    @GetMapping("/stock/hanam")
    public String hanamPage() {
        return "stock/hanam";
    }

}
