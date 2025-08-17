import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const thoughts = await prisma.thoughtOfTheDay.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(thoughts)

  } catch (error) {
    console.error('Error fetching thoughts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thoughts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { quote, author, hindiQuote, hindiAuthor, isActive, date, createdById } = await request.json()

    if (!quote || !author || !createdById) {
      return NextResponse.json(
        { error: 'Quote, author, and creator ID are required' },
        { status: 400 }
      )
    }

    // If setting this thought as active, deactivate all others first
    if (isActive) {
      await prisma.thoughtOfTheDay.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      })
    }

    const thought = await prisma.thoughtOfTheDay.create({
      data: {
        quote,
        author,
        hindiQuote,
        hindiAuthor,
        isActive: isActive || false,
        date: date ? new Date(date) : new Date(),
        createdById
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(thought, { status: 201 })

  } catch (error) {
    console.error('Error creating thought:', error)
    return NextResponse.json(
      { error: 'Failed to create thought' },
      { status: 500 }
    )
  }
} 