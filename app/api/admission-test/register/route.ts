import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const fullName = formData.get('fullName') as string
    const fathersName = formData.get('fathersName') as string
    const mothersName = formData.get('mothersName') as string
    const currentClass = formData.get('currentClass') as string
    const presentSchool = formData.get('presentSchool') as string
    const parentMobile = formData.get('parentMobile') as string
    const residentialAddress = formData.get('residentialAddress') as string
    const hasAppearedNTSE = formData.get('hasAppearedNTSE') === 'true'
    
    // Validate required fields
    if (!fullName || !fathersName || !mothersName || !currentClass || !presentSchool || !parentMobile || !residentialAddress) {
      return NextResponse.json({ message: 'All required fields must be filled' }, { status: 400 })
    }
    
    // Validate mobile number
    const mobileRegex = /^[6-9]\d{9}$/
    if (!mobileRegex.test(parentMobile)) {
      return NextResponse.json({ message: 'Please enter a valid 10-digit mobile number' }, { status: 400 })
    }
    
    // Handle file uploads
    const passportPhoto = formData.get('passportPhoto') as File
    const aadharPhoto = formData.get('aadharPhoto') as File
    
    if (!passportPhoto || !aadharPhoto) {
      return NextResponse.json({ message: 'Both passport photo and Aadhar card photo are required' }, { status: 400 })
    }
    
    // Validate file types
    if (!passportPhoto.type.startsWith('image/') || !aadharPhoto.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Please upload valid image files' }, { status: 400 })
    }
    
    // Validate file sizes (max 2MB for database storage)
    if (passportPhoto.size > 2 * 1024 * 1024 || aadharPhoto.size > 2 * 1024 * 1024) {
      return NextResponse.json({ message: 'File size must be less than 2MB for database storage' }, { status: 400 })
    }
    
    // Convert files to base64 for database storage
    const passportBuffer = Buffer.from(await passportPhoto.arrayBuffer())
    const aadharBuffer = Buffer.from(await aadharPhoto.arrayBuffer())
    
    const passportBase64 = `data:${passportPhoto.type};base64,${passportBuffer.toString('base64')}`
    const aadharBase64 = `data:${aadharPhoto.type};base64,${aadharBuffer.toString('base64')}`
    
    // Generate unique admit card ID
    const admitCardId = `ADM${Date.now().toString().slice(-8)}`
    
    // Save to database
    const registration = await prisma.admissionTestRegistration.create({
      data: {
        fullName,
        fathersName,
        mothersName,
        currentClass,
        presentSchool,
        parentMobile,
        residentialAddress,
        hasAppearedNTSE,
        passportPhoto: passportBase64,
        aadharPhoto: aadharBase64,
        admitCardId,
        status: 'PENDING'
      }
    })
    
    return NextResponse.json({
      message: 'Registration successful',
      admitCardId: registration.admitCardId,
      registrationId: registration.id
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
