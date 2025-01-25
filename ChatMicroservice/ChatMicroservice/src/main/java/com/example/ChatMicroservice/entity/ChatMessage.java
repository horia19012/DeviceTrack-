package com.example.ChatMicroservice.entity;

import lombok.*;

import java.util.Date;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChatMessage {
    private String chatId;
    private String senderName;
    private String receiverName;
    private String message;
    private Date timestamp;
    private Status status;
}
