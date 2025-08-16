import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      name: 'School Administrator',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  // Create teacher user
  const teacherPassword = await bcrypt.hash('teacher123', 12)
  
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      name: 'School Teacher',
      password: teacherPassword,
      role: 'TEACHER'
    }
  })

  // Create classes structure
  const classesData = [
    { name: 'Nursery', description: 'Foundation learning for early years', order: 1 },
    { name: 'LKG', description: 'Lower Kindergarten', order: 2 },
    { name: 'UKG', description: 'Upper Kindergarten', order: 3 },
    { name: 'Class I', description: 'Grade 1 - Beginning formal education', order: 4 },
    { name: 'Class II', description: 'Grade 2 - Building foundational skills', order: 5 },
    { name: 'Class III', description: 'Grade 3 - Expanding knowledge base', order: 6 },
    { name: 'Class IV', description: 'Grade 4 - Intermediate primary level', order: 7 },
    { name: 'Class V', description: 'Grade 5 - Advanced primary level', order: 8 },
    { name: 'Class VI', description: 'Grade 6 - Lower secondary education', order: 9 },
    { name: 'Class VII', description: 'Grade 7 - Middle school level', order: 10 },
    { name: 'Class VIII', description: 'Grade 8 - Pre-secondary level', order: 11 },
    { name: 'Class IX', description: 'Grade 9 - Secondary education begins', order: 12 },
    { name: 'Class X', description: 'Grade 10 - Board examination year', order: 13 },
    { name: 'Class XI', description: 'Grade 11 - Higher secondary first year', order: 14 },
    { name: 'Class XII', description: 'Grade 12 - Higher secondary final year', order: 15 }
  ]

  // Subject mappings by class level
  const subjectsByClass = {
    'Nursery': [
      { name: 'English', code: 'ENG-N' },
      { name: 'Mathematics', code: 'MAT-N' },
      { name: 'General Knowledge', code: 'GK-N' }
    ],
    'LKG': [
      { name: 'English', code: 'ENG-L' },
      { name: 'Mathematics', code: 'MAT-L' },
      { name: 'General Knowledge', code: 'GK-L' }
    ],
    'UKG': [
      { name: 'English', code: 'ENG-U' },
      { name: 'Mathematics', code: 'MAT-U' },
      { name: 'General Knowledge', code: 'GK-U' }
    ],
    'Class I': [
      { name: 'English', code: 'ENG-1' },
      { name: 'Mathematics', code: 'MAT-1' },
      { name: 'EVS', code: 'EVS-1' }
    ],
    'Class II': [
      { name: 'English', code: 'ENG-2' },
      { name: 'Mathematics', code: 'MAT-2' },
      { name: 'EVS', code: 'EVS-2' }
    ],
    'Class III': [
      { name: 'English', code: 'ENG-3' },
      { name: 'Mathematics', code: 'MAT-3' },
      { name: 'EVS', code: 'EVS-3' }
    ],
    'Class IV': [
      { name: 'English', code: 'ENG-4' },
      { name: 'Mathematics', code: 'MAT-4' },
      { name: 'EVS', code: 'EVS-4' },
      { name: 'Computer Science', code: 'CS-4' }
    ],
    'Class V': [
      { name: 'English', code: 'ENG-5' },
      { name: 'Mathematics', code: 'MAT-5' },
      { name: 'EVS', code: 'EVS-5' },
      { name: 'Computer Science', code: 'CS-5' }
    ],
    'Class VI': [
      { name: 'English', code: 'ENG-6' },
      { name: 'Mathematics', code: 'MAT-6' },
      { name: 'Science', code: 'SCI-6' },
      { name: 'Social Science', code: 'SST-6' },
      { name: 'Computer Science', code: 'CS-6' }
    ],
    'Class VII': [
      { name: 'English', code: 'ENG-7' },
      { name: 'Mathematics', code: 'MAT-7' },
      { name: 'Science', code: 'SCI-7' },
      { name: 'Social Science', code: 'SST-7' },
      { name: 'Computer Science', code: 'CS-7' },
      { name: 'Punjabi', code: 'PUN-7' }
    ],
    'Class VIII': [
      { name: 'English', code: 'ENG-8' },
      { name: 'Mathematics', code: 'MAT-8' },
      { name: 'Science', code: 'SCI-8' },
      { name: 'Social Science', code: 'SST-8' },
      { name: 'Computer Science', code: 'CS-8' },
      { name: 'Punjabi', code: 'PUN-8' }
    ],
    'Class IX': [
      { name: 'English', code: 'ENG-9' },
      { name: 'Mathematics', code: 'MAT-9' },
      { name: 'Science', code: 'SCI-9' },
      { name: 'Social Science', code: 'SST-9' },
      { name: 'Computer Science', code: 'CS-9' },
      { name: 'Punjabi', code: 'PUN-9' }
    ],
    'Class X': [
      { name: 'English', code: 'ENG-10' },
      { name: 'Mathematics', code: 'MAT-10' },
      { name: 'Science', code: 'SCI-10' },
      { name: 'Social Science', code: 'SST-10' },
      { name: 'Computer Science', code: 'CS-10' }
    ],
    'Class XI': [
      { name: 'English', code: 'ENG-11' },
      { name: 'Physics', code: 'PHY-11' },
      { name: 'Chemistry', code: 'CHE-11' },
      { name: 'Mathematics', code: 'MAT-11' },
      { name: 'Biology', code: 'BIO-11' },
      { name: 'Computer Science', code: 'CS-11' }
    ],
    'Class XII': [
      { name: 'English', code: 'ENG-12' },
      { name: 'Physics', code: 'PHY-12' },
      { name: 'Chemistry', code: 'CHE-12' },
      { name: 'Mathematics', code: 'MAT-12' },
      { name: 'Biology', code: 'BIO-12' },
      { name: 'Computer Science', code: 'CS-12' }
    ]
  }

  // Create classes with terms and subjects
  for (const classData of classesData) {
    console.log(`Creating class: ${classData.name}`)
    
    const schoolClass = await prisma.class.upsert({
      where: { name: classData.name },
      update: {},
      create: classData
    })

    // Create terms for each class
    const terms = ['Term 1', 'Term 2']
    
    for (let i = 0; i < terms.length; i++) {
      const termName = terms[i]
      console.log(`  Creating term: ${termName}`)
      
      const term = await prisma.term.upsert({
        where: { classId_name: { classId: schoolClass.id, name: termName } },
        update: {},
        create: {
          name: termName,
          classId: schoolClass.id,
          order: i + 1
        }
      })

      // Create subjects for this term
      const subjects = subjectsByClass[classData.name] || []
      
      for (const subjectData of subjects) {
        console.log(`    Creating subject: ${subjectData.name}`)
        
        await prisma.subject.upsert({
          where: { termId_code: { termId: term.id, code: subjectData.code } },
          update: {},
          create: {
            name: subjectData.name,
            code: subjectData.code,
            termId: term.id
          }
        })
      }
    }
  }

  console.log('✅ Database seeding completed!')
  console.log(`👤 Admin user: admin@school.com / admin123`)
  console.log(`👨‍🏫 Teacher user: teacher@school.com / teacher123`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 