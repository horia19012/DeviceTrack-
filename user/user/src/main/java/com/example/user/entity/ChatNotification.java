package com.example.user.entity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ChatNotification {
    private String id;
    private String senderId;
    private String recipientId;
    private String content;

}
