 'use client'

import React, { useState, useEffect } from 'react'
import { FiUsers, FiBookOpen, FiFileText, FiSettings, FiBell, FiEdit3, FiEye, FiTrash2, FiPlus, FiBook, FiAward, FiBarChart, FiCalendar, FiMail, FiHome, FiLogOut, FiMenu, FiX, FiLogOut as FiGatePass } from 'react-icons/fi'
import NoticesManager from '../../components/NoticesManager'
import NewsManager from '../../components/NewsManager'
import ThoughtsManager from '../../components/ThoughtsManager'
import ClassesManager from '../../components/ClassesManager'
import TermsManager from '../../components/TermsManager'
import SubjectsManager from '../../components/SubjectsManager'
import GatePassManager from '../../components/GatePassManager'
import AcademicResourcesManager from '../../components/AcademicResourcesManager'
import AdmissionTestManager from '../../components/AdmissionTestManager'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
}

interface AdminStats {
  totalStudents: number
  totalTeachers: number
  totalResources: number
  totalQuizzes: number
  activeNotices: number
  recentNews: number
}

interface Notice {
  id: string
  title: string
  content: string
  isUrgent: boolean
  isPublished: boolean
  publishDate: string
  expiryDate?: string
}

interface News {
  id: string
  title: string
  content: string
  excerpt?: string
  isPublished: boolean
  publishDate: string
}

interface ThoughtOfTheDay {
  id: string
  quote: string
  author: string
  hindiQuote?: string
  hindiAuthor?: string
  isActive: boolean
  date: string
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalResources: 0,
    totalQuizzes: 0,
    activeNotices: 0,
    recentNews: 0
  })
  const [notices, setNotices] = useState<Notice[]>([])
  const [news, setNews] = useState<News[]>([])
  const [thoughts, setThoughts] = useState<ThoughtOfTheDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showGatePassManager, setShowGatePassManager] = useState(false)

  // Check authentication and load user data
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      window.location.href = '/'
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      alert('Unauthorized access. Admin only.')
      window.location.href = '/'
      return
    }

    setUser(parsedUser)
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load all necessary data for dashboard
      await Promise.all([
        loadStats(),
        loadNotices(),
        loadNews(),
        loadThoughts()
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadNotices = async () => {
    try {
      const response = await fetch('/api/admin/notices')
      if (response.ok) {
        const data = await response.json()
        setNotices(data)
      }
    } catch (error) {
      console.error('Error loading notices:', error)
    }
  }

  const loadNews = async () => {
    try {
      const response = await fetch('/api/admin/news')
      if (response.ok) {
        const data = await response.json()
        setNews(data)
      }
    } catch (error) {
      console.error('Error loading news:', error)
    }
  }

  const loadThoughts = async () => {
    try {
      const response = await fetch('/api/admin/thoughts')
      if (response.ok) {
        const data = await response.json()
        setThoughts(data)
      }
    } catch (error) {
      console.error('Error loading thoughts:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiBarChart },
    { id: 'notices', label: 'Notices', icon: FiBell },
    { id: 'news', label: 'News', icon: FiFileText },
    { id: 'thoughts', label: 'Thought of Day', icon: FiEdit3 },
    { id: 'gate-pass', label: 'Gate Pass', icon: FiGatePass },
    { id: 'admission-test', label: 'Admission Test', icon: FiUsers },
    { id: 'academic-resources', label: 'Academic Resources', icon: FiAward },
    { id: 'users', label: 'User Management', icon: FiUsers },
    { id: 'academic', label: 'Academic Structure', icon: FiBookOpen },
    { id: 'resources', label: 'Resources & Quizzes', icon: FiBook },
    { id: 'settings', label: 'School Settings', icon: FiSettings }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 lg:p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-lg">RP</span>
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Admin Panel</h2>
                <p className="text-xs lg:text-sm text-gray-600">R.P. Sr. Sec. School</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="mt-4 lg:mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 lg:px-6 py-3 text-left transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm lg:text-base">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 lg:p-6 border-t bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">{user?.name?.[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 flex items-center justify-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 text-xs lg:text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiHome className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 text-xs lg:text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 overflow-auto">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4 lg:py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base hidden sm:block">Manage your school's digital presence</p>
              </div>
            </div>
            <div className="text-xs lg:text-sm text-gray-500 hidden md:block">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {activeTab === 'dashboard' && user && <DashboardView stats={stats} user={user} />}
          {activeTab === 'notices' && user && <NoticesManager userId={user.id} />}
          {activeTab === 'news' && user && <NewsManager userId={user.id} />}
          {activeTab === 'thoughts' && user && <ThoughtsManager userId={user.id} />}
          {activeTab === 'gate-pass' && user && <GatePassView user={user} />}
          {activeTab === 'admission-test' && <AdmissionTestManager />}
          {activeTab === 'academic-resources' && user && <AcademicResourcesManager userId={user.id} />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'academic' && <AcademicManagement />}
          {activeTab === 'resources' && <ResourceManagement />}
          {activeTab === 'settings' && <SchoolSettings />}
        </div>
      </main>
    </div>
  )
}

// Dashboard Component
function DashboardView({ stats, user }: { stats: AdminStats; user: any }) {
  const [showGatePassManager, setShowGatePassManager] = useState(false)
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[
          { label: 'Total Students', value: stats.totalStudents, icon: FiUsers, color: 'blue' },
          { label: 'Total Teachers', value: stats.totalTeachers, icon: FiAward, color: 'green' },
          { label: 'Total Resources', value: stats.totalResources, icon: FiBook, color: 'purple' },
          { label: 'Active Quizzes', value: stats.totalQuizzes, icon: FiEdit3, color: 'orange' },
          { label: 'Active Notices', value: stats.activeNotices, icon: FiBell, color: 'red' },
          { label: 'Recent News', value: stats.recentNews, icon: FiFileText, color: 'indigo' }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg lg:rounded-xl shadow-sm border p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-${stat.color}-100 rounded-lg lg:rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 lg:w-6 lg:h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {[
            { label: 'Add Notice', icon: FiBell, color: 'red', action: () => window.location.href = '/admin?tab=notices' },
            { label: 'Create News', icon: FiFileText, color: 'blue', action: () => window.location.href = '/admin?tab=news' },
            { label: 'Update Thought', icon: FiEdit3, color: 'purple', action: () => window.location.href = '/admin?tab=thoughts' },
            { label: 'Gate Pass', icon: FiGatePass, color: 'orange', action: () => setShowGatePassManager(true) }
          ].map((action, index) => {
            const Icon = action.icon
            return (
              <button 
                key={index} 
                onClick={action.action}
                className="p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
              >
                <Icon className={`w-5 h-5 lg:w-6 lg:h-6 text-${action.color}-600 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <p className="text-xs lg:text-sm font-medium text-gray-700">{action.label}</p>
              </button>
            )
          })}
        </div>
      </div>

      {showGatePassManager && user && (
        <GatePassManager onClose={() => setShowGatePassManager(false)} userId={user.id} />
      )}
    </div>
  )
}

// Placeholder components for other tabs

function UserManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          onClick={() => {
            alert('User management feature coming soon!')
          }}
        >
          <FiPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <p className="text-gray-600">User management functionality will be implemented here.</p>
          <p className="text-sm text-gray-500 mt-2">Features: Add/edit/delete users, assign roles, manage classes, bulk imports</p>
        </div>
      </div>
    </div>
  )
}

function AcademicManagement() {
  const [activeSection, setActiveSection] = useState('overview')

  if (activeSection === 'classes') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveSection('overview')}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
          >
            <span>← Back to Overview</span>
          </button>
        </div>
        <ClassesManager />
      </div>
    )
  }

  if (activeSection === 'terms') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveSection('overview')}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
          >
            <span>← Back to Overview</span>
          </button>
        </div>
        <TermsManager />
      </div>
    )
  }

  if (activeSection === 'subjects') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveSection('overview')}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
          >
            <span>← Back to Overview</span>
          </button>
        </div>
        <SubjectsManager />
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Academic Structure Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Classes</h3>
          <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">Manage class structure</p>
          <button 
            onClick={() => setActiveSection('classes')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 lg:py-3 rounded-lg transition-colors text-sm lg:text-base"
          >
            Manage Classes
          </button>
        </div>
        
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Terms</h3>
          <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">Manage academic terms</p>
          <button 
            onClick={() => setActiveSection('terms')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 lg:py-3 rounded-lg transition-colors text-sm lg:text-base"
          >
            Manage Terms
          </button>
        </div>
        
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border p-4 lg:p-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Subjects</h3>
          <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">Manage subjects & syllabus</p>
          <button 
            onClick={() => setActiveSection('subjects')}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 lg:py-3 rounded-lg transition-colors text-sm lg:text-base"
          >
            Manage Subjects
          </button>
        </div>
      </div>
    </div>
  )
}

function ResourceManagement() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Resources & Quizzes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Library</h3>
          <p className="text-gray-600 mb-4">Manage syllabi, question papers, and educational resources</p>
          <button 
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
            onClick={() => {
              window.location.href = '/examinations'
            }}
          >
            Manage Resources
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Management</h3>
          <p className="text-gray-600 mb-4">Create and manage quizzes and assessments</p>
          <button 
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg"
            onClick={() => {
              window.location.href = '/examinations'
            }}
          >
            Manage Quizzes
          </button>
        </div>
      </div>
    </div>
  )
}

function GatePassView({ user }: { user: any }) {
  const [showGatePassManager, setShowGatePassManager] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gate Pass Management</h2>
          <p className="text-gray-600 mt-1">Issue gate passes for students leaving school premises</p>
        </div>
        <button 
          onClick={() => setShowGatePassManager(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Create Gate Pass
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiGatePass className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Gate Passes Created Yet</h3>
          <p className="text-gray-600 mb-4">Start by creating your first gate pass for a student</p>
          <button 
            onClick={() => setShowGatePassManager(true)}
            className="btn-primary"
          >
            Create First Gate Pass
          </button>
        </div>
      </div>

      {showGatePassManager && (
        <GatePassManager onClose={() => setShowGatePassManager(false)} userId={user.id} />
      )}
    </div>
  )
}

function SchoolSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">School Settings</h2>
      
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <p className="text-gray-600">School settings management functionality will be implemented here.</p>
          <p className="text-sm text-gray-500 mt-2">Features: School information, contact details, academic calendar, fee structure</p>
        </div>
      </div>
    </div>
  )
} 