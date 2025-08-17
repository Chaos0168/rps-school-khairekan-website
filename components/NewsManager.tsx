'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiCalendar, FiClock, FiSave, FiX, FiFileText, FiImage } from 'react-icons/fi'

interface News {
  id: string
  title: string
  content: string
  excerpt?: string
  imageUrl?: string
  isPublished: boolean
  publishDate: string
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

interface NewsManagerProps {
  userId: string
}

export default function NewsManager({ userId }: NewsManagerProps) {
  const [news, setNews] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    isPublished: true,
    publishDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      const response = await fetch('/api/admin/news')
      if (response.ok) {
        const data = await response.json()
        setNews(data)
      }
    } catch (error) {
      console.error('Error loading news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingNews) {
      alert('Edit functionality coming soon!')
      return
    }
    
    try {
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdById: userId,
          excerpt: formData.excerpt || null,
          imageUrl: formData.imageUrl || null
        })
      })

      if (response.ok) {
        await loadNews()
        resetForm()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error saving news:', error)
    }
  }

  const handleEdit = (newsItem: News) => {
    alert('Edit functionality coming soon!')
  }

  const handleDelete = async (id: string) => {
    alert('Delete functionality coming soon!')
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      isPublished: true,
      publishDate: new Date().toISOString().split('T')[0]
    })
    setEditingNews(null)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

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
          <h2 className="text-2xl font-bold text-gray-900">Manage News</h2>
          <p className="text-gray-600">Create and manage school news articles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add News</span>
        </button>
      </div>

      {/* News List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {news.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiFileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No news articles found. Create your first news article!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {news.map((newsItem) => (
              <div key={newsItem.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{newsItem.title}</h3>
                      {!newsItem.isPublished && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                          DRAFT
                        </span>
                      )}
                      {newsItem.imageUrl && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
                          <FiImage className="w-3 h-3" />
                          <span>IMAGE</span>
                        </span>
                      )}
                    </div>
                    {newsItem.excerpt && (
                      <p className="text-gray-600 mb-2 text-sm italic">{newsItem.excerpt}</p>
                    )}
                    <p className="text-gray-600 mb-3 line-clamp-2">{newsItem.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>Published: {new Date(newsItem.publishDate).toLocaleDateString()}</span>
                      </div>
                      <span>By: {newsItem.createdBy.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(newsItem)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(newsItem.id)}
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
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingNews ? 'Edit News Article' : 'Create New News Article'}
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
                  News Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter news title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (Brief Summary)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a brief summary or excerpt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  News Content *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the full news content"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
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
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{editingNews ? 'Update' : 'Create'} News</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 