import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { fathersName: { contains: search, mode: 'insensitive' } },
        { mothersName: { contains: search, mode: 'insensitive' } },
        { presentSchool: { contains: search, mode: 'insensitive' } },
        { parentMobile: { contains: search } },
        { admitCardId: { contains: search } }
      ]
    }
    
    // Get registrations with pagination
    const [registrations, totalCount] = await Promise.all([
      prisma.admissionTestRegistration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.admissionTestRegistration.count({ where })
    ])
    
    // Get status counts
    const statusCounts = await prisma.admissionTestRegistration.groupBy({
      by: ['status'],
      _count: { status: true }
    })
    
    const statusCountsMap = statusCounts.reduce((acc, item) => {
      acc[item.status] = item._count.status
      return acc
    }, {} as Record<string, number>)
    
    return NextResponse.json({
      registrations,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      statusCounts: {
        PENDING: statusCountsMap.PENDING || 0,
        APPROVED: statusCountsMap.APPROVED || 0,
        REJECTED: statusCountsMap.REJECTED || 0,
        COMPLETED: statusCountsMap.COMPLETED || 0,
        TOTAL: totalCount
      }
    })
    
  } catch (error) {
    console.error('Error fetching admission test registrations:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    
    if (!id || !status) {
      return NextResponse.json({ message: 'ID and status are required' }, { status: 400 })
    }
    
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 })
    }
    
    const updatedRegistration = await prisma.admissionTestRegistration.update({
      where: { id },
      data: { status }
    })
    
    return NextResponse.json({
      message: 'Status updated successfully',
      registration: updatedRegistration
    })
    
  } catch (error) {
    console.error('Error updating registration status:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
