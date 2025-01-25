# Stage 1: Build the application
FROM maven:3.8.8-eclipse-temurin-17 AS builder

# Set the working directory
WORKDIR /app

# Copy the Maven project files
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Create a lightweight runtime image
FROM openjdk:17-jdk-slim

# Set environment variables
ENV TZ=UTC \
    APP_HOME=/app

# Set the working directory
WORKDIR ${APP_HOME}

# Copy the built JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the application port (update to match your application)
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
