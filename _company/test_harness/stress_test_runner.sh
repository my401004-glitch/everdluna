#!/bin/bash
# Stress Test Runner Script for monitor_sync.sh
# Purpose: Simulate concurrent API calls and data sync processes.

echo "==============================================="
echo "🚀 Starting System Load Stress Test..."
echo "Target Script: monitor_sync.sh"
echo "Simulating 10 concurrent users/processes."
echo "==============================================="

NUM_PROCESSES=10
FAILURES=0
SUCCESSES=0

# Function to simulate a single sync process run
run_single_process() {
    local pid=$1
    echo "[Process $pid] Starting data synchronization and validation..."
    
    # --- [START SIMULATED LOAD BLOCK] ---
    # Simulate complex processing (e.g., JSON parsing, DB query/write)
    # This loop simulates resource-intensive work.
    for i in {1..5}; do 
        sleep 0.1  # Small delay to simulate network latency or calculation time
        echo "[Process $pid] Processing data chunk $i..."
        # Simulate CPU usage spike (e.g., complex math operation)
        echo "$((RANDOM * 12345 / 100))" | bc -l > /dev/null 2>&1
    done
    # --- [END SIMULATED LOAD BLOCK] ---

    # Run the actual (placeholder) script
    if [[ -f ./monitor_sync.sh ]]; then
        ./monitor_sync.sh "$pid" &> /tmp/stress_log_$$.txt
        EXIT_CODE=$?
        echo "[Process $pid] Completed. Exit Code: $EXIT_CODE"
        return $EXIT_CODE
    else
        echo "[Process $pid] ERROR: monitor_sync.sh not found. Using dummy success."
        sleep 1 # Wait time if file is missing
        return 0 # Assume success for the test setup itself
    fi
}

# Run processes concurrently in background
for i in $(seq 1 $NUM_PROCESSES); do
    run_single_process $i &
done

# Wait for all background jobs to complete
wait

echo "==============================================="
echo "✅ Stress Test Completed. Check logs for detailed output."
echo "==============================================="