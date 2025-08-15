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
              At RPS School Khairekan, we don't just educate minds – we nurture hearts, 
              inspire dreams, and build the confident leaders of tomorrow's India.
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
              Behind every number is a story of transformation, growth, and dreams realized
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { 
                number: "2,500+", 
                label: "Dreams Nurtured", 
                story: "Young minds discovering their passion for learning",
                hindi: "सपने पाले गए"
              },
              { 
                number: "150+", 
                label: "Mentors & Guides", 
                story: "Dedicated teachers shaping futures with care",
                hindi: "गुरु और मार्गदर्शक"
              },
              { 
                number: "25+", 
                label: "Years of Excellence", 
                story: "A legacy of transforming lives in Haryana",
                hindi: "वर्षों की उत्कृष्टता"
              },
              { 
                number: "99.2%", 
                label: "Success Stories", 
                story: "Students achieving their dreams and beyond",
                hindi: "सफलता की कहानियां"
              }
            ].map((stat, index) => (
              <div key={index} className="story-card micro-interaction">
                <div className="impact-number mb-4">
                  {stat.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{stat.label}</h3>
                <p className="text-gray-600 text-sm mb-2">{stat.story}</p>
                <p className="text-xs text-gray-500 font-hindi">{stat.hindi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Emotional Connection */}
      <section className="py-24 relative bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold text-gray-900 mb-6">
              Why Families <span className="kinetic-text text-red-500">Choose</span> RPS?
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Because every child deserves an education that touches their heart and ignites their potential
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              {
                icon: "🏛️",
                title: "CBSE Excellence",
                story: "Arjun from Class XII scored 98% and got into IIT Delhi. His journey started with our CBSE foundation.",
                impact: "Top 1% Results Nationally"
              },
              {
                icon: "💝",
                title: "Values That Matter",
                story: "Priya organized a food drive for 500 families during COVID. Our values education shapes character.",
                impact: "500+ Community Projects"
              },
              {
                icon: "🚀",
                title: "Innovation Hub",
                story: "Rahul's AI project won National Science Fair. Our tech labs turn curiosity into innovation.",
                impact: "50+ National Awards"
              },
              {
                icon: "🌟",
                title: "Individual Attention",
                story: "Shy Meera became Student Council President. Small classes mean every voice is heard.",
                impact: "15:1 Student-Teacher Ratio"
              },
              {
                icon: "🏆",
                title: "Dreams Realized",
                story: "Amit got Oxford scholarship for Economics. We don't just teach subjects, we unlock potential.",
                impact: "25+ International Scholarships"
              },
              {
                icon: "❤️",
                title: "Extended Family",
                story: "When Kavya's father was hospitalized, our entire school became her support system.",
                impact: "One Family, 2500+ Hearts"
              }
            ].map((feature, index) => (
              <div key={index} className="story-card group text-center">
                <div className="feature-icon text-6xl mb-6 group-hover:scale-110 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
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
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Stay <span className="kinetic-text text-orange-500">Updated</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Important notices, latest news, and daily inspiration for our school community
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Important Notices */}
            <div className="story-card">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📢</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Important Notices</h3>
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
                <h3 className="text-2xl font-bold text-gray-900">Latest News</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "RPS Students Win State Science Fair",
                    excerpt: "Our Class XII students secured first place in robotics category...",
                    date: "12 Jan 2025"
                  },
                  {
                    title: "New Computer Lab Inauguration",
                    excerpt: "State-of-the-art computer lab with 50 systems now open...",
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
                <h3 className="text-2xl font-bold text-gray-900">Thought of the Day</h3>
              </div>
              
              <div className="text-center py-6">
                <blockquote className="text-xl font-medium text-gray-800 mb-4 italic">
                  "Education is the most powerful weapon which you can use to change the world."
                </blockquote>
                <cite className="text-purple-600 font-semibold">- Nelson Mandela</cite>
              </div>

              <div className="mt-8 p-4 bg-white/80 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Hindi Thought</h4>
                <blockquote className="text-lg font-medium text-gray-800 mb-2 font-hindi">
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
                quote: "RPS didn't just teach me subjects - they taught me to dream bigger than I ever imagined.",
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
                quote: "RPS gave me the foundation to compete globally. My dreams had no boundaries here.",
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold text-gray-900 mb-8">
              Your Child's <span className="kinetic-text text-red-500">Journey</span> Starts Here
            </h2>
            <p className="text-2xl text-gray-600 mb-12 leading-relaxed">
              Every great story begins with a single step. Let's write your child's success story together 
              at RPS School Khairekan, where dreams become reality.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
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
                <div key={index} className="story-card text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="btn-primary text-xl px-12 py-6">
                Start Your Child's Journey
              </button>
              <button className="btn-secondary text-xl px-12 py-6">
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
            <h2 className="text-5xl font-bold mb-6">
              Ready to <span className="kinetic-text text-orange-400">Connect?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're here to answer your questions and welcome you into our family
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: "🏫",
                title: "Visit Our Campus",
                info: "RPS School Campus\nKhairekan, Haryana - 125055\nNear Sirsa",
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
                <div className="text-4xl mb-4">{contact.icon}</div>
                <h3 className="text-xl font-bold mb-4">{contact.title}</h3>
                <p className="text-gray-300 whitespace-pre-line mb-6 leading-relaxed">
                  {contact.info}
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:transform hover:scale-105">
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
                  <span className="text-white font-bold text-2xl">RPS</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    RPS School <span className="text-orange-400">Khairekan</span>
                  </h3>
                  <p className="text-gray-400">
                    Where Every Dream Finds Its Wings
                  </p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Empowering minds, nurturing hearts, and building the confident leaders of tomorrow's India. 
                Join our family where tradition meets innovation.
              </p>
              <div className="text-orange-300 font-hindi text-lg">
                जहाँ हर सपना पंख पाता है
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
                    <p>RPS School Campus</p>
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
              © 2025 RPS School Khairekan. All rights reserved.
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