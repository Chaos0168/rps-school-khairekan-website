import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { saveFile, validateFile } from '../../../../lib/fileUpload'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as 'SYLLABUS' | 'QUESTION_PAPER' | 'QUIZ'
    const subjectId = formData.get('subjectId') as string
    const uploadedById = formData.get('uploadedById') as string
    const file = formData.get('file') as File | null

    if (!title || !type || !subjectId || !uploadedById) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate that the subjectId exists in the database
    const subjectExists = await prisma.subject.findUnique({
      where: { id: subjectId }
    })

    if (!subjectExists) {
      return NextResponse.json(
        { error: `Subject with ID ${subjectId} not found. Please refresh the page and try again.` },
        { status: 400 }
      )
    }

    let fileUrl: string | null = null
    let fileName: string | null = null
    let fileSize: number | null = null
    let fileType: string | null = null

    // Handle file upload for non-quiz resources
    if (type !== 'QUIZ' && file) {
      const validation = validateFile(file)
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        )
      }

      const uploadResult = await saveFile(file)
      if (!uploadResult.success) {
        return NextResponse.json(
          { error: uploadResult.error },
          { status: 500 }
        )
      }

      fileUrl = uploadResult.fileUrl || null
      fileName = uploadResult.fileName || null
      fileSize = uploadResult.fileSize || null
      fileType = file.type
    }

    // Create resource in database
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        type,
        subjectId,
        uploadedById,
        fileUrl,
        fileName,
        fileSize,
        fileType,
        isPublished: true
      }
    })

    // Handle quiz creation
    if (type === 'QUIZ') {
      const duration = parseInt(formData.get('duration') as string || '30')
      const difficulty = formData.get('difficulty') as 'EASY' | 'MEDIUM' | 'HARD' || 'MEDIUM'
      const questionsData = formData.get('questions') as string

      if (questionsData) {
        const questions = JSON.parse(questionsData)
        
        const quiz = await prisma.quiz.create({
          data: {
            resourceId: resource.id,
            duration,
            difficulty,
            totalMarks: questions.length,
            passingMarks: Math.ceil(questions.length * 0.6),
            isActive: true
          }
        })

        // Create questions
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i]
          await prisma.question.create({
            data: {
              quizId: quiz.id,
              text: question.text,
              option1: question.options[0],
              option2: question.options[1],
              option3: question.options[2],
              option4: question.options[3],
              correctAnswer: question.correctAnswer + 1, // Convert 0-based to 1-based
              explanation: question.explanation,
              order: i + 1
            }
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      resource
    })

  } catch (error) {
    console.error('Resource upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload resource' },
      { status: 500 }
    )
  }
} 