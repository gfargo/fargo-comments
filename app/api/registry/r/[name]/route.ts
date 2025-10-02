import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Analytics } from '@/lib/analytics'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const startTime = Date.now()

  try {
    const { name } = await params

    // Sanitize the name to prevent path traversal
    const sanitizedName = name.replace(/[^a-zA-Z0-9-]/g, '')

    if (!sanitizedName) {
      await Analytics.trackError(
        'invalid_component_name',
        'Component name contains invalid characters',
        request,
        { component: name }
      )

      return NextResponse.json(
        { error: 'Invalid component name' },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), 'registry', 'r', `${sanitizedName}.json`)

    if (!fs.existsSync(filePath)) {
      // Track 404 for missing components
      await Analytics.trackComponentNotFound(sanitizedName, request)

      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      )
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const componentData = JSON.parse(fileContent)

    // Populate actual file content for each file
    let totalBytes = 0
    const populatedFiles = componentData.files.map((file: any) => {
      // Extract the original source path from the target
      const sourcePath = file.target.replace('@/', '')
      const fullSourcePath = path.join(process.cwd(), sourcePath)

      let content = ''
      if (fs.existsSync(fullSourcePath)) {
        content = fs.readFileSync(fullSourcePath, 'utf-8')
        totalBytes += Buffer.byteLength(content, 'utf-8')
      } else {
        // Track missing files
        Analytics.trackError(
          'file_not_found',
          `File not found: ${sourcePath}`,
          request,
          { component: sanitizedName }
        ).catch(console.error)
      }

      return {
        ...file,
        content
      }
    })

    const responseData = {
      ...componentData,
      files: populatedFiles
    }

    // Track component access with enhanced metadata
    await Analytics.trackComponentAccess(
      sanitizedName,
      request,
      {
        action: 'install',
        adapter: componentData.meta?.adapter,
      }
    )

    // Track registry access with detailed metadata
    await Analytics.trackRegistryAccess(
      'component_download',
      request,
      {
        component_name: sanitizedName,
        component_version: componentData.version,
        file_count: populatedFiles.length,
        dependency_count: componentData.dependencies?.length || 0,
      }
    )

    // Track performance metrics
    const loadTime = Date.now() - startTime
    await Analytics.trackPerformance(
      'component_load',
      loadTime,
      'ms',
      { component_name: sanitizedName }
    )

    // Track bundle size
    await Analytics.trackPerformance(
      'component_size',
      totalBytes,
      'bytes',
      { component_name: sanitizedName }
    )

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error serving registry component:', error)

    // Track error with details
    await Analytics.trackError(
      'component_server_error',
      error instanceof Error ? error.message : 'Unknown error',
      request,
      {
        component: name,
        stack_trace: error instanceof Error ? error.stack : undefined,
      }
    )

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}