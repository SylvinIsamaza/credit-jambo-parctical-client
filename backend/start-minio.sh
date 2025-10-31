#!/bin/bash

# Download and start MinIO server
echo "Starting MinIO server..."

# Create data directory
mkdir -p ./minio-data

# Download MinIO if not exists
if [ ! -f "./minio" ]; then
    echo "Downloading MinIO..."
    wget https://dl.min.io/server/minio/release/linux-amd64/minio
    chmod +x minio
fi

# Set environment variables
export MINIO_ROOT_USER=minioadmin
export MINIO_ROOT_PASSWORD=minioadmin

# Start MinIO server
echo "Starting MinIO on port 9000..."
./minio server ./minio-data --console-address ":9001" &

echo "MinIO started!"
echo "Web Console: http://localhost:9001"
echo "API Endpoint: http://localhost:9000"
echo "Username: minioadmin"
echo "Password: minioadmin"