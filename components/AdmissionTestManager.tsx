'use client'

import React, { useState, useEffect } from 'react'
import { FiEye, FiDownload, FiSearch, FiFilter, FiRefreshCw, FiCheck, FiX, FiClock, FiUser, FiPhone, FiMapPin, FiBook, FiHome } from 'react-icons/fi'

interface Registration {
  id: string
  fullName: string
  fathersName: string
  mothersName: string
  currentClass: string
  presentSchool: string
  parentMobile: string
  residentialAddress: string
  hasAppearedNTSE: boolean
  passportPhoto?: string
  aadharPhoto?: string
  admitCardId: string
  registrationDate: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

interface StatusCounts {
  PENDING: number
  APPROVED: number
  REJECTED: number
  COMPLETED: number
  TOTAL: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AdmissionTestManager() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    COMPLETED: 0,
    TOTAL: 0
  })
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadRegistrations()
  }, [pagination.page, statusFilter, searchTerm])

  const loadRegistrations = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: statusFilter,
        search: searchTerm
      })
      
      const response = await fetch(`/api/admin/admission-test?${params}`)
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations)
        setStatusCounts(data.statusCounts)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error loading registrations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/admission-test', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status })
      })
      
      if (response.ok) {
        loadRegistrations()
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const downloadAdmitCard = (admitCardId: string) => {
    window.open(`/api/admission-test/admit-card/${admitCardId}`, '_blank')
  }

  const downloadImage = (base64Data: string, filename: string) => {
    const link = document.createElement('a')
    link.href = base64Data
    link.download = `${filename}-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <FiClock className="w-4 h-4" />
      case 'APPROVED': return <FiCheck className="w-4 h-4" />
      case 'REJECTED': return <FiX className="w-4 h-4" />
      case 'COMPLETED': return <FiCheck className="w-4 h-4" />
      default: return <FiClock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admission Test Registrations</h2>
          <p className="text-gray-600">Manage and track admission test registrations</p>
        </div>
        <button
          onClick={loadRegistrations}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: statusCounts.TOTAL, color: 'gray' },
          { label: 'Pending', value: statusCounts.PENDING, color: 'yellow' },
          { label: 'Approved', value: statusCounts.APPROVED, color: 'green' },
          { label: 'Rejected', value: statusCounts.REJECTED, color: 'red' },
          { label: 'Completed', value: statusCounts.COMPLETED, color: 'blue' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, school, mobile, or admit card ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FiFilter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Registrations Found</h3>
            <p className="text-gray-600">No registrations match your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{registration.fullName}</div>
                        <div className="text-sm text-gray-500">{registration.fathersName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {registration.currentClass}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{registration.presentSchool}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.parentMobile}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {getStatusIcon(registration.status)}
                        <span className="ml-1">{registration.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(registration.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRegistration(registration)
                          setShowModal(true)
                        }}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadAdmitCard(registration.admitCardId)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Registration Details Modal */}
      {showModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Registration Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <FiUser className="w-5 h-5 text-orange-600" />
                    <span>Personal Information</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{selectedRegistration.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Father's Name</label>
                      <p className="text-gray-900">{selectedRegistration.fathersName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mother's Name</label>
                      <p className="text-gray-900">{selectedRegistration.mothersName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Class</label>
                      <p className="text-gray-900">{selectedRegistration.currentClass}</p>
                    </div>
                  </div>
                </div>

                {/* School & Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <FiHome className="w-5 h-5 text-orange-600" />
                    <span>School & Contact</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Present School</label>
                      <p className="text-gray-900">{selectedRegistration.presentSchool}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Parent's Mobile</label>
                      <p className="text-gray-900 flex items-center space-x-1">
                        <FiPhone className="w-4 h-4" />
                        <span>{selectedRegistration.parentMobile}</span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Residential Address</label>
                      <p className="text-gray-900 flex items-start space-x-1">
                        <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{selectedRegistration.residentialAddress}</span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">NTSE Experience</label>
                      <p className="text-gray-900 flex items-center space-x-1">
                        <FiBook className="w-4 h-4" />
                        <span>{selectedRegistration.hasAppearedNTSE ? 'Yes' : 'No'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Display */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Photos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Passport Photo</label>
                    {selectedRegistration.passportPhoto ? (
                      <div className="mt-2">
                        <img 
                          src={selectedRegistration.passportPhoto} 
                          alt="Passport Photo" 
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          onClick={() => downloadImage(selectedRegistration.passportPhoto!, 'passport-photo')}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <FiDownload className="w-4 h-4" />
                          <span>Download Photo</span>
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                        No Photo Available
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Aadhar Card Photo</label>
                    {selectedRegistration.aadharPhoto ? (
                      <div className="mt-2">
                        <img 
                          src={selectedRegistration.aadharPhoto} 
                          alt="Aadhar Card Photo" 
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          onClick={() => downloadImage(selectedRegistration.aadharPhoto!, 'aadhar-card')}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <FiDownload className="w-4 h-4" />
                          <span>Download Photo</span>
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                        No Photo Available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h4>
                <div className="flex flex-wrap gap-2">
                  {['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateStatus(selectedRegistration.id, status)
                        setShowModal(false)
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedRegistration.status === status
                          ? getStatusColor(status)
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getStatusIcon(status)}
                      <span className="ml-1">{status}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => downloadAdmitCard(selectedRegistration.admitCardId)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Download Admit Card</span>
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
