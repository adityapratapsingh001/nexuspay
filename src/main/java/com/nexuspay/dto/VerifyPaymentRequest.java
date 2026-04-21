package com.nexuspay.dto;

import java.math.BigDecimal;

public class VerifyPaymentRequest {
    private String orderId;
    private BigDecimal amount;
    private Long timestamp;

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }
}
