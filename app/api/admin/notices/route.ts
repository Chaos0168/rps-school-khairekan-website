import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(notices)

  } catch (error) {
    console.error('Error fetching notices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notices' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, isUrgent, isPublished, publishDate, expiryDate, createdById } = await request.json()

    if (!title || !content || !createdById) {
      return NextResponse.json(
        { error: 'Title, content, and creator ID are required' },
        { status: 400 }
      )
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        isUrgent: isUrgent || false,
        isPublished: isPublished !== undefined ? isPublished : true,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        createdById
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(notice, { status: 201 })

  } catch (error) {
    console.error('Error creating notice:', error)
    return NextResponse.json(
      { error: 'Failed to create notice' },
      { status: 500 }
    )
  }
} 