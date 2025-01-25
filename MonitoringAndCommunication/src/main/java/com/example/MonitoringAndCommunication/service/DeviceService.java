package com.example.MonitoringAndCommunication.service;

import com.example.MonitoringAndCommunication.entities.ConsumptionAlert;
import com.example.MonitoringAndCommunication.entities.Device;
import com.example.MonitoringAndCommunication.entities.DeviceEnergyConsumption;
import com.example.MonitoringAndCommunication.entities.Measurement;
import com.example.MonitoringAndCommunication.repository.DeviceEnergyConsumptionRepository;
import com.example.MonitoringAndCommunication.repository.DeviceRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private DeviceEnergyConsumptionRepository deviceEnergyConsumptionRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final Map<String, Queue<Measurement>> deviceMessages = new ConcurrentHashMap<>();
    private final Map<String, Thread> deviceThreads = new ConcurrentHashMap<>();
    private final ExecutorService executorService = Executors.newCachedThreadPool(

    );

    public void createDevice(Device device) {
        deviceRepository.save(device);
        initializeDeviceEnergyConsumption(device.getId());
    }

    private void initializeDeviceEnergyConsumption(Long deviceId) {
        deviceEnergyConsumptionRepository.findByDeviceId(deviceId).orElseGet(() -> {
            DeviceEnergyConsumption newConsumption = DeviceEnergyConsumption.builder()
                    .deviceId(deviceId)
                    .energyConsumed(0.0)
                    .lastUpdated(LocalDateTime.now())
                    .build();
            return deviceEnergyConsumptionRepository.save(newConsumption);
        });
    }

    public void deleteDevice(Long id) {
        // First, find the device to ensure it exists
        Optional<Device> deviceOpt = deviceRepository.findById(id);
        if (deviceOpt.isPresent()) {
            Device device = deviceOpt.get();

            // Delete the corresponding DeviceEnergyConsumption record
            deviceEnergyConsumptionRepository.findByDeviceId(id)
                    .ifPresent(deviceEnergyConsumption -> {
                        deviceEnergyConsumptionRepository.delete(deviceEnergyConsumption);
                    });

            // Delete the device itself
            deviceRepository.delete(device);
        } else {
            System.out.println("Device not found with id: " + id);
        }
    }

    public void updateDevice(Long id, Device deviceDetails) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found with id: " + id));

        device.setDescription(deviceDetails.getDescription());
        device.setAddress(deviceDetails.getAddress());
        device.setMaxHourlyEnergyConsumption(deviceDetails.getMaxHourlyEnergyConsumption());
        device.setUserId(deviceDetails.getUserId());

        deviceRepository.save(device);
    }


    // Rabbit Listener that reads messages from the RabbitMQ queue
    @RabbitListener(queues = "device_queue")
    public void receiveDeviceQueueMessage(Measurement measurement) {
        String deviceId = measurement.getDeviceId();
        // Use a device-specific queue to track measurements
        Queue<Measurement> messagesQueue = deviceMessages
                .computeIfAbsent(deviceId, k -> new LinkedBlockingQueue<>()); // Thread-safe queue

        // Add the incoming message to the queue
        messagesQueue.offer(measurement);

        // Process messages if the queue size reaches 6
        if (messagesQueue.size() >= 7) {
            processDeviceMessages(deviceId);
        }
    }

    private void processDeviceMessages(String deviceId) {
        Queue<Measurement> messagesQueue = deviceMessages.get(deviceId);
        if (messagesQueue != null && messagesQueue.size() >= 6) {
            double firstValue = 0.0;
            double lastValue = 0.0;
            int count = 0;

            while (!messagesQueue.isEmpty() && count < 6) {
                Measurement measurement = messagesQueue.poll();
                if (count == 0) {
                    firstValue = measurement.getMeasurementValue(); // First value
                }
                lastValue = measurement.getMeasurementValue(); // Continuously update to the last value
                count++;
            }

            double hourlyConsumption = lastValue - firstValue;

            // Save consumption data to database
            DeviceEnergyConsumption newConsumption = DeviceEnergyConsumption.builder()
                    .deviceId(Long.parseLong(deviceId))
                    .energyConsumed(hourlyConsumption)
                    .lastUpdated(LocalDateTime.now())
                    .build();
            deviceEnergyConsumptionRepository.save(newConsumption);

            // Retrieve the device to validate and send alerts if needed
            Optional<Device> deviceOpt = deviceRepository.findById(Long.parseLong(deviceId));
            if (deviceOpt.isPresent()) {
                Device device = deviceOpt.get();
                Long userId = device.getUserId();

                if (hourlyConsumption > device.getMaxHourlyEnergyConsumption()) {
                    ConsumptionAlert alert = new ConsumptionAlert(
                            Long.parseLong(deviceId),
                            userId,
                            hourlyConsumption,
                            device.getMaxHourlyEnergyConsumption()
                    );

                    // Log before sending the alert
                    System.out.println("Preparing to send alert to user: " + userId);

                    // Modify the user topic to be user-specific
                    String userTopic = "/user/" + userId + "/alerts";  // Dynamic user-specific topic
                    System.out.println("Sending alert to topic: " + userTopic);  // Log the topic

                    try {
                        // Send alert to the user-specific topic
                        messagingTemplate.convertAndSend(userTopic, alert);
                        System.out.println("ALERT SENT: Device " + deviceId + " exceeded maximum consumption.");
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            } else {
                System.err.println("Device with ID " + deviceId + " not found.");
            }
        }
    }



    @PostConstruct
    public void cleanupThreadsOnShutdown() {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Shutting down all device threads...");
            executorService.shutdownNow();
        }));
    }

    @PostConstruct
    public void initializeValues() {
        // Set energy consumed for all records to 0
        deviceEnergyConsumptionRepository.resetAllEnergyConsumed();
        System.out.println("All energy consumption values reset to 0.");
    }

}
