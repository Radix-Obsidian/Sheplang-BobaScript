'use client'

import { useState } from 'react'
import { useProjects } from '@/lib/hooks/useProjects'
import { useShepKitStore } from '@/lib/store'
import { 
  FolderOpen, 
  Plus, 
  Loader2, 
  AlertCircle,
  Calendar,
  FileText
} from 'lucide-react'

export function ProjectManager() {
  const { 
    projects, 
    isLoading, 
    error, 
    createProject, 
    isCreating 
  } = useProjects()
  
  const { activeProject, setActiveProject } = useShepKitStore()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return

    createProject({
      name: newProjectName,
      files: [{
        id: `file_${Date.now()}`,
        name: 'App.shep',
        content: `component ${newProjectName.replace(/\s+/g, '')} {\n  "Welcome to ${newProjectName}"\n}`,
        path: '/App.shep'
      }]
    })

    setNewProjectName('')
    setShowCreateForm(false)
  }

  const handleSelectProject = (project: any) => {
    setActiveProject(project)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading projects...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div>
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-destructive">Failed to load projects</p>
          <p className="text-xs text-muted-foreground mt-1">
            Check your database connection
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Projects</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
          disabled={isCreating}
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New Project
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-4 p-3 border border-border rounded-lg bg-card">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
            placeholder="Project name..."
            className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim() || isCreating}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-8">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground mb-2">No projects yet</p>
          <p className="text-xs text-muted-foreground">Create your first project to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleSelectProject(project)}
              className={`
                p-3 rounded-lg border cursor-pointer transition-colors
                hover:bg-accent
                ${activeProject?.id === project.id 
                  ? 'border-primary bg-accent' 
                  : 'border-border'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>{project.files?.length || 0} files</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {activeProject?.id === project.id && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
