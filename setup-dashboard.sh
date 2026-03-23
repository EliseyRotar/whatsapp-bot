#!/bin/bash

# WhatsApp Bot Dashboard Setup Script
# This script helps you set up the web dashboard quickly

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     WhatsApp Bot Dashboard - Quick Setup                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Check if web configuration exists in .env
if ! grep -q "WEB_PASSWORD" .env; then
    echo ""
    echo -e "${YELLOW}📝 Adding web dashboard configuration to .env...${NC}"
    echo "" >> .env
    echo "# Web Dashboard Configuration" >> .env
    echo "WEB_PORT=3000" >> .env
    echo "WEB_PASSWORD=admin123" >> .env
    echo "JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo 'change-this-to-a-random-secret-key')" >> .env
    echo -e "${GREEN}✅ Web configuration added${NC}"
else
    echo -e "${GREEN}✅ Web configuration exists${NC}"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# Check if jsonwebtoken is installed
if ! npm list jsonwebtoken > /dev/null 2>&1; then
    echo ""
    echo -e "${YELLOW}📦 Installing jsonwebtoken...${NC}"
    npm install jsonwebtoken
    echo -e "${GREEN}✅ jsonwebtoken installed${NC}"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete! 🎉                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Dashboard is ready to use!${NC}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start the bot and dashboard:"
echo -e "   ${YELLOW}npm start${NC}"
echo ""
echo "2. Open your browser:"
echo -e "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "3. Login with:"
echo -e "   Username: ${YELLOW}admin${NC}"
echo -e "   Password: ${YELLOW}admin123${NC} (or your WEB_PASSWORD from .env)"
echo ""
echo "⚠️  IMPORTANT: Change the default password in .env for production!"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: web/QUICK_START.md"
echo "   - Full Setup: DASHBOARD_SETUP.md"
echo "   - Features: web/FEATURES.md"
echo ""
echo "🚀 Enjoy your new dashboard!"
echo ""
