'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useShepKitStore } from '@/lib/store'
import type { ShepProject } from '@/lib/store'

export function useProjects() {
  const queryClient = useQueryClient()
  const { setActiveProject, loadProjects } = useShepKitStore()

  const {
    data: projects = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      return data.projects as ShepProject[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createProjectMutation = useMutation({
    mutationFn: async (project: { name: string; files?: any[] }) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      })
      if (!response.ok) {
        throw new Error('Failed to create project')
      }
      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setActiveProject(data.project)
    }
  })

  const updateProjectMutation = useMutation({
    mutationFn: async (project: ShepProject) => {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      })
      if (!response.ok) {
        throw new Error('Failed to update project')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete project')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  // Sync with store when projects change
  React.useEffect(() => {
    if (projects.length > 0) {
      loadProjects(projects)
    }
  }, [projects, loadProjects])

  return {
    projects,
    isLoading,
    error,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending
  }
}
