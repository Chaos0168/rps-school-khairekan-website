import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, classId, order } = await request.json()

    if (!name || !classId || order === undefined) {
      return NextResponse.json(
        { error: 'Name, class ID, and order are required' },
        { status: 400 }
      )
    }

    // Check if order already exists for this class (excluding current term)
    const existingTerm = await prisma.term.findFirst({
      where: { 
        classId,
        order,
        id: { not: params.id }
      }
    })

    if (existingTerm) {
      return NextResponse.json(
        { error: 'A term with this order already exists for this class' },
        { status: 400 }
      )
    }

    const updatedTerm = await prisma.term.update({
      where: { id: params.id },
      data: {
        name,
        classId,
        order
      },
      include: {
        class: {
          select: { name: true, order: true }
        },
        _count: {
          select: {
            subjects: true
          }
        }
      }
    })

    return NextResponse.json(updatedTerm)

  } catch (error) {
    console.error('Error updating term:', error)
    return NextResponse.json(
      { error: 'Failed to update term' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if term has subjects
    const termWithRelations = await prisma.term.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            subjects: true
          }
        }
      }
    })

    if (!termWithRelations) {
      return NextResponse.json(
        { error: 'Term not found' },
        { status: 404 }
      )
    }

    if (termWithRelations._count.subjects > 0) {
      return NextResponse.json(
        { error: 'Cannot delete term with existing subjects. Please delete subjects first.' },
        { status: 400 }
      )
    }

    await prisma.term.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Term deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting term:', error)
    return NextResponse.json(
      { error: 'Failed to delete term' },
      { status: 500 }
    )
  }
} 