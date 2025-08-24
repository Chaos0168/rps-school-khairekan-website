'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2, FiDownload, FiBook, FiCalendar, FiFileText, FiBookOpen, FiAward, FiX, FiSave, FiUpload } from 'react-icons/fi'

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

interface AcademicResourcesManagerProps {
  userId: string
}

export default function AcademicResourcesManager({ userId }: AcademicResourcesManagerProps) {
  const [resources, setResources] = useState<AcademicResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingResource, setEditingResource] = useState<AcademicResource | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SYLLABUS' as 'SYLLABUS' | 'QUESTION_PAPER' | 'DATE_SHEET' | 'CURRICULUM' | 'STUDY_MATERIAL',
    className: '',
    subject: '',
    year: '',
    fileUrl: '',
    fileName: '',
    isPublished: true
  })

  useEffect(() => {
    fetchResources()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = editingResource 
        ? `/api/admin/academic-resources/${editingResource.id}`
        : '/api/admin/academic-resources'
      
      const method = editingResource ? 'PUT' : 'POST'
      
      const payload = editingResource 
        ? formData 
        : { ...formData, createdById: userId }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchResources()
        resetForm()
        alert(editingResource ? 'Resource updated successfully!' : 'Resource created successfully!')
      } else {
        throw new Error('Failed to save resource')
      }
    } catch (error) {
      console.error('Error saving resource:', error)
      alert('Failed to save resource')
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
      year: resource.year || '',
      fileUrl: resource.fileUrl || '',
      fileName: resource.fileName || '',
      isPublished: resource.isPublished
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'SYLLABUS',
      className: '',
      subject: '',
      year: '',
      fileUrl: '',
      fileName: '',
      isPublished: true
    })
    setEditingResource(null)
    setShowForm(false)
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
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add Resource
        </button>
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
                  <input
                    type="text"
                    required
                    value={formData.className}
                    onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Class XII, All Classes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mathematics, All Subjects"
                  />
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File URL
                  </label>
                  <input
                    type="url"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/file.pdf"
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