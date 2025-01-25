export class ConsumptionAlert {
  deviceId: number;
  userId: number;
  consumption: number;
  maxAllowed: number;
  timestamp: string;  // You can use string for LocalDate

  constructor(
    deviceId: number,
    userId: number,
    consumption: number,
    maxAllowed: number,
    timestamp: string // Add the timestamp as a string parameter
  ) {
    this.deviceId = deviceId;
    this.userId = userId;
    this.consumption = consumption;
    this.maxAllowed = maxAllowed;
    this.timestamp = timestamp; // Initialize timestamp
  }
}
