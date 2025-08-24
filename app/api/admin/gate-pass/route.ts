import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyAuth } from '../../../../lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      studentName,
      className,
      gender,
      fathersName,
      village,
      accompaniedBy,
      reason,
      vanDriverName,
      busNumber,
      contactNumber,
      dispersalTime,
      studentImage,
      issuingAuthorityName,
      createdById
    } = body

    // Validate required fields
    if (!studentName || !className || !fathersName || !contactNumber || !createdById) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const gatePass = await prisma.gatePass.create({
      data: {
        studentName,
        className,
        gender,
        fathersName,
        village,
        accompaniedBy,
        reason,
        vanDriverName,
        busNumber,
        contactNumber,
        dispersalTime,
        studentImage,
        issuingAuthorityName,
        createdById
      }
    })

    return NextResponse.json(gatePass)
  } catch (error) {
    console.error('Error creating gate pass:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const date = searchParams.get('date') || ''

    const skip = (page - 1) * limit

    let whereClause: any = {}

    if (search) {
      whereClause.OR = [
        { studentName: { contains: search, mode: 'insensitive' } },
        { className: { contains: search, mode: 'insensitive' } },
        { fathersName: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      whereClause.createdAt = {
        gte: startDate,
        lt: endDate
      }
    }

    const [gatePasses, total] = await Promise.all([
      prisma.gatePass.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          createdBy: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.gatePass.count({ where: whereClause })
    ])

    return NextResponse.json({
      gatePasses,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching gate passes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 