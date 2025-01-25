package com.example.messagingstompwebsocket;

import com.example.MonitoringAndCommunication.entities.ConsumptionAlert;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class AlertController {

    @MessageMapping("/device-alert")
    @SendTo("/user/{userId}/alerts")  // Correct the topic to include {userId}
    public ConsumptionAlert sendConsumptionAlert(@DestinationVariable String userId, ConsumptionAlert alert) {
        // Send the alert to the correct user
        return alert;
    }
}