'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { FiBook, FiCalendar, FiFileText, FiDownload, FiSearch, FiFilter, FiBookOpen, FiClock, FiChevronDown, FiUser, FiEye, FiAward } from 'react-icons/fi'

interface AcademicResource {
  id: string
  title: string
  description?: string
  type: 'SYLLABUS' | 'QUESTION_PAPER' | 'DATE_SHEET' | 'CURRICULUM' | 'STUDY_MATERIAL'
  className: string
  subject: string
  year?: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  downloadCount: number
  isPublished: boolean
  publishDate: string
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

export default function AcademicsPage() {
  const [resources, setResources] = useState<AcademicResource[]>([])
  const [filteredResources, setFilteredResources] = useState<AcademicResource[]>([])
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/public/academic-resources')
        if (response.ok) {
          const data = await response.json()
          setResources(data)
          setFilteredResources(data)
        } else {
          console.error('Failed to fetch academic resources')
        }
      } catch (error) {
        console.error('Error fetching academic resources:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [])

  // Filter resources based on selected criteria
  useEffect(() => {
    let filtered = resources

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType)
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(resource => resource.className === selectedClass)
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === selectedSubject)
    }

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort by upload date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredResources(filtered)
  }, [selectedType, selectedClass, selectedSubject, searchTerm, resources])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SYLLABUS': return <FiBook className="w-5 h-5" />
      case 'QUESTION_PAPER': return <FiFileText className="w-5 h-5" />
      case 'DATE_SHEET': return <FiCalendar className="w-5 h-5" />
      case 'CURRICULUM': return <FiBookOpen className="w-5 h-5" />
      case 'STUDY_MATERIAL': return <FiAward className="w-5 h-5" />
      default: return <FiBook className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SYLLABUS': return 'bg-blue-100 text-blue-800'
      case 'QUESTION_PAPER': return 'bg-green-100 text-green-800'
      case 'DATE_SHEET': return 'bg-purple-100 text-purple-800'
      case 'CURRICULUM': return 'bg-orange-100 text-orange-800'
      case 'STUDY_MATERIAL': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'SYLLABUS': return 'Syllabus'
      case 'QUESTION_PAPER': return 'Question Paper'
      case 'DATE_SHEET': return 'Date Sheet'
      case 'CURRICULUM': return 'Curriculum'
      case 'STUDY_MATERIAL': return 'Study Material'
      default: return type
    }
  }

  const handleDownload = async (resource: AcademicResource) => {
    if (!resource.fileUrl) {
      alert('File not available for download')
      return
    }
    
    // Increment download count (optional - you could call an API here)
    setResources(prev => 
      prev.map(r => 
        r.id === resource.id 
          ? { ...r, downloadCount: r.downloadCount + 1 }
          : r
      )
    )
    
    // Open download link
    window.open(resource.fileUrl, '_blank')
  }

  // Get unique values for filters
  const uniqueClasses = Array.from(new Set(resources.map(r => r.className))).sort()
  const uniqueSubjects = Array.from(new Set(resources.map(r => r.subject))).sort()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Academic <span className="text-yellow-400">Resources</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Access syllabi, question papers, date sheets, and study materials
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiBook className="mr-2" />
                Syllabi
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiFileText className="mr-2" />
                Question Papers
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiCalendar className="mr-2" />
                Date Sheets
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="SYLLABUS">Syllabus</option>
                <option value="QUESTION_PAPER">Question Papers</option>
                <option value="DATE_SHEET">Date Sheets</option>
                <option value="CURRICULUM">Curriculum</option>
                <option value="STUDY_MATERIAL">Study Material</option>
              </select>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading resources...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Found {filteredResources.length} resources
                </h2>
                <p className="text-gray-600">
                  {selectedType !== 'all' && `Filtered by: ${getTypeLabel(selectedType)}`}
                  {selectedClass !== 'all' && ` • ${selectedClass}`}
                  {selectedSubject !== 'all' && ` • ${selectedSubject}`}
                </p>
              </div>

              {filteredResources.length === 0 ? (
                <div className="text-center py-12">
                  <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <div key={resource.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(resource.type)}`}>
                            {getTypeIcon(resource.type)}
                            <span className="ml-2">{getTypeLabel(resource.type)}</span>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            {new Date(resource.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {resource.title}
                        </h3>

                        {resource.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {resource.description}
                          </p>
                        )}

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <FiBookOpen className="w-4 h-4 mr-2" />
                            <span>{resource.className} • {resource.subject}</span>
                          </div>
                          {resource.year && (
                            <div className="flex items-center text-sm text-gray-600">
                              <FiClock className="w-4 h-4 mr-2" />
                              <span>Year: {resource.year}</span>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <FiUser className="w-4 h-4 mr-2" />
                            <span>By {resource.createdBy.name}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiEye className="w-4 h-4 mr-1" />
                            <span>{resource.downloadCount} downloads</span>
                          </div>
                          
                          <button
                            onClick={() => handleDownload(resource)}
                            disabled={!resource.fileUrl}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                              resource.fileUrl
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <FiDownload className="w-4 h-4 mr-2" />
                            Download
                          </button>
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
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-500 p-6">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <FiBook className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Academic Resources Information
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• All resources are officially approved by the academic department</li>
                  <li>• Resources are updated regularly as per the latest curriculum</li>
                  <li>• For any queries regarding academic content, contact your subject teachers</li>
                  <li>• Download counts help us understand popular resources for better planning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 