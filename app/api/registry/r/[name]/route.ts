import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
    
    return NextResponse.json(componentData)
  } catch (error) {
    console.error('Error serving registry component:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}