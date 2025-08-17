import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, code, termId } = await request.json()

    if (!name || !code || !termId) {
      return NextResponse.json(
        { error: 'Name, code, and term ID are required' },
        { status: 400 }
      )
    }

    // Check if code already exists for this term (excluding current subject)
    const existingSubject = await prisma.subject.findFirst({
      where: { 
        termId,
        code,
        id: { not: params.id }
      }
    })

    if (existingSubject) {
      return NextResponse.json(
        { error: 'A subject with this code already exists for this term' },
        { status: 400 }
      )
    }

    const updatedSubject = await prisma.subject.update({
      where: { id: params.id },
      data: {
        name,
        code,
        termId
      },
      include: {
        term: {
          include: {
            class: {
              select: { name: true, order: true }
            }
          }
        },
        _count: {
          select: {
            resources: true
          }
        }
      }
    })

    return NextResponse.json(updatedSubject)

  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json(
      { error: 'Failed to update subject' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if subject has resources
    const subjectWithRelations = await prisma.subject.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            resources: true
          }
        }
      }
    })

    if (!subjectWithRelations) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      )
    }

    if (subjectWithRelations._count.resources > 0) {
      return NextResponse.json(
        { error: 'Cannot delete subject with existing resources. Please delete resources first.' },
        { status: 400 }
      )
    }

    await prisma.subject.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Subject deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json(
      { error: 'Failed to delete subject' },
      { status: 500 }
    )
  }
} 