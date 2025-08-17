'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiCalendar, FiClock, FiSave, FiX, FiStar, FiHeart } from 'react-icons/fi'

interface ThoughtOfTheDay {
  id: string
  quote: string
  author: string
  hindiQuote?: string
  hindiAuthor?: string
  isActive: boolean
  date: string
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

interface ThoughtsManagerProps {
  userId: string
}

export default function ThoughtsManager({ userId }: ThoughtsManagerProps) {
  const [thoughts, setThoughts] = useState<ThoughtOfTheDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingThought, setEditingThought] = useState<ThoughtOfTheDay | null>(null)
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    hindiQuote: '',
    hindiAuthor: '',
    isActive: false,
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadThoughts()
  }, [])

  const loadThoughts = async () => {
    try {
      const response = await fetch('/api/admin/thoughts')
      if (response.ok) {
        const data = await response.json()
        setThoughts(data)
      }
    } catch (error) {
      console.error('Error loading thoughts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingThought ? `/api/admin/thoughts/${editingThought.id}` : '/api/admin/thoughts'
      const method = editingThought ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdById: userId,
          hindiQuote: formData.hindiQuote || null,
          hindiAuthor: formData.hindiAuthor || null
        })
      })

      if (response.ok) {
        await loadThoughts()
        resetForm()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error saving thought:', error)
    }
  }

  const handleEdit = (thought: ThoughtOfTheDay) => {
    setEditingThought(thought)
    setFormData({
      quote: thought.quote,
      author: thought.author,
      hindiQuote: thought.hindiQuote || '',
      hindiAuthor: thought.hindiAuthor || '',
      isActive: thought.isActive,
      date: thought.date.split('T')[0]
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this thought?')) return

    try {
      const response = await fetch(`/api/admin/thoughts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadThoughts()
      }
    } catch (error) {
      console.error('Error deleting thought:', error)
    }
  }

  const toggleActive = async (thought: ThoughtOfTheDay) => {
    try {
      const response = await fetch(`/api/admin/thoughts/${thought.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...thought,
          isActive: !thought.isActive
        })
      })

      if (response.ok) {
        await loadThoughts()
      }
    } catch (error) {
      console.error('Error toggling thought status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      quote: '',
      author: '',
      hindiQuote: '',
      hindiAuthor: '',
      isActive: false,
      date: new Date().toISOString().split('T')[0]
    })
    setEditingThought(null)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const activeThought = thoughts.find(t => t.isActive)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Thought of the Day</h2>
          <p className="text-gray-600">Create and manage daily inspirational thoughts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Thought</span>
        </button>
      </div>

      {/* Active Thought Highlight */}
      {activeThought && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FiStar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Current Active Thought</h3>
              <blockquote className="text-gray-700 italic mb-2">"{activeThought.quote}"</blockquote>
              <p className="text-sm text-gray-600">— {activeThought.author}</p>
              {activeThought.hindiQuote && (
                <div className="mt-3 pt-3 border-t border-purple-200">
                  <blockquote className="text-gray-700 italic mb-2">"{activeThought.hindiQuote}"</blockquote>
                  <p className="text-sm text-gray-600">— {activeThought.hindiAuthor || activeThought.author}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Thoughts List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {thoughts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiHeart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No thoughts found. Create your first inspirational thought!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {thoughts.map((thought) => (
              <div key={thought.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {thought.isActive && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
                          <FiStar className="w-3 h-3" />
                          <span>ACTIVE</span>
                        </span>
                      )}
                      {thought.hindiQuote && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                          हिंदी
                        </span>
                      )}
                    </div>
                    <blockquote className="text-lg text-gray-900 italic mb-2">"{thought.quote}"</blockquote>
                    <p className="text-gray-600 mb-2">— {thought.author}</p>
                    
                    {thought.hindiQuote && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <blockquote className="text-gray-700 italic mb-2">"{thought.hindiQuote}"</blockquote>
                        <p className="text-gray-600 text-sm">— {thought.hindiAuthor || thought.author}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>Date: {new Date(thought.date).toLocaleDateString()}</span>
                      </div>
                      <span>By: {thought.createdBy.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleActive(thought)}
                      className={`p-2 rounded-lg transition-colors ${
                        thought.isActive 
                          ? 'text-purple-600 bg-purple-50 hover:bg-purple-100' 
                          : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                      title={thought.isActive ? 'Deactivate' : 'Set as Active'}
                    >
                      <FiStar className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(thought)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(thought.id)}
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
                  {editingThought ? 'Edit Thought' : 'Create New Thought'}
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
                  Quote (English) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter the inspirational quote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter the author's name"
                />
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Hindi Translation (Optional)</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quote (Hindi)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.hindiQuote}
                      onChange={(e) => setFormData({ ...formData, hindiQuote: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="हिंदी में प्रेरणादायक उद्धरण"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author (Hindi)
                    </label>
                    <input
                      type="text"
                      value={formData.hindiAuthor}
                      onChange={(e) => setFormData({ ...formData, hindiAuthor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="लेखक का नाम हिंदी में"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Set as active thought</span>
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
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{editingThought ? 'Update' : 'Create'} Thought</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 