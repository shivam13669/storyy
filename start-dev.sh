#!/bin/bash

# Start backend server in background
echo "🚀 Starting backend server..."
node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend server PID: $BACKEND_PID"

# Wait for backend to start
sleep 2

# Start frontend dev server (in foreground so proxy can detect it)
echo "🚀 Starting frontend server..."
pnpm exec vite

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT
