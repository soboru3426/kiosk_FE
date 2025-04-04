package com.example.baskin_admin.pay;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

import com.example.baskin_admin.branch.Branch;
import com.example.baskin_admin.menu.Menu;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "payment")
public class Pay {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @ManyToOne
    @JoinColumn(name = "menu_id", referencedColumnName = "menu_id", nullable = false)
    @JsonManagedReference
    private Menu menu;

    @ManyToOne
    @JoinColumn(name = "branch_id", referencedColumnName = "branch_id", nullable = false)
    @JsonManagedReference
    private Branch branch;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private int totalPrice;

    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime paymentDate;

    @Column(unique = true, nullable = false, length = 20)
    private String serialNumber;  // 결제 일련번호 추가

    @Column(nullable = false, length = 20)
    private String paymentMethod;  // 결제수단 추가

    @PrePersist
    protected void onCreate() {
        this.paymentDate = LocalDateTime.now();
        this.serialNumber = generateSerialNumber();
    }

    private String generateSerialNumber() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        String randomDigits = String.format("%04d", new Random().nextInt(10000)); // 0000~9999 랜덤 숫자
        return timestamp + randomDigits;
    }
}
