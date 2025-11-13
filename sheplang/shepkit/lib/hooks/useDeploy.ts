'use client'

import { useState } from 'react'
import { useShepKitStore } from '@/lib/store'

export interface DeploymentOptions {
  vercelToken?: string
  teamId?: string
}

export interface DeploymentStatus {
  isDeploying: boolean
  success: boolean | null
  url: string | null
  deploymentId: string | null
  error: string | null
  logs: string[]
}

export function useDeploy() {
  const { activeProject } = useShepKitStore()
  const [status, setStatus] = useState<DeploymentStatus>({
    isDeploying: false,
    success: null,
    url: null,
    deploymentId: null,
    error: null,
    logs: []
  })

  const deploy = async (options: DeploymentOptions = {}) => {
    if (!activeProject) {
      setStatus(prev => ({
        ...prev,
        error: 'No active project to deploy',
        success: false
      }))
      return
    }

    setStatus({
      isDeploying: true,
      success: null,
      url: null,
      deploymentId: null,
      error: null,
      logs: ['Starting deployment...']
    })

    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: activeProject.name.toLowerCase().replace(/\s+/g, '-'),
          files: activeProject.files.map(f => ({
            name: f.name,
            content: f.content
          })),
          vercelToken: options.vercelToken,
          teamId: options.teamId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Deployment failed')
      }

      setStatus({
        isDeploying: false,
        success: true,
        url: data.url,
        deploymentId: data.deploymentId,
        error: null,
        logs: data.logs || []
      })

      return {
        success: true,
        url: data.url,
        deploymentId: data.deploymentId
      }
    } catch (error: any) {
      setStatus({
        isDeploying: false,
        success: false,
        url: null,
        deploymentId: null,
        error: error.message,
        logs: [error.message]
      })

      return {
        success: false,
        error: error.message
      }
    }
  }

  const reset = () => {
    setStatus({
      isDeploying: false,
      success: null,
      url: null,
      deploymentId: null,
      error: null,
      logs: []
    })
  }

  return {
    ...status,
    deploy,
    reset
  }
}
