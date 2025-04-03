package com.example.baskin_admin.Branch;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BranchRepository extends JpaRepository<Branch, Integer> {
    Branch findByBranchName(String branchName);
}
