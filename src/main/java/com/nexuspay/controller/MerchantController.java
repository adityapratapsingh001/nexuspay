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
@RequestMapping("/api/merchant")
public class MerchantController {

    private final MerchantService merchantService;
    private final OrderRepository orderRepository;
    private final EncryptionService encryptionService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MerchantController(MerchantService merchantService, 
                              OrderRepository orderRepository, 
                              EncryptionService encryptionService) {
        this.merchantService = merchantService;
        this.orderRepository = orderRepository;
        this.encryptionService = encryptionService;
    }

    @PostMapping("/onboard")
    public ResponseEntity<?> onboard(@RequestBody Merchant merchant) {
        try {
            if (merchantService.findByEmail(merchant.getEmail()).isPresent()) {
                return ResponseEntity.status(400).body(Map.of("error", "Merchant already onboarded"));
            }

            Merchant saved = merchantService.onboard(merchant);
            return ResponseEntity.ok(Map.of(
                    "message", "Merchant onboarded successfully",
                    "apiKey", saved.getApiKey(),
                    "apiSecret", saved.getApiSecret()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Optional<Merchant> demoOpt = merchantService.findByEmail("demo@nexuspay.com");
        if (demoOpt.isPresent()) {
            return ResponseEntity.ok(demoOpt.get());
        }
        return ResponseEntity.ok(Map.of("error", "No demo account found"));
    }

    @PostMapping("/roll-keys")
    public ResponseEntity<?> rollKeys() {
        Optional<Merchant> demo = merchantService.findByEmail("demo@nexuspay.com");
        if (demo.isPresent()) {
            Merchant rolled = merchantService.rollKeys(demo.get());
            return ResponseEntity.ok(Map.of("apiKey", rolled.getApiKey(), "apiSecret", rolled.getApiSecret()));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    }

    @PostMapping("/create-link")
    public ResponseEntity<?> createLink(@RequestBody Map<String, Object> request) {
        try {
            String email = "demo@nexuspay.com"; 
            Merchant merchant = merchantService.findByEmail(email).orElseThrow();

            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String description = (String) request.get("description");

            String orderId = "ord_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            
            Map<String, Object> payload = new HashMap<>();
            payload.put("oid", orderId);
            payload.put("amt", amount);
            payload.put("mname", merchant.getBusinessName());
            payload.put("desc", description);
            payload.put("ts", System.currentTimeMillis());

            String encrypted = encryptionService.encrypt(objectMapper.writeValueAsString(payload));
            String baseUrl = "http://localhost:3000";
            String paymentUrl = baseUrl + "/pay?q=" + encrypted;

            Order order = new Order();
            order.setOrderId(orderId);
            order.setAmount(amount);
            order.setMerchant(merchant);
            order.setDescription(description);
            order.setPaymentLink(paymentUrl);
            order.setEncryptedPayload(encrypted);
            order.setStatus(OrderStatus.PENDING);

            orderRepository.save(order);

            return ResponseEntity.ok(Map.of("success", true, "url", paymentUrl, "orderId", orderId));
        } catch (Exception e) {
             return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
