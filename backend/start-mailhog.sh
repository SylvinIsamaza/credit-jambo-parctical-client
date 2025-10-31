#!/bin/bash

echo "Starting MailHog for email testing..."
docker compose -f docker-compose.mailhog.yml up -d

echo "Waiting for MailHog to start..."
sleep 3

echo "MailHog is now running!"
echo "SMTP Server: localhost:1025"
echo "Web Interface: http://localhost:8025"
echo ""
echo "To stop MailHog, run: docker compose -f docker-compose.mailhog.yml down"
echo "To check status, run: docker compose -f docker-compose.mailhog.yml ps"