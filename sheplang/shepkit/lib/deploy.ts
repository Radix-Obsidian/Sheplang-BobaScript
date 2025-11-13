import { transpileShepToBoba } from '@adapters/sheplang-to-boba'

export interface DeploymentConfig {
  projectName: string
  files: Array<{ name: string; content: string }>
  vercelToken: string
  teamId?: string
}

export interface DeploymentResult {
  success: boolean
  url?: string
  deploymentId?: string
  error?: string
  logs?: string[]
}

export class DeployService {
  private vercelApiUrl = 'https://api.vercel.com'

  async deploy(config: DeploymentConfig): Promise<DeploymentResult> {
    const logs: string[] = []

    try {
      logs.push('Starting deployment process...')

      // Step 1: Transpile all .shep files to BobaScript
      logs.push('Transpiling ShepLang files...')
      const transpiledFiles = await this.transpileFiles(config.files)
      logs.push(`Transpiled ${transpiledFiles.length} files`)

      // Step 2: Create deployment payload
      logs.push('Building deployment payload...')
      const deploymentFiles = this.buildDeploymentFiles(transpiledFiles)

      // Step 3: Create deployment via Vercel API
      logs.push('Deploying to Vercel...')
      const deployment = await this.createVercelDeployment({
        name: config.projectName,
        files: deploymentFiles,
        token: config.vercelToken,
        teamId: config.teamId
      })

      logs.push('Deployment successful!')

      return {
        success: true,
        url: deployment.url,
        deploymentId: deployment.id,
        logs
      }
    } catch (error: any) {
      logs.push(`Error: ${error?.message || String(error)}`)
      return {
        success: false,
        error: error?.message || 'Deployment failed',
        logs
      }
    }
  }

  private async transpileFiles(files: Array<{ name: string; content: string }>) {
    const transpiled: Array<{ name: string; content: string; type: 'shep' | 'boba' }> = []

    for (const file of files) {
      if (file.name.endsWith('.shep')) {
        try {
          const result = await transpileShepToBoba(file.content)
          if (!result.success || !result.output) {
            const errors = result.diagnostics
              .filter(d => d.severity === 'error')
              .map(d => d.message)
              .join(', ')
            throw new Error(`Transpilation errors: ${errors}`)
          }
          transpiled.push({
            name: file.name.replace('.shep', '.js'),
            content: result.output,
            type: 'boba'
          })
        } catch (error: any) {
          throw new Error(`Failed to transpile ${file.name}: ${error?.message}`)
        }
      } else {
        transpiled.push({
          name: file.name,
          content: file.content,
          type: 'shep'
        })
      }
    }

    return transpiled
  }

  private buildDeploymentFiles(
    transpiledFiles: Array<{ name: string; content: string; type: 'shep' | 'boba' }>
  ) {
    const files: Array<{ file: string; data: string }> = []

    // Add package.json
    files.push({
      file: 'package.json',
      data: JSON.stringify({
        name: 'shepkit-deployment',
        version: '1.0.0',
        type: 'module',
        scripts: {
          start: 'node index.js'
        },
        dependencies: {}
      })
    })

    // Add index.js entry point
    const indexContent = `
// ShepKit Deployment Entry Point
console.log('ShepKit application running...');

// Import transpiled components
${transpiledFiles.map((f, i) => `import * as module${i} from './${f.name}';`).join('\n')}

// Export all modules
export { ${transpiledFiles.map((_, i) => `module${i}`).join(', ')} };
`

    files.push({
      file: 'index.js',
      data: indexContent
    })

    // Add all transpiled files
    for (const file of transpiledFiles) {
      files.push({
        file: file.name,
        data: file.content
      })
    }

    return files
  }

  private async createVercelDeployment(options: {
    name: string
    files: Array<{ file: string; data: string }>
    token: string
    teamId?: string
  }) {
    const url = options.teamId
      ? `${this.vercelApiUrl}/v13/deployments?teamId=${options.teamId}`
      : `${this.vercelApiUrl}/v13/deployments`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${options.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: options.name,
        files: options.files,
        projectSettings: {
          framework: null,
          buildCommand: null,
          installCommand: null
        },
        target: 'production'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Vercel deployment failed')
    }

    const data = await response.json()

    return {
      id: data.id,
      url: `https://${data.url}`
    }
  }
}
