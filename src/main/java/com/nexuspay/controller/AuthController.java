package com.nexuspay.controller;

import com.nexuspay.entity.Merchant;
import com.nexuspay.service.MerchantService;
import com.nexuspay.config.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final MerchantService merchantService;
    private final JwtUtil jwtUtil;

    public AuthController(MerchantService merchantService, JwtUtil jwtUtil) {
        this.merchantService = merchantService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");

        if (merchantService.findByEmail(email).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("error", "Email already registered"));
        }

        Merchant merchant = new Merchant();
        merchant.setEmail(email);
        merchant.setPassword(password); // Should be hashed in production
        merchant.setBusinessName(name);
        merchant.setStatus("active");
        
        // Use service to ensure API keys are generated
        merchantService.onboard(merchant);
        
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of(
            "message", "User registered successfully", 
            "auth", true,
            "token", token,
            "onboarded", false,
            "status", "pending"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<Merchant> merchantOpt = merchantService.findByEmail(email);
        if (merchantOpt.isPresent() && merchantOpt.get().getPassword().equals(password)) {
            Merchant merchant = merchantOpt.get();
            boolean isOnboarded = merchant.getPan() != null && !merchant.getPan().isEmpty();
            String token = jwtUtil.generateToken(email);
            
            return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "auth", true,
                "token", token,
                "onboarded", isOnboarded,
                "status", merchant.getStatus()
            ));
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }


    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("auth", false));
        }

        String token = authHeader.substring(7);
        try {
            String email = jwtUtil.extractEmail(token);
            if (jwtUtil.validateToken(token, email)) {
                Optional<Merchant> merchantOpt = merchantService.findByEmail(email);
                if (merchantOpt.isPresent()) {
                    Merchant m = merchantOpt.get();
                    boolean isOnboarded = m.getPan() != null && !m.getPan().isEmpty();
                    return ResponseEntity.ok(Map.of(
                        "auth", true, 
                        "email", email, 
                        "onboarded", isOnboarded,
                        "status", m.getStatus(),
                        "businessName", m.getBusinessName() != null ? m.getBusinessName() : ""
                    ));
                }
            }
        } catch (Exception e) {
            // Token invalid or expired
        }

        return ResponseEntity.status(401).body(Map.of("auth", false));
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        Optional<Merchant> merchantOpt = merchantService.findByEmail(email);
        if (merchantOpt.isPresent()) {
            Merchant merchant = merchantOpt.get();
            if (merchant.getPassword().equals(currentPassword)) {
                merchant.setPassword(newPassword);
                merchantService.onboard(merchant); // onboard saves the merchant
                return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Current password is incorrect"));
            }
        }
        return ResponseEntity.status(404).body(Map.of("error", "Merchant not found"));
    }
}


