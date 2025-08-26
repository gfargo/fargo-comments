import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const registryPath = path.join(process.cwd(), 'registry', 'registry.json')
    
    if (!fs.existsSync(registryPath)) {
      return NextResponse.json(
        { error: 'Registry not found' },
        { status: 404 }
      )
    }
    
    const registryContent = fs.readFileSync(registryPath, 'utf-8')
    const registry = JSON.parse(registryContent)
    
    return NextResponse.json(registry)
  } catch (error) {
    console.error('Error serving registry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}