package com.example.MonitoringAndCommunication.repository;

import com.example.MonitoringAndCommunication.entities.Device;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<Device,Long> {

}
