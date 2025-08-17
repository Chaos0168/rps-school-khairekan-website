'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit3, FiTrash2, FiUsers, FiBookOpen, FiSave, FiX, FiAward } from 'react-icons/fi'

interface Class {
  id: string
  name: string
  description?: string
  order: number
  createdAt: string
  updatedAt: string
  _count: {
    users: number
    terms: number
  }
}

export default function ClassesManager() {
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 1
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/admin/classes')
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (error) {
      console.error('Error loading classes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    try {
      const url = editingClass ? `/api/admin/classes/${editingClass.id}` : '/api/admin/classes'
      const method = editingClass ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order.toString())
        })
      })

      if (response.ok) {
        await loadClasses()
        resetForm()
        setShowModal(false)
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || 'Failed to save class' })
      }
    } catch (error) {
      console.error('Error saving class:', error)
      setErrors({ submit: 'Failed to save class' })
    }
  }

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem)
    setFormData({
      name: classItem.name,
      description: classItem.description || '',
      order: classItem.order
    })
    setShowModal(true)
  }

  const handleDelete = async (classItem: Class) => {
    if (classItem._count.users > 0 || classItem._count.terms > 0) {
      alert(`Cannot delete ${classItem.name}. It has ${classItem._count.users} students and ${classItem._count.terms} terms. Please move students and delete terms first.`)
      return
    }

    if (!confirm(`Are you sure you want to delete ${classItem.name}?`)) return

    try {
      const response = await fetch(`/api/admin/classes/${classItem.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadClasses()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete class')
      }
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('Failed to delete class')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      order: classes.length + 1
    })
    setEditingClass(null)
    setErrors({})
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Manage Classes</h2>
          <p className="text-gray-600 text-sm lg:text-base">Create and manage school class structure</p>
        </div>
        <button
          onClick={() => {
            setFormData(prev => ({ ...prev, order: classes.length + 1 }))
            setShowModal(true)
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm lg:text-base"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Class</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-lg lg:rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-4 lg:p-6">
              <div className="flex items-start justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiAward className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 truncate">{classItem.name}</h3>
                    <p className="text-xs lg:text-sm text-gray-500">Order: {classItem.order}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(classItem)}
                    className="p-1.5 lg:p-2 text-blue-600 hover:bg-blue-50 rounded-md lg:rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(classItem)}
                    className="p-1.5 lg:p-2 text-red-600 hover:bg-red-50 rounded-md lg:rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {classItem.description && (
                <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">{classItem.description}</p>
              )}
              
              <div className="flex items-center justify-between text-xs lg:text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <FiUsers className="w-4 h-4" />
                  <span>{classItem._count.users} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiBookOpen className="w-4 h-4" />
                  <span>{classItem._count.terms} terms</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {classes.length === 0 && (
          <div className="col-span-full text-center py-8 lg:py-12">
            <FiAward className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-sm lg:text-base">No classes found. Create your first class!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-4 lg:p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
                  {editingClass ? 'Edit Class' : 'Create New Class'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-sm">
                  {errors.submit}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm lg:text-base"
                  placeholder="e.g., Class 10th, Grade 5, Nursery"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm lg:text-base"
                  placeholder="Optional description of the class"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm lg:text-base"
                  placeholder="1, 2, 3..."
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm lg:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm lg:text-base"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{editingClass ? 'Update' : 'Create'} Class</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 