package com.example.kiosk.branch;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BranchMapper {
    Branch findByBranchName(@Param("branchName") String branchName);
}
