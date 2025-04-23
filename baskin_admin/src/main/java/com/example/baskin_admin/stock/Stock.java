package com.example.baskin_admin.stock;


import com.example.baskin_admin.branch.Branch;
import com.example.baskin_admin.menu.Menu;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stock_id")
    private Integer stockId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_id", referencedColumnName = "branch_id", foreignKey = @ForeignKey(name = "FK_stock_branch"))
    @JsonBackReference
    private Branch branch;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "menu_id", referencedColumnName = "menu_id", foreignKey = @ForeignKey(name = "FK_stock_menu"))
    private Menu menu;    

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String orderStatus;
}
