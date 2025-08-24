import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    const resources = await prisma.academicResource.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching academic resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch academic resources' },
      { status: 500 }
    )
  }
} 