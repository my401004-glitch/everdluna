-- --------------------------------------------
-- Migration for A/B Test Tracking (v2)
-- Date: 2026-07-17
-- Description: Adds tracking columns for marketing attribution and A/B testing results to Diagnosis_Results.
-- --------------------------------------------

BEGIN;

-- 1. Add the AB Test Group column to track which campaign group exposed the user (A vs B).
ALTER TABLE Diagnosis_Results
ADD COLUMN ab_test_group VARCHAR(50) NULL COMMENT 'Attribution of A/B test group: e.g., A_EMO, B_DATA';

-- 2. Add a flag to track successful conversion during this session.
ALTER TABLE Diagnosis_Results
ADD COLUMN conversion_flag BOOLEAN DEFAULT FALSE COMMENT 'True if the user completed the target action (e.g., demo sign-up)';

-- 3. Indexing: Create an index on ab_test_group for faster reporting queries.
CREATE INDEX idx_diagnosis_ab_test ON Diagnosis_Results (ab_test_group);


COMMIT;