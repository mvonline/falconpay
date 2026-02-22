#!/bin/bash

# FalconPay Centralized Backup Script
# This script backs up all PostgreSQL databases and configuration files.

BACKUP_DIR="./backups/$(date +%Y-%m-%d_%H-%M-%S)"
mkdir -p "$BACKUP_DIR"

echo "🚀 Starting FalconPay Backup: $(date)"

# --- 1. Database Backups (Postgres) ---
DB_CONTAINERS=(
    "falconpay-pg-auth"
    "falconpay-pg-user"
    "falconpay-pg-payment"
    "falconpay-pg-wallet"
    "falconpay-pg-reporting"
)

for container in "${DB_CONTAINERS[@]}"; do
    echo "📦 Backing up database container: $container..."
    docker exec "$container" pg_dump -U falconpay -d "${container#falconpay-pg-}"_db > "$BACKUP_DIR/$container.sql"
done

# --- 2. Database Backups (MongoDB) ---
echo "📦 Backing up MongoDB..."
docker exec falconpay-mongo mongodump --archive --gzip > "$BACKUP_DIR/falconpay-mongo.gz"

# --- 3. Configuration & Secret Backups ---
echo "⚙️ Backing up configurations..."
mkdir -p "$BACKUP_DIR/configs"
cp .env "$BACKUP_DIR/configs/.env.root"
cp apps/*/.env "$BACKUP_DIR/configs/" 2>/dev/null
cp docker-compose.yml "$BACKUP_DIR/configs/"
cp prometheus.yml "$BACKUP_DIR/configs/"

# --- 4. Compression ---
echo "🗜️ Compressing backup folder..."
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "✅ Backup completed successfully: $BACKUP_DIR.tar.gz"
