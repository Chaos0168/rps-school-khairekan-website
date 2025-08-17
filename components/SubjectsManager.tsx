'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit3, FiTrash2, FiFileText, FiSave, FiX, FiBook } from 'react-icons/fi'

interface Class {
  id: string
  name: string
  order: number
}

interface Term {
  id: string
  name: string
  order: number
  classId: string
  class: {
    name: string
    order: number
  }
}

interface Subject {
  id: string
  name: string
  code: string
  termId: string
  createdAt: string
  updatedAt: string
  term: {
    name: string
    order: number
    class: {
      name: string
      order: number
    }
  }
  _count: {
    resources: number
  }
}

export default function SubjectsManager() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [terms, setTerms] = useState<Term[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('')
  const [selectedTermFilter, setSelectedTermFilter] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    termId: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadClasses()
    loadTerms()
    loadSubjects()
  }, [])

  useEffect(() => {
    loadSubjects()
  }, [selectedClassFilter, selectedTermFilter])

  useEffect(() => {
    if (selectedClassFilter) {
      loadTermsForClass(selectedClassFilter)
    } else {
      loadTerms()
    }
  }, [selectedClassFilter])

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/admin/classes')
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (error) {
      console.error('Error loading classes:', error)
    }
  }

  const loadTerms = async () => {
    try {
      const response = await fetch('/api/admin/terms')
      if (response.ok) {
        const data = await response.json()
        setTerms(data)
      }
    } catch (error) {
      console.error('Error loading terms:', error)
    }
  }

  const loadTermsForClass = async (classId: string) => {
    try {
      const response = await fetch(`/api/admin/terms?classId=${classId}`)
      if (response.ok) {
        const data = await response.json()
        setTerms(data)
      }
    } catch (error) {
      console.error('Error loading terms for class:', error)
    }
  }

  const loadSubjects = async () => {
    try {
      let url = '/api/admin/subjects'
      const params = new URLSearchParams()
      
      if (selectedTermFilter) {
        params.append('termId', selectedTermFilter)
      } else if (selectedClassFilter) {
        params.append('classId', selectedClassFilter)
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setSubjects(data)
      }
    } catch (error) {
      console.error('Error loading subjects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    try {
      const url = editingSubject ? `/api/admin/subjects/${editingSubject.id}` : '/api/admin/subjects'
      const method = editingSubject ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await loadSubjects()
        resetForm()
        setShowModal(false)
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || 'Failed to save subject' })
      }
    } catch (error) {
      console.error('Error saving subject:', error)
      setErrors({ submit: 'Failed to save subject' })
    }
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      code: subject.code,
      termId: subject.termId
    })
    setShowModal(true)
  }

  const handleDelete = async (subject: Subject) => {
    if (subject._count.resources > 0) {
      alert(`Cannot delete ${subject.name}. It has ${subject._count.resources} resources. Please delete resources first.`)
      return
    }

    if (!confirm(`Are you sure you want to delete ${subject.name} (${subject.code})?`)) return

    try {
      const response = await fetch(`/api/admin/subjects/${subject.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadSubjects()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete subject')
      }
    } catch (error) {
      console.error('Error deleting subject:', error)
      alert('Failed to delete subject')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      termId: terms.length > 0 ? terms[0].id : ''
    })
    setEditingSubject(null)
    setErrors({})
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const groupedSubjects = subjects.reduce((acc, subject) => {
    const key = `${subject.term.class.name} - ${subject.term.name}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(subject)
    return acc
  }, {} as Record<string, Subject[]>)

  const availableTerms = selectedClassFilter 
    ? terms.filter(term => term.classId === selectedClassFilter)
    : terms

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Subjects</h2>
          <p className="text-gray-600">Create and manage subjects for each term</p>
        </div>
        <button
          onClick={() => {
            setFormData(prev => ({ 
              ...prev, 
              termId: availableTerms.length > 0 ? availableTerms[0].id : ''
            }))
            setShowModal(true)
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Class:</label>
            <select
              value={selectedClassFilter}
              onChange={(e) => {
                setSelectedClassFilter(e.target.value)
                setSelectedTermFilter('')
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Term:</label>
            <select
              value={selectedTermFilter}
              onChange={(e) => setSelectedTermFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Terms</option>
              {availableTerms.map((term) => (
                <option key={term.id} value={term.id}>
                  {selectedClassFilter ? term.name : `${term.class.name} - ${term.name}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Subjects Display */}
      {Object.keys(groupedSubjects).length === 0 ? (
        <div className="text-center py-12">
          <FiBook className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No subjects found. Create your first subject!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSubjects).map(([groupName, groupSubjects]) => (
            <div key={groupName} className="bg-white rounded-xl shadow-sm border">
              <div className="px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                <h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupSubjects.map((subject) => (
                    <div key={subject.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FiBook className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{subject.name}</h4>
                            <p className="text-sm text-gray-500 font-mono">{subject.code}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(subject)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(subject)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <FiFileText className="w-4 h-4" />
                        <span>{subject._count.resources} resources</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingSubject ? 'Edit Subject' : 'Create New Subject'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {errors.submit}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term *
                </label>
                <select
                  required
                  value={formData.termId}
                  onChange={(e) => setFormData({ ...formData, termId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select a term</option>
                  {availableTerms.map((term) => (
                    <option key={term.id} value={term.id}>
                      {selectedClassFilter ? term.name : `${term.class.name} - ${term.name}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Mathematics, English, Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
                  placeholder="e.g., MATH, ENG, SCI"
                />
                <p className="text-xs text-gray-500 mt-1">Short unique code for the subject</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{editingSubject ? 'Update' : 'Create'} Subject</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 