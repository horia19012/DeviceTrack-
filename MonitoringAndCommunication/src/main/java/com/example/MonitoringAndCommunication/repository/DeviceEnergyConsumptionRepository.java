package com.example.MonitoringAndCommunication.repository;

import com.example.MonitoringAndCommunication.entities.DeviceEnergyConsumption;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface DeviceEnergyConsumptionRepository extends JpaRepository<DeviceEnergyConsumption, Long> {
    Optional<DeviceEnergyConsumption> findByDeviceId(Long deviceId);

    @Transactional
    @Modifying
    @Query("UPDATE DeviceEnergyConsumption d SET d.energyConsumed = 0")
    void resetAllEnergyConsumed();
}
