#!/usr/bin/env bash

# Update package lists and install dependencies for Puppeteer/Chromium
apt-get update && apt-get install -y \
  libnss3 \
  libatk1.0-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxrandr2 \
  libcups2 \
  libpangocairo-1.0-0 \
  fonts-liberation \
  libasound2

# Install Chromium explicitly using Puppeteer
npx puppeteer browsers install chrome
