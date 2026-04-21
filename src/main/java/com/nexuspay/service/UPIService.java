package com.nexuspay.service;

import org.springframework.stereotype.Service;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class UPIService {

    private static final String PAYEE_VPA = "BHARATPE09904145219@yesbankltd";
    private static final String PAYEE_NAME = "Ayush Shukla";

    public String generateIntent(String orderId, String amount) {
        String baseUri = String.format(
                "upi://pay?pa=%s&pn=%s&mc=&tid=&tr=&tn=%s&am=%s&cu=INR&refUrl=%s",
                PAYEE_VPA,
                PAYEE_NAME,
                orderId,
                amount,
                "http://localhost:8080/verify-payment" // Local testing URL
        );
        
        return baseUri.replace(" ", "+");
    }
}
