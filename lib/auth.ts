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

export async function verifyAuth(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    // For now, we'll use a simple approach - in production you'd want proper JWT verification
    // This is a placeholder implementation
    const userData = JSON.parse(atob(token))
    return userData
  } catch (error) {
    return null
  }
} 