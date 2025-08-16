import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { quizId, userId, answers, timeSpent } = await request.json()

    if (!quizId || !userId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Calculate score
    let score = 0
    const questionAnswers = []

    for (const questionId in answers) {
      const question = quiz.questions.find(q => q.id === questionId)
      if (question) {
        const selectedAnswer = answers[questionId]
        const isCorrect = selectedAnswer === question.correctAnswer
        const marksAwarded = isCorrect ? question.marks : 0
        
        score += marksAwarded

        questionAnswers.push({
          questionId,
          selectedAnswer,
          isCorrect,
          marksAwarded
        })
      }
    }

    const percentage = (score / quiz.totalMarks) * 100

    // Create quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        totalMarks: quiz.totalMarks,
        percentage,
        timeSpent,
        isCompleted: true,
        completedAt: new Date()
      }
    })

    // Create answers
    for (const answer of questionAnswers) {
      await prisma.answer.create({
        data: {
          questionId: answer.questionId,
          quizAttemptId: quizAttempt.id,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect,
          marksAwarded: answer.marksAwarded
        }
      })
    }

    // Get detailed results with correct answers
    const detailedResults = await prisma.quizAttempt.findUnique({
      where: { id: quizAttempt.id },
      include: {
        answers: {
          include: {
            question: true
          }
        },
        quiz: {
          include: {
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
        }
      }
    })

    return NextResponse.json({
      success: true,
      result: detailedResults
    })

  } catch (error) {
    console.error('Quiz submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    )
  }
} 