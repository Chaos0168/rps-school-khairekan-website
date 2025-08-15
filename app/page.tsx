'use client'

import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'

export default function HomePage() {
  const [currentStory, setCurrentStory] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const stories = [
    "Where Dreams Take Flight",
    "Where Innovation Meets Tradition", 
    "Where Every Child Shines"
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStory((prev) => (prev + 1) % stories.length)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 350)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Emotional Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden emotional-gradient">
        <div className="floating-elements"></div>
        <div className="hero-overlay absolute inset-0"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-reveal mb-4 px-2 py-2 h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 flex items-center justify-center">
              <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light kinetic-text break-words" style={{lineHeight: '1.3'}}>
                विद्या ददाति विनयम्
              </span>
            </div>
            
            <div className="h-16 md:h-20 flex items-center justify-center mb-6">
              <h1 className={`text-3xl md:text-5xl font-light transition-all duration-700 ease-in-out transform ${
                isTransitioning ? 'opacity-0 translate-y-4 scale-95' : 'opacity-90 translate-y-0 scale-100'
              }`}>
                {stories[currentStory]}
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed font-light opacity-90">
              At RP Sr. Sec. School Khairekan, we don't just educate minds – we nurture souls, 
              ignite passions, and sculpt the visionary leaders who will shape tomorrow's India.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="btn-primary group">
                <span className="relative z-10">Admission Open 2026-27</span>
              </button>
              <button className="btn-secondary">
                Experience Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers with Emotional Stories */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Stories That <span className="kinetic-text">Inspire</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Behind every number lies a heartwarming story of profound transformation, extraordinary growth, and impossible dreams becoming beautiful realities
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { 
                number: "2,500+", 
                label: "Dreams Nurtured", 
                story: "Young brilliant minds discovering their boundless passion for transformative learning",
                hindi: "सपने पाले गए"
              },
              { 
                number: "150+", 
                label: "Mentors & Guides", 
                story: "Dedicated master educators shaping brilliant futures with unwavering love and care",
                hindi: "गुरु और मार्गदर्शक"
              },
              { 
                number: "25+", 
                label: "Years of Excellence", 
                story: "A glorious legacy of transforming countless lives across Haryana and beyond",
                hindi: "वर्षों की उत्कृष्टता"
              },
              { 
                number: "99.2%", 
                label: "Success Stories", 
                story: "Extraordinary students achieving their wildest dreams and soaring far beyond",
                hindi: "सफलता की कहानियां"
              }
            ].map((stat, index) => (
              <div key={index} className="story-card micro-interaction px-4 py-6">
                <div className="impact-number mb-4">
                  {stat.number}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 leading-tight">{stat.label}</h3>
                <p className="text-gray-600 text-sm mb-2 leading-relaxed px-2">{stat.story}</p>
                <p className="text-xs text-gray-500 font-hindi leading-relaxed">{stat.hindi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Emotional Connection */}
      <section className="py-24 relative bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Why Families <span className="kinetic-text text-red-500">Choose</span> RP Sr. Sec. School?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              Because every child deserves an education that touches their soul, ignites their potential, and transforms their dreams into reality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
            {[
              {
                icon: "🏛️",
                title: "CBSE Excellence",
                story: "Arjun from a humble farming family scored 98% and secured IIT Delhi. His extraordinary journey began with our unwavering CBSE foundation.",
                impact: "Top 1% Results Nationally"
              },
              {
                icon: "💝",
                title: "Values That Matter",
                story: "Priya organized a food drive for 500 families during COVID. Our values education doesn't just teach – it transforms hearts.",
                impact: "500+ Community Projects"
              },
              {
                icon: "🚀",
                title: "Innovation Hub",
                story: "Rahul's groundbreaking AI project conquered the National Science Fair. Our state-of-the-art labs turn wild curiosity into world-changing innovation.",
                impact: "50+ National Awards"
              },
              {
                icon: "🌟",
                title: "Individual Attention",
                story: "Shy, introverted Meera blossomed into Student Council President. Our intimate class sizes ensure every precious voice is not just heard – but celebrated.",
                impact: "15:1 Student-Teacher Ratio"
              },
              {
                icon: "🏆",
                title: "Dreams Realized",
                story: "Amit secured a prestigious Oxford scholarship for Economics. We don't just teach subjects – we unlock hidden potential and create legends.",
                impact: "25+ International Scholarships"
              },
              {
                icon: "❤️",
                title: "Extended Family",
                story: "When Kavya's father was hospitalized, our entire school family rallied around her. Here, no child ever faces life's storms alone.",
                impact: "One Family, 2500+ Hearts"
              }
            ].map((feature, index) => (
              <div key={index} className="story-card group text-center px-4 py-6">
                <div className="feature-icon text-4xl sm:text-5xl md:text-6xl mb-6 group-hover:scale-110 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed italic">
                  "{feature.story}"
                </p>
                <div className="text-sm font-semibold text-orange-500 bg-orange-50 rounded-full px-4 py-2 inline-block">
                  {feature.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notices & News Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Stay <span className="kinetic-text text-orange-500">Updated</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Crucial updates, inspiring achievements, and daily motivation that keeps our vibrant school community connected and thriving
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {/* Important Notices */}
            <div className="story-card">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📢</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Important Notices</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Admission Test Schedule",
                    date: "15 Jan 2025",
                    urgent: true
                  },
                  {
                    title: "Parent-Teacher Meeting",
                    date: "20 Jan 2025",
                    urgent: false
                  },
                  {
                    title: "Annual Sports Day",
                    date: "25 Jan 2025",
                    urgent: false
                  },
                  {
                    title: "Fee Submission Deadline",
                    date: "31 Jan 2025",
                    urgent: true
                  }
                ].map((notice, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-4 py-2 hover:bg-orange-50 transition-colors duration-300">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900">{notice.title}</h4>
                      {notice.urgent && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">URGENT</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{notice.date}</p>
                  </div>
                ))}
              </div>
              <button className="mt-6 text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-300">
                View All Notices →
              </button>
            </div>

            {/* Latest News */}
            <div className="story-card">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📰</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Latest News</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "RP Sr. Sec. School Students Win State Science Fair",
                    excerpt: "Our brilliant Class XII students dominated the robotics category, showcasing innovation that left judges speechless...",
                    date: "12 Jan 2025"
                  },
                  {
                    title: "Cutting-Edge Computer Lab Unveiled",
                    excerpt: "Revolutionary computer lab with 50 advanced systems and AI capabilities now operational...",
                    date: "10 Jan 2025"
                  },
                  {
                    title: "Teacher Training Program Success",
                    excerpt: "All faculty completed advanced pedagogy training...",
                    date: "8 Jan 2025"
                  }
                ].map((news, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{news.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{news.excerpt}</p>
                    <p className="text-xs text-gray-500">{news.date}</p>
                  </div>
                ))}
              </div>
              <button className="mt-6 text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-300">
                Read All News →
              </button>
            </div>

            {/* Thought of the Day */}
            <div className="story-card bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">💭</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Thought of the Day</h3>
              </div>
              
              <div className="text-center py-6">
                <blockquote className="text-lg sm:text-xl font-medium text-gray-800 mb-4 italic">
                  "Education is the most powerful weapon which you can use to change the world."
                </blockquote>
                <cite className="text-purple-600 font-semibold">- Nelson Mandela</cite>
              </div>

              <div className="mt-8 p-4 bg-white/80 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Hindi Thought</h4>
                <blockquote className="text-base sm:text-lg font-medium text-gray-800 mb-2 font-hindi">
                  "शिक्षा सबसे शक्तिशाली हथियार है जिससे आप दुनिया बदल सकते हैं।"
                </blockquote>
                <cite className="text-purple-600 font-semibold">- नेल्सन मंडेला</cite>
              </div>

              <div className="mt-6 text-center">
                <button className="text-purple-500 font-semibold hover:text-purple-600 transition-colors duration-300">
                  Previous Thoughts →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories - Real Students */}
      <section className="py-24 emotional-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold text-white mb-6">
              Real Stories, Real <span className="kinetic-text">Dreams</span>
            </h2>
            <p className="text-2xl text-white/90 max-w-4xl mx-auto">
              Meet the faces behind our success - students who dared to dream and achieved the extraordinary
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Arjun Sharma",
                achievement: "IIT Delhi, Computer Science",
                quote: "RP Sr. Sec. School didn't just teach me subjects – they taught me to dream beyond horizons I never knew existed. They turned an ordinary village boy into someone extraordinary.",
                year: "Batch of 2023",
                highlight: "From village boy to IIT topper"
              },
              {
                name: "Priya Gupta", 
                achievement: "AIIMS Delhi, Medicine",
                quote: "The teachers here saw potential in me when I couldn't see it myself. They never gave up.",
                year: "Batch of 2022",
                highlight: "First doctor in her family"
              },
              {
                name: "Rahul Singh",
                achievement: "Stanford University, AI Research",
                quote: "RP Sr. Sec. School gave me wings to soar globally. In these hallowed halls, dreams don't just take flight – they conquer the world.",
                year: "Batch of 2021", 
                highlight: "Youngest patent holder from Haryana"
              }
            ].map((student, index) => (
              <div key={index} className="success-story p-8 text-white">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold mb-2">{student.name}</h3>
                <div className="text-orange-300 font-semibold mb-4">{student.achievement}</div>
                <blockquote className="text-lg italic mb-4 leading-relaxed">
                  "{student.quote}"
                </blockquote>
                <div className="text-sm text-white/70 mb-2">{student.year}</div>
                <div className="text-sm font-semibold text-yellow-300">{student.highlight}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Emotional */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              Your Child's <span className="kinetic-text text-red-500">Journey</span> Starts Here
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed px-2">
              Every legendary journey begins with a single courageous step. Let's co-author your child's extraordinary success story together 
              at RP Sr. Sec. School Khairekan, where impossible dreams transform into inevitable realities.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {[
                {
                  step: "01",
                  title: "Schedule a Visit",
                  desc: "Experience our campus, meet our teachers, feel the warmth of our community"
                },
                {
                  step: "02", 
                  title: "Meet Our Family",
                  desc: "Speak with parents, students, and teachers who'll share their real experiences"
                },
                {
                  step: "03",
                  title: "Begin the Journey",
                  desc: "Join our family and watch your child's confidence and potential flourish"
                }
              ].map((step, index) => (
                <div key={index} className="story-card text-center p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-3 sm:mb-4">{step.step}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <button className="btn-primary text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 w-full sm:w-auto">
                Start Your Child's Journey
              </button>
              <button className="btn-secondary text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 w-full sm:w-auto">
                Schedule Campus Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact with Heart */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="kinetic-text text-orange-400">Connect?</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              We're here to answer every question and warmly welcome you into our extraordinary family where excellence meets compassion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: "🏫",
                title: "Visit Our Campus",
                info: "RP Sr. Sec. School Campus\nKhairekan, Haryana - 125055\nNear Sirsa",
                action: "Get Directions"
              },
              {
                icon: "📞",
                title: "Call Our Family",
                info: "+91 98765 43210\n+91 98765 43211\nOpen: Mon-Sat, 8 AM - 6 PM",
                action: "Call Now"
              },
              {
                icon: "💌",
                title: "Send a Message",
                info: "info@rpskhairekan.edu.in\nadmissions@rpskhairekan.edu.in\nWe reply within 2 hours",
                action: "Email Us"
              }
            ].map((contact, index) => (
              <div key={index} className="story-card bg-gray-800 border-gray-700 text-center">
                <div className="text-3xl sm:text-4xl mb-4">{contact.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-4">{contact.title}</h3>
                <p className="text-gray-300 whitespace-pre-line mb-6 leading-relaxed">
                  {contact.info}
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:transform hover:scale-105 text-sm sm:text-base">
                  {contact.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-16 relative overflow-hidden">
        <div className="floating-elements"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* School Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
                  <span className="text-white font-bold text-2xl">RP</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">
                    RP Sr. Sec. School <span className="text-orange-400">Khairekan</span>
                  </h3>
                  <p className="text-gray-400">
                    Where Every Dream Finds Its Wings to Soar Beyond Horizons
                  </p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                              Empowering brilliant minds, nurturing compassionate hearts, and sculpting the visionary leaders who will illuminate tomorrow's India. 
              Join our extraordinary family where timeless traditions dance with cutting-edge innovation.
              </p>
              <div className="text-orange-300 font-hindi text-lg">
                जहाँ हर सपना पंख पाकर आसमान छूता है
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-orange-400">Quick Links</h4>
              <ul className="space-y-3">
                {['About Us', 'Academics', 'Admissions', 'Notices', 'News', 'Gallery'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 hover:translate-x-2 transform inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-orange-400">Get in Touch</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FiMapPin className="w-5 h-5 text-orange-400 mt-1" />
                  <div className="text-gray-300">
                    <p>RP Sr. Sec. School Campus</p>
                    <p>Khairekan, Haryana - 125055</p>
                    <p>Near Sirsa</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="w-5 h-5 text-orange-400" />
                  <p className="text-gray-300">+91 98765 43210</p>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMail className="w-5 h-5 text-orange-400" />
                  <p className="text-gray-300">info@rpskhairekan.edu.in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2025 RP Sr. Sec. School Khairekan. All rights reserved.
            </div>
            <div className="text-gray-400">
              Made with <span className="text-red-400 animate-pulse">❤️</span> for our students' bright future
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 