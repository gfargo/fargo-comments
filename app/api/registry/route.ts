import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Analytics } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const registryPath = path.join(process.cwd(), 'registry', 'registry.json')

    if (!fs.existsSync(registryPath)) {
      // Track 404 error
      await Analytics.trackError(
        'registry_not_found',
        'Registry file does not exist',
        request,
        { component: 'registry_index' }
      )

      return NextResponse.json(
        { error: 'Registry not found' },
        { status: 404 }
      )
    }

    const registryContent = fs.readFileSync(registryPath, 'utf-8')
    const registry = JSON.parse(registryContent)

    // Track registry access with enhanced metadata
    await Analytics.trackRegistryAccess(
      'registry_index',
      request,
      {
        file_count: Array.isArray(registry) ? registry.length : 0,
      }
    )

    // Track performance
    const loadTime = Date.now() - startTime
    await Analytics.trackPerformance(
      'registry_index_load',
      loadTime,
      'ms'
    )

    return NextResponse.json(registry)
  } catch (error) {
    console.error('Error serving registry:', error)

    // Track error
    await Analytics.trackError(
      'registry_server_error',
      error instanceof Error ? error.message : 'Unknown error',
      request,
      { component: 'registry_index' }
    )

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}