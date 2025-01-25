package com.example.MonitoringAndCommunication.service;

import com.example.MonitoringAndCommunication.entities.Device;
import com.example.MonitoringAndCommunication.entities.DeviceAction;
import com.example.MonitoringAndCommunication.entities.Measurement;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeviceOperationConsumer {

    private final DeviceService deviceService;

    @Autowired
    public DeviceOperationConsumer(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    // Listener for device monitoring queue
    @RabbitListener(queues = "device_monitoring_queue")
    public void receiveDeviceMonitoringMessage(DeviceAction deviceAction) {
        String operation = deviceAction.getOperation();
        Device device = deviceAction.getDevice();

        switch (operation.toLowerCase()) {
            case "create":
                deviceService.createDevice(device);
                System.out.println("Device created: " + device);
                break;
            case "update":
                deviceService.updateDevice(device.getId(), device);
                System.out.println("Device updated: " + device);
                break;
            case "delete":
                deviceService.deleteDevice(device.getId());
                System.out.println("Device deleted with ID: " + device.getId());
                break;
            default:
                System.out.println("Unknown operation: " + operation);
        }
    }

//    // Listener for deviceQueue
//    @RabbitListener(queues = "device_queue")
//    public void receiveDeviceQueueMessage(Measurement measurement) {
//        System.out.println("Read: " + measurement);
//    }
}