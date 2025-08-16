import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export async function createUser(email: string, name: string, password: string, role: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'STUDENT') {
  const hashedPassword = await hashPassword(password)
  
  return await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role
    }
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      class: true
    }
  })
} 