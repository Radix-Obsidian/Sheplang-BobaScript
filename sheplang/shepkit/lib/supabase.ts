import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL not set')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY not set')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Database types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string | null
          name: string
          files: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          files: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          files?: any
          created_at?: string
          updated_at?: string
        }
      }
      ai_interactions: {
        Row: {
          id: string
          project_id: string | null
          type: string
          input: string
          output: string
          model_used: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          type: string
          input: string
          output: string
          model_used: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          type?: string
          input?: string
          output?: string
          model_used?: string
          created_at?: string
        }
      }
    }
  }
}
