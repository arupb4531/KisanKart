#!/bin/bash

# Navigate to script directory
cd "$(dirname "$0")"

echo "================================================================="
echo "       KisanKart - 1-Click Launch Assistant (Mac/Linux)"
echo "================================================================="
echo ""

# 1. Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed on this system!"
    echo "Please download and install Node.js from https://nodejs.org/"
    exit 1
fi

# 2. Install dependencies if node_modules missing
if [ ! -d "node_modules" ]; then
    echo "[*] Installing project dependencies..."
    npm install
fi

# 3. Run launcher
node scripts/launch.js
