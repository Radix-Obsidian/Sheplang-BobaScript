-- Fix RLS policies for ShepKit Alpha
-- This migration allows anonymous project creation for the Alpha version

-- Update the model reference in ai_interactions
ALTER TABLE ai_interactions ALTER COLUMN model_used SET DEFAULT 'gpt-4o';

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Create more permissive policies for Alpha version
-- Allow anonymous users to create and manage projects using session_id

CREATE POLICY "Allow anonymous project access" ON projects
  FOR ALL USING (true);

-- For production, you would want to use proper authentication:
-- CREATE POLICY "Users can manage own projects" ON projects
--   FOR ALL USING (
--     auth.uid()::text = user_id 
--     OR user_id IS NULL 
--     OR user_id = ''
--   );

-- Update AI interactions policies to match
DROP POLICY IF EXISTS "Users can view own ai_interactions" ON ai_interactions;
DROP POLICY IF EXISTS "Users can insert own ai_interactions" ON ai_interactions;

CREATE POLICY "Allow anonymous ai_interactions access" ON ai_interactions
  FOR ALL USING (true);

-- Add a comment for future reference
COMMENT ON TABLE projects IS 'Projects table with permissive RLS for Alpha. Tighten security for production.';
