import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - List all projects  
export async function GET(request: NextRequest) {
  try {
    // For Alpha version, always return empty projects list since we use localStorage on client
    // This prevents RLS errors during development
    return NextResponse.json({ projects: [] })
    
    // Commented out Supabase integration for Alpha
    // const { data, error } = await supabase
    //   .from('projects')
    //   .select('*')
    //   .order('updated_at', { ascending: false })

    // if (error) {
    //   console.error('Supabase error:', error)
    //   return NextResponse.json({ projects: [] }) // Fallback to empty
    // }

    // return NextResponse.json({ projects: data || [] })
  } catch (error: any) {
    console.error('Projects GET error:', error)
    // Always return empty array for Alpha to avoid breaking the UI
    return NextResponse.json({ projects: [] })
  }
}

// POST - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    // For Alpha version, just return a mock project
    // Projects are managed via localStorage on the client
    const mockProject = {
      id: `project_${Date.now()}`,
      name: body.name,
      files: body.files || [],
      user_id: 'anonymous',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({ project: mockProject }, { status: 201 })
    
    // Commented out Supabase integration for Alpha
    // const newProject = {
    //   name: body.name,
    //   files: body.files || [],
    //   user_id: body.user_id || 'anonymous'
    // }

    // const { data, error } = await supabase
    //   .from('projects')
    //   .insert([newProject])
    //   .select()
    //   .single()

    // if (error) {
    //   console.error('Supabase error:', error)
    //   return NextResponse.json(
    //     { error: 'Failed to create project' },
    //     { status: 500 }
    //   )
    // }

    // return NextResponse.json({ project: data }, { status: 201 })
  } catch (error: any) {
    console.error('Projects POST error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create project' },
      { status: 500 }
    )
  }
}

// PUT - Update a project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const updates = {
      name: body.name,
      files: body.files,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ project: data })
  } catch (error: any) {
    console.error('Projects PUT error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Projects DELETE error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to delete project' },
      { status: 500 }
    )
  }
}
