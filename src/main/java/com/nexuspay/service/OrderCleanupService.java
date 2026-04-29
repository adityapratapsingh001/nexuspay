package com.nexuspay.service;

import com.nexuspay.entity.Order;
import com.nexuspay.entity.OrderStatus;
import com.nexuspay.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderCleanupService {

    private static final Logger log = LoggerFactory.getLogger(OrderCleanupService.class);
    private final OrderRepository orderRepository;

    public OrderCleanupService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Runs every minute to find orders that have been pending for more than 10 minutes
     * and marks them as FAILED.
     */
    @Scheduled(fixedRate = 60000) // 1 minute
    @Transactional
    public void cleanupStaleOrders() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(10);
        List<Order> staleOrders = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.PENDING, cutoff);

        if (!staleOrders.isEmpty()) {
            log.info("Found {} stale pending orders. Marking them as FAILED.", staleOrders.size());
            for (Order order : staleOrders) {
                order.setStatus(OrderStatus.FAILED);
            }
            orderRepository.saveAll(staleOrders);
        }
    }
}
