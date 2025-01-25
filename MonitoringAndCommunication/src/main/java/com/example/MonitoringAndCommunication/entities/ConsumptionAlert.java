package com.example.MonitoringAndCommunication.entities;

import java.time.LocalDateTime;

public class ConsumptionAlert {

    private Long deviceId;
    private Long userId;
    private double consumption;
    private double maxAllowed;
    private String timestamp; // Change to String to hold the ISO string format

    public ConsumptionAlert(Long deviceId, Long userId, double consumption, double maxAllowed) {
        this.deviceId = deviceId;
        this.userId = userId;
        this.consumption = consumption;
        this.maxAllowed = maxAllowed;
        this.timestamp = LocalDateTime.now().toString(); // Convert to ISO string format
    }

    // Getters and Setters
    public Long getDeviceId() {
        return deviceId;
    }

    public Long getUserId() {
        return userId;
    }

    public double getConsumption() {
        return consumption;
    }

    public double getMaxAllowed() {
        return maxAllowed;
    }

    public String getTimestamp() {
        return timestamp;
    }
}
