#!/bin/bash

echo "🤖 WhatsApp Bot Service Installer"
echo "=================================="

# Get current user and directory
CURRENT_USER=$(whoami)
CURRENT_DIR=$(pwd)

# Create service file
SERVICE_FILE="/tmp/whatsapp-bot.service"
cat > $SERVICE_FILE << EOF
[Unit]
Description=WhatsApp Bot
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$CURRENT_DIR
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

echo "📝 Service file created"
echo ""
echo "To install the service, run these commands:"
echo ""
echo "sudo cp $SERVICE_FILE /etc/systemd/system/"
echo "sudo systemctl daemon-reload"
echo "sudo systemctl enable whatsapp-bot"
echo "sudo systemctl start whatsapp-bot"
echo ""
echo "To check status:"
echo "sudo systemctl status whatsapp-bot"
echo ""
echo "To view logs:"
echo "sudo journalctl -u whatsapp-bot -f"
echo ""
echo "⚠️  Make sure to run 'npm install' first!"
