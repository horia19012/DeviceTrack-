package com.example.device.service;

import com.example.device.entity.Device;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface DeviceService {

    // Create a new device
    Device createDevice(Device device);

    // Retrieve a device by ID
    Optional<Device> getDeviceById(Long id);

    // Retrieve all devices
    List<Device> getAllDevices();

    // Update an existing device
    Device updateDevice(Long id, Device deviceDetails);

    // Delete a device by ID
    void deleteDevice(Long id);


    List<Long> getAllDeviceIds();

    // Retrieve devices by user ID
    List<Device> getDevicesByUserId(Long userId);

    void deleteDevicesByUserId(Long userId);


}