/**
 * @fileoverview Diagnosis Controller: Core logic for calculating the student's growth report and gap score depth.
 * Handles authorization, data fetching, and business logic execution (P0).
 */

import { Request, Response, NextFunction } from 'express';
import { dbClient } from '../../../../config/dbConnection'; // Assume this exists
import { IDiagnosisResult, UserRole, DiagnosisType } from '../../../models/types'; 

// --- [ CONSTANTS & UTILS ] ---
/**
 * Checks if the user has sufficient role to access a specific diagnosis type. (RBAC Check)
 * @param userId - The ID of the logged-in user.
 * @param requiredType - The Diagnosis Type that requires checking.
 * @returns boolean - True if authorized, false otherwise.
 */
const isUserAuthorized = async (userId: string, requiredType: DiagnosisType): Promise<boolean> => {
    // [TODO]: Implement complex DB query to check user's subscription level vs diagnosis type permissions.
    console.log(`[AUTH] Checking access for User ${userId} on Diagnosis Type: ${requiredType}`);
    if (requiredType === 'MONETIZATION_GAP') {
        // Example: Only users with 'Premium' role can see the monetization gap report.
        const userRole = await dbClient.query('SELECT role FROM users WHERE id = ?', [userId]);
        return userRole && userRole['role'] === 'PREMIUM'; 
    }
    return true; // Default pass for basic reports
};


// --- [ CORE CONTROLLER FUNCTION ] ---

/**
 * GET /api/v1/diagnosis_score
 * Calculates the comprehensive growth report and Gap Score Depth.
 * @param req - Express Request object (contains user ID, context ID).
 * @param res - Express Response object.
 */
export const getDiagnosisScore = async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.user?.id; // Assuming authentication middleware populates req.user
    const contextId: string = req.query.context_id as string; 

    if (!userId || !contextId) {
        return res.status(401).json({ message: "Authentication required or missing Context ID." });
    }

    try {
        // 1. Authorization Check (P0 - Phase 1)
        const canView = await isUserAuthorized(userId, 'MONETIZATION_GAP');
        if (!canView) {
            return res.status(403).json({ message: "Access Denied. Please upgrade your plan to view this report." });
        }

        // 2. Data Retrieval and Business Logic (P0 - Phase 2)
        const diagnosisResult = await calculateGapScoreDepth(userId, contextId);

        if (!diagnosisResult) {
            return res.status(404).json({ message: "Diagnosis results not found for this context." });
        }

        // 3. Success Response (P0 - Phase 3)
        return res.status(200).json({
            success: true,
            data: diagnosisResult
        });

    } catch (error) {
        console.error("Error processing diagnosis score:", error);
        // Log the full error stack trace for debugging purposes
        res.status(500).json({ message: "Internal server error while generating report." });
    }
};


/**
 * Private function to execute complex DB queries and calculate KPI-driven scores.
 * @param userId - The user ID for data filtering.
 * @param contextId - The context ID (e.g., course_id).
 * @returns Promise<IDiagnosisResult> - Structured diagnosis result object.
 */
const calculateGapScoreDepth = async (userId: string, contextId: string): Promise<IDiagnosisResult | null> => {
    console.log(`[LOGIC] Starting Gap Score calculation for User ${userId}...`);

    // STEP 1: Fetch historical data (Requires joining multiple tables)
    const [progressData, logData] = await Promise.all([
        dbClient.query(
            `SELECT * FROM user_progress WHERE user_id = ? AND context_id = ? ORDER BY date DESC LIMIT 5`,
            [userId, contextId]
        ),
        dbClient.query(
            `SELECT diagnosis_type, score, created_at FROM diagnosis_logs WHERE user_id = ? AND context_id = ? ORDER BY created_at ASC LIMIT 10`,
            [userId, contextId]
        )
    ]);

    if (progressData.length === 0 && logData.length === 0) {
        return null; // No data found
    }

    // STEP 2: Core Gap Score Calculation (Business Logic Implementation)
    const growthScore = calculateGrowth(progressData);
    const engagementScore = calculateEngagement(logData);
    const monetizationScore = calculateMonetizationGap(logData, progressData); // New logic here!

    // STEP 3: Structure the final result object based on schema.
    return {
        contextId: contextId,
        userId: userId,
        timestamp: new Date(),
        growthScore: growthScore,
        engagementScore: engagementScore,
        monetizationGap: monetizationScore, // This is the critical P0 metric!
        reportSummary: `[${contextId}] 종합 진단 완료. 현재 Gap Score Depth가 높습니다.`,
        // ... other necessary fields
    };
};

// --- [ PRIVATE CALCULATION HELPERS ] ---

const calculateGrowth = (data: any[]): number => {
    // Logic to compute Growth KPI based on user_progress data points
    return Math.floor(Math.random() * 50) + 30; // Mock value for now
};

const calculateEngagement = (data: any[]): number => {
    // Logic to compute Engagement KPI based on diagnosis_logs frequency/type
    return Math.floor(Math.random() * 40) + 10; // Mock value for now
};

/**
 * Calculates the monetization gap score, crucial for funnel conversion prediction.
 * @param logData - Diagnosis logs.
 * @param progressData - User progress data.
 * @returns number - The calculated Gap Score Depth (0 to 100).
 */
const calculateMonetizationGap = (logData: any[], progressData: any[]): number => {
    // Logic that compares current performance against 'Premium' expected benchmarks
    let baseScore = 50; // Base score
    
    if (progressData.length < 3) {
        baseScore -= 10; // Needs more activity to measure monetization potential
    } else if (logData.filter(l => l.diagnosis_type === 'MONETIZATION_GAP').length === 0) {
        // The Gap Score is high if the user hasn't encountered the premium module yet, but has shown sufficient base engagement.
        baseScore += 25; 
    }

    // Clamping the score between 0 and 100
    return Math.min(100, Math.max(0, baseScore));
};