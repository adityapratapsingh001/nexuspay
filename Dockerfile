# STAGE 1: Build the Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# STAGE 2: Build the Spring Boot App
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-build
WORKDIR /app
COPY pom.xml ./
# Pre-download dependencies to speed up builds
RUN mvn dependency:go-offline

COPY src ./src
# Copy built frontend from Stage 1 to static resources
COPY --from=frontend-build /app/frontend/out ./src/main/resources/static
RUN mvn package -DskipTests

# STAGE 3: Final Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8080

# Use H2 by default in Docker unless overridden
ENV DATABASE_URL=jdbc:h2:mem:nexuspay;DB_CLOSE_DELAY=-1
ENV DB_DRIVER=org.h2.Driver
ENV DB_USER=sa
ENV DB_PASSWORD=""

ENTRYPOINT ["java", "-jar", "app.jar"]
