/**
 * @file Manages core diagnosis logic and ensures system stability by integrating error logging.
 */

import { DatabaseClient } from '../utils/dbClient';
// Assume these types are defined elsewhere
export type UserRole = 'FREE' | 'PREMIUM' | 'ADMIN'; 
export interface DiagnosisResult { /* ... structure of results ... */ }

/**
 * Attempts to run the diagnosis and logs any failure encountered.
 * @param userId The ID of the user attempting the service call.
 * @param contextId Unique identifier for this specific attempt/session.
 * @param role User's current subscription role (for RBAC check).
 * @returns DiagnosisResult object or throws a controlled Error.
 */
export async function runDiagnosis(userId: string, contextId: string, role: UserRole): Promise<DiagnosisResult> {
    try {
        // 1. Core Business Logic Simulation (e.g., API call to calculate score)
        const result = await simulateCoreCalculation();

        // 2. Success path - nothing needs logging unless critical metric changes.
        return result;

    } catch (error: any) {
        // --- [P0 Error Handling & RBAC Enforcement] ---
        let finalError: Error;
        if (this.isAccessDenied(role, error)) { 
             // Role-Based Access Control Check: If the error is due to insufficient rights, don't log sensitive details publicly.
            finalError = new Error("Unauthorized access or insufficient subscription level.");
            await recordSystemError(userId, contextId, 'AUTH_FAIL_403', finalError.message, error);

        } else {
            // Standard Error Logging: Log everything for internal debugging.
            finalError = error;
            await recordSystemError(userId, contextId, 'SYSTEM_ERROR', `${error.name}: ${error.message}`, error);
        }
        throw finalError; // Re-throw a controlled exception
    }
}

/**
 * Records detailed system errors into the dedicated log table.
 * MUST be implemented as a transaction to ensure atomic write. [근거: 코다리 개인 메모리]
 */
async function recordSystemError(userId: string, contextId: string, errorCode: string, message: string, originalError: any): Promise<void> {
    const dbClient = new DatabaseClient(); // Assume singleton DB client access

    // Check RBAC before logging sensitive errors (e.g., only ADMIN can log 'CRITICAL' severity)
    if (errorCode === 'INTERNAL_DB_FAILURE' && role !== 'ADMIN') { 
        console.warn("Attempted to log critical error without admin rights.");
        return; // Block unauthorized logging attempts
    }

    await dbClient.executeTransaction(async (tx) => {
        // Insert the log record
        await tx.query(`INSERT INTO error_logs (user_id, context_id, severity, error_code, error_message, stack_trace, is_handled) VALUES ($1, $2, 'ERROR', $3, $4, $5, FALSE)`, 
            [userId, contextId, errorCode, message, originalError.stack || null]);

        // Optional: Trigger an alert/webhook here for CRITICAL errors
    });
}


/**
 * Mocks the core calculation and returns a result structure.
 */
async function simulateCoreCalculation(): Promise<DiagnosisResult> {
    // Simulate network latency or complex computation
    await new Promise(resolve => setTimeout(resolve, 50));
    return { /* ... data structure ... */ };
}

/**
 * Mocks the RBAC check logic.
 */
function isAccessDenied(role: UserRole, error: any): boolean {
    // Detailed checking based on specific API calls and role requirements
    if (error.message?.includes("premium_content")) return true; 
    return false;
}

// Exporting for testing purposes
export { recordSystemError };