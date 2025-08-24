import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
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
      isPublished
    } = body

    const resource = await prisma.academicResource.update({
      where: { id },
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
        isPublished
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
    console.error('Error updating academic resource:', error)
    return NextResponse.json(
      { error: 'Failed to update academic resource' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.academicResource.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Academic resource deleted successfully' })
  } catch (error) {
    console.error('Error deleting academic resource:', error)
    return NextResponse.json(
      { error: 'Failed to delete academic resource' },
      { status: 500 }
    )
  }
} 