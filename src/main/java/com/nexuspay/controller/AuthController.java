package com.nexuspay.controller;

import com.nexuspay.entity.Merchant;
import com.nexuspay.service.MerchantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final MerchantService merchantService;

    public AuthController(MerchantService merchantService) {
        this.merchantService = merchantService;
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
        
        merchantService.onboard(merchant);
        
        return ResponseEntity.ok(Map.of("message", "User registered successfully", "auth", true));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<Merchant> merchantOpt = merchantService.findByEmail(email);
        if (merchantOpt.isPresent() && merchantOpt.get().getPassword().equals(password)) {
            Merchant merchant = merchantOpt.get();
            boolean isOnboarded = merchant.getPan() != null && !merchant.getPan().isEmpty();
            return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "auth", true,
                "onboarded", isOnboarded,
                "status", merchant.getStatus()
            ));
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }


    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        // Mocking auth for demo
        return ResponseEntity.ok(Map.of("auth", true, "email", "demo@nexuspay.com"));
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


