import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { admitCardId: string } }
) {
  try {
    const { admitCardId } = params
    
    // Find the registration
    const registration = await prisma.admissionTestRegistration.findUnique({
      where: { admitCardId }
    })
    
    if (!registration) {
      return NextResponse.json({ message: 'Admit card not found' }, { status: 404 })
    }
    
    // Generate HTML for the admit card
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admit Card - ${registration.fullName}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%);
                min-height: 100vh;
                padding: 20px;
            }
            
            .admit-card {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
                border: 3px solid #f97316;
            }
            
            .header {
                background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
                color: white;
                padding: 30px;
                text-align: center;
                position: relative;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }
            
            .school-logo {
                width: 80px;
                height: 80px;
                background: white;
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                font-weight: bold;
                color: #f97316;
                position: relative;
                z-index: 1;
            }
            
            .school-name {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
                position: relative;
                z-index: 1;
            }
            
            .school-tagline {
                font-size: 16px;
                opacity: 0.9;
                position: relative;
                z-index: 1;
            }
            
            .admit-title {
                font-size: 24px;
                font-weight: bold;
                margin-top: 20px;
                position: relative;
                z-index: 1;
            }
            
            .content {
                padding: 40px;
            }
            
            .student-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 40px;
            }
            
            .info-section h3 {
                color: #f97316;
                font-size: 18px;
                margin-bottom: 20px;
                border-bottom: 2px solid #f97316;
                padding-bottom: 5px;
            }
            
            .info-item {
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }
            
            .info-label {
                font-weight: bold;
                color: #374151;
                min-width: 120px;
                margin-right: 10px;
            }
            
            .info-value {
                color: #6b7280;
                flex: 1;
            }
            
            .photo-section {
                text-align: center;
                margin: 30px 0;
            }
            
            .photo-placeholder {
                width: 120px;
                height: 150px;
                border: 2px dashed #d1d5db;
                border-radius: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: #9ca3af;
                font-size: 14px;
                margin: 0 10px;
            }
            
            .instructions {
                background: #fef3e2;
                border: 2px solid #f97316;
                border-radius: 15px;
                padding: 25px;
                margin-top: 30px;
            }
            
            .instructions h3 {
                color: #f97316;
                font-size: 18px;
                margin-bottom: 15px;
            }
            
            .instructions ul {
                list-style: none;
                padding-left: 0;
            }
            
            .instructions li {
                margin-bottom: 8px;
                padding-left: 20px;
                position: relative;
            }
            
            .instructions li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #f97316;
                font-weight: bold;
            }
            
            .footer {
                background: #f3f4f6;
                padding: 20px;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
            }
            
            .admit-id {
                background: #f97316;
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-weight: bold;
                font-size: 16px;
                display: inline-block;
                margin: 20px 0;
            }
            
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
                
                .admit-card {
                    box-shadow: none;
                    border: 2px solid #000;
                }
            }
        </style>
    </head>
    <body>
        <div class="admit-card">
            <div class="header">
                <div class="school-logo">RP</div>
                <div class="school-name">R.P. Sr. Sec. School</div>
                <div class="school-tagline">Excellence in Education Since 1995</div>
                <div class="admit-title">ADMISSION TEST ADMIT CARD</div>
            </div>
            
            <div class="content">
                <div class="admit-id">
                    Admit Card ID: ${registration.admitCardId}
                </div>
                
                <div class="student-info">
                    <div class="info-section">
                        <h3>Student Details</h3>
                        <div class="info-item">
                            <span class="info-label">Name:</span>
                            <span class="info-value">${registration.fullName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Father's Name:</span>
                            <span class="info-value">${registration.fathersName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Mother's Name:</span>
                            <span class="info-value">${registration.mothersName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Class:</span>
                            <span class="info-value">${registration.currentClass}</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>School & Contact</h3>
                        <div class="info-item">
                            <span class="info-label">Present School:</span>
                            <span class="info-value">${registration.presentSchool}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Mobile:</span>
                            <span class="info-value">${registration.parentMobile}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Address:</span>
                            <span class="info-value">${registration.residentialAddress}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">NTSE Experience:</span>
                            <span class="info-value">${registration.hasAppearedNTSE ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="photo-section">
                    <div class="flex justify-center space-x-8">
                        <div class="text-center">
                            <div class="text-sm font-medium text-gray-500 mb-2">Passport Photo</div>
                            ${registration.passportPhoto ? 
                                `<img src="${registration.passportPhoto}" alt="Passport Photo" class="w-24 h-30 object-cover rounded-lg border border-gray-300 mx-auto" />` : 
                                '<div class="w-24 h-30 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-xs">No Photo</div>'
                            }
                        </div>
                        <div class="text-center">
                            <div class="text-sm font-medium text-gray-500 mb-2">Aadhar Card</div>
                            ${registration.aadharPhoto ? 
                                `<img src="${registration.aadharPhoto}" alt="Aadhar Card" class="w-24 h-30 object-cover rounded-lg border border-gray-300 mx-auto" />` : 
                                '<div class="w-24 h-30 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-xs">No Photo</div>'
                            }
                        </div>
                    </div>
                </div>
                
                <div class="instructions">
                    <h3>Important Instructions</h3>
                    <ul>
                        <li>Report to the examination center 30 minutes before the scheduled time</li>
                        <li>Bring this admit card and a valid photo ID</li>
                        <li>Carry your own pen, pencil, and eraser</li>
                        <li>Mobile phones and electronic devices are strictly prohibited</li>
                        <li>Follow all COVID-19 safety protocols</li>
                        <li>Contact the school office for any queries</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>R.P. Sr. Sec. School</strong> | Phone: +91-XXXX-XXXXXX | Email: info@rpschool.edu.in</p>
                <p>Generated on: ${new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</p>
            </div>
        </div>
    </body>
    </html>
    `
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="admit-card-${admitCardId}.html"`
      }
    })
    
  } catch (error) {
    console.error('Admit card generation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
