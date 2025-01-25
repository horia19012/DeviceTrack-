package com.example.device.entity;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeviceAction {
    private String operation; // "insert", "delete", "update"
    private Device device;    // Device object with the device data
}
