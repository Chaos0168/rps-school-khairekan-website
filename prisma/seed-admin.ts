import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedAdminData() {
  console.log('🌱 Seeding admin content...')

  try {
    // Get or create an admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      console.log('No admin user found, please run the main seed first')
      return
    }

    // Create sample notices
    const notices = [
      {
        title: 'Admission Test Schedule for 2025-26',
        content: 'The admission test for the academic year 2025-26 will be conducted on January 15, 2025. All interested candidates should register by January 10, 2025. The test will cover Mathematics, Science, and English for all classes.',
        isUrgent: true,
        isPublished: true,
        publishDate: new Date('2025-01-10'),
        expiryDate: new Date('2025-01-20'),
        createdById: adminUser.id
      },
      {
        title: 'Parent-Teacher Meeting Notice',
        content: 'A parent-teacher meeting is scheduled for January 20, 2025, from 10:00 AM to 4:00 PM. Parents are requested to meet their ward\'s class teacher to discuss academic progress and any concerns.',
        isUrgent: false,
        isPublished: true,
        publishDate: new Date('2025-01-15'),
        expiryDate: new Date('2025-01-25'),
        createdById: adminUser.id
      },
      {
        title: 'Annual Sports Day 2025',
        content: 'The Annual Sports Day will be celebrated on January 25, 2025. Various sports events and competitions will be held. All students are encouraged to participate. Parents are welcome to attend and cheer for their children.',
        isUrgent: false,
        isPublished: true,
        publishDate: new Date('2025-01-12'),
        expiryDate: new Date('2025-01-30'),
        createdById: adminUser.id
      }
    ]

    for (const notice of notices) {
      await prisma.notice.create({ data: notice })
    }

    // Create sample news
    const news = [
      {
        title: 'R.P. Sr. Sec. School Students Win State Science Fair',
        content: 'Our brilliant Class XII students, Arjun Sharma and Priya Gupta, dominated the State Science Fair held in Chandigarh. Their innovative project on renewable energy solutions impressed judges and earned them the first prize in the senior category. This achievement brings great pride to our school and showcases the quality of education we provide.',
        excerpt: 'Our brilliant Class XII students dominated the robotics category, showcasing innovation that left judges speechless...',
        isPublished: true,
        publishDate: new Date('2025-01-12'),
        createdById: adminUser.id
      },
      {
        title: 'Cutting-Edge Computer Lab Unveiled',
        content: 'We are proud to announce the inauguration of our state-of-the-art computer laboratory equipped with 50 high-performance computers, latest software, and interactive learning tools. This facility will enhance our students\' technological skills and prepare them for the digital future.',
        excerpt: 'Revolutionary computer lab with 50 advanced systems and AI capabilities now operational...',
        isPublished: true,
        publishDate: new Date('2025-01-10'),
        createdById: adminUser.id
      },
      {
        title: 'Teacher Training Program Success',
        content: 'Our dedicated faculty recently completed an intensive teacher training program focused on modern pedagogy and technology integration. This initiative ensures our teachers stay updated with the latest educational methodologies to provide the best learning experience for our students.',
        excerpt: 'All faculty completed advanced pedagogy training to enhance teaching methodologies...',
        isPublished: true,
        publishDate: new Date('2025-01-08'),
        createdById: adminUser.id
      }
    ]

    for (const newsItem of news) {
      await prisma.news.create({ data: newsItem })
    }

    // Create sample thoughts of the day
    const thoughts = [
      {
        quote: 'Education is the most powerful weapon which you can use to change the world.',
        author: 'Nelson Mandela',
        hindiQuote: 'शिक्षा सबसे शक्तिशाली हथियार है जिससे आप दुनिया बदल सकते हैं।',
        hindiAuthor: 'नेल्सन मंडेला',
        isActive: true,
        date: new Date(),
        createdById: adminUser.id
      },
      {
        quote: 'The beautiful thing about learning is that no one can take it away from you.',
        author: 'B.B. King',
        hindiQuote: 'सीखने की खूबसूरत बात यह है कि कोई भी इसे आपसे छीन नहीं सकता।',
        hindiAuthor: 'बी.बी. किंग',
        isActive: false,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        createdById: adminUser.id
      },
      {
        quote: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
        author: 'Mahatma Gandhi',
        hindiQuote: 'ऐसे जिएं जैसे कि आप कल मरने वाले हैं। ऐसे सीखें जैसे कि आप हमेशा जीने वाले हैं।',
        hindiAuthor: 'महात्मा गांधी',
        isActive: false,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Day before yesterday
        createdById: adminUser.id
      }
    ]

    for (const thought of thoughts) {
      await prisma.thoughtOfTheDay.create({ data: thought })
    }

    // Create some school settings
    const settings = [
      {
        key: 'school_name',
        value: 'R.P. Sr. Sec. School Khairekan',
        description: 'Official name of the school',
        category: 'general',
        updatedById: adminUser.id
      },
      {
        key: 'contact_phone',
        value: '+91 98765 43210',
        description: 'Primary contact phone number',
        category: 'contact',
        updatedById: adminUser.id
      },
      {
        key: 'contact_email',
        value: 'info@rpskhairekan.edu.in',
        description: 'Primary contact email address',
        category: 'contact',
        updatedById: adminUser.id
      },
      {
        key: 'school_address',
        value: 'R.P. Sr. Sec. School Campus, Khairekan, Haryana - 125055, Near Sirsa',
        description: 'Complete school address',
        category: 'contact',
        updatedById: adminUser.id
      },
      {
        key: 'admission_open',
        value: 'true',
        description: 'Whether admissions are currently open',
        category: 'admissions',
        updatedById: adminUser.id
      }
    ]

    for (const setting of settings) {
      await prisma.schoolSettings.upsert({
        where: { key: setting.key },
        update: setting,
        create: setting
      })
    }

    console.log('✅ Admin content seeded successfully!')
    console.log(`- Created ${notices.length} notices`)
    console.log(`- Created ${news.length} news articles`)
    console.log(`- Created ${thoughts.length} thoughts of the day`)
    console.log(`- Created ${settings.length} school settings`)

  } catch (error) {
    console.error('❌ Error seeding admin data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAdminData() 