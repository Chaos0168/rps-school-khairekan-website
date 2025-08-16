import fs from 'fs'
import path from 'path'
import { writeFile } from 'fs/promises'

export interface UploadResult {
  success: boolean
  fileUrl?: string
  fileName?: string
  fileSize?: number
  error?: string
}

export async function saveFile(file: File, uploadDir: string = 'uploads'): Promise<UploadResult> {
  try {
    // Create upload directory if it doesn't exist
    const uploadsPath = path.join(process.cwd(), 'public', uploadDir)
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = path.extname(file.name)
    const fileName = `${timestamp}_${randomString}${fileExtension}`
    const filePath = path.join(uploadsPath, fileName)

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file to disk
    await writeFile(filePath, buffer)

    return {
      success: true,
      fileUrl: `/${uploadDir}/${fileName}`,
      fileName: file.name,
      fileSize: file.size
    }
  } catch (error) {
    console.error('File upload error:', error)
    return {
      success: false,
      error: 'Failed to upload file'
    }
  }
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif'
  ]

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' }
  }

  return { valid: true }
}

export function deleteFile(fileUrl: string): boolean {
  try {
    const filePath = path.join(process.cwd(), 'public', fileUrl)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error('File deletion error:', error)
    return false
  }
} 