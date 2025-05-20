# Use Maven image with Java 17
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built artifact from builder stage
COPY --from=build /app/target/Backend-0.0.1-SNAPSHOT.jar .

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/Backend-0.0.1-SNAPSHOT.jar"]
