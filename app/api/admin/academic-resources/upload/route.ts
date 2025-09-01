import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const className = formData.get('className') as string
    const subject = formData.get('subject') as string
    const year = formData.get('year') as string
    const isPublished = formData.get('isPublished') === 'true'
    const createdById = formData.get('createdById') as string
    const file = formData.get('file') as File

    if (!title || !type || !className || !subject || !createdById) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Convert file to base64 for storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileUrl = `data:${file.type};base64,${buffer.toString('base64')}`

    // Create the academic resource
    const resource = await prisma.academicResource.create({
      data: {
        title,
        description,
        type: type as any,
        className,
        subject,
        year,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        isPublished,
        createdById
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      resource
    })
  } catch (error) {
    console.error('Error uploading academic resource:', error)
    return NextResponse.json(
      { error: 'Failed to upload academic resource' },
      { status: 500 }
    )
  }
}
