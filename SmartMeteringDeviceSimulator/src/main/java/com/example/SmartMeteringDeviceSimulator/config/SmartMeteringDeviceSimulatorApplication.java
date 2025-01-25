package com.example.SmartMeteringDeviceSimulator.config;

import models.Measurement;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.Instant;

@SpringBootApplication
@EnableRabbit
@EnableScheduling
//so it works with the dockerrabbitMQ you must close the local rabbitmq
public class SmartMeteringDeviceSimulatorApplication implements CommandLineRunner {

	@Autowired
	private RabbitTemplate rabbitTemplate;

	@Autowired
	private RestTemplate restTemplate;

	private static final String CSV_FILE_PATH = "/sd_data/sensor.csv";
	private BufferedReader csvReader;

	// Global device ID (default value)
	private Integer deviceId = 6;

	public static void main(String[] args) {
		SpringApplication.run(SmartMeteringDeviceSimulatorApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		System.out.println("Received arguments:");
		for (String arg : args) {
			System.out.println(arg);
			if (arg.startsWith("--deviceId=")) {
				try {
					deviceId = Integer.parseInt(arg.split("=")[1]);
					System.out.println("Device ID set to: " + deviceId);
				} catch (NumberFormatException e) {
					System.err.println("Invalid deviceId argument. Using default: " + deviceId);
				}
			}
		}

		// Open the CSV file
		csvReader = new BufferedReader(new FileReader(CSV_FILE_PATH));
	}

	@Scheduled(fixedRate = 5000)  // Run every 5 seconds
	public void sendMeasurement() {
		try {
			String line = csvReader.readLine();
			if (line != null) {
				double measurementValue = Double.parseDouble(line);

				// Send measurement for the single device ID
				Measurement measurement = new Measurement(Instant.now().toEpochMilli(), deviceId.toString(), measurementValue);
				rabbitTemplate.convertAndSend("device_exchange", "device_routing_key", measurement);
				System.out.println("Sent measurement for device ID " + deviceId + ": " + measurement);
			} else {
				System.out.println("End of CSV file reached.");
				csvReader.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
