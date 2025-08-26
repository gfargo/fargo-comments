import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { track } from '@vercel/analytics/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    
    // Sanitize the name to prevent path traversal
    const sanitizedName = name.replace(/[^a-zA-Z0-9-]/g, '')
    
    if (!sanitizedName) {
      return NextResponse.json(
        { error: 'Invalid component name' },
        { status: 400 }
      )
    }
    
    const filePath = path.join(process.cwd(), 'registry', 'r', `${sanitizedName}.json`)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      )
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const componentData = JSON.parse(fileContent)
    
    // Populate actual file content for each file
    const populatedFiles = componentData.files.map((file: any) => {
      // Extract the original source path from the target
      const sourcePath = file.target.replace('@/', '')
      const fullSourcePath = path.join(process.cwd(), sourcePath)
      
      let content = ''
      if (fs.existsSync(fullSourcePath)) {
        content = fs.readFileSync(fullSourcePath, 'utf-8')
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
    
    // Track component access
    await track('component_accessed', {
      component_name: sanitizedName,
      type: 'component_download',
      timestamp: Date.now()
    })
    
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error serving registry component:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}