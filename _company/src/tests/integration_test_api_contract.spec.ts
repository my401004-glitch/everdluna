// @ts-check
import { validateDataContract } from './dataContractValidator'; // <- Assuming this is the correct import path

// Mock API Request Body (The data structure we expect)
const mockValidDiagnosisData = {
    contextId: 'user-123',
    diagnosisType: 'Frequency Stability', // Mandatory field 1
    score: 85,                            // Mandatory field 2 (Number type expected)
    resultDetails: {                     // Complex object structure
        growthScore: 0.7,                 // Float/Number
        engagementGap: 4.5,              // Float/Number
        monetizationPotential: 'High'    // String enum/value check
    },
    timestamp: new Date().toISOString()
};

describe('API Data Contract Integration Test Suite', () => {
    
    it('✅ Should successfully validate a complete and correct diagnosis data contract (Happy Path)', async () => {
        // Act: Run the validator with perfect mock data
        const result = validateDataContract(mockValidDiagnosisData); 
        
        // Assert: Check that validation passes and returns expected structure
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it('❌ Should fail validation if a mandatory field (e.g., diagnosisType) is missing', async () => {
        // Arrange: Data missing the required 'diagnosisType' field
        const invalidDataMissingField = {
            contextId: 'user-123',
            score: 85,
            resultDetails: { growthScore: 0.7, engagementGap: 4.5, monetizationPotential: 'High' },
            timestamp: new Date().toISOString()
        };

        // Act: Run the validator with incomplete data
        const result = validateDataContract(invalidDataMissingField);
        
        // Assert: Check that validation fails and reports the specific missing field
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual(
            expect.objectContaining({ field: 'diagnosisType', message: 'Mandatory field is missing.' })
        );
    });

    it('🛑 Should fail validation if data types are incorrect (e.g., score should be number but receives string)', async () => {
        // Arrange: Data with an intentional type mismatch for 'score'
        const invalidDataType = {
            contextId: 'user-123',
            diagnosisType: 'Pitch Consistency', 
            score: "EightyFive", // <-- Intentional Type Error (String instead of Number)
            resultDetails: { growthScore: 0.7, engagementGap: 4.5, monetizationPotential: 'High' },
            timestamp: new Date().toISOString()
        };

        // Act: Run the validator with incorrect data types
        const result = validateDataContract(invalidDataType);
        
        // Assert: Check that validation fails and reports the type error
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual(
            expect.objectContaining({ field: 'score', message: 'Expected number, received string.' })
        );
    });

    it('📐 Should handle complex nested data validation for KPI metrics (Growth/Engagement)', async () => {
         // Arrange: Data where one of the deeply nested values is invalid (e.g., score outside expected range)
        const invalidNestedData = {
            contextId: 'user-123',
            diagnosisType: 'Pitch Consistency', 
            score: 85,
            resultDetails: { growthScore: 1.5, engagementGap: -10 }, // <-- Invalid range/negative value
            timestamp: new Date().toISOString()
        };

        // Act: Run the validator with invalid nested data
        const result = validateDataContract(invalidNestedData);
        
        // Assert: Check that validation fails and specifically points to the deep field failure
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual(
            expect.objectContaining({ field: 'resultDetails.engagementGap', message: 'Value must be non-negative.' })
        );
    });
});