package com.nexuspay.controller;

import com.nexuspay.dto.PaymentRequest;
import com.nexuspay.dto.VerifyPaymentRequest;
import com.nexuspay.entity.Order;
import com.nexuspay.entity.OrderStatus;
import com.nexuspay.repository.OrderRepository;
import com.nexuspay.service.EncryptionService;
import com.nexuspay.service.TransactionService;
import com.nexuspay.service.UPIService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    private final EncryptionService encryptionService;
    private final UPIService upiService;
    private final TransactionService transactionService;
    private final OrderRepository orderRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PaymentController(EncryptionService encryptionService, 
                             UPIService upiService, 
                             TransactionService transactionService, 
                             OrderRepository orderRepository) {
        this.encryptionService = encryptionService;
        this.upiService = upiService;
        this.transactionService = transactionService;
        this.orderRepository = orderRepository;
    }

    @PostMapping("/generate-upi")
    public ResponseEntity<?> generateUPI(@RequestBody PaymentRequest request) {
        try {
            String decrypted = encryptionService.decrypt(request.getQ());
            Map<String, Object> data = objectMapper.readValue(decrypted, Map.class);

            String orderId = (String) data.get("oid");
            String amount = String.valueOf(data.get("amt"));
            String mname = (String) data.get("mname");

            Optional<Order> orderOpt = orderRepository.findByOrderId(orderId);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Order not found"));
            }

            Order order = orderOpt.get();
            if (order.getStatus() == OrderStatus.PAID) {
                return ResponseEntity.ok(Map.of("error", "This payment has already been completed.", "order_id", orderId));
            }

            String upiUri = upiService.generateIntent(orderId, amount);

            Map<String, Object> response = new HashMap<>();
            response.put("upiUri", upiUri);
            response.put("amount", amount);
            response.put("mname", mname);
            response.put("order_id", orderId);
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("UPI Generation Error: ", e);
            return ResponseEntity.status(400).body(Map.of("error", "Invalid data or server error"));
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody VerifyPaymentRequest request) {
        try {
            Optional<Order> orderOpt = orderRepository.findByOrderId(request.getOrderId());
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Order not found"));
            }

            Order order = orderOpt.get();
            if (order.getStatus() == OrderStatus.PAID) {
                return ResponseEntity.ok(Map.of("status", "received", "oid", order.getOrderId()));
            }

            List<Map<String, Object>> transactions = transactionService.fetchTransactions(request.getTimestamp());
            
            if (!transactions.isEmpty()) {
                order.setStatus(OrderStatus.PAID);
                order.setPaidAt(LocalDateTime.now());
                orderRepository.save(order);
                return ResponseEntity.ok(Map.of("status", "received", "oid", order.getOrderId()));
            }

            return ResponseEntity.ok(Map.of("status", "pending", "oid", null));
        } catch (Exception e) {
            log.error("Verification Error: ", e);
            return ResponseEntity.status(500).body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}
