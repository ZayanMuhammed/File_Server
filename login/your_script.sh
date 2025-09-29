#!/bin/bash
set -x # Enable debugging

echo "=== SCRIPT START ==="
echo "Current directory: $(pwd)"
echo "Script started at: $(date)"

echo "Changing to data directory..."
cd ../ || {
    echo "ERROR: Failed to change to data directory"
    exit 1
}

echo "New directory: $(pwd)"
echo "Files in directory:"
ls -la

echo "Starting Node.js script in background..."
# Check if server is already running
if pgrep -f "node server.js" > /dev/null; then
    echo "Server is already running"
else
    # Start the server in background
    nohup node server.js > server.log 2>&1 &
    SERVER_PID=$!
    echo "Server started with PID: $SERVER_PID"
    
    # Wait a moment for server to start
    sleep 2
    
    # Check if server is running
    if kill -0 $SERVER_PID 2>/dev/null; then
        echo "Server is running successfully"
    else
        echo "Server failed to start"
        cat server.log
    fi
fi

echo "=== SCRIPT END ==="
# Disable debugging
set +x
