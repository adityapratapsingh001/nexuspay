package com.nexuspay.repository;

import com.nexuspay.entity.Merchant;
import com.nexuspay.entity.Order;
import com.nexuspay.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderId(String orderId);
    List<Order> findByMerchantOrderByCreatedAtDesc(Merchant merchant);
    List<Order> findByMerchantAndStatus(Merchant merchant, OrderStatus status);
    List<Order> findByMerchantAndStatusAndPaidAtBetween(Merchant merchant, OrderStatus status, LocalDateTime start, LocalDateTime end);
}



