'use client'

import React, { useState } from 'react'
import { FiX, FiUser, FiLock, FiEye, FiEyeOff, FiUserCheck, FiSettings } from 'react-icons/fi'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: { id: string; name: string; email: string; role: 'admin' | 'student' }) => void
}

// Mock user database - In real app, this would be backend API calls
const mockUsers = [
  {
    id: '1',
    email: 'admin@rpskhairekan.edu.in',
    password: 'admin123',
    name: 'Dr. Rajesh Kumar',
    role: 'admin' as const,
    designation: 'Principal'
  },
  {
    id: '2', 
    email: 'teacher@rpskhairekan.edu.in',
    password: 'teacher123',
    name: 'Mrs. Priya Sharma',
    role: 'admin' as const,
    designation: 'Mathematics Teacher'
  },
  {
    id: '3',
    email: 'student@rpskhairekan.edu.in', 
    password: 'student123',
    name: 'Arjun Patel',
    role: 'student' as const,
    class: 'Class X',
    rollNumber: 'RP2024001'
  },
  {
    id: '4',
    email: 'rahul.sharma@student.com',
    password: 'rahul123', 
    name: 'Rahul Sharma',
    role: 'student' as const,
    class: 'Class XII',
    rollNumber: 'RP2024002'
  }
]

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Find user in mock database
      const user = mockUsers.find(u => 
        u.email.toLowerCase() === formData.email.toLowerCase() && 
        u.password === formData.password &&
        u.role === loginType
      )

      if (user) {
        // Success
        onLogin({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        })
        
        // Reset form
        setFormData({ email: '', password: '', rememberMe: false })
        onClose()
      } else {
        setError('Invalid email or password. Please check your credentials.')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = (userEmail: string) => {
    const user = mockUsers.find(u => u.email === userEmail)
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        password: user.password
      }))
      setLoginType(user.role)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Login</h2>
            <p className="text-gray-600 text-xs sm:text-sm">Access your examination portal</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* Login Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6">
            <button
              type="button"
              onClick={() => setLoginType('student')}
              className={`flex-1 flex items-center justify-center py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all ${
                loginType === 'student'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiUser className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Student</span>
              <span className="xs:hidden">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 flex items-center justify-center py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all ${
                loginType === 'admin'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiSettings className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Admin/Teacher</span>
              <span className="xs:hidden">Admin</span>
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Demo Accounts (Click to use):</h4>
            <div className="space-y-1 sm:space-y-2">
              {loginType === 'admin' ? (
                <>
                                      <button
                      type="button"
                      onClick={() => quickLogin('admin@rpskhairekan.edu.in')}
                      className="w-full text-left p-2 sm:p-3 hover:bg-white rounded border text-xs transition-colors"
                    >
                      <div className="font-medium text-orange-600 text-xs sm:text-sm">Principal</div>
                      <div className="text-gray-600 text-xs truncate">admin@rpskhairekan.edu.in</div>
                    </button>
                  <button
                    type="button"
                    onClick={() => quickLogin('teacher@rpskhairekan.edu.in')}
                    className="w-full text-left p-2 hover:bg-white rounded border text-xs"
                  >
                    <div className="font-medium text-orange-600">Teacher</div>
                    <div className="text-gray-600">teacher@rpskhairekan.edu.in</div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => quickLogin('student@rpskhairekan.edu.in')}
                    className="w-full text-left p-2 hover:bg-white rounded border text-xs"
                  >
                    <div className="font-medium text-blue-600">Class X Student</div>
                    <div className="text-gray-600">student@rpskhairekan.edu.in</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => quickLogin('rahul.sharma@student.com')}
                    className="w-full text-left p-2 hover:bg-white rounded border text-xs"
                  >
                    <div className="font-medium text-blue-600">Class XII Student</div>
                    <div className="text-gray-600">rahul.sharma@student.com</div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                loginType === 'admin'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FiUserCheck className="mr-2" />
                  Login as {loginType === 'admin' ? 'Admin/Teacher' : 'Student'}
                </div>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By logging in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 