import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    // Get active notices (published and not expired)
    const notices = await prisma.notice.findMany({
      where: {
        isPublished: true,
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: new Date() } }
        ]
      },
      orderBy: { publishDate: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        publishDate: true,
        isUrgent: true
      }
    })

    // Get recent published news
    const news = await prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { publishDate: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        excerpt: true,
        publishDate: true
      }
    })

    // Get active thought of the day
    const thoughtOfTheDay = await prisma.thoughtOfTheDay.findFirst({
      where: { isActive: true },
      select: {
        id: true,
        quote: true,
        author: true,
        hindiQuote: true,
        hindiAuthor: true
      }
    })

    return NextResponse.json({
      notices,
      news,
      thoughtOfTheDay
    })

  } catch (error) {
    console.error('Error fetching public content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
} 