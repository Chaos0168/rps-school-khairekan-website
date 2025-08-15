'use client'

import React, { useState, useEffect } from 'react'
import { FiMenu, FiX, FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi'
import { BiGlobe } from 'react-icons/bi'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const [currentTime, setCurrentTime] = useState(new Date())

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en')
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <>
      {/* Modern Top Bar - Hidden on mobile */}
      <div className="hidden sm:block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-2 px-4 text-sm border-b border-slate-700">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 transition-all duration-300 cursor-pointer group">
                <FiPhone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 transition-all duration-300 cursor-pointer group">
                <FiMail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-sm">info@rpskhairekan.edu.in</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-300 border border-slate-600 px-3 py-1 rounded-full bg-slate-800/50">
                <FiClock className="w-4 h-4 text-orange-400" />
                <div className="flex flex-col text-xs">
                  <span className="font-medium">{formatTime(currentTime)}</span>
                  <span className="text-slate-400">{formatDate(currentTime)}</span>
                </div>
              </div>
              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 transition-all duration-300 px-3 py-1 rounded-full border border-slate-600 hover:border-orange-400 bg-slate-800/50 hover:bg-orange-400/10"
              >
                <BiGlobe className="w-4 h-4" />
                <span className="font-medium text-sm">{language === 'en' ? 'हिंदी' : 'English'}</span>
              </button>
              <div className="flex items-center space-x-2 text-slate-300">
                <FiMapPin className="w-4 h-4" />
                <span className="font-medium text-sm">Khairekan, Haryana</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Responsive Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm w-full overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-full">
          <div className="flex items-center justify-between py-3 sm:py-4 min-h-[60px]">
            {/* Responsive Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 min-w-0 flex-1">
              <div className="flex items-center min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0">
                  <span className="text-white font-bold text-sm sm:text-lg">RP</span>
                </div>
                <div className="min-w-0 overflow-hidden">
                  <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent whitespace-nowrap overflow-hidden text-ellipsis">
                    {language === 'en' ? 'R.P. Sr. Sec. School' : 'आर.पी. सीनियर सेकेंडरी स्कूल'}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {language === 'en' ? 'Khairekan, Haryana' : 'खैरेकान, हरियाणा'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation for all screens */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Desktop Navigation - shows on medium+ screens */}
              <nav className="hidden lg:flex items-center space-x-1">
                {[
                  { en: 'Home', hi: 'मुख्य' },
                  { en: 'About', hi: 'के बारे में' },
                  { en: 'Academics', hi: 'शैक्षणिक' },
                  { en: 'Notices', hi: 'सूचनाएं' },
                  { en: 'News', hi: 'समाचार' },
                  { en: 'Gallery', hi: 'गैलरी' },
                ].map((item, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="text-slate-700 hover:text-orange-500 font-medium transition-all duration-300 px-2 py-2 rounded-lg hover:bg-orange-50 text-sm whitespace-nowrap"
                  >
                    {language === 'en' ? item.en : item.hi}
                  </a>
                ))}
              </nav>
              
              {/* Admission Button - always visible */}
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 sm:px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-xs whitespace-nowrap flex-shrink-0">
                {language === 'en' ? 'Admission' : 'प्रवेश'}
              </button>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0 z-50 relative"
              >
                {isMenuOpen ? (
                  <FiX className="w-5 h-5 text-gray-700" />
                ) : (
                  <FiMenu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>


          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-100 py-4 overflow-hidden">
              <nav className="flex flex-col space-y-2">
                {[
                  { en: 'Home', hi: 'मुख्य' },
                  { en: 'About', hi: 'के बारे में' },
                  { en: 'Academics', hi: 'शैक्षणिक' },
                  { en: 'Notices', hi: 'सूचनाएं' },
                  { en: 'News', hi: 'समाचार' },
                  { en: 'Gallery', hi: 'गैलरी' },
                ].map((item, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-slate-50"
                  >
                    {language === 'en' ? item.en : item.hi}
                  </a>
                ))}
                <div className="pt-2">
                  <button className="btn-primary w-full">
                    {language === 'en' ? 'Admission Open 2026-27' : 'प्रवेश खुला 2026-27'}
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
} 