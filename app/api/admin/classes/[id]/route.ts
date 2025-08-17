import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, order } = await request.json()

    if (!name || order === undefined) {
      return NextResponse.json(
        { error: 'Name and order are required' },
        { status: 400 }
      )
    }

    // Check if order already exists (excluding current class)
    const existingClass = await prisma.class.findFirst({
      where: { 
        order,
        id: { not: params.id }
      }
    })

    if (existingClass) {
      return NextResponse.json(
        { error: 'A class with this order already exists' },
        { status: 400 }
      )
    }

    const updatedClass = await prisma.class.update({
      where: { id: params.id },
      data: {
        name,
        description,
        order
      },
      include: {
        _count: {
          select: {
            users: true,
            terms: true
          }
        }
      }
    })

    return NextResponse.json(updatedClass)

  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if class has users or terms
    const classWithRelations = await prisma.class.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            users: true,
            terms: true
          }
        }
      }
    })

    if (!classWithRelations) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    if (classWithRelations._count.users > 0 || classWithRelations._count.terms > 0) {
      return NextResponse.json(
        { error: 'Cannot delete class with existing students or terms. Please move students and delete terms first.' },
        { status: 400 }
      )
    }

    await prisma.class.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Class deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    )
  }
} 