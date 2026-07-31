-- --------------------------------------------
-- Migration: Add Error_Log Table (2026-07-31)
-- Purpose: To log all critical system failures, permission denials, and invalid user actions based on Funnel Flow Audit Map.
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS error_log (
    error_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,          -- Who caused the error? (FK to User table assumed)
    context_id VARCHAR(255),                -- Which process/record failed? (e.g., diagnosis_session_id)
    error_type VARCHAR(100) NOT NULL,       -- Classification of error (e.g., PERMISSION_DENIAL, PAYMENT_FAILED, INPUT_VALIDATION)
    error_code VARCHAR(50) UNIQUE NOT NULL, -- Specific code for programmatic handling (e.g., ERR_AUTH_001)
    message TEXT NOT NULL,                  -- Detailed user/system message
    stack_trace TEXT,                       -- Full stack trace for debugging
    severity VARCHAR(20) DEFAULT 'HIGH',    -- HIGH, MEDIUM, LOW
    is_resolved BOOLEAN DEFAULT FALSE,      -- Has the issue been fixed? (Manual tracking)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE error_log IS 'Logs all critical system and user-triggered errors to ensure auditable failure paths.';

-- Indexing for common lookups
CREATE INDEX idx_error_log_user_id ON error_log (user_id);
CREATE INDEX idx_error_log_context_id ON error_log (context_id);
CREATE INDEX idx_error_log_error_type ON error_log (error_type);

-- Add Foreign Key constraints (Assuming 'users' and 'diagnosis_sessions' tables exist)
ALTER TABLE error_log ADD CONSTRAINT fk_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
-- Note: Context ID might reference multiple tables, requiring careful FK definition later.

COMMIT;