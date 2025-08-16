import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    const resourceId = params.resourceId

    // Check if resource exists
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: { quiz: true }
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // If it's a quiz, delete the quiz and questions first
    if (resource.quiz) {
      await prisma.question.deleteMany({
        where: { quizId: resource.quiz.id }
      })
      
      await prisma.quiz.delete({
        where: { id: resource.quiz.id }
      })
    }

    // Delete the resource
    await prisma.resource.delete({
      where: { id: resourceId }
    })

    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully'
    })

  } catch (error) {
    console.error('Resource deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
} 