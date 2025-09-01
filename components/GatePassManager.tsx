'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FiPrinter, FiSave, FiX, FiDownload, FiList, FiPlus, FiCalendar, FiSearch } from 'react-icons/fi'

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
  issuingAuthorityName: string
}

interface StoredGatePass extends GatePass {
  id: string
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
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
    issuingAuthorityName: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [viewMode, setViewMode] = useState<'create' | 'list'>('create')
  const [gatePasses, setGatePasses] = useState<StoredGatePass[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (viewMode === 'list') {
      loadGatePasses()
    }
  }, [viewMode, pagination.page, searchTerm, dateFilter])

  const handleInputChange = (field: keyof GatePass, value: string) => {
    setGatePass(prev => ({ ...prev, [field]: value }))
  }

  const loadGatePasses = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(dateFilter && { date: dateFilter })
      })

      const response = await fetch(`/api/admin/gate-pass?${params}`)
      if (response.ok) {
        const data = await response.json()
        setGatePasses(data.gatePasses)
        setPagination(prev => ({
          ...prev,
          total: data.total,
          totalPages: data.totalPages
        }))
      } else {
        console.error('Failed to load gate passes')
      }
    } catch (error) {
      console.error('Error loading gate passes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportExcel = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (dateFilter) {
        params.set('startDate', dateFilter)
        params.set('endDate', dateFilter)
      } else {
        // Export last 30 days if no date filter
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        params.set('startDate', startDate.toISOString().split('T')[0])
        params.set('endDate', endDate.toISOString().split('T')[0])
      }

      const response = await fetch(`/api/admin/gate-pass/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `gate-passes-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        alert('Gate passes exported successfully!')
      } else {
        alert('Failed to export gate passes')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export gate passes')
    } finally {
      setIsLoading(false)
    }
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
        alert('Gate Pass created successfully!')
        setShowPreview(true)
        // Refresh the list if we're in list mode
        if (viewMode === 'list') {
          loadGatePasses()
        }
      } else {
        const error = await response.text()
        alert(`Error creating gate pass: ${error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating gate pass')
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
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 0; 
                  padding: 20px;
                  font-size: 12px;
                }
                .gate-pass-container {
                  width: 8.27in;
                  height: 5.83in;
                  border: 2px solid #000;
                  padding: 20px;
                  position: relative;
                  background: white;
                  margin: 0 auto;
                  display: flex;
                  flex-direction: column;
                }
                .header {
                  text-align: center;
                  margin-bottom: 15px;
                  border-bottom: 1px solid #000;
                  padding-bottom: 5px;
                }
                .school-name {
                  font-size: 14px;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .title {
                  font-size: 16px;
                  font-weight: bold;
                  text-decoration: underline;
                }
                .form-row {
                  display: flex;
                  margin-bottom: 8px;
                  align-items: center;
                }
                .label {
                  font-weight: bold;
                  min-width: 80px;
                  margin-right: 5px;
                }
                .value {
                  flex: 1;
                  border-bottom: 1px solid #000;
                  padding-left: 5px;
                  min-height: 16px;
                }
                .photo-box {
                  position: absolute;
                  top: 50px;
                  right: 10px;
                  width: 60px;
                  height: 80px;
                  border: 1px solid #000;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 8px;
                  background: #f0f0f0;
                }
                .reason-section {
                  margin: 10px 0;
                }
                .reason-option {
                  margin: 2px 0;
                  padding-left: 15px;
                }
                .checkbox {
                  display: inline-block;
                  width: 12px;
                  height: 12px;
                  border: 1px solid #000;
                  margin-right: 5px;
                  text-align: center;
                  line-height: 10px;
                  font-size: 8px;
                }
                .footer {
                  margin-top: 15px;
                  border-top: 1px solid #000;
                  padding-top: 5px;
                }
                .signature-line {
                  border-bottom: 1px solid #000;
                  margin-top: 20px;
                  padding-bottom: 5px;
                }
                @media print {
                  body { margin: 0; }
                  .gate-pass-container { 
                    width: 2.75in !important;
                    height: 4.5in !important;
                    border: 2px solid #000 !important;
                  }
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

  const GatePassPreview = () => (
    <div className="gate-pass-container" ref={printRef}>
      <div className="header">
        <div className="school-name">RP SR. SEC. SCHOOL, KAHIREKAN</div>
        <div className="title">GATE PASS</div>
      </div>

      <div className="form-content">
        <div className="form-row">
          <span className="label">DATE :</span>
          <span className="value">{new Date().toLocaleDateString('en-GB')}</span>
          <span className="label" style={{marginLeft: '10px'}}>TIME :</span>
          <span className="value">{new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit', second: '2-digit'})}</span>
        </div>

        <div className="form-row">
          <span className="label">NAME OF STUDENT</span>
          <span className="value">{gatePass.studentName}</span>
        </div>

        <div className="form-row">
          <span className="label">CLASS</span>
          <span className="value">{gatePass.className}</span>
          <span className="label" style={{marginLeft: '10px'}}>GENDER</span>
          <span className="value">{gatePass.gender}</span>
        </div>

                 <div className="form-row">
           <span className="label">FATHER'S NAME</span>
           <span className="value">{gatePass.fathersName}</span>
           <span className="label" style={{marginLeft: '15px'}}>VILLAGE</span>
           <span className="value">{gatePass.village}</span>
         </div>

         <div className="form-row">
           <span className="label">ACCOMPANIED BY</span>
           <span className="value">{gatePass.accompaniedBy}</span>
         </div>

         <div className="reason-section">
           <div className="reason-label">REASON</div>
           <div className="reason-option">
             <span className="checkbox">✓</span>
             {gatePass.reason === 'SICKNESS_DURING_SCHOOL_HOURS' ? 'SICKNESS DURING SCHOOL HOURS' : 
              gatePass.reason === 'URGENT_WORK_AT_HOME' ? 'URGENT WORK AT HOME' : 'PERSONAL'}
           </div>
         </div>

         <div className="form-row">
           <span className="label">VAN DRIVER'S NAME/BUS NO.</span>
           <span className="value">{gatePass.vanDriverName || gatePass.busNumber}</span>
         </div>

         <div className="form-row">
           <span className="label">CONTACT NO.</span>
           <span className="value">{gatePass.contactNumber}</span>
           <span className="label" style={{marginLeft: '15px'}}>DISPERSAL TIME</span>
           <span className="value">{gatePass.dispersalTime}</span>
         </div>

        
      </div>

      <div className="footer">
        <div className="form-row">
          <span className="label">CREATED BY :</span>
          <span className="value">{gatePass.issuingAuthorityName}</span>
        </div>
        
        <div style={{marginTop: '10px'}}>
          <div style={{fontWeight: 'bold', marginBottom: '5px'}}>PERMISSION GRANTED BY ISSUING AUTHORITY</div>
          <div className="form-row">
            <span className="label">NAME OF ISSUING AUTHORITY</span>
            <span className="value">{gatePass.issuingAuthorityName}</span>
          </div>
          <div className="signature-line">
            <div style={{fontSize: '10px', marginTop: '5px'}}>ISSUING AUTHORITY SIGNATURE</div>
          </div>
        </div>
      </div>
    </div>
  )

  // Gate Pass List View
  if (viewMode === 'list') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Gate Pass Records</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleExportExcel}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FiDownload className="w-4 h-4" />
                  Export Excel
                </button>
                <button
                  onClick={() => setViewMode('create')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  New Gate Pass
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FiX className="w-4 h-4" />
                  Close
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by student name, class, or father's name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FiSearch className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Filter</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FiCalendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setDateFilter('')
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Gate Pass Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Date/Time</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Class</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Father's Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Reason</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Contact</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="border border-gray-300 px-4 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                          Loading gate passes...
                        </div>
                      </td>
                    </tr>
                  ) : gatePasses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                        No gate passes found
                      </td>
                    </tr>
                  ) : (
                    gatePasses.map((gatePass) => (
                      <tr key={gatePass.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          <div>
                            <div className="font-medium">{new Date(gatePass.createdAt).toLocaleDateString('en-IN')}</div>
                            <div className="text-sm text-gray-500">{new Date(gatePass.createdAt).toLocaleTimeString('en-IN')}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">{gatePass.studentName}</td>
                        <td className="border border-gray-300 px-4 py-2">{gatePass.className}</td>
                        <td className="border border-gray-300 px-4 py-2">{gatePass.fathersName}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {gatePass.reason.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{gatePass.contactNumber}</td>
                        <td className="border border-gray-300 px-4 py-2">{gatePass.createdBy.name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

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
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FiPrinter className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FiX className="w-4 h-4" />
                  Back
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <GatePassPreview />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create Gate Pass</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FiList className="w-4 h-4" />
                View Records
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={gatePass.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class *
                  </label>
                  <select
                    value={gatePass.className}
                    onChange={(e) => handleInputChange('className', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Class</option>
                    <option value="NURSERY">NURSERY</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="1ST">1ST</option>
                    <option value="2ND">2ND</option>
                    <option value="3RD">3RD</option>
                    <option value="4TH">4TH</option>
                    <option value="5TH">5TH</option>
                    <option value="6TH">6TH</option>
                    <option value="7TH">7TH</option>
                    <option value="8TH">8TH</option>
                    <option value="9TH">9TH</option>
                    <option value="10TH">10TH</option>
                    <option value="11TH">11TH</option>
                    <option value="12TH">12TH</option>
                  </select>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Village
                  </label>
                  <input
                    type="text"
                    value={gatePass.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., KHAIREKAN"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Name *
                </label>
                <input
                  type="text"
                  value={gatePass.fathersName}
                  onChange={(e) => handleInputChange('fathersName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter father's name"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter companion name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <select
                  value={gatePass.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SICKNESS_DURING_SCHOOL_HOURS">Sickness During School Hours</option>
                  <option value="URGENT_WORK_AT_HOME">Urgent Work at Home</option>
                  <option value="PERSONAL">Personal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Van Driver's Name / Bus No.
                  </label>
                  <input
                    type="text"
                    value={gatePass.vanDriverName}
                    onChange={(e) => handleInputChange('vanDriverName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Driver name or bus number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={gatePass.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dispersal Time
                </label>
                <input
                  type="text"
                  value={gatePass.dispersalTime}
                  onChange={(e) => handleInputChange('dispersalTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 9.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Authority Name
                </label>
                <input
                  type="text"
                  value={gatePass.issuingAuthorityName}
                  onChange={(e) => handleInputChange('issuingAuthorityName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter authority name"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded flex items-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  {isLoading ? 'Creating...' : 'Create Gate Pass'}
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="border-l pl-6">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <GatePassPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


