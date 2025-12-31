-- Migration: Align database schema with application code
-- Date: 2025-12-31
--
-- This migration adds missing columns and updates constraints to match
-- what the application code expects.

-- ============================================
-- CONTESTANTS TABLE UPDATES
-- ============================================

-- Add city column to contestants (nominees have it, contestants should too)
ALTER TABLE contestants ADD COLUMN IF NOT EXISTS city TEXT;

-- Add phone column for contact info consistency
ALTER TABLE contestants ADD COLUMN IF NOT EXISTS phone TEXT;

-- ============================================
-- NOMINEES TABLE UPDATES
-- ============================================

-- Add phone column for contact info
ALTER TABLE nominees ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update nominated_by constraint to include 'admin' for manual entries
-- First drop the existing constraint, then add new one
ALTER TABLE nominees DROP CONSTRAINT IF EXISTS nominees_nominated_by_check;
ALTER TABLE nominees ADD CONSTRAINT nominees_nominated_by_check
  CHECK (nominated_by IN ('self', 'third_party', 'admin'));

-- Make email nullable for admin-added nominees from profiles without email
ALTER TABLE nominees ALTER COLUMN email DROP NOT NULL;

-- ============================================
-- COMPETITION_SETTINGS TABLE UPDATES
-- ============================================

-- Ensure competition_settings has all needed timeline fields
-- These should already exist but adding IF NOT EXISTS for safety
ALTER TABLE competition_settings ADD COLUMN IF NOT EXISTS nomination_start TIMESTAMPTZ;
ALTER TABLE competition_settings ADD COLUMN IF NOT EXISTS nomination_end TIMESTAMPTZ;
ALTER TABLE competition_settings ADD COLUMN IF NOT EXISTS voting_start TIMESTAMPTZ;
ALTER TABLE competition_settings ADD COLUMN IF NOT EXISTS voting_end TIMESTAMPTZ;
ALTER TABLE competition_settings ADD COLUMN IF NOT EXISTS finale_date TIMESTAMPTZ;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Add indexes for common query patterns (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_contestants_competition_id ON contestants(competition_id);
CREATE INDEX IF NOT EXISTS idx_contestants_user_id ON contestants(user_id);
CREATE INDEX IF NOT EXISTS idx_contestants_votes ON contestants(votes DESC);

CREATE INDEX IF NOT EXISTS idx_nominees_competition_id ON nominees(competition_id);
CREATE INDEX IF NOT EXISTS idx_nominees_user_id ON nominees(user_id);
CREATE INDEX IF NOT EXISTS idx_nominees_status ON nominees(status);

CREATE INDEX IF NOT EXISTS idx_votes_competition_id ON votes(competition_id);
CREATE INDEX IF NOT EXISTS idx_votes_contestant_id ON votes(contestant_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter_id ON votes(voter_id);

CREATE INDEX IF NOT EXISTS idx_voting_rounds_competition_id ON voting_rounds(competition_id);

-- ============================================
-- UPDATE TIMESTAMPS TRIGGER
-- ============================================

-- Create or replace function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at on tables that have the column
DO $$
BEGIN
    -- contestants
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_contestants_updated_at') THEN
        CREATE TRIGGER update_contestants_updated_at
            BEFORE UPDATE ON contestants
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- nominees
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_nominees_updated_at') THEN
        CREATE TRIGGER update_nominees_updated_at
            BEFORE UPDATE ON nominees
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- competitions
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_competitions_updated_at') THEN
        CREATE TRIGGER update_competitions_updated_at
            BEFORE UPDATE ON competitions
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- competition_settings
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_competition_settings_updated_at') THEN
        CREATE TRIGGER update_competition_settings_updated_at
            BEFORE UPDATE ON competition_settings
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN contestants.city IS 'City of the contestant (optional)';
COMMENT ON COLUMN contestants.phone IS 'Phone number for contact (optional)';
COMMENT ON COLUMN nominees.phone IS 'Phone number for contact (optional)';
COMMENT ON COLUMN nominees.nominated_by IS 'Source of nomination: self, third_party, or admin';
