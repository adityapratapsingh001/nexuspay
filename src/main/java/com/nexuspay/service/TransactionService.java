package com.nexuspay.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String MERCHANT_ID = "25540696";
    private static final String BHARATPE_TOKEN = "63494edbdee441e7809c2b4f8b7f743f";

    public List<Map<String, Object>> fetchTransactions(long timestamp) {
        String url = String.format(
                "https://payments-tesseract.bharatpe.in/api/v1/merchant/transactions?module=PAYMENT_QR&merchantId=%s&sDate=%d&eDate=%d&pageSize=10&pageCount=0&isFromOtDashboard=1",
                MERCHANT_ID, timestamp, timestamp + (5 * 60 * 1000)
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json, text/javascript, */*; q=0.01");
        headers.set("Origin", "https://enterprise.bharatpe.in");
        headers.set("Referer", "https://enterprise.bharatpe.in/");
        headers.set("token", BHARATPE_TOKEN);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) body.get("data");
                if (data != null && data.containsKey("transactions")) {
                    return (List<Map<String, Object>>) data.get("transactions");
                }
            }
        } catch (Exception e) {
            log.error("Error fetching transactions: {}", e.getMessage());
        }

        return new ArrayList<>();
    }
}
