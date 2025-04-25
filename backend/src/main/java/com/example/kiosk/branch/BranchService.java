package com.example.kiosk.branch;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BranchService {
    
    @Autowired
    private BranchMapper branchMapper;

    public Branch findByBranchName(String branchName) {
        return branchMapper.findByBranchName(branchName);
    }
}
