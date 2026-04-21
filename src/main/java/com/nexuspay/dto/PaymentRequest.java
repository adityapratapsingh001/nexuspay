package com.nexuspay.dto;

public class PaymentRequest {
    private String q; // Encrypted payload

    public String getQ() { return q; }
    public void setQ(String q) { this.q = q; }
}
