/**
 * @fileoverview Structured logging utility for consistent error and audit trail recording.
 * [WHY] Ensures all services log data in a machine-readable, queryable format (JSON).
 */

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogEntry {
    timestamp: string;       // ISO 8601 Format
    service: string;         // Source microservice name (e.g., diagnosis-api, payment-gateway)
    level: LogLevel;         // Severity level
    traceId: string;         // Unique ID for tracing a single request flow across services
    message: string;         // Human readable summary of the event
    details: Record<string, any>; // Structured data payload (e.g., user_id, failed_field)
}

/**
 * Logs an entry to the centralized logging service (e.g., Kafka/CloudWatch).
 * @param level The severity level of the log.
 * @param message A description of what happened.
 * @param details Structured key-value pairs providing context.
 */
export function logEvent(level: LogLevel, message: string, details: Record<string, any> = {}) {
    const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        service: "diagnosis-api", // Needs to be configurable per service
        level: level,
        traceId: details.traceId || 'N/A', // Must pass trace ID from the API gateway middleware
        message: message,
        details: details
    };

    // In a real environment, this would send data over an HTTP client or Kafka producer.
    console.log(JSON.stringify(entry)); 
}