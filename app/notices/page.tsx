'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { FiBell, FiAlertTriangle, FiCalendar, FiClock, FiSearch, FiFilter, FiUser, FiEye, FiTag } from 'react-icons/fi'

interface Notice {
  id: string
  title: string
  content: string
  isPublished: boolean
  publishDate: string
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch notices from the database
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/public/notices')
        if (response.ok) {
          const notices = await response.json()
          setNotices(notices)
          setFilteredNotices(notices)
        } else {
          console.error('Failed to fetch notices')
        }
      } catch (error) {
        console.error('Error fetching notices:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotices()
  }, [])

  // Filter notices based on search term
  useEffect(() => {
    let filtered = notices

    if (searchTerm) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredNotices(filtered)
  }, [searchTerm, notices])

  const isRecent = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const daysDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24)
    return daysDiff <= 7 // Consider as recent if within 7 days
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              School <span className="text-yellow-400">Notices</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8">
              Stay updated with all important announcements and notifications
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiBell className="mr-2" />
                Latest Updates
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiAlertTriangle className="mr-2" />
                Important Alerts
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiCalendar className="mr-2" />
                Events & Exams
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Notices Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading notices...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  All Notices
                </h2>
                <p className="text-gray-600">
                  Found {filteredNotices.length} notices
                </p>
              </div>

              {filteredNotices.length === 0 ? (
                <div className="text-center py-12">
                  <FiBell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No notices found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms' : 'No notices are currently published'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredNotices.map((notice) => (
                    <div 
                      key={notice.id} 
                      className={`bg-white rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow duration-300 ${
                        isRecent(notice.createdAt) ? 'border-l-purple-500 bg-purple-50' : 'border-l-gray-300'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {isRecent(notice.createdAt) && (
                              <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                <FiBell className="w-4 h-4 mr-1" />
                                <span>New</span>
                              </div>
                            )}
                            <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              <FiCalendar className="w-4 h-4 mr-1" />
                              <span>Notice</span>
                            </div>
                          </div>
                          
                          <div className="text-right text-sm text-gray-500">
                            <div>{formatDate(notice.createdAt)}</div>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {notice.title}
                        </h3>

                        <div 
                          className="text-gray-600 mb-4 leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: notice.content }}
                        />

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <FiUser className="w-4 h-4 mr-1" />
                              Published by {notice.createdBy.name}
                            </div>
                            <div className="flex items-center">
                              <FiCalendar className="w-4 h-4 mr-1" />
                              {formatDate(notice.publishDate || notice.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Important Notice Section */}
      <section className="py-12 bg-purple-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-purple-500 p-6">
            <div className="flex items-start">
              <div className="bg-purple-100 rounded-full p-2 mr-4">
                <FiBell className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Stay Connected
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Check notices regularly for important updates</li>
                  <li>• Recent notices are highlighted with a purple border</li>
                  <li>• All notices are published by authorized school staff</li>
                  <li>• Contact the school office for any clarifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 