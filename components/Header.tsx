'use client'

import React, { useState } from 'react'
import { FiMenu, FiX, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { BiGlobe } from 'react-icons/bi'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState('en')

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en')
  }

  return (
    <>
      {/* Modern Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-3 px-4 text-sm border-b border-slate-700">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 lg:gap-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 transition-all duration-300 cursor-pointer group">
                <FiPhone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-xs sm:text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 transition-all duration-300 cursor-pointer group">
                <FiMail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-xs sm:text-sm">info@rpskhairekan.edu.in</span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-4">
              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 transition-all duration-300 px-3 py-1 rounded-full border border-slate-600 hover:border-orange-400 bg-slate-800/50 hover:bg-orange-400/10"
              >
                <BiGlobe className="w-4 h-4" />
                <span className="font-medium text-xs sm:text-sm">{language === 'en' ? 'हिंदी' : 'English'}</span>
              </button>
              <div className="flex items-center space-x-2 text-slate-300">
                <FiMapPin className="w-4 h-4" />
                <span className="font-medium text-xs sm:text-sm">Khairekan, Haryana</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Professional Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-5">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <span className="text-white font-bold text-xl">RP</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {language === 'en' ? 'RP Sr. Sec. School Khairekan' : 'आरपी सीनियर सेकेंडरी स्कूल खैरेकान'}
                  </h1>
                  <p className="text-sm text-slate-600 font-medium">
                    {language === 'en' ? 'CBSE Affiliated • Excellence in Education' : 'सीबीएसई संबद्ध • शिक्षा में उत्कृष्टता'}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
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
                  className="text-slate-700 hover:text-orange-500 font-medium transition-all duration-300 px-4 py-3 rounded-xl hover:bg-orange-50 relative group"
                >
                  {language === 'en' ? item.en : item.hi}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300"></span>
                </a>
              ))}
              <button className="btn-primary ml-8 relative overflow-hidden group">
                <span className="relative z-10 font-semibold">
                  {language === 'en' ? 'Admission Open 2026-27' : 'प्रवेश खुला 2026-27'}
                </span>
              </button>
            </nav>

            {/* Enhanced Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>

          {/* Clean Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-100 py-4">
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