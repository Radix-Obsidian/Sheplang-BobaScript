import { NextRequest, NextResponse } from 'next/server'
import { DeployService } from '@/lib/deploy'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.projectName || !body.files || !Array.isArray(body.files)) {
      return NextResponse.json(
        { error: 'Project name and files are required' },
        { status: 400 }
      )
    }

    // Get Vercel token from environment or request
    const vercelToken = process.env.VERCEL_TOKEN || body.vercelToken

    if (!vercelToken) {
      return NextResponse.json(
        { error: 'Vercel token not configured. Please set VERCEL_TOKEN environment variable.' },
        { status: 400 }
      )
    }

    const deployService = new DeployService()

    const result = await deployService.deploy({
      projectName: body.projectName,
      files: body.files,
      vercelToken,
      teamId: body.teamId
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, logs: result.logs },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      deploymentId: result.deploymentId,
      logs: result.logs
    })
  } catch (error: any) {
    console.error('Deploy error:', error)
    return NextResponse.json(
      { error: error?.message || 'Deployment failed' },
      { status: 500 }
    )
  }
}
