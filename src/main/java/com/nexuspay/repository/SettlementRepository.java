package com.nexuspay.repository;

import com.nexuspay.entity.Merchant;
import com.nexuspay.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SettlementRepository extends JpaRepository<Settlement, Long> {
    List<Settlement> findByMerchantOrderByProcessedAtDesc(Merchant merchant);
    List<Settlement> findByMerchant(Merchant merchant);
}
