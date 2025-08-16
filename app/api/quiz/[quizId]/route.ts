import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            text: true,
            option1: true,
            option2: true,
            option3: true,
            option4: true,
            marks: true,
            order: true
            // Don't include correctAnswer for security
          }
        },
        resource: {
          include: {
            subject: {
              include: {
                term: {
                  include: {
                    class: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      quiz
    })

  } catch (error) {
    console.error('Quiz fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
} 