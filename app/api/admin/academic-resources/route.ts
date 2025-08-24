import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    const resources = await prisma.academicResource.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching academic resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch academic resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      type,
      className,
      subject,
      year,
      fileUrl,
      fileName,
      fileSize,
      isPublished,
      createdById
    } = body

    if (!title || !type || !className || !subject || !createdById) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const resource = await prisma.academicResource.create({
      data: {
        title,
        description,
        type,
        className,
        subject,
        year,
        fileUrl,
        fileName,
        fileSize,
        isPublished: isPublished ?? true,
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

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error creating academic resource:', error)
    return NextResponse.json(
      { error: 'Failed to create academic resource' },
      { status: 500 }
    )
  }
} 