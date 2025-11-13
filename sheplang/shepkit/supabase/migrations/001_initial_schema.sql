-- ShepKit Database Schema
-- This migration creates the initial tables for ShepKit Alpha

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id text,
  name text NOT NULL,
  files jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI interactions table
CREATE TABLE ai_interactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('explain', 'generate', 'debug')),
  input text NOT NULL,
  output text NOT NULL,
  model_used text NOT NULL DEFAULT 'gpt-4-turbo-preview',
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_updated_at ON projects(updated_at DESC);
CREATE INDEX idx_ai_interactions_project_id ON ai_interactions(project_id);
CREATE INDEX idx_ai_interactions_created_at ON ai_interactions(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Projects: Users can only access their own projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid()::text = user_id);

-- AI Interactions: Users can only access interactions for their projects
CREATE POLICY "Users can view own ai_interactions" ON ai_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = ai_interactions.project_id 
      AND projects.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own ai_interactions" ON ai_interactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = ai_interactions.project_id 
      AND projects.user_id = auth.uid()::text
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO projects (user_id, name, files) VALUES 
(
  'demo-user',
  'My First ShepKit Project',
  '[
    {
      "id": "file_1",
      "name": "App.shep",
      "content": "component App {\n  \"MyTodos\"\n}",
      "path": "/App.shep"
    }
  ]'::jsonb
);
