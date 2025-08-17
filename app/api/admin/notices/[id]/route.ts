import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    if (!notice) {
      return NextResponse.json(
        { error: 'Notice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(notice)

  } catch (error) {
    console.error('Error fetching notice:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notice' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content, isUrgent, isPublished, publishDate, expiryDate } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const notice = await prisma.notice.update({
      where: { id: params.id },
      data: {
        title,
        content,
        isUrgent: isUrgent || false,
        isPublished: isPublished !== undefined ? isPublished : true,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(notice)

  } catch (error) {
    console.error('Error updating notice:', error)
    return NextResponse.json(
      { error: 'Failed to update notice' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.notice.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Notice deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting notice:', error)
    return NextResponse.json(
      { error: 'Failed to delete notice' },
      { status: 500 }
    )
  }
} 