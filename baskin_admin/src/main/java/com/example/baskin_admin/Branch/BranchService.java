package com.example.baskin_admin.Branch;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;

    public Branch findBranchByName(String branchName) {
        return branchRepository.findByBranchName(branchName);
    }
}