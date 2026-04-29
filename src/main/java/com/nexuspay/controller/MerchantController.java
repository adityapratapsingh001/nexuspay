package com.nexuspay.controller;

import com.nexuspay.entity.Merchant;
import com.nexuspay.entity.Order;
import com.nexuspay.entity.OrderStatus;
import com.nexuspay.entity.Settlement;
import com.nexuspay.repository.MerchantRepository;
import com.nexuspay.repository.OrderRepository;
import com.nexuspay.repository.SettlementRepository;
import com.nexuspay.service.EncryptionService;
import com.nexuspay.service.MerchantService;
import com.nexuspay.service.ReportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/merchant")
@CrossOrigin("*")
public class MerchantController {

    private final MerchantService merchantService;
    private final OrderRepository orderRepository;
    private final SettlementRepository settlementRepository;
    private final ReportService reportService;
    private final EncryptionService encryptionService;
    private final ObjectMapper objectMapper;

    public MerchantController(MerchantService merchantService, 
                              OrderRepository orderRepository, 
                              SettlementRepository settlementRepository,
                              ReportService reportService,
                              EncryptionService encryptionService,
                              ObjectMapper objectMapper) {
        this.merchantService = merchantService;
        this.orderRepository = orderRepository;
        this.settlementRepository = settlementRepository;
        this.reportService = reportService;
        this.encryptionService = encryptionService;
        this.objectMapper = objectMapper;
    }


    @GetMapping("/settlements")
    public ResponseEntity<?> getSettlements(HttpServletRequest request) {
        try {
            String email = (String) request.getAttribute("authenticatedEmail");
            if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            Merchant merchant = merchantService.findByEmail(email).orElseThrow();
            
            List<Order> paidOrders = orderRepository.findByMerchantAndStatus(merchant, OrderStatus.PAID);
            BigDecimal totalPaid = paidOrders.stream().map(Order::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            
            List<Settlement> settlements = settlementRepository.findByMerchantOrderByProcessedAtDesc(merchant);
            BigDecimal totalSettled = settlements.stream().map(Settlement::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal availableBalance = totalPaid.subtract(totalSettled);

            return ResponseEntity.ok(Map.of(
                "settlements", settlements,
                "availableBalance", availableBalance
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/request-settlement")
    public ResponseEntity<?> requestSettlement(HttpServletRequest request) {
        try {
            String email = (String) request.getAttribute("authenticatedEmail");
            if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            Merchant merchant = merchantService.findByEmail(email).orElseThrow();
            
            List<Order> paidOrders = orderRepository.findByMerchantAndStatus(merchant, OrderStatus.PAID);
            BigDecimal totalPaid = paidOrders.stream().map(Order::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            
            List<Settlement> settlements = settlementRepository.findByMerchant(merchant);
            BigDecimal totalSettled = settlements.stream().map(Settlement::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal totalAmount = totalPaid.subtract(totalSettled);
            
            if (totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.status(400).body(Map.of("error", "Insufficient balance for settlement"));
            }

            BigDecimal fees = totalAmount.multiply(new BigDecimal("0.02")); // 2% fee
            BigDecimal tax = fees.multiply(new BigDecimal("0.18")); // 18% GST on fees
            BigDecimal netAmount = totalAmount.subtract(fees).subtract(tax);

            Settlement settlement = new Settlement();
            settlement.setSettlementId("SETL" + System.currentTimeMillis());
            settlement.setAmount(totalAmount);
            settlement.setFees(fees);
            settlement.setTax(tax);
            settlement.setNetAmount(netAmount);
            settlement.setStatus(Settlement.SettlementStatus.PROCESSED);
            settlement.setUtr("UTR" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
            settlement.setMerchant(merchant);
            settlement.setProcessedAt(LocalDateTime.now());

            settlementRepository.save(settlement);
            
            return ResponseEntity.ok(Map.of("success", true, "settlementId", settlement.getSettlementId()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }


    @PostMapping("/onboard")
    public ResponseEntity<?> onboard(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.status(400).body(Map.of("error", "Email is required"));
            }

            Optional<Merchant> merchantOpt = merchantService.findByEmail(email);
            Merchant merchant;
            if (merchantOpt.isPresent()) {
                merchant = merchantOpt.get();
            } else {
                merchant = new Merchant();
                merchant.setEmail(email);
                // Set a default password if creating new for some reason
                merchant.setPassword("password123");
            }

            merchant.setBusinessName(request.get("businessName"));
            merchant.setCategory(request.get("category"));
            merchant.setWebsite(request.get("website"));
            merchant.setPan(request.get("pan"));
            merchant.setAadhar(request.get("aadhar"));
            merchant.setMobile(request.get("mobile"));
            merchant.setAccountHolder(request.get("accountHolder"));
            merchant.setAccountNumber(request.get("accountNumber"));
            merchant.setIfsc(request.get("ifsc"));
            merchant.setStatus("active");

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
    public ResponseEntity<?> getMe(HttpServletRequest request) {
        String email = (String) request.getAttribute("authenticatedEmail");
        if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        
        Optional<Merchant> merchantOpt = merchantService.findByEmail(email);
        if (merchantOpt.isPresent()) {
            return ResponseEntity.ok(merchantOpt.get());
        }
        return ResponseEntity.status(404).body(Map.of("error", "Merchant not found"));
    }

    @PostMapping("/roll-keys")
    public ResponseEntity<?> rollKeys(HttpServletRequest request) {
        String email = (String) request.getAttribute("authenticatedEmail");
        if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        Optional<Merchant> merchantOpt = merchantService.findByEmail(email);
        if (merchantOpt.isPresent()) {
            Merchant rolled = merchantService.rollKeys(merchantOpt.get());
            return ResponseEntity.ok(Map.of("apiKey", rolled.getApiKey(), "apiSecret", rolled.getApiSecret()));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Merchant not found"));
    }


    @PostMapping("/create-link")
    public ResponseEntity<?> createLink(@RequestBody Map<String, Object> request, HttpServletRequest httpRequest) {
        try {
            String email = (String) httpRequest.getAttribute("authenticatedEmail");
            if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            Merchant merchant = merchantService.findByEmail(email).orElseThrow();


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
            String origin = request.get("origin") != null ? request.get("origin").toString() : "http://localhost:8080";
            if (origin.endsWith("/")) origin = origin.substring(0, origin.length() - 1);
            String paymentUrl = origin + "/pay?q=" + encrypted;

            Order order = new Order();
            order.setOrderId(orderId);
            order.setAmount(amount);
            order.setMerchant(merchant);
            order.setDescription(description);
            order.setPaymentLink(paymentUrl);
            order.setEncryptedPayload(encrypted);
            order.setStatus(OrderStatus.PENDING);
            order.setSource("DASHBOARD");
            order.setReturnUrl(returnUrl);

            orderRepository.save(order);



            return ResponseEntity.ok(Map.of("success", true, "url", paymentUrl, "orderId", orderId));
        } catch (Exception e) {
             return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(HttpServletRequest request) {
        try {
            String email = (String) request.getAttribute("authenticatedEmail");
            if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            Merchant merchant = merchantService.findByEmail(email).orElseThrow();
            List<Order> orders = orderRepository.findByMerchantOrderByCreatedAtDesc(merchant);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(HttpServletRequest request) {
        try {
            String email = (String) request.getAttribute("authenticatedEmail");
            if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            Merchant merchant = merchantService.findByEmail(email).orElseThrow();
            
            LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
            LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
            
            List<Order> allOrders = orderRepository.findByMerchantOrderByCreatedAtDesc(merchant);
            List<Order> paidOrders = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PAID)
                .toList();

            List<Order> todayOrders = paidOrders.stream()
                .filter(o -> o.getPaidAt() != null && o.getPaidAt().isAfter(startOfDay))
                .toList();
            
            BigDecimal totalToday = todayOrders.stream()
                .map(Order::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalRevenue = paidOrders.stream()
                .map(Order::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            return ResponseEntity.ok(Map.of(
                "totalToday", totalToday,
                "countToday", todayOrders.size(),
                "totalRevenue", totalRevenue,
                "totalOrders", paidOrders.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf(HttpServletRequest request) throws java.io.IOException {
        String email = (String) request.getAttribute("authenticatedEmail");
        if (email == null) return ResponseEntity.status(401).build();
        Merchant merchant = merchantService.findByEmail(email).orElseThrow();
        List<Order> orders = orderRepository.findByMerchantOrderByCreatedAtDesc(merchant);

        byte[] pdf = reportService.generateOrdersPdf(merchant, orders);

        return ResponseEntity.ok()
            .header("Content-Type", "application/pdf")
            .header("Content-Disposition", "attachment; filename=report.pdf")
            .body(pdf);
    }

    @GetMapping("/export/csv")
    public ResponseEntity<String> exportCsv(HttpServletRequest request) {
        String email = (String) request.getAttribute("authenticatedEmail");
        if (email == null) return ResponseEntity.status(401).build();
        Merchant merchant = merchantService.findByEmail(email).orElseThrow();
        List<Order> orders = orderRepository.findByMerchantOrderByCreatedAtDesc(merchant);

        String csv = reportService.generateOrdersCsv(orders);

        return ResponseEntity.ok()
            .header("Content-Type", "text/csv")
            .header("Content-Disposition", "attachment; filename=report.csv")
            .body(csv);
    }

    @GetMapping("/admin/logs")
    public ResponseEntity<?> getLogs(HttpServletRequest request) {
        try {
            String email = (String) request.getAttribute("authenticatedEmail");
            if (email == null) return ResponseEntity.status(401).build();
            
            Merchant merchant = merchantService.findByEmail(email).orElseThrow();
            if (!merchant.isAdmin()) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Admin access required"));
            }

            java.nio.file.Path path = java.nio.file.Paths.get("logs.txt");
            if (!java.nio.file.Files.exists(path)) {
                return ResponseEntity.ok(java.util.List.of("No logs found yet."));
            }

            java.util.List<String> logs = java.nio.file.Files.readAllLines(path);
            int start = Math.max(0, logs.size() - 100);
            return ResponseEntity.ok(logs.subList(start, logs.size()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}



