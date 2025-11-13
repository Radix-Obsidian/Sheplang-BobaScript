'use client'

import { useState } from 'react'
import { useDeploy } from '@/lib/hooks/useDeploy'
import { 
  Rocket, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Settings
} from 'lucide-react'

export function DeployButton() {
  const { 
    isDeploying, 
    success, 
    url, 
    error, 
    logs, 
    deploy, 
    reset 
  } = useDeploy()
  
  const [showConfig, setShowConfig] = useState(false)
  const [vercelToken, setVercelToken] = useState('')
  const [teamId, setTeamId] = useState('')

  const handleDeploy = async () => {
    await deploy({
      vercelToken: vercelToken || undefined,
      teamId: teamId || undefined
    })
  }

  const handleReset = () => {
    reset()
    setShowConfig(false)
  }

  if (success) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">Deployed successfully!</span>
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            View Live Site
          </a>
        )}
        <button
          onClick={handleReset}
          className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
        >
          Deploy Again
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded text-red-800">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Deployment failed</span>
        </div>
        <p className="text-xs text-muted-foreground px-3">{error}</p>
        <button
          onClick={handleReset}
          className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (isDeploying) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-blue-800">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Deploying...</span>
        </div>
        {logs.length > 0 && (
          <div className="max-h-32 overflow-y-auto bg-gray-50 border rounded p-2">
            {logs.map((log, idx) => (
              <p key={idx} className="text-xs text-gray-600 font-mono">
                {log}
              </p>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={handleDeploy}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm font-medium"
        >
          <Rocket className="h-4 w-4" />
          Deploy to Vercel
        </button>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          title="Configure deployment"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {showConfig && (
        <div className="p-3 border border-border rounded bg-card space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Vercel Token (optional)
            </label>
            <input
              type="password"
              value={vercelToken}
              onChange={(e) => setVercelToken(e.target.value)}
              placeholder="Leave empty to use server token"
              className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Team ID (optional)
            </label>
            <input
              type="text"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="team_..."
              className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Configure these settings or use environment variables on the server.
          </p>
        </div>
      )}
    </div>
  )
}
