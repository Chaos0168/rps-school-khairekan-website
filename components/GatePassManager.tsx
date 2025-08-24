'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FiCamera, FiPrinter, FiSave, FiX, FiRefreshCw } from 'react-icons/fi'

interface GatePass {
  id?: string
  studentName: string
  className: string
  gender: string
  fathersName: string
  village: string
  accompaniedBy: string
  reason: 'SICKNESS_DURING_SCHOOL_HOURS' | 'URGENT_WORK_AT_HOME' | 'PERSONAL'
  vanDriverName: string
  busNumber: string
  contactNumber: string
  dispersalTime: string
  studentImage: string
  issuingAuthorityName: string
}

interface GatePassManagerProps {
  onClose: () => void
  userId: string
}

export default function GatePassManager({ onClose, userId }: GatePassManagerProps) {
  const [gatePass, setGatePass] = useState<GatePass>({
    studentName: '',
    className: '',
    gender: '',
    fathersName: '',
    village: '',
    accompaniedBy: '',
    reason: 'SICKNESS_DURING_SCHOOL_HOURS',
    vanDriverName: '',
    busNumber: '',
    contactNumber: '',
    dispersalTime: '',
    studentImage: '',
    issuingAuthorityName: ''
  })

  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const startCamera = async () => {
    try {
      console.log('Starting camera...')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      })
      
      console.log('Camera stream obtained:', stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraActive(true)
        console.log('Camera active state set to true')
        
        // Set video ready immediately
        setTimeout(() => {
          setIsVideoReady(true)
          console.log('Video ready state set to true')
        }, 100)
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded')
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log('Video started playing')
              setIsVideoReady(true)
            }).catch(err => {
              console.error('Error playing video:', err)
            })
          }
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
    setIsVideoReady(false)
  }

  const captureImage = () => {
    console.log('Capturing image...')
    console.log('Video ref:', videoRef.current)
    console.log('Canvas ref:', canvasRef.current)
    
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight)
      console.log('Video ready state:', video.readyState)
      console.log('Video paused:', video.paused)
      
      if (context) {
        // Set canvas size to match video
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480
        
        try {
          context.drawImage(video, 0, 0)
          console.log('Image drawn to canvas successfully')
          
          const imageData = canvas.toDataURL('image/jpeg', 0.8)
          console.log('Image captured, data length:', imageData.length)
          
          if (imageData.length > 100) { // Basic validation
            setGatePass(prev => ({ ...prev, studentImage: imageData }))
            stopCamera()
            console.log('Image saved successfully')
          } else {
            console.error('Generated image data is too small')
          }
        } catch (error) {
          console.error('Error drawing image to canvas:', error)
        }
      } else {
        console.error('Could not get canvas context')
      }
    } else {
      console.error('Video or canvas ref not available')
      console.log('Video ref exists:', !!videoRef.current)
      console.log('Canvas ref exists:', !!canvasRef.current)
    }
  }

  const handleInputChange = (field: keyof GatePass, value: string) => {
    setGatePass(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!gatePass.studentName || !gatePass.className || !gatePass.fathersName) {
      alert('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/gate-pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...gatePass,
          createdById: userId
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setGatePass(prev => ({ ...prev, id: result.id }))
        setShowPreview(true)
      } else {
        throw new Error('Failed to create gate pass')
      }
    } catch (error) {
      console.error('Error creating gate pass:', error)
      alert('Failed to create gate pass. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Gate Pass - ${gatePass.studentName}</title>
              <style>
                @media print {
                  body { margin: 0; }
                  .gate-pass { 
                    width: 2.75in; 
                    height: 4.5in; 
                    margin: 0; 
                    padding: 0.25in;
                    font-family: Arial, sans-serif;
                    font-size: 10px;
                    line-height: 1.2;
                    page-break-after: always;
                  }
                  .no-print { display: none; }
                }
                .gate-pass {
                  width: 2.75in;
                  height: 4.5in;
                  border: 1px solid #000;
                  padding: 0.25in;
                  font-family: Arial, sans-serif;
                  font-size: 10px;
                  line-height: 1.2;
                  position: relative;
                }
                .header {
                  text-align: center;
                  font-weight: bold;
                  margin-bottom: 0.2in;
                }
                .school-name {
                  font-size: 12px;
                  margin-bottom: 0.1in;
                }
                .gate-pass-title {
                  font-size: 14px;
                  text-decoration: underline;
                  margin-bottom: 0.3in;
                }
                .field {
                  margin-bottom: 0.15in;
                }
                .field-label {
                  font-weight: bold;
                  display: inline-block;
                  width: 1.2in;
                }
                .field-value {
                  display: inline-block;
                  min-height: 0.15in;
                  border-bottom: 1px solid #000;
                  width: 1.3in;
                  text-align: center;
                }
                .reason-options {
                  margin: 0.1in 0;
                }
                .reason-option {
                  margin: 0.05in 0;
                }
                .reason-checkbox {
                  display: inline-block;
                  width: 0.1in;
                  height: 0.1in;
                  border: 1px solid #000;
                  margin-right: 0.05in;
                }
                .photo-box {
                  position: absolute;
                  top: 0.5in;
                  right: 0.25in;
                  width: 0.8in;
                  height: 1in;
                  border: 1px solid #000;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .signature-section {
                  margin-top: 0.3in;
                  text-align: center;
                }
                .signature-line {
                  width: 1.5in;
                  border-bottom: 1px solid #000;
                  margin: 0.1in auto;
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const resetForm = () => {
    setGatePass({
      studentName: '',
      className: '',
      gender: '',
      fathersName: '',
      village: '',
      accompaniedBy: '',
      reason: 'SICKNESS_DURING_SCHOOL_HOURS',
      vanDriverName: '',
      busNumber: '',
      contactNumber: '',
      dispersalTime: '',
      studentImage: '',
      issuingAuthorityName: ''
    })
    setShowPreview(false)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Debug effect to monitor state changes
  useEffect(() => {
    console.log('State changed - Camera Active:', isCameraActive, 'Video Ready:', isVideoReady)
  }, [isCameraActive, isVideoReady])

  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Gate Pass Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiPrinter className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={resetForm}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  New Pass
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FiX className="w-4 h-4" />
                  Close
                </button>
              </div>
            </div>

            <div ref={printRef} className="gate-pass bg-white border border-gray-300 mx-auto">
              <div className="header">
                <div className="school-name">RP SR. SEC. SCHOOL, KAHIREKAN</div>
                <div className="gate-pass-title">GATE PASS</div>
              </div>

              <div className="grid grid-cols-2 gap-x-4">
                <div className="field">
                  <span className="field-label">DATE :</span>
                  <span className="field-value">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="field">
                  <span className="field-label">TIME :</span>
                  <span className="field-value">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="field">
                <span className="field-label">NAME OF STUDENT</span>
                <span className="field-value">{gatePass.studentName}</span>
              </div>

              <div className="field">
                <span className="field-label">CLASS</span>
                <span className="field-value">{gatePass.className}</span>
              </div>

              <div className="field">
                <span className="field-label">GENDER</span>
                <span className="field-value">{gatePass.gender}</span>
              </div>

              <div className="field">
                <span className="field-label">FATHER'S NAME</span>
                <span className="field-value">{gatePass.fathersName}</span>
              </div>

              <div className="field">
                <span className="field-label">VILLAGE</span>
                <span className="field-value">{gatePass.village}</span>
              </div>

              <div className="field">
                <span className="field-label">ACCOMPANIED BY</span>
                <span className="field-value">{gatePass.accompaniedBy}</span>
              </div>

              <div className="field">
                <span className="field-label">REASON</span>
                <div className="reason-options">
                  <div className="reason-option">
                    <span className="reason-checkbox">
                      {gatePass.reason === 'SICKNESS_DURING_SCHOOL_HOURS' ? '✓' : ''}
                    </span>
                    SICKNESS DURING SCHOOL HOURS
                  </div>
                  <div className="reason-option">
                    <span className="reason-checkbox">
                      {gatePass.reason === 'URGENT_WORK_AT_HOME' ? '✓' : ''}
                    </span>
                    URGENT WORK AT HOME
                  </div>
                  <div className="reason-option">
                    <span className="reason-checkbox">
                      {gatePass.reason === 'PERSONAL' ? '✓' : ''}
                    </span>
                    PERSONAL
                  </div>
                </div>
              </div>

              <div className="field">
                <span className="field-label">VAN DRIVER'S NAME/BUS NO.</span>
                <span className="field-value">{gatePass.vanDriverName || gatePass.busNumber}</span>
              </div>

              <div className="field">
                <span className="field-label">CONTACT NO.</span>
                <span className="field-value">{gatePass.contactNumber}</span>
              </div>

              <div className="field">
                <span className="field-label">DISPERSAL TIME</span>
                <span className="field-value">{gatePass.dispersalTime}</span>
              </div>

              <div className="photo-box">
                {gatePass.studentImage ? (
                  <img 
                    src={gatePass.studentImage} 
                    alt="Student" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-500">Photo</span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="field">
                <span className="field-label">CREATED BY :</span>
                <span className="field-value">{gatePass.issuingAuthorityName}</span>
              </div>
              
              <div className="signature-section">
                <div className="font-bold mb-2">PERMISSION GRANTED BY ISSUING AUTHORITY</div>
                <div className="field">
                  <span className="field-label">NAME OF ISSUING AUTHORITY</span>
                  <span className="field-value">{gatePass.issuingAuthorityName}</span>
                </div>
                <div className="signature-line">
                  <div className="text-xs mt-1">ISSUING AUTHORITY SIGNATURE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create Gate Pass</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <div className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={gatePass.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class *
                  </label>
                  <input
                    type="text"
                    value={gatePass.className}
                    onChange={(e) => handleInputChange('className', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter class"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gatePass.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father's Name *
                  </label>
                  <input
                    type="text"
                    value={gatePass.fathersName}
                    onChange={(e) => handleInputChange('fathersName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter father's name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Village
                  </label>
                  <input
                    type="text"
                    value={gatePass.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter village"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accompanied By
                  </label>
                  <input
                    type="text"
                    value={gatePass.accompaniedBy}
                    onChange={(e) => handleInputChange('accompaniedBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Who is accompanying"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <select
                  value={gatePass.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="SICKNESS_DURING_SCHOOL_HOURS">Sickness During School Hours</option>
                  <option value="URGENT_WORK_AT_HOME">Urgent Work at Home</option>
                  <option value="PERSONAL">Personal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Van Driver's Name
                  </label>
                  <input
                    type="text"
                    value={gatePass.vanDriverName}
                    onChange={(e) => handleInputChange('vanDriverName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Driver name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bus Number
                  </label>
                  <input
                    type="text"
                    value={gatePass.busNumber}
                    onChange={(e) => handleInputChange('busNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Bus number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={gatePass.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dispersal Time
                  </label>
                  <input
                    type="text"
                    value={gatePass.dispersalTime}
                    onChange={(e) => handleInputChange('dispersalTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Dispersal time"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Authority Name
                </label>
                <input
                  type="text"
                  value={gatePass.issuingAuthorityName}
                  onChange={(e) => handleInputChange('issuingAuthorityName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Authority name"
                />
              </div>
            </div>

            {/* Camera Section */}
            <div className="space-y-6">
              {/* Student Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {/* Debug info */}
                  <div className="text-xs text-blue-500 mb-2">
                    Debug: Camera Active = {isCameraActive ? 'TRUE' : 'FALSE'} | Has Image = {gatePass.studentImage ? 'TRUE' : 'FALSE'}
                  </div>
                  
                  {!isCameraActive && !gatePass.studentImage && (
                    <button
                      onClick={startCamera}
                      className="w-full h-32 flex items-center justify-center text-gray-500 hover:text-gray-700"
                    >
                      <FiCamera className="w-8 h-8 mr-2" />
                      Click to capture photo
                    </button>
                  )}
                  
                  {/* Always show this when camera should be active */}
                  {isCameraActive && (
                    <div className="space-y-3">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-48 object-cover rounded border border-gray-300"
                        style={{ backgroundColor: '#000' }}
                      />
                      
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => {
                            console.log('Capture button clicked!')
                            captureImage()
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
                        >
                          📸 Capture Photo
                        </button>
                        
                        <button
                          onClick={stopCamera}
                          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                      
                      <p className="text-center text-sm text-gray-600">Position yourself in the camera and click "Capture Photo"</p>
                    </div>
                  )}
                  
                  {/* Force show buttons for testing */}
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        console.log('Force camera active clicked')
                        setIsCameraActive(true)
                      }}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded text-sm"
                    >
                      🔧 Force Show Camera Buttons (Test)
                    </button>
                  </div>
                  
                  {gatePass.studentImage && !isCameraActive && (
                    <div className="relative">
                      <img
                        src={gatePass.studentImage}
                        alt="Student"
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        onClick={() => setGatePass(prev => ({ ...prev, studentImage: '' }))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Create Gate Pass
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 