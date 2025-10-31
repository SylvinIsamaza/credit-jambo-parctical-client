#!/bin/bash

echo "Starting MailHog using Docker run command..."
docker run -d \
  --name credit-ijambo-mailhog \
  -p 1025:1025 \
  -p 8025:8025 \
  --restart unless-stopped \
  mailhog/mailhog:latest

echo "Waiting for MailHog to start..."
sleep 3

echo "MailHog is now running!"
echo "SMTP Server: localhost:1025"
echo "Web Interface: http://localhost:8025"
echo ""
echo "To stop MailHog, run: docker stop credit-ijambo-mailhog"
echo "To remove MailHog, run: docker rm credit-ijambo-mailhog"