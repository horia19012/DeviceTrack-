package com.example.user.controller;



import com.example.user.entity.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "http://angular-app.localhost")
public class ChatController {


    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{to}")
    public void sendMessage(@DestinationVariable String to, ChatMessage message) {
        System.out.println("Handling send message: " + message + " to: " + to);

        // Send the message to a specific topic based on the username
        String destination = "/topic/messages/" + to;
        messagingTemplate.convertAndSend(destination, message);

        System.out.println("Message sent to destination: " + destination);
    }


}
