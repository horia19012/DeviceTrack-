package com.example.MonitoringAndCommunication.entities;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeviceAction{

    private String operation; // "insert", "delete", "update"
    private Device device;

}
