import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        terms: {
          include: {
            subjects: {
              include: {
                resources: {
                  include: {
                    uploadedBy: {
                      select: {
                        name: true,
                        email: true
                      }
                    },
                    quiz: {
                      include: {
                        questions: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    })

    return NextResponse.json({ success: true, classes })
  } catch (error) {
    console.error('Classes fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
} 