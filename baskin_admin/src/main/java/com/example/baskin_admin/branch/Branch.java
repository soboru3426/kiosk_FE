package com.example.baskin_admin.branch;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "branch_id")
    private Integer branchId;

    @Column(name = "branch_name", nullable = false, length = 100)
    private String branchName;

    @Column(nullable = false, length = 200)
    private String location;

    @OneToMany(mappedBy = "branch")
    private List<Stock> stocks;

    @OneToMany(mappedBy = "branch")
    @JsonBackReference
    private List<Pay> payments;
}
