package com.nexuspay.config;

import com.nexuspay.entity.Merchant;
import com.nexuspay.service.MerchantService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final MerchantService merchantService;

    public DataSeeder(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (merchantService.findByEmail("demo@nexuspay.com").isEmpty()) {
            Merchant demo = new Merchant();
            demo.setEmail("demo@nexuspay.com");
            demo.setPassword("demo123");
            demo.setBusinessName("NexusPay Demo Store");
            demo.setCategory("Services");
            demo.setPan("ABCDE1234F");
            demo.setAadhar("123456789012");
            demo.setMobile("9876543210");
            demo.setAccountHolder("Demo Holder");
            demo.setAccountNumber("1234567890");
            demo.setIfsc("SBIN0001234");
            
            merchantService.onboard(demo);
            System.out.println("Demo merchant created: demo@nexuspay.com / demo123");
        }
    }
}
