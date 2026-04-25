package com.nexuspay.controller;

import com.nexuspay.entity.Merchant;
import com.nexuspay.entity.Order;
import com.nexuspay.entity.OrderStatus;
import com.nexuspay.repository.OrderRepository;
import com.nexuspay.service.EncryptionService;
import com.nexuspay.service.MerchantService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/gateway")
public class GatewayController {

    private final MerchantService merchantService;
    private final OrderRepository orderRepository;
    private final EncryptionService encryptionService;
    private final ObjectMapper objectMapper;

    public GatewayController(MerchantService merchantService, OrderRepository orderRepository, EncryptionService encryptionService, ObjectMapper objectMapper) {
        this.merchantService = merchantService;
        this.orderRepository = orderRepository;
        this.encryptionService = encryptionService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/order-status/{orderId}")
    public ResponseEntity<?> getOrderStatus(
            @PathVariable String orderId,
            @RequestHeader("X-API-KEY") String apiKey,
            @RequestHeader("X-API-SECRET") String apiSecret) {
        
        Optional<Merchant> merchantOpt = merchantService.authenticate(apiKey, apiSecret);
        if (merchantOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid API Credentials"));
        }

        Optional<Order> orderOpt = orderRepository.findByOrderId(orderId);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Order not found"));
        }

        Order order = orderOpt.get();
        
        // Ensure the order belongs to the authenticated merchant
        if (!order.getMerchant().getId().equals(merchantOpt.get().getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized access to this order"));
        }

        return ResponseEntity.ok(Map.of(
            "orderId", order.getOrderId(),
            "status", order.getStatus(),
            "amount", order.getAmount(),
            "description", order.getDescription() != null ? order.getDescription() : "",
            "paidAt", order.getPaidAt() != null ? order.getPaidAt() : "",
            "createdAt", order.getCreatedAt()
        ));
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody Map<String, Object> request,
            @RequestHeader("X-API-KEY") String apiKey,
            @RequestHeader("X-API-SECRET") String apiSecret) {
        
        try {
            Optional<Merchant> merchantOpt = merchantService.authenticate(apiKey, apiSecret);
            if (merchantOpt.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid API Credentials"));
            }

            Merchant merchant = merchantOpt.get();
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String description = (String) request.get("description");
            String returnUrl = (String) request.get("returnUrl");

            String orderId = "ord_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            
            Map<String, Object> payload = new HashMap<>();
            payload.put("oid", orderId);
            payload.put("amt", amount);
            payload.put("mname", merchant.getBusinessName());
            payload.put("desc", description);
            payload.put("ts", System.currentTimeMillis());

            String encrypted = encryptionService.encrypt(objectMapper.writeValueAsString(payload));
            
            // Standard origin for API orders (the base URL of this service)
            // In a real app, this would be a config property
            String origin = request.get("origin") != null ? request.get("origin").toString() : "http://localhost:8080";
            String paymentUrl = origin + "/pay?q=" + encrypted;

            Order order = new Order();
            order.setOrderId(orderId);
            order.setAmount(amount);
            order.setMerchant(merchant);
            order.setDescription(description);
            order.setPaymentLink(paymentUrl);
            order.setEncryptedPayload(encrypted);
            order.setStatus(OrderStatus.PENDING);
            order.setSource("API");
            order.setReturnUrl(returnUrl);

            orderRepository.save(order);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "orderId", orderId,
                "paymentUrl", paymentUrl
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}

