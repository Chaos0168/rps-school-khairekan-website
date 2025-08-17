import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')

    const whereCondition = classId ? { classId } : {}
    
    const terms = await prisma.term.findMany({
      where: whereCondition,
      orderBy: [
        { class: { order: 'asc' } },
        { order: 'asc' }
      ],
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

    return NextResponse.json(terms)

  } catch (error) {
    console.error('Error fetching terms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch terms' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, classId, order } = await request.json()

    if (!name || !classId || order === undefined) {
      return NextResponse.json(
        { error: 'Name, class ID, and order are required' },
        { status: 400 }
      )
    }

    // Check if order already exists for this class
    const existingTerm = await prisma.term.findFirst({
      where: { 
        classId,
        order 
      }
    })

    if (existingTerm) {
      return NextResponse.json(
        { error: 'A term with this order already exists for this class' },
        { status: 400 }
      )
    }

    const newTerm = await prisma.term.create({
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

    return NextResponse.json(newTerm, { status: 201 })

  } catch (error) {
    console.error('Error creating term:', error)
    return NextResponse.json(
      { error: 'Failed to create term' },
      { status: 500 }
    )
  }
} 