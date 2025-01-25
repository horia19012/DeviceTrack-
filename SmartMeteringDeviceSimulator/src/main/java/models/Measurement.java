package models;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Measurement implements Serializable {
    private long timestamp;
    private String deviceId;
    private double measurementValue;

    @Override
    public String toString() {
        return "Measurement{" +
                "timestamp=" + timestamp +
                ", deviceId='" + deviceId + '\'' +
                ", measurementValue=" + measurementValue +
                '}';
    }
}
