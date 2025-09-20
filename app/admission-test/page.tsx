'use client'

import React, { useState } from 'react'
import { FiUpload, FiUser, FiPhone, FiMapPin, FiBook, FiHome, FiFileText, FiCheckCircle, FiDownload, FiArrowLeft } from 'react-icons/fi'

interface RegistrationData {
  fullName: string
  fathersName: string
  mothersName: string
  currentClass: string
  presentSchool: string
  parentMobile: string
  residentialAddress: string
  hasAppearedNTSE: boolean
  passportPhoto: File | null
  aadharPhoto: File | null
}

interface ValidationErrors {
  fullName?: string
  fathersName?: string
  mothersName?: string
  currentClass?: string
  presentSchool?: string
  parentMobile?: string
  residentialAddress?: string
  passportPhoto?: string
  aadharPhoto?: string
}

export default function AdmissionTestRegistration() {
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    fathersName: '',
    mothersName: '',
    currentClass: '',
    presentSchool: '',
    parentMobile: '',
    residentialAddress: '',
    hasAppearedNTSE: false,
    passportPhoto: null,
    aadharPhoto: null
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [admitCardId, setAdmitCardId] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})

  const classes = ['5TH', '6TH', '7TH', '8TH', '9TH', '10TH', '11TH']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'passportPhoto' | 'aadharPhoto') => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          [field]: 'Please upload a valid image file'
        }))
        return
      }
      
      // Validate file size (max 2MB for database storage)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [field]: 'File size must be less than 2MB'
        }))
        return
      }
      
      setFormData(prev => ({
        ...prev,
        [field]: file
      }))
      
      // Clear error
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required'
    if (!formData.fathersName.trim()) newErrors.fathersName = 'Father\'s Name is required'
    if (!formData.mothersName.trim()) newErrors.mothersName = 'Mother\'s Name is required'
    if (!formData.currentClass) newErrors.currentClass = 'Current Class is required'
    if (!formData.presentSchool.trim()) newErrors.presentSchool = 'Present School\'s Name is required'
    if (!formData.parentMobile.trim()) newErrors.parentMobile = 'Parent\'s Mobile Number is required'
    if (!formData.residentialAddress.trim()) newErrors.residentialAddress = 'Residential Address is required'
    if (!formData.passportPhoto) newErrors.passportPhoto = 'Passport size photo is required'
    if (!formData.aadharPhoto) newErrors.aadharPhoto = 'Aadhar card photo is required'
    
    // Validate mobile number
    const mobileRegex = /^[6-9]\d{9}$/
    if (formData.parentMobile && !mobileRegex.test(formData.parentMobile)) {
      newErrors.parentMobile = 'Please enter a valid 10-digit mobile number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('fullName', formData.fullName.toUpperCase())
      formDataToSend.append('fathersName', formData.fathersName.toUpperCase())
      formDataToSend.append('mothersName', formData.mothersName.toUpperCase())
      formDataToSend.append('currentClass', formData.currentClass)
      formDataToSend.append('presentSchool', formData.presentSchool)
      formDataToSend.append('parentMobile', formData.parentMobile)
      formDataToSend.append('residentialAddress', formData.residentialAddress)
      formDataToSend.append('hasAppearedNTSE', formData.hasAppearedNTSE.toString())
      
      if (formData.passportPhoto) {
        formDataToSend.append('passportPhoto', formData.passportPhoto)
      }
      if (formData.aadharPhoto) {
        formDataToSend.append('aadharPhoto', formData.aadharPhoto)
      }
      
      const response = await fetch('/api/admission-test/register', {
        method: 'POST',
        body: formDataToSend
      })
      
      if (response.ok) {
        const result = await response.json()
        setAdmitCardId(result.admitCardId)
        setIsSuccess(true)
      } else {
        const error = await response.json()
        alert(error.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadAdmitCard = () => {
    window.open(`/api/admission-test/admit-card/${admitCardId}`, '_blank')
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your admission test registration has been completed successfully. 
            Your admit card ID is: <span className="font-mono font-bold text-orange-600">{admitCardId}</span>
          </p>
          
          <div className="space-y-3">
            <button
              onClick={downloadAdmitCard}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <FiDownload className="w-5 h-5" />
              <span>Download Admit Card</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">RP</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admission Test Registration</h1>
          <p className="text-gray-600">R.P. Sr. Sec. School - Academic Year 2025-26</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <FiUser className="w-5 h-5 text-orange-600" />
                <span>Personal Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name (in capital letters) *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Name (in capital letters) *
                  </label>
                  <input
                    type="text"
                    name="fathersName"
                    value={formData.fathersName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.fathersName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter father's name"
                  />
                  {errors.fathersName && <p className="text-red-500 text-sm mt-1">{errors.fathersName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mother's Name (in capital letters) *
                  </label>
                  <input
                    type="text"
                    name="mothersName"
                    value={formData.mothersName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.mothersName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter mother's name"
                  />
                  {errors.mothersName && <p className="text-red-500 text-sm mt-1">{errors.mothersName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Class *
                  </label>
                  <select
                    name="currentClass"
                    value={formData.currentClass}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.currentClass ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  {errors.currentClass && <p className="text-red-500 text-sm mt-1">{errors.currentClass}</p>}
                </div>
              </div>
            </div>

            {/* School Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <FiHome className="w-5 h-5 text-orange-600" />
                <span>School Information</span>
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Present School's Name *
                </label>
                <input
                  type="text"
                  name="presentSchool"
                  value={formData.presentSchool}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.presentSchool ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your current school name"
                />
                {errors.presentSchool && <p className="text-red-500 text-sm mt-1">{errors.presentSchool}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <FiPhone className="w-5 h-5 text-orange-600" />
                <span>Contact Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent's Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="parentMobile"
                    value={formData.parentMobile}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.parentMobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                  />
                  {errors.parentMobile && <p className="text-red-500 text-sm mt-1">{errors.parentMobile}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Residential Address *
                  </label>
                  <textarea
                    name="residentialAddress"
                    value={formData.residentialAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.residentialAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your complete residential address"
                  />
                  {errors.residentialAddress && <p className="text-red-500 text-sm mt-1">{errors.residentialAddress}</p>}
                </div>
              </div>
            </div>

            {/* NTSE Experience */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <FiBook className="w-5 h-5 text-orange-600" />
                <span>Previous Experience</span>
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Have you appeared in NTSE before? *
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasAppearedNTSE"
                      checked={formData.hasAppearedNTSE === true}
                      onChange={() => setFormData(prev => ({ ...prev, hasAppearedNTSE: true }))}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasAppearedNTSE"
                      checked={formData.hasAppearedNTSE === false}
                      onChange={() => setFormData(prev => ({ ...prev, hasAppearedNTSE: false }))}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <FiUpload className="w-5 h-5 text-orange-600" />
                <span>Required Documents</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Size Photo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'passportPhoto')}
                      className="hidden"
                      id="passport-photo"
                    />
                    <label htmlFor="passport-photo" className="cursor-pointer">
                      <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.passportPhoto ? formData.passportPhoto.name : 'Click to upload passport photo'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Max 2MB, JPG/PNG</p>
                    </label>
                  </div>
                  {errors.passportPhoto && <p className="text-red-500 text-sm mt-1">{errors.passportPhoto}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Card Photo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'aadharPhoto')}
                      className="hidden"
                      id="aadhar-photo"
                    />
                    <label htmlFor="aadhar-photo" className="cursor-pointer">
                      <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.aadharPhoto ? formData.aadharPhoto.name : 'Click to upload Aadhar card photo'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Max 2MB, JPG/PNG</p>
                    </label>
                  </div>
                  {errors.aadharPhoto && <p className="text-red-500 text-sm mt-1">{errors.aadharPhoto}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <FiFileText className="w-5 h-5" />
                    <span>Submit Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
