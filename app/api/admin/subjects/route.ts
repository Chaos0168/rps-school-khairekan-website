import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const termId = searchParams.get('termId')
    const classId = searchParams.get('classId')

    let whereCondition = {}
    if (termId) {
      whereCondition = { termId }
    } else if (classId) {
      whereCondition = { term: { classId } }
    }
    
    const subjects = await prisma.subject.findMany({
      where: whereCondition,
      orderBy: [
        { term: { class: { order: 'asc' } } },
        { term: { order: 'asc' } },
        { name: 'asc' }
      ],
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

    return NextResponse.json(subjects)

  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, code, termId } = await request.json()

    if (!name || !code || !termId) {
      return NextResponse.json(
        { error: 'Name, code, and term ID are required' },
        { status: 400 }
      )
    }

    // Check if code already exists for this term
    const existingSubject = await prisma.subject.findFirst({
      where: { 
        termId,
        code 
      }
    })

    if (existingSubject) {
      return NextResponse.json(
        { error: 'A subject with this code already exists for this term' },
        { status: 400 }
      )
    }

    const newSubject = await prisma.subject.create({
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

    return NextResponse.json(newSubject, { status: 201 })

  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
} 