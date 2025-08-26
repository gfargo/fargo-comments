import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    
    // Sanitize path segments to prevent path traversal
    const sanitizedSegments = pathSegments.map(segment => 
      segment.replace(/[^a-zA-Z0-9-_.]/g, '')
    ).filter(segment => segment.length > 0)
    
    if (sanitizedSegments.length === 0) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      )
    }
    
    const filePath = path.join(process.cwd(), ...sanitizedSegments)
    
    // Ensure the path is still within the project directory and specifically lib/
    const projectDir = path.join(process.cwd(), 'lib')
    const resolvedPath = path.resolve(filePath)
    const resolvedProjectDir = path.resolve(projectDir)
    
    // Only allow access to files under /lib/ directory
    if (!resolvedPath.startsWith(resolvedProjectDir)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    
    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }
    
    const stats = fs.statSync(resolvedPath)
    if (!stats.isFile()) {
      return NextResponse.json(
        { error: 'Not a file' },
        { status: 400 }
      )
    }
    
    const fileContent = fs.readFileSync(resolvedPath, 'utf-8')
    const ext = path.extname(resolvedPath)
    
    // Set appropriate content type
    let contentType = 'text/plain'
    if (ext === '.ts' || ext === '.tsx') {
      contentType = 'text/typescript'
    } else if (ext === '.js' || ext === '.jsx') {
      contentType = 'text/javascript'
    } else if (ext === '.json') {
      contentType = 'application/json'
    }
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error serving template file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}