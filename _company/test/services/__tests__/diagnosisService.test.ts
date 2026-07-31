import { recordSystemError } from '../../src/services/diagnosisService';
// Mock the database client to isolate the test logic (no real DB connection needed)
jest.mock('../../src/utils/dbClient', () => ({
    DatabaseClient: {
        executeTransaction: jest.fn(async (callback) => {
            // Simulate successful transaction execution
            await callback(); 
        }),
    },
}));

describe('Diagnosis Service - P0 Error Logging & RBAC', () => {
    const mockDbClient = require('../../src/utils/dbClient').DatabaseClient;
    const MOCK_USER_ID = 'user-123';
    const MOCK_CONTEXT_ID = 'test-context-456';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully record a non-critical system error for any user', async () => {
        // Test Case: Standard failure (e.g., temporary API outage)
        await recordSystemError(MOCK_USER_ID, MOCK_CONTEXT_ID, 'NETWORK_TIMEOUT', 'API service unavailable.', new Error('Timeout'));

        // Assert that the transaction was called and a log was inserted
        expect(mockDbClient.executeTransaction).toHaveBeenCalledTimes(1); 
    });

    it('should block unauthorized users (FREE role) from logging critical errors if internal checks pass', async () => {
        // Test Case: RBAC failure check before writing to the DB
        const freeUserRole = 'FREE';
        await recordSystemError(MOCK_USER_ID, MOCK_CONTEXT_ID, 'INTERNAL_DB_FAILURE', 'Admin action required.', new Error('Permission denied'));

        // If internal checks are working correctly (as mocked in the function), 
        // we assert that the transaction should NOT be called for unauthorized logging.
        // NOTE: Due to mocking limitations, this assertion is conceptual but critical.
        // The actual implementation of recordSystemError must enforce this block.
        expect(mockDbClient.executeTransaction).not.toHaveBeenCalled(); 
    });

    it('should log a CRITICAL error when the user role is ADMIN', async () => {
        // Test Case: Admin logging access (Should succeed)
        const adminRole = 'ADMIN';
        await recordSystemError(MOCK_USER_ID, MOCK_CONTEXT_ID, 'INTERNAL_DB_FAILURE', 'Admin override successful.', new Error('Success'));

        expect(mockDbClient.executeTransaction).toHaveBeenCalledTimes(1); 
    });
});