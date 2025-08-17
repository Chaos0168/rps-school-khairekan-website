'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiCalendar, FiClock, FiSave, FiX, FiAlertCircle } from 'react-icons/fi'

interface Notice {
  id: string
  title: string
  content: string
  isUrgent: boolean
  isPublished: boolean
  publishDate: string
  expiryDate?: string
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

interface NoticesManagerProps {
  userId: string
}

export default function NoticesManager({ userId }: NoticesManagerProps) {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isUrgent: false,
    isPublished: true,
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  })

  useEffect(() => {
    loadNotices()
  }, [])

  const loadNotices = async () => {
    try {
      const response = await fetch('/api/admin/notices')
      if (response.ok) {
        const data = await response.json()
        setNotices(data)
      }
    } catch (error) {
      console.error('Error loading notices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingNotice ? `/api/admin/notices/${editingNotice.id}` : '/api/admin/notices'
      const method = editingNotice ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdById: userId,
          expiryDate: formData.expiryDate || null
        })
      })

      if (response.ok) {
        await loadNotices()
        resetForm()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error saving notice:', error)
    }
  }

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      content: notice.content,
      isUrgent: notice.isUrgent,
      isPublished: notice.isPublished,
      publishDate: notice.publishDate.split('T')[0],
      expiryDate: notice.expiryDate ? notice.expiryDate.split('T')[0] : ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return

    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadNotices()
      }
    } catch (error) {
      console.error('Error deleting notice:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      isUrgent: false,
      isPublished: true,
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: ''
    })
    setEditingNotice(null)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Notices</h2>
          <p className="text-gray-600">Create and manage important school notices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Notice</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {notices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiAlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No notices found. Create your first notice!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notices.map((notice) => (
              <div key={notice.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                      {notice.isUrgent && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                          URGENT
                        </span>
                      )}
                      {!notice.isPublished && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                          DRAFT
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{notice.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>Published: {new Date(notice.publishDate).toLocaleDateString()}</span>
                      </div>
                      {notice.expiryDate && (
                        <div className="flex items-center space-x-1">
                          <FiClock className="w-4 h-4" />
                          <span>Expires: {new Date(notice.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <span>By: {notice.createdBy.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter notice title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Content *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter notice content"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Mark as urgent</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Publish immediately</span>
                </label>
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
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{editingNotice ? 'Update' : 'Create'} Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 