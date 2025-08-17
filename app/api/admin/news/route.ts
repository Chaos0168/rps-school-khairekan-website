import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(news)

  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, excerpt, imageUrl, isPublished, publishDate, createdById } = await request.json()

    if (!title || !content || !createdById) {
      return NextResponse.json(
        { error: 'Title, content, and creator ID are required' },
        { status: 400 }
      )
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        excerpt,
        imageUrl,
        isPublished: isPublished !== undefined ? isPublished : true,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        createdById
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(news, { status: 201 })

  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
} 