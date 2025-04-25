package com.example.kiosk.branch;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("Branch")
public class Branch {
    private Integer branchId;
    private String branchName;
    private String location;
}
