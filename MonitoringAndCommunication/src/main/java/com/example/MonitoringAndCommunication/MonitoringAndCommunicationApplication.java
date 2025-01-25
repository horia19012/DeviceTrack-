package com.example.MonitoringAndCommunication;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableRabbit
public class MonitoringAndCommunicationApplication {

	public static void main(String[] args) {
		SpringApplication.run(MonitoringAndCommunicationApplication.class, args);
	}

}
