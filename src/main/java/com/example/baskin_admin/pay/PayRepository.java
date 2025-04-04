package com.example.baskin_admin.pay;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayRepository extends JpaRepository<Pay, Long> {
    List<Pay> findByBranch_BranchId(Long branchId);
}

