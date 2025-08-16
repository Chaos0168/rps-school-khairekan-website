import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { order: 'asc' },
      include: {
        terms: {
          orderBy: { order: 'asc' },
          include: {
            subjects: {
              include: {
                resources: {
                  where: { isPublished: true },
                  include: {
                    quiz: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      classes
    })

  } catch (error) {
    console.error('Classes fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
} 