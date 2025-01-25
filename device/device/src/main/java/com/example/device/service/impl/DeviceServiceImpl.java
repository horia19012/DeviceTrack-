package com.example.device.service.impl;

import com.example.device.entity.Device;
import com.example.device.entity.DeviceAction;
import com.example.device.repository.DeviceRepository;
import com.example.device.service.DeviceService;
import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeviceServiceImpl implements DeviceService {


    private final RabbitTemplate rabbitTemplate;
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceServiceImpl(RabbitTemplate rabbitTemplate, DeviceRepository deviceRepository) {
        this.rabbitTemplate = rabbitTemplate;
        this.deviceRepository = deviceRepository;
    }

    @Override
    public Device createDevice(Device device) {
        Device savedDevice = deviceRepository.save(device);
        System.out.println(savedDevice);
        sendQueueDataMessage("create", savedDevice);
        return savedDevice;
    }

    @Override
    public Optional<Device> getDeviceById(Long id) {
        return deviceRepository.findById(id);
    }

    @Override
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @Override
    public Device updateDevice(Long id, Device deviceDetails) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found with id: " + id));

        device.setDescription(deviceDetails.getDescription());
        device.setAddress(deviceDetails.getAddress());
        device.setMaxHourlyEnergyConsumption(deviceDetails.getMaxHourlyEnergyConsumption());
        device.setUserId(deviceDetails.getUserId());

        sendQueueDataMessage("update", device);
        return deviceRepository.save(device);
    }

    @Override
    public void deleteDevice(Long id) {
        Optional<Device> deviceOpt = deviceRepository.findById(id);
        deviceOpt.ifPresent(device -> {
            deviceRepository.delete(device);
            sendQueueDataMessage("delete", device);  // Send operation to queue
        });
    }

    @Override
    public List<Long> getAllDeviceIds() {
        return deviceRepository.findAllIds();
    }

    @Override
    public List<Device> getDevicesByUserId(Long userId) {
        return deviceRepository.findByUserId(userId);
    }

    @Transactional
    public void deleteDevicesByUserId(Long userId) {
        deviceRepository.deleteByUserId(userId);
    }

    private void sendQueueDataMessage(String operation, Device device) {
        DeviceAction deviceAction = new DeviceAction(operation, device);
        rabbitTemplate.convertAndSend("device_monitoring_exchange", "device_monitoring_routing_key", deviceAction);
    }

}