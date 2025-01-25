package com.example.user.entity;

import com.example.user.enums.Status;
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
