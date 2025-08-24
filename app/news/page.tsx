'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { FiCalendar, FiUser, FiEye, FiHeart, FiShare2, FiImage, FiPlay, FiSearch, FiFilter, FiTrendingUp, FiAward, FiBookOpen } from 'react-icons/fi'

interface NewsArticle {
  id: string
  title: string
  excerpt?: string
  content: string
  imageUrl?: string
  isPublished: boolean
  publishDate: string
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch news from the database
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/public/news')
        if (response.ok) {
          const news = await response.json()
          setArticles(news)
          setFilteredArticles(news)
        } else {
          console.error('Failed to fetch news')
        }
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Filter articles based on search term
  useEffect(() => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredArticles(filtered)
  }, [searchTerm, articles])

  const handleShare = (article: NewsArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt || article.content.substring(0, 100) + '...',
        url: window.location.href
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href + '#article-' + article.id)
      alert('Link copied to clipboard!')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isRecent = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const daysDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24)
    return daysDiff <= 7 // Consider as recent if within 7 days
  }

  // Split articles into featured (recent) and regular
  const featuredArticles = filteredArticles.filter(article => isRecent(article.createdAt)).slice(0, 2)
  const regularArticles = filteredArticles.filter(article => !isRecent(article.createdAt) || !featuredArticles.includes(article))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              School <span className="text-yellow-400">News</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-8">
              Stay updated with the latest happenings, achievements, and events at our school
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiAward className="mr-2" />
                Achievements
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiCalendar className="mr-2" />
                Events
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiTrendingUp className="mr-2" />
                Updates
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
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      {featuredArticles.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest News</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {article.imageUrl && (
                    <div className="relative">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          <span>Latest</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <div className="flex items-center">
                          <FiUser className="w-4 h-4 mr-1" />
                          {article.createdBy.name}
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          {formatDate(article.createdAt)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleShare(article)}
                          className="flex items-center text-sm text-gray-500 hover:text-emerald-500 transition-colors"
                        >
                          <FiShare2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading news...</p>
            </div>
          ) : (
            <>
              {regularArticles.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    {featuredArticles.length > 0 ? 'More News' : 'All News'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularArticles.map((article) => (
                      <div key={article.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300">
                        {article.imageUrl && (
                          <div className="relative">
                            <img 
                              src={article.imageUrl} 
                              alt={article.title}
                              className="w-full h-48 object-cover rounded-t-xl"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                            <div className="absolute top-3 left-3">
                              <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FiCalendar className="w-3 h-3 mr-1" />
                                <span>News</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                              {article.excerpt}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <div className="flex items-center">
                              <FiUser className="w-3 h-3 mr-1" />
                              {article.createdBy.name}
                            </div>
                            <div className="flex items-center">
                              <FiCalendar className="w-3 h-3 mr-1" />
                              {formatDate(article.createdAt)}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500">
                              Published {formatDate(article.publishDate || article.createdAt)}
                            </div>
                            <button
                              onClick={() => handleShare(article)}
                              className="text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                              <FiShare2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No news found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms' : 'No news articles are currently published'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-emerald-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-emerald-500 p-6">
            <div className="flex items-start">
              <div className="bg-emerald-100 rounded-full p-2 mr-4">
                <FiCalendar className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Stay Updated with School News
                </h3>
                <p className="text-gray-600 mb-4">
                  Subscribe to our newsletter to receive the latest news, achievements, and announcements directly in your inbox.
                </p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 