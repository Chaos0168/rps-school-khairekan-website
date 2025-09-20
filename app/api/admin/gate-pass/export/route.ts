import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    let whereClause: any = {}
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate + 'T23:59:59.999Z')
      }
    }

    const gatePasses = await prisma.gatePass.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Convert to CSV format for Excel
    const headers = [
      'Date',
      'Time',
      'Student Name',
      'Class',
      'Gender',
      'Father\'s Name',
      'Village',
      'Accompanied By',
      'Reason',
      'Van Driver/Bus No',
      'Contact Number',
      'Dispersal Time',
      'Issuing Authority',
      'Created By'
    ]

    const rows = gatePasses.map(gatePass => [
      new Date(gatePass.createdAt).toLocaleDateString('en-IN'),
      new Date(gatePass.createdAt).toLocaleTimeString('en-IN'),
      gatePass.studentName,
      gatePass.className,
      gatePass.gender || '',
      gatePass.fathersName,
      gatePass.village || '',
      gatePass.accompaniedBy || '',
      gatePass.reason.replace(/_/g, ' '),
      gatePass.vanDriverName || gatePass.busNumber || '',
      gatePass.contactNumber,
      gatePass.dispersalTime || '',
      gatePass.issuingAuthorityName || '',
      gatePass.createdBy.name
    ])

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Return as downloadable CSV file (Excel compatible)
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="gate-passes-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error('Error exporting gate passes:', error)
    return NextResponse.json(
      { error: 'Failed to export gate passes' },
      { status: 500 }
    )
  }
}
