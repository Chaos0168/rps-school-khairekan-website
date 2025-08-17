'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit3, FiTrash2, FiBook, FiSave, FiX, FiCalendar } from 'react-icons/fi'

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
  createdAt: string
  updatedAt: string
  class: {
    name: string
    order: number
  }
  _count: {
    subjects: number
  }
}

export default function TermsManager() {
  const [terms, setTerms] = useState<Term[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTerm, setEditingTerm] = useState<Term | null>(null)
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    order: 1
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadClasses()
    loadTerms()
  }, [])

  useEffect(() => {
    loadTerms()
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
      const url = selectedClassFilter 
        ? `/api/admin/terms?classId=${selectedClassFilter}`
        : '/api/admin/terms'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setTerms(data)
      }
    } catch (error) {
      console.error('Error loading terms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    try {
      const url = editingTerm ? `/api/admin/terms/${editingTerm.id}` : '/api/admin/terms'
      const method = editingTerm ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order.toString())
        })
      })

      if (response.ok) {
        await loadTerms()
        resetForm()
        setShowModal(false)
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || 'Failed to save term' })
      }
    } catch (error) {
      console.error('Error saving term:', error)
      setErrors({ submit: 'Failed to save term' })
    }
  }

  const handleEdit = (term: Term) => {
    setEditingTerm(term)
    setFormData({
      name: term.name,
      classId: term.classId,
      order: term.order
    })
    setShowModal(true)
  }

  const handleDelete = async (term: Term) => {
    if (term._count.subjects > 0) {
      alert(`Cannot delete ${term.name}. It has ${term._count.subjects} subjects. Please delete subjects first.`)
      return
    }

    if (!confirm(`Are you sure you want to delete ${term.name}?`)) return

    try {
      const response = await fetch(`/api/admin/terms/${term.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadTerms()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete term')
      }
    } catch (error) {
      console.error('Error deleting term:', error)
      alert('Failed to delete term')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      classId: classes.length > 0 ? classes[0].id : '',
      order: 1
    })
    setEditingTerm(null)
    setErrors({})
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const groupedTerms = terms.reduce((acc, term) => {
    const className = term.class.name
    if (!acc[className]) {
      acc[className] = []
    }
    acc[className].push(term)
    return acc
  }, {} as Record<string, Term[]>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Terms</h2>
          <p className="text-gray-600">Create and manage academic terms for each class</p>
        </div>
        <button
          onClick={() => {
            setFormData(prev => ({ 
              ...prev, 
              classId: classes.length > 0 ? classes[0].id : '',
              order: 1 
            }))
            setShowModal(true)
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Term</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Class:</label>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Terms Display */}
      {Object.keys(groupedTerms).length === 0 ? (
        <div className="text-center py-12">
          <FiCalendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No terms found. Create your first term!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTerms).map(([className, classTerms]) => (
            <div key={className} className="bg-white rounded-xl shadow-sm border">
              <div className="px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                <h3 className="text-lg font-semibold text-gray-900">{className}</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classTerms.map((term) => (
                    <div key={term.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiCalendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{term.name}</h4>
                            <p className="text-sm text-gray-500">Order: {term.order}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(term)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(term)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <FiBook className="w-4 h-4" />
                        <span>{term._count.subjects} subjects</span>
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
                  {editingTerm ? 'Edit Term' : 'Create New Term'}
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
                  Class *
                </label>
                <select
                  required
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., First Term, Second Term, Final Term"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1, 2, 3..."
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
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
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{editingTerm ? 'Update' : 'Create'} Term</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 