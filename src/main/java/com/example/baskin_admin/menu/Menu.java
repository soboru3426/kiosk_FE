package com.example.baskin_admin.menu;

import java.util.List;

import com.example.baskin_admin.pay.Pay;
import com.example.baskin_admin.stock.Stock;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private Integer menuId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(length = 255)
    private String image;

    // Stock 엔티티와 관계 설정
    @OneToMany(mappedBy = "menu", fetch = FetchType.LAZY)
    private List<Stock> stocks; 

    @OneToMany(mappedBy = "menu")
    @JsonBackReference
    private List<Pay> payments;

    public enum Category {
        아이스크림, 커피, 음료, 아이스모찌
    }
}
