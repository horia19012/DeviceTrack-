package com.example.MonitoringAndCommunication.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data // Generates getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor // Generates a no-args constructor
@AllArgsConstructor // Generates a constructor with all arguments
@Builder // Generates a builder pattern for constructing the object
public class DeviceEnergyConsumption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // The unique identifier for the entity

    @Column(nullable = false)
    private Long deviceId; // The ID of the associated device

    @Column(nullable = false)
    private Double energyConsumed = 0.0; // The energy consumption (in kWh, for example)

    @Column(nullable = false)
    private LocalDateTime lastUpdated; // Timestamp of the last update
}