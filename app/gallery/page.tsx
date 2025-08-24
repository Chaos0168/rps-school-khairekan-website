'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { FiImage, FiPlay, FiCamera, FiVideo, FiCalendar, FiEye, FiHeart, FiDownload, FiSearch, FiFilter, FiMaximize2, FiX } from 'react-icons/fi'

interface GalleryItem {
  id: string
  title: string
  description: string
  category: 'events' | 'academics' | 'sports' | 'cultural' | 'infrastructure' | 'achievements'
  type: 'photo' | 'video' | 'album'
  thumbnail: string
  mediaUrl?: string
  albumImages?: string[]
  uploadDate: string
  views: number
  likes: number
  photographer?: string
  tags: string[]
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockItems: GalleryItem[] = [
      {
        id: '1',
        title: 'Science Fair 2024 Winners',
        description: 'Celebrating our brilliant students who excelled at the State Science Fair',
        category: 'achievements',
        type: 'album',
        thumbnail: '/images/science-fair-thumb.jpg',
        albumImages: [
          '/images/science-fair-1.jpg',
          '/images/science-fair-2.jpg',
          '/images/science-fair-3.jpg',
          '/images/science-fair-4.jpg',
          '/images/science-fair-5.jpg',
          '/images/science-fair-6.jpg'
        ],
        uploadDate: '2024-02-10',
        views: 1547,
        likes: 234,
        photographer: 'School Photography Club',
        tags: ['Science', 'Competition', 'Achievement', 'Innovation']
      },
      {
        id: '2',
        title: 'Cultural Fest Sanskriti 2024',
        description: 'Vibrant moments from our annual cultural festival showcasing diverse talents',
        category: 'cultural',
        type: 'album',
        thumbnail: '/images/cultural-fest-thumb.jpg',
        albumImages: [
          '/images/cultural-1.jpg',
          '/images/cultural-2.jpg',
          '/images/cultural-3.jpg',
          '/images/cultural-4.jpg',
          '/images/cultural-5.jpg',
          '/images/cultural-6.jpg',
          '/images/cultural-7.jpg',
          '/images/cultural-8.jpg'
        ],
        uploadDate: '2024-02-08',
        views: 1234,
        likes: 189,
        photographer: 'Event Team',
        tags: ['Culture', 'Dance', 'Music', 'Performance']
      },
      {
        id: '3',
        title: 'New Computer Lab Tour',
        description: 'Virtual tour of our state-of-the-art computer laboratory',
        category: 'infrastructure',
        type: 'video',
        thumbnail: '/images/computer-lab-thumb.jpg',
        mediaUrl: '/videos/computer-lab-tour.mp4',
        uploadDate: '2024-02-05',
        views: 892,
        likes: 156,
        tags: ['Technology', 'Infrastructure', 'Modern', 'Lab']
      },
      {
        id: '4',
        title: 'Football Championship Victory',
        description: 'Triumphant moments from our district football championship win',
        category: 'sports',
        type: 'album',
        thumbnail: '/images/football-thumb.jpg',
        albumImages: [
          '/images/football-1.jpg',
          '/images/football-2.jpg',
          '/images/football-3.jpg',
          '/images/football-4.jpg',
          '/images/football-5.jpg'
        ],
        uploadDate: '2024-01-28',
        views: 1678,
        likes: 287,
        photographer: 'Sports Department',
        tags: ['Football', 'Championship', 'Victory', 'Team']
      },
      {
        id: '5',
        title: 'Republic Day Celebration',
        description: 'Patriotic celebration with flag hoisting and cultural performances',
        category: 'events',
        type: 'album',
        thumbnail: '/images/republic-day-thumb.jpg',
        albumImages: [
          '/images/republic-1.jpg',
          '/images/republic-2.jpg',
          '/images/republic-3.jpg',
          '/images/republic-4.jpg'
        ],
        uploadDate: '2024-01-26',
        views: 987,
        likes: 201,
        photographer: 'Documentation Team',
        tags: ['Patriotism', 'Flag', 'Celebration', 'National']
      },
      {
        id: '6',
        title: 'Classroom Activities',
        description: 'Interactive learning sessions and student engagement in classrooms',
        category: 'academics',
        type: 'photo',
        thumbnail: '/images/classroom-activity.jpg',
        mediaUrl: '/images/classroom-activity-full.jpg',
        uploadDate: '2024-01-20',
        views: 543,
        likes: 89,
        photographer: 'Academic Team',
        tags: ['Learning', 'Classroom', 'Education', 'Students']
      },
      {
        id: '7',
        title: 'Annual Sports Day Highlights',
        description: 'Energetic moments from our annual sports day celebration',
        category: 'sports',
        type: 'video',
        thumbnail: '/images/sports-day-thumb.jpg',
        mediaUrl: '/videos/sports-day-highlights.mp4',
        uploadDate: '2024-01-15',
        views: 1456,
        likes: 298,
        tags: ['Sports', 'Athletics', 'Competition', 'Annual']
      },
      {
        id: '8',
        title: 'Art Exhibition 2024',
        description: 'Beautiful artworks created by our talented students',
        category: 'cultural',
        type: 'album',
        thumbnail: '/images/art-exhibition-thumb.jpg',
        albumImages: [
          '/images/art-1.jpg',
          '/images/art-2.jpg',
          '/images/art-3.jpg',
          '/images/art-4.jpg',
          '/images/art-5.jpg',
          '/images/art-6.jpg'
        ],
        uploadDate: '2024-01-10',
        views: 789,
        likes: 145,
        photographer: 'Art Department',
        tags: ['Art', 'Exhibition', 'Creativity', 'Students']
      }
    ]

    setTimeout(() => {
      setGalleryItems(mockItems)
      setFilteredItems(mockItems)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter items based on selected criteria
  useEffect(() => {
    let filtered = galleryItems

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())

    setFilteredItems(filtered)
  }, [selectedCategory, selectedType, searchTerm, galleryItems])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'events': return <FiCalendar className="w-5 h-5" />
      case 'academics': return <FiImage className="w-5 h-5" />
      case 'sports': return <FiCamera className="w-5 h-5" />
      case 'cultural': return <FiImage className="w-5 h-5" />
      case 'infrastructure': return <FiCamera className="w-5 h-5" />
      case 'achievements': return <FiImage className="w-5 h-5" />
      default: return <FiImage className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'events': return 'bg-blue-100 text-blue-800'
      case 'academics': return 'bg-green-100 text-green-800'
      case 'sports': return 'bg-orange-100 text-orange-800'
      case 'cultural': return 'bg-purple-100 text-purple-800'
      case 'infrastructure': return 'bg-gray-100 text-gray-800'
      case 'achievements': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleLike = (itemId: string) => {
    setGalleryItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, likes: item.likes + 1 } 
          : item
      )
    )
  }

  const handleItemClick = (item: GalleryItem) => {
    // Increment view count
    setGalleryItems(prev => 
      prev.map(i => i.id === item.id ? { ...i, views: i.views + 1 } : i)
    )

    if (item.type === 'photo') {
      setLightboxImage(item.mediaUrl || item.thumbnail)
    } else {
      setSelectedItem(item)
    }
  }

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
    setSelectedItem(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              School <span className="text-yellow-400">Gallery</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8">
              Capturing precious moments, achievements, and memories of our vibrant school life
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiImage className="mr-2" />
                Photos
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiPlay className="mr-2" />
                Videos
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <FiCamera className="mr-2" />
                Albums
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
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="events">Events</option>
                <option value="academics">Academics</option>
                <option value="sports">Sports</option>
                <option value="cultural">Cultural</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="achievements">Achievements</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="photo">Photos</option>
                <option value="video">Videos</option>
                <option value="album">Albums</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading gallery...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Gallery Collection
                </h2>
                <p className="text-gray-600">
                  Found {filteredItems.length} items
                </p>
              </div>

              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Type indicator */}
                        <div className="absolute top-3 right-3">
                          {item.type === 'video' && (
                            <div className="bg-black/70 text-white rounded-full p-2">
                              <FiPlay className="w-4 h-4" />
                            </div>
                          )}
                          {item.type === 'album' && (
                            <div className="bg-black/70 text-white px-2 py-1 rounded text-sm">
                              <FiImage className="inline mr-1 w-3 h-3" />
                              {item.albumImages?.length || 0}
                            </div>
                          )}
                        </div>

                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                            {getCategoryIcon(item.category)}
                            <span className="ml-1 capitalize">{item.category}</span>
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <FiMaximize2 className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="text-gray-400 text-xs px-1">+{item.tags.length - 2}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiCalendar className="w-4 h-4 mr-1" />
                            {new Date(item.uploadDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <FiEye className="w-4 h-4 mr-1" />
                              {item.views}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLike(item.id)
                              }}
                              className="flex items-center hover:text-red-500 transition-colors"
                            >
                              <FiHeart className="w-4 h-4 mr-1" />
                              {item.likes}
                            </button>
                          </div>
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

      {/* Lightbox for images */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
          >
            <FiX className="w-8 h-8" />
          </button>
          <img
            src={lightboxImage}
            alt="Gallery Image"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Album/Video Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h3>
                <button
                  onClick={closeLightbox}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedItem.description}</p>
              
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.mediaUrl}
                  controls
                  className="w-full rounded-lg"
                  poster={selectedItem.thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              ) : selectedItem.type === 'album' && selectedItem.albumImages ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedItem.albumImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedItem.title} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => openLightbox(image)}
                    />
                  ))}
                </div>
              ) : null}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    {selectedItem.photographer && (
                      <span>📸 {selectedItem.photographer}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <FiEye className="w-4 h-4 mr-1" />
                      {selectedItem.views} views
                    </div>
                    <div className="flex items-center">
                      <FiHeart className="w-4 h-4 mr-1" />
                      {selectedItem.likes} likes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Notice */}
      <section className="py-12 bg-purple-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-purple-500 p-6">
            <div className="flex items-start">
              <div className="bg-purple-100 rounded-full p-2 mr-4">
                <FiCamera className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Share Your Moments
                </h3>
                <p className="text-gray-600 mb-4">
                  Have photos or videos from school events? Share them with us to be featured in our gallery!
                </p>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                  Submit Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 