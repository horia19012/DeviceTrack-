FROM maven:3.8.8-eclipse-temurin-17 AS builder
COPY . /app
WORKDIR /app
RUN mvn package -DskipTests

FROM openjdk:18-jdk-slim
COPY --from=builder /app/target/ChatMicroservice-0.0.1-SNAPSHOT.jar chat-ms.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "chat-ms.jar"]