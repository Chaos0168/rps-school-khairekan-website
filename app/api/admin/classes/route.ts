import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            users: true,
            terms: true
          }
        }
      }
    })

    return NextResponse.json(classes)

  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, order } = await request.json()

    if (!name || order === undefined) {
      return NextResponse.json(
        { error: 'Name and order are required' },
        { status: 400 }
      )
    }

    // Check if order already exists
    const existingClass = await prisma.class.findUnique({
      where: { order }
    })

    if (existingClass) {
      return NextResponse.json(
        { error: 'A class with this order already exists' },
        { status: 400 }
      )
    }

    const newClass = await prisma.class.create({
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

    return NextResponse.json(newClass, { status: 201 })

  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
} 