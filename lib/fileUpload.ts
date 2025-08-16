import path from 'path'

export interface UploadResult {
  success: boolean
  fileUrl?: string
  fileName?: string
  fileSize?: number
  error?: string
}

export async function saveFile(file: File, uploadDir: string = 'uploads'): Promise<UploadResult> {
  try {
    // For Vercel deployment, we'll store file content as base64 data URL
    // This is a temporary solution - for production, use cloud storage like AWS S3, Cloudinary, etc.
    
    // Convert File to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = file.type
    const dataUrl = `data:${mimeType};base64,${base64}`

    // Generate unique filename for reference
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = path.extname(file.name)
    const fileName = `${timestamp}_${randomString}${fileExtension}`

    return {
      success: true,
      fileUrl: dataUrl, // Store as data URL for now
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
    // For data URLs stored in database, deletion is handled at the database level
    // For cloud storage, this would delete from the cloud service
    // Currently returning true as files are stored as data URLs in database
    return true
  } catch (error) {
    console.error('File deletion error:', error)
    return false
  }
} 