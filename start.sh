#!/bin/bash
# Portfolio site server script with auto-restart
cd /home/z/my-project

# Build if needed
if [ ! -d ".next" ] || [ ! -f ".next/BUILD_ID" ]; then
  echo "Building..."
  npx next build
fi

# Start server with auto-restart
while true; do
  echo "[$(date)] Starting Next.js server..."
  NODE_OPTIONS="--max-old-space-size=2048" NODE_ENV=production exec node /home/z/my-project/node_modules/.bin/next start -p 3000
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE. Restarting in 3 seconds..."
  sleep 3
done
