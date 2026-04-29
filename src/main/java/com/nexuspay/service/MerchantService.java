package com.nexuspay.service;

import com.nexuspay.entity.Merchant;
import com.nexuspay.repository.MerchantRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MerchantService {
    private final MerchantRepository merchantRepository;

    public MerchantService(MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    public Merchant onboard(Merchant merchant) {
        if (merchant.getApiKey() == null || merchant.getApiKey().isEmpty()) {
            merchant.setApiKey("NEXUS_" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 24).toUpperCase());
        }
        if (merchant.getApiSecret() == null || merchant.getApiSecret().isEmpty()) {
            merchant.setApiSecret("sk_live_" + java.util.UUID.randomUUID().toString().replace("-", ""));
        }
        return merchantRepository.save(merchant);
    }

    public Optional<Merchant> findByEmail(String email) {
        return merchantRepository.findByEmail(email);
    }

    public Merchant rollKeys(Merchant merchant) {
        merchant.setApiKey("NEXUS_" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 24).toUpperCase());
        merchant.setApiSecret("sk_live_" + java.util.UUID.randomUUID().toString().replace("-", ""));
        return merchantRepository.save(merchant);
    }

    public Optional<Merchant> authenticate(String apiKey, String apiSecret) {
        return merchantRepository.findByApiKeyAndApiSecret(apiKey, apiSecret);
    }
}

