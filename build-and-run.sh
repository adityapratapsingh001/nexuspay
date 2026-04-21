#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting NexusPay Unified Build..."

# 1. Build the Frontend
echo "📦 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Prepare Spring Boot static folder
echo "📂 Copying Frontend to Spring Boot static resources..."
mkdir -p src/main/resources/static
rm -rf src/main/resources/static/*
cp -r frontend/out/* src/main/resources/static/

# 3. Start the Spring Boot App
echo "🔥 Starting Spring Boot Server..."
./mvnw spring-boot:run
