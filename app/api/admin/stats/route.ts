import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get counts for dashboard stats
    const [
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalResources,
      totalQuizzes,
      activeNotices,
      recentNews,
      activeThoughts
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.resource.count({ where: { isPublished: true } }),
      prisma.quiz.count({ where: { isActive: true } }),
      prisma.notice.count({ 
        where: { 
          isPublished: true,
          OR: [
            { expiryDate: null },
            { expiryDate: { gte: new Date() } }
          ]
        }
      }),
      prisma.news.count({ 
        where: { 
          isPublished: true,
          publishDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      }),
      prisma.thoughtOfTheDay.count({ where: { isActive: true } })
    ])

    const stats = {
      totalStudents,
      totalTeachers: totalTeachers + totalAdmins,
      totalResources,
      totalQuizzes,
      activeNotices,
      recentNews
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
} 