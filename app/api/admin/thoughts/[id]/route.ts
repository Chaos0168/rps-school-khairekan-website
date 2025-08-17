import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const thought = await prisma.thoughtOfTheDay.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    if (!thought) {
      return NextResponse.json(
        { error: 'Thought not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(thought)

  } catch (error) {
    console.error('Error fetching thought:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thought' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { quote, author, hindiQuote, hindiAuthor, isActive, date } = await request.json()

    if (!quote || !author) {
      return NextResponse.json(
        { error: 'Quote and author are required' },
        { status: 400 }
      )
    }

    // If setting this thought as active, deactivate all others first
    if (isActive) {
      await prisma.thoughtOfTheDay.updateMany({
        where: { 
          isActive: true,
          id: { not: params.id }
        },
        data: { isActive: false }
      })
    }

    const thought = await prisma.thoughtOfTheDay.update({
      where: { id: params.id },
      data: {
        quote,
        author,
        hindiQuote,
        hindiAuthor,
        isActive: isActive || false,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(thought)

  } catch (error) {
    console.error('Error updating thought:', error)
    return NextResponse.json(
      { error: 'Failed to update thought' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.thoughtOfTheDay.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Thought deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting thought:', error)
    return NextResponse.json(
      { error: 'Failed to delete thought' },
      { status: 500 }
    )
  }
} 