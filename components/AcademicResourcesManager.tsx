'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2, FiDownload, FiBook, FiCalendar, FiFileText, FiBookOpen, FiAward, FiX, FiSave, FiUpload, FiFile, FiCheckCircle } from 'react-icons/fi'

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

interface Class {
  id: string
  name: string
  description?: string
}

interface Subject {
  id: string
  name: string
  code: string
}

interface AcademicResourcesManagerProps {
  userId: string
}

export default function AcademicResourcesManager({ userId }: AcademicResourcesManagerProps) {
  const [resources, setResources] = useState<AcademicResource[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [editingResource, setEditingResource] = useState<AcademicResource | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [bulkUploadData, setBulkUploadData] = useState({
    selectedClass: '',
    uploadType: 'SYLLABUS' as 'SYLLABUS' | 'QUESTION_PAPER' | 'DATE_SHEET',
    files: {} as Record<string, File>,
    descriptions: {} as Record<string, string>
  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SYLLABUS' as 'SYLLABUS' | 'QUESTION_PAPER' | 'DATE_SHEET' | 'CURRICULUM' | 'STUDY_MATERIAL',
    className: '',
    subject: '',
    year: new Date().getFullYear().toString(),
    fileName: '',
    isPublished: true
  })

  useEffect(() => {
    fetchResources()
    fetchClasses()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/admin/academic-resources')
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const classData = data.classes.map((cls: any) => ({
            id: cls.id,
            name: cls.name,
            description: cls.description
          }))
          setClasses(classData)
          
          // Extract unique subjects across all classes and terms
          const allSubjects: Subject[] = []
          data.classes.forEach((cls: any) => {
            cls.terms.forEach((term: any) => {
              term.subjects.forEach((subject: any) => {
                if (!allSubjects.find(s => s.code === subject.code)) {
                  allSubjects.push({
                    id: subject.id,
                    name: subject.name,
                    code: subject.code
                  })
                }
              })
            })
          })
          setSubjects(allSubjects)
        }
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!selectedFile && !editingResource) {
        alert('Please select a file to upload')
        setIsLoading(false)
        return
      }

      if (editingResource) {
        // For editing, just update the metadata
        const response = await fetch(`/api/admin/academic-resources/${editingResource.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (response.ok) {
          await fetchResources()
          resetForm()
          alert('Resource updated successfully!')
        } else {
          throw new Error('Failed to update resource')
        }
      } else {
        // For new resources, use FormData for file upload
        const uploadFormData = new FormData()
        uploadFormData.append('title', formData.title)
        uploadFormData.append('description', formData.description)
        uploadFormData.append('type', formData.type)
        uploadFormData.append('className', formData.className)
        uploadFormData.append('subject', formData.subject)
        uploadFormData.append('year', formData.year)
        uploadFormData.append('isPublished', formData.isPublished.toString())
        uploadFormData.append('createdById', userId)
        
        if (selectedFile) {
          uploadFormData.append('file', selectedFile)
        }

        const response = await fetch('/api/admin/academic-resources/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (response.ok) {
          await fetchResources()
          resetForm()
          alert('Resource created successfully!')
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create resource')
        }
      }
    } catch (error) {
      console.error('Error saving resource:', error)
      alert('Failed to save resource: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkUpload = async () => {
    if (!bulkUploadData.selectedClass) {
      alert('Please select a class')
      return
    }

    const fileCount = Object.keys(bulkUploadData.files).length
    if (fileCount === 0) {
      alert('Please select at least one file to upload')
      return
    }

    setIsLoading(true)
    let successCount = 0
    let failCount = 0

    try {
      for (const [subjectName, file] of Object.entries(bulkUploadData.files)) {
        try {
          const uploadFormData = new FormData()
          uploadFormData.append('title', `${bulkUploadData.uploadType} - ${subjectName} - ${bulkUploadData.selectedClass}`)
          uploadFormData.append('description', bulkUploadData.descriptions[subjectName] || `${bulkUploadData.uploadType} for ${subjectName}`)
          uploadFormData.append('type', bulkUploadData.uploadType)
          uploadFormData.append('className', bulkUploadData.selectedClass)
          uploadFormData.append('subject', subjectName)
          uploadFormData.append('year', new Date().getFullYear().toString())
          uploadFormData.append('isPublished', 'true')
          uploadFormData.append('createdById', userId)
          uploadFormData.append('file', file)

          const response = await fetch('/api/admin/academic-resources/upload', {
            method: 'POST',
            body: uploadFormData
          })

          if (response.ok) {
            successCount++
          } else {
            failCount++
          }
        } catch (error) {
          failCount++
        }
      }

      await fetchResources()
      alert(`Bulk upload completed! Success: ${successCount}, Failed: ${failCount}`)
      setBulkUploadData({
        selectedClass: '',
        uploadType: 'SYLLABUS',
        files: {},
        descriptions: {}
      })
      setShowBulkUpload(false)
    } catch (error) {
      console.error('Bulk upload error:', error)
      alert('Bulk upload failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const response = await fetch(`/api/admin/academic-resources/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchResources()
        alert('Resource deleted successfully!')
      } else {
        throw new Error('Failed to delete resource')
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
      alert('Failed to delete resource')
    }
  }

  const handleEdit = (resource: AcademicResource) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description || '',
      type: resource.type,
      className: resource.className,
      subject: resource.subject,
      year: resource.year || new Date().getFullYear().toString(),
      fileName: resource.fileName || '',
      isPublished: resource.isPublished
    })
    setSelectedFile(null) // Can't edit file, only metadata
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'SYLLABUS',
      className: '',
      subject: '',
      year: new Date().getFullYear().toString(),
      fileName: '',
      isPublished: true
    })
    setEditingResource(null)
    setSelectedFile(null)
    setShowForm(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFormData(prev => ({ ...prev, fileName: file.name }))
    }
  }

  const getUniqueSubjects = () => {
    const uniqueSubjects = new Set<string>()
    subjects.forEach(subject => uniqueSubjects.add(subject.name))
    return Array.from(uniqueSubjects).sort()
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Academic Resources</h2>
          <p className="text-gray-600">Manage syllabi, question papers, and date sheets</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiUpload className="w-4 h-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Add Resource
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mathematics Syllabus 2024-25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SYLLABUS">Syllabus</option>
                    <option value="QUESTION_PAPER">Question Paper</option>
                    <option value="DATE_SHEET">Date Sheet</option>
                    <option value="CURRICULUM">Curriculum</option>
                    <option value="STUDY_MATERIAL">Study Material</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class *
                  </label>
                  <select
                    required
                    value={formData.className}
                    onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.name}>{cls.name}</option>
                    ))}
                    <option value="All Classes">All Classes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    {getUniqueSubjects().map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                    <option value="All Subjects">All Subjects</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2024, 2023"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the resource..."
                />
              </div>

              {!editingResource && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File *
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    selectedFile 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}>
                    {selectedFile ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <FiFile className="w-12 h-12 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">{selectedFile.name}</p>
                          <p className="text-sm text-green-700">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                          </p>
                        </div>
                        <div className="flex justify-center space-x-4">
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center text-sm"
                          >
                            <FiUpload className="mr-2" />
                            Change File
                          </label>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <FiFile className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="space-y-2">
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center"
                          >
                            <FiUpload className="mr-2" />
                            Choose File
                          </label>
                          <p className="text-sm text-gray-500">
                            Supports PDF, DOC, DOCX files up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                      required={!editingResource}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Published</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <FiSave className="w-4 h-4" />
                  {isLoading ? 'Saving...' : (editingResource ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Bulk Upload Resources</h3>
              <button onClick={() => setShowBulkUpload(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class *
                  </label>
                  <select
                    value={bulkUploadData.selectedClass}
                    onChange={(e) => setBulkUploadData(prev => ({ ...prev, selectedClass: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.name}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Type *
                  </label>
                  <select
                    value={bulkUploadData.uploadType}
                    onChange={(e) => setBulkUploadData(prev => ({ ...prev, uploadType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SYLLABUS">Syllabus</option>
                    <option value="QUESTION_PAPER">Question Papers</option>
                    <option value="DATE_SHEET">Date Sheets</option>
                  </select>
                </div>
              </div>

              {bulkUploadData.selectedClass && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Upload {bulkUploadData.uploadType} for All Subjects
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Select files for each subject. The files will be uploaded for all terms of {bulkUploadData.selectedClass}.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getUniqueSubjects().map(subject => (
                      <div key={subject} className="border rounded-lg p-4 space-y-3">
                        <h5 className="font-medium text-gray-900">{subject}</h5>
                        
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">File</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setBulkUploadData(prev => ({
                                    ...prev,
                                    files: { ...prev.files, [subject]: file }
                                  }))
                                }
                              }}
                              className="hidden"
                              id={`file-${subject}`}
                            />
                            <label
                              htmlFor={`file-${subject}`}
                              className="cursor-pointer bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors flex items-center"
                            >
                              <FiUpload className="mr-1" />
                              Choose File
                            </label>
                            {bulkUploadData.files[subject] && (
                              <div className="flex items-center text-green-600">
                                <FiCheckCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm">{bulkUploadData.files[subject].name}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Description (Optional)</label>
                          <input
                            type="text"
                            placeholder={`${bulkUploadData.uploadType} for ${subject}`}
                            value={bulkUploadData.descriptions[subject] || ''}
                            onChange={(e) => setBulkUploadData(prev => ({
                              ...prev,
                              descriptions: { ...prev.descriptions, [subject]: e.target.value }
                            }))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowBulkUpload(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkUpload}
                  disabled={isLoading || !bulkUploadData.selectedClass || Object.keys(bulkUploadData.files).length === 0}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <FiUpload className="w-4 h-4" />
                  {isLoading ? 'Uploading...' : `Upload ${Object.keys(bulkUploadData.files).length} Files`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resources List */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="p-8 text-center">
            <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first academic resource</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Resource
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class/Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{resource.title}</div>
                        {resource.description && (
                          <div className="text-sm text-gray-500 mt-1">{resource.description}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          By {resource.createdBy.name} • {new Date(resource.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                        {getTypeIcon(resource.type)}
                        <span className="ml-1">{resource.type.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{resource.className}</div>
                      <div className="text-gray-500">{resource.subject}</div>
                      {resource.year && <div className="text-gray-400">Year: {resource.year}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <FiDownload className="w-4 h-4 mr-1" />
                        {resource.downloadCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        resource.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {resource.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(resource)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(resource.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                        {resource.fileUrl && (
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 transition-colors"
                          >
                            <FiDownload className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 