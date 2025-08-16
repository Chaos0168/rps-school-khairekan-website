'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import AdminUploadModal from '../../components/AdminUploadModal'
import { FiBook, FiFileText, FiDownload, FiUpload, FiChevronRight, FiClock, FiUsers, FiAward, FiPlay, FiCheck, FiEdit, FiUser, FiTrash2 } from 'react-icons/fi'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface Quiz {
  id: number
  title: string
  description: string
  duration: number
  totalQuestions: number
  questions: QuizQuestion[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  completed?: boolean
  score?: number
}

interface Resource {
  id: number
  title: string
  type: 'syllabus' | 'question_paper' | 'quiz'
  description: string
  fileUrl?: string
  uploadDate: string
  uploadedBy: string
  quiz?: Quiz
}

interface Subject {
  id: number
  name: string
  code: string
  resources: Resource[]
}

interface Term {
  id: number
  name: string
  subjects: Subject[]
}

interface Class {
  id: number
  name: string
  description: string
  terms: Term[]
}

// Mock data - will be replaced with real API data
const mockClasses: Class[] = [
  {
    id: 1,
    name: "Nursery",
    description: "Early childhood development with play-based learning",
    terms: [
      {
        id: 1,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 1,
            name: "English",
            code: "ENG-N",
            resources: []
          },
          {
            id: 2,
            name: "Hindi",
            code: "HIN-N",
            resources: []
          },
          {
            id: 3,
            name: "Mathematics",
            code: "MATH-N",
            resources: []
          },
          {
            id: 4,
            name: "EVS",
            code: "EVS-N",
            resources: []
          }
        ]
      },
      {
        id: 2,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 1,
            name: "English",
            code: "ENG-N",
            resources: []
          },
          {
            id: 2,
            name: "Hindi",
            code: "HIN-N",
            resources: []
          },
          {
            id: 3,
            name: "Mathematics",
            code: "MATH-N",
            resources: []
          },
          {
            id: 4,
            name: "EVS",
            code: "EVS-N",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "LKG",
    description: "Lower Kindergarten with foundational skills development",
    terms: [
      {
        id: 3,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 5,
            name: "English",
            code: "ENG-LKG",
            resources: []
          },
          {
            id: 6,
            name: "Hindi",
            code: "HIN-LKG",
            resources: []
          },
          {
            id: 7,
            name: "Mathematics",
            code: "MATH-LKG",
            resources: []
          },
          {
            id: 8,
            name: "EVS",
            code: "EVS-LKG",
            resources: []
          }
        ]
      },
      {
        id: 4,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 5,
            name: "English",
            code: "ENG-LKG",
            resources: []
          },
          {
            id: 6,
            name: "Hindi",
            code: "HIN-LKG",
            resources: []
          },
          {
            id: 7,
            name: "Mathematics",
            code: "MATH-LKG",
            resources: []
          },
          {
            id: 8,
            name: "EVS",
            code: "EVS-LKG",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "UKG",
    description: "Upper Kindergarten with pre-primary preparation",
    terms: [
      {
        id: 5,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 9,
            name: "English",
            code: "ENG-UKG",
            resources: []
          },
          {
            id: 10,
            name: "Hindi",
            code: "HIN-UKG",
            resources: []
          },
          {
            id: 11,
            name: "Mathematics",
            code: "MATH-UKG",
            resources: []
          },
          {
            id: 12,
            name: "EVS",
            code: "EVS-UKG",
            resources: []
          }
        ]
      },
      {
        id: 6,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 9,
            name: "English",
            code: "ENG-UKG",
            resources: []
          },
          {
            id: 10,
            name: "Hindi",
            code: "HIN-UKG",
            resources: []
          },
          {
            id: 11,
            name: "Mathematics",
            code: "MATH-UKG",
            resources: []
          },
          {
            id: 12,
            name: "EVS",
            code: "EVS-UKG",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Class I",
    description: "Primary level with basic concept introduction",
    terms: [
      {
        id: 7,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 13,
            name: "English",
            code: "ENG-1",
            resources: []
          },
          {
            id: 14,
            name: "Hindi",
            code: "HIN-1",
            resources: []
          },
          {
            id: 15,
            name: "Mathematics",
            code: "MATH-1",
            resources: []
          },
          {
            id: 16,
            name: "EVS",
            code: "EVS-1",
            resources: []
          }
        ]
      },
      {
        id: 8,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 13,
            name: "English",
            code: "ENG-1",
            resources: []
          },
          {
            id: 14,
            name: "Hindi",
            code: "HIN-1",
            resources: []
          },
          {
            id: 15,
            name: "Mathematics",
            code: "MATH-1",
            resources: []
          },
          {
            id: 16,
            name: "EVS",
            code: "EVS-1",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Class II",
    description: "Primary level with skill building focus",
    terms: [
      {
        id: 9,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 17,
            name: "English",
            code: "ENG-2",
            resources: []
          },
          {
            id: 18,
            name: "Hindi",
            code: "HIN-2",
            resources: []
          },
          {
            id: 19,
            name: "Mathematics",
            code: "MATH-2",
            resources: []
          },
          {
            id: 20,
            name: "EVS",
            code: "EVS-2",
            resources: []
          }
        ]
      },
      {
        id: 10,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 17,
            name: "English",
            code: "ENG-2",
            resources: []
          },
          {
            id: 18,
            name: "Hindi",
            code: "HIN-2",
            resources: []
          },
          {
            id: 19,
            name: "Mathematics",
            code: "MATH-2",
            resources: []
          },
          {
            id: 20,
            name: "EVS",
            code: "EVS-2",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Class III",
    description: "Elementary level with conceptual understanding",
    terms: [
      {
        id: 11,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 21,
            name: "English",
            code: "ENG-3",
            resources: []
          },
          {
            id: 22,
            name: "Hindi",
            code: "HIN-3",
            resources: []
          },
          {
            id: 23,
            name: "Mathematics",
            code: "MATH-3",
            resources: []
          },
          {
            id: 24,
            name: "EVS",
            code: "EVS-3",
            resources: []
          }
        ]
      },
      {
        id: 12,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 21,
            name: "English",
            code: "ENG-3",
            resources: []
          },
          {
            id: 22,
            name: "Hindi",
            code: "HIN-3",
            resources: []
          },
          {
            id: 23,
            name: "Mathematics",
            code: "MATH-3",
            resources: []
          },
          {
            id: 24,
            name: "EVS",
            code: "EVS-3",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 7,
    name: "Class IV",
    description: "Elementary level with advanced concepts",
    terms: [
      {
        id: 13,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 25,
            name: "English",
            code: "ENG-4",
            resources: []
          },
          {
            id: 26,
            name: "Hindi",
            code: "HIN-4",
            resources: []
          },
          {
            id: 27,
            name: "Mathematics",
            code: "MATH-4",
            resources: []
          },
          {
            id: 28,
            name: "EVS",
            code: "EVS-4",
            resources: []
          }
        ]
      },
      {
        id: 14,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 25,
            name: "English",
            code: "ENG-4",
            resources: []
          },
          {
            id: 26,
            name: "Hindi",
            code: "HIN-4",
            resources: []
          },
          {
            id: 27,
            name: "Mathematics",
            code: "MATH-4",
            resources: []
          },
          {
            id: 28,
            name: "EVS",
            code: "EVS-4",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 8,
    name: "Class V",
    description: "Upper primary with comprehensive learning",
    terms: [
      {
        id: 15,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 29,
            name: "English",
            code: "ENG-5",
            resources: []
          },
          {
            id: 30,
            name: "Hindi",
            code: "HIN-5",
            resources: []
          },
          {
            id: 31,
            name: "Mathematics",
            code: "MATH-5",
            resources: []
          },
          {
            id: 32,
            name: "EVS",
            code: "EVS-5",
            resources: []
          }
        ]
      },
      {
        id: 16,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 29,
            name: "English",
            code: "ENG-5",
            resources: []
          },
          {
            id: 30,
            name: "Hindi",
            code: "HIN-5",
            resources: []
          },
          {
            id: 31,
            name: "Mathematics",
            code: "MATH-5",
            resources: []
          },
          {
            id: 32,
            name: "EVS",
            code: "EVS-5",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 9,
    name: "Class VI",
    description: "Middle school with subject specialization",
    terms: [
      {
        id: 1,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 1,
            name: "Mathematics",
            code: "MATH-6",
            resources: [
              {
                id: 1,
                title: "Complete Syllabus - Term 1",
                type: "syllabus",
                description: "Comprehensive syllabus covering Numbers, Basic Geometry, and Algebra basics",
                fileUrl: "/files/math-6-term1-syllabus.pdf",
                uploadDate: "2025-01-10",
                uploadedBy: "Mrs. Priya Sharma"
              },
              {
                id: 2,
                title: "Mid-Term Question Paper 2024",
                type: "question_paper",
                description: "Previous year mid-term examination paper with solutions",
                fileUrl: "/files/math-6-midterm-2024.pdf",
                uploadDate: "2025-01-12",
                uploadedBy: "Mrs. Priya Sharma"
              },
              {
                id: 3,
                title: "Numbers & Operations Quiz",
                type: "quiz",
                description: "Interactive quiz on basic number operations and place value",
                uploadDate: "2025-01-15",
                uploadedBy: "Mrs. Priya Sharma",
                quiz: {
                  id: 1,
                  title: "Numbers & Operations Quiz",
                  description: "Test your understanding of basic number operations",
                  duration: 20,
                  totalQuestions: 10,
                  difficulty: "Easy",
                  questions: [
                    {
                      id: 1,
                      question: "What is 125 + 378?",
                      options: ["503", "493", "513", "483"],
                      correctAnswer: 0,
                      explanation: "125 + 378 = 503"
                    },
                    {
                      id: 2,
                      question: "Which number is greater: 4,567 or 4,576?",
                      options: ["4,567", "4,576", "Both are equal", "Cannot determine"],
                      correctAnswer: 1,
                      explanation: "4,576 is greater than 4,567 because 76 > 67 in the ones and tens place"
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 2,
            name: "Science",
            code: "SCI-6",
            resources: [
              {
                id: 4,
                title: "Science Syllabus - Term 1",
                type: "syllabus",
                description: "Covering Food, Components of Food, and Fiber to Fabric",
                fileUrl: "/files/science-6-term1-syllabus.pdf",
                uploadDate: "2025-01-10",
                uploadedBy: "Dr. Rajesh Kumar"
              }
            ]
          }
        ]
      },
      {
        id: 2,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 1,
            name: "Mathematics",
            code: "MATH-6",
            resources: [
              {
                id: 5,
                title: "Complete Syllabus - Term 2",
                type: "syllabus",
                description: "Advanced topics including Fractions, Decimals, and Data Handling",
                fileUrl: "/files/math-6-term2-syllabus.pdf",
                uploadDate: "2025-01-10",
                uploadedBy: "Mrs. Priya Sharma"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 10,
    name: "Class VII",
    description: "Middle school with enhanced subject complexity",
    terms: [
      {
        id: 19,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 41,
            name: "English",
            code: "ENG-7",
            resources: []
          },
          {
            id: 42,
            name: "Hindi",
            code: "HIN-7",
            resources: []
          },
          {
            id: 43,
            name: "Mathematics",
            code: "MATH-7",
            resources: []
          },
          {
            id: 44,
            name: "Science",
            code: "SCI-7",
            resources: []
          },
          {
            id: 45,
            name: "Social Science",
            code: "SST-7",
            resources: []
          },
          {
            id: 46,
            name: "Punjabi",
            code: "PUN-7",
            resources: []
          }
        ]
      },
      {
        id: 20,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 41,
            name: "English",
            code: "ENG-7",
            resources: []
          },
          {
            id: 42,
            name: "Hindi",
            code: "HIN-7",
            resources: []
          },
          {
            id: 43,
            name: "Mathematics",
            code: "MATH-7",
            resources: []
          },
          {
            id: 44,
            name: "Science",
            code: "SCI-7",
            resources: []
          },
          {
            id: 45,
            name: "Social Science",
            code: "SST-7",
            resources: []
          },
          {
            id: 46,
            name: "Punjabi",
            code: "PUN-7",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 11,
    name: "Class VIII",
    description: "Advanced middle school with pre-secondary preparation",
    terms: [
      {
        id: 21,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 47,
            name: "English",
            code: "ENG-8",
            resources: []
          },
          {
            id: 48,
            name: "Hindi",
            code: "HIN-8",
            resources: []
          },
          {
            id: 49,
            name: "Mathematics",
            code: "MATH-8",
            resources: []
          },
          {
            id: 50,
            name: "Science",
            code: "SCI-8",
            resources: []
          },
          {
            id: 51,
            name: "Social Science",
            code: "SST-8",
            resources: []
          },
          {
            id: 52,
            name: "Punjabi",
            code: "PUN-8",
            resources: []
          }
        ]
      },
      {
        id: 22,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 47,
            name: "English",
            code: "ENG-8",
            resources: []
          },
          {
            id: 48,
            name: "Hindi",
            code: "HIN-8",
            resources: []
          },
          {
            id: 49,
            name: "Mathematics",
            code: "MATH-8",
            resources: []
          },
          {
            id: 50,
            name: "Science",
            code: "SCI-8",
            resources: []
          },
          {
            id: 51,
            name: "Social Science",
            code: "SST-8",
            resources: []
          },
          {
            id: 52,
            name: "Punjabi",
            code: "PUN-8",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 12,
    name: "Class IX",
    description: "Secondary level with CBSE board preparation",
    terms: [
      {
        id: 23,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 53,
            name: "English",
            code: "ENG-9",
            resources: []
          },
          {
            id: 54,
            name: "Hindi",
            code: "HIN-9",
            resources: []
          },
          {
            id: 55,
            name: "Mathematics",
            code: "MATH-9",
            resources: []
          },
          {
            id: 56,
            name: "Science",
            code: "SCI-9",
            resources: []
          },
          {
            id: 57,
            name: "Social Science",
            code: "SST-9",
            resources: []
          },
          {
            id: 58,
            name: "Punjabi",
            code: "PUN-9",
            resources: []
          },
          {
            id: 59,
            name: "Information Technology",
            code: "IT-9",
            resources: []
          }
        ]
      },
      {
        id: 24,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 53,
            name: "English",
            code: "ENG-9",
            resources: []
          },
          {
            id: 54,
            name: "Hindi",
            code: "HIN-9",
            resources: []
          },
          {
            id: 55,
            name: "Mathematics",
            code: "MATH-9",
            resources: []
          },
          {
            id: 56,
            name: "Science",
            code: "SCI-9",
            resources: []
          },
          {
            id: 57,
            name: "Social Science",
            code: "SST-9",
            resources: []
          },
          {
            id: 58,
            name: "Punjabi",
            code: "PUN-9",
            resources: []
          },
          {
            id: 59,
            name: "Information Technology",
            code: "IT-9",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 13,
    name: "Class X",
    description: "Board examination year with intensive preparation",
    terms: [
      {
        id: 3,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 3,
            name: "Mathematics",
            code: "MATH-10",
            resources: [
              {
                id: 6,
                title: "CBSE Mathematics Syllabus",
                type: "syllabus",
                description: "Complete CBSE syllabus for Class X Mathematics",
                fileUrl: "/files/math-10-cbse-syllabus.pdf",
                uploadDate: "2025-01-08",
                uploadedBy: "Mr. Arun Verma"
              },
              {
                id: 7,
                title: "Sample Paper 1 - 2025",
                type: "question_paper",
                description: "CBSE sample paper with detailed solutions",
                fileUrl: "/files/math-10-sample-2025.pdf",
                uploadDate: "2025-01-14",
                uploadedBy: "Mr. Arun Verma"
              },
              {
                id: 8,
                title: "Real Numbers Mastery Quiz",
                type: "quiz",
                description: "Comprehensive quiz on real numbers and their properties",
                uploadDate: "2025-01-16",
                uploadedBy: "Mr. Arun Verma",
                quiz: {
                  id: 2,
                  title: "Real Numbers Mastery Quiz",
                  description: "Test your mastery of real numbers concepts",
                  duration: 30,
                  totalQuestions: 15,
                  difficulty: "Medium",
                  questions: [
                    {
                      id: 1,
                      question: "What is the HCF of 18 and 24?",
                      options: ["4", "6", "8", "12"],
                      correctAnswer: 1,
                      explanation: "Using Euclid's algorithm: HCF(18,24) = 6"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 14,
    name: "Class XI",
    description: "Senior secondary with stream specialization",
    terms: [
      {
        id: 27,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 67,
            name: "English Core",
            code: "ENG-11",
            resources: []
          },
          {
            id: 68,
            name: "Hindi Core",
            code: "HIN-11",
            resources: []
          },
          {
            id: 69,
            name: "Mathematics",
            code: "MATH-11",
            resources: []
          },
          {
            id: 70,
            name: "Physics",
            code: "PHY-11",
            resources: []
          },
          {
            id: 71,
            name: "Chemistry",
            code: "CHE-11",
            resources: []
          },
          {
            id: 72,
            name: "Biology",
            code: "BIO-11",
            resources: []
          },
          {
            id: 73,
            name: "Physical Education",
            code: "PE-11",
            resources: []
          }
        ]
      },
      {
        id: 28,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 67,
            name: "English Core",
            code: "ENG-11",
            resources: []
          },
          {
            id: 68,
            name: "Hindi Core",
            code: "HIN-11",
            resources: []
          },
          {
            id: 69,
            name: "Mathematics",
            code: "MATH-11",
            resources: []
          },
          {
            id: 70,
            name: "Physics",
            code: "PHY-11",
            resources: []
          },
          {
            id: 71,
            name: "Chemistry",
            code: "CHE-11",
            resources: []
          },
          {
            id: 72,
            name: "Biology",
            code: "BIO-11",
            resources: []
          },
          {
            id: 73,
            name: "Physical Education",
            code: "PE-11",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 15,
    name: "Class XII",
    description: "Senior secondary board examination with career preparation",
    terms: [
      {
        id: 29,
        name: "Term 1 (April - September)",
        subjects: [
          {
            id: 74,
            name: "English Core",
            code: "ENG-12",
            resources: []
          },
          {
            id: 75,
            name: "Hindi Core",
            code: "HIN-12",
            resources: []
          },
          {
            id: 76,
            name: "Mathematics",
            code: "MATH-12",
            resources: []
          },
          {
            id: 77,
            name: "Physics",
            code: "PHY-12",
            resources: []
          },
          {
            id: 78,
            name: "Chemistry",
            code: "CHE-12",
            resources: []
          },
          {
            id: 79,
            name: "Biology",
            code: "BIO-12",
            resources: []
          },
          {
            id: 80,
            name: "Physical Education",
            code: "PE-12",
            resources: []
          }
        ]
      },
      {
        id: 30,
        name: "Term 2 (October - March)",
        subjects: [
          {
            id: 74,
            name: "English Core",
            code: "ENG-12",
            resources: []
          },
          {
            id: 75,
            name: "Hindi Core",
            code: "HIN-12",
            resources: []
          },
          {
            id: 76,
            name: "Mathematics",
            code: "MATH-12",
            resources: []
          },
          {
            id: 77,
            name: "Physics",
            code: "PHY-12",
            resources: []
          },
          {
            id: 78,
            name: "Chemistry",
            code: "CHE-12",
            resources: []
          },
          {
            id: 79,
            name: "Biology",
            code: "BIO-12",
            resources: []
          },
          {
            id: 80,
            name: "Physical Education",
            code: "PE-12",
            resources: []
          }
        ]
      }
    ]
  }
]

export default function ExaminationPortal() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [user, setUser] = useState<null | { id: string; name: string; email: string; role: 'admin' | 'student' }>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Fetch classes data from API
  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/classes')
      const data = await response.json()
      
      if (data.success) {
        // Transform the data to match the expected format
        const transformedClasses = data.classes.map((cls: any) => ({
          id: cls.id,
          name: cls.name,
          description: cls.description || '',
          terms: cls.terms.map((term: any) => ({
            id: term.id,
            name: term.name,
            subjects: term.subjects.map((subject: any) => ({
              id: subject.id,
              name: subject.name,
              code: subject.code,
              resources: subject.resources.map((resource: any) => ({
                id: resource.id,
                title: resource.title,
                type: resource.type.toLowerCase(),
                description: resource.description || '',
                fileUrl: resource.fileUrl,
                uploadDate: resource.createdAt,
                uploadedBy: resource.uploadedBy?.name || 'Unknown',
                quiz: resource.quiz ? {
                  id: resource.quiz.id,
                  title: resource.title,
                  description: resource.description || '',
                  duration: resource.quiz.duration,
                  totalQuestions: resource.quiz.questions?.length || 0,
                  questions: resource.quiz.questions?.map((q: any) => ({
                    id: q.id,
                    question: q.text,
                    options: [q.option1, q.option2, q.option3, q.option4],
                    correctAnswer: q.correctAnswer - 1, // Convert 1-based to 0-based
                    explanation: q.explanation
                  })) || [],
                  difficulty: resource.quiz.difficulty?.toLowerCase() || 'medium'
                } : undefined
              }))
            }))
          }))
        }))
        setClasses(transformedClasses)
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      // Fallback to empty array if API fails
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  // Check for logged in user
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleQuizStart = (quiz: Quiz) => {
    setActiveQuiz(quiz)
    setCurrentQuestion(0)
    setUserAnswers([])
    setQuizCompleted(false)
    setShowResults(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answerIndex
    setUserAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < (activeQuiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizCompleted(true)
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    if (!activeQuiz) return 0
    let correct = 0
    activeQuiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / activeQuiz.questions.length) * 100)
  }

  const resetView = () => {
    setSelectedClass(null)
    setSelectedTerm(null)
    setSelectedSubject(null)
    setActiveQuiz(null)
  }

  const handleResourceUpload = (resourceData: any) => {
    // Refresh the classes data to include the new resource
    fetchClasses()
    setShowUploadModal(false)
  }

  const handleFileDownload = (resource: any) => {
    if (!resource.fileUrl) {
      alert('No file available for download')
      return
    }

    try {
      // For data URLs (base64), create a downloadable link
      if (resource.fileUrl.startsWith('data:')) {
        const link = document.createElement('a')
        link.href = resource.fileUrl
        link.download = `${resource.title}.${getFileExtension(resource.fileUrl)}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // For regular URLs, open in new tab
        window.open(resource.fileUrl, '_blank')
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download file')
    }
  }

  const handleFileView = (resource: any) => {
    if (!resource.fileUrl) {
      alert('No file available for viewing')
      return
    }

    try {
      // Open the file in a new tab for viewing
      window.open(resource.fileUrl, '_blank')
    } catch (error) {
      console.error('View error:', error)
      alert('Failed to view file')
    }
  }

  const handleResourceDelete = async (resource: any) => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can delete resources')
      return
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${resource.title}"? This action cannot be undone.`
    )

    if (!confirmDelete) return

    try {
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        alert('Resource deleted successfully!')
        // Refresh the classes data to remove the deleted resource
        fetchClasses()
      } else {
        alert(data.error || 'Failed to delete resource')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete resource')
    }
  }

  const getFileExtension = (dataUrl: string) => {
    // Extract file type from data URL
    const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0]
    switch (mimeType) {
      case 'application/pdf': return 'pdf'
      case 'application/msword': return 'doc'
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'docx'
      case 'image/jpeg': return 'jpg'
      case 'image/png': return 'png'
      default: return 'file'
    }
  }

  // Quiz Interface
  if (activeQuiz && !showResults) {
    const question = activeQuiz.questions[currentQuestion]
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{activeQuiz.title}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <FiClock className="mr-2" />
                    <span>{activeQuiz.duration} mins</span>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {currentQuestion + 1}/{activeQuiz.questions.length}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="bg-gray-200 rounded-full h-2 mb-6">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
                  ></div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {question.question}
                </h2>

                <div className="space-y-4">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        userAnswers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Exit Quiz
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={userAnswers[currentQuestion] === undefined}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {currentQuestion === activeQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <FiChevronRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz Results
  if (showResults && activeQuiz) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheck className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>
                <div className="text-6xl font-bold text-blue-600 mb-4">{score}%</div>
                <p className="text-gray-600">
                  You scored {userAnswers.filter((answer, index) => answer === activeQuiz.questions[index].correctAnswer).length} out of {activeQuiz.questions.length} questions correctly
                </p>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold mb-6">Review Your Answers</h3>
                <div className="space-y-4 text-left max-h-96 overflow-y-auto">
                  {activeQuiz.questions.map((question, index) => {
                    const isCorrect = userAnswers[index] === question.correctAnswer
                    return (
                      <div key={index} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                            <p className="text-sm text-gray-600">
                              Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                                {question.options[userAnswers[index]]}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-600 mt-1">
                                Correct answer: {question.options[question.correctAnswer]}
                              </p>
                            )}
                            {question.explanation && (
                              <p className="text-sm text-gray-500 mt-2 italic">{question.explanation}</p>
                            )}
                          </div>
                          <div className={`ml-4 p-2 rounded-full ${isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
                            {isCorrect ? (
                              <FiCheck className="w-4 h-4 text-green-700" />
                            ) : (
                              <span className="text-red-700 font-bold">✗</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-8">
                <button
                  onClick={() => {
                    setActiveQuiz(null)
                    setShowResults(false)
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Back to Resources
                </button>
                <button
                  onClick={() => handleQuizStart(activeQuiz)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Examination <span className="text-yellow-300">Portal</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Access syllabus, question papers, and interactive quizzes to excel in your studies
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center">
                <FiBook className="mr-2" />
                <span>Comprehensive Study Materials</span>
              </div>
              <div className="flex items-center">
                <FiFileText className="mr-2" />
                <span>Previous Year Papers</span>
              </div>
              <div className="flex items-center">
                <FiPlay className="mr-2" />
                <span>Interactive Quizzes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={resetView} className="hover:text-blue-600 transition-colors">
              Examination Portal
            </button>
            {selectedClass && (
              <>
                <FiChevronRight className="text-gray-400" />
                <button 
                  onClick={() => {
                    setSelectedTerm(null)
                    setSelectedSubject(null)
                  }}
                  className="hover:text-blue-600 transition-colors"
                >
                  {selectedClass.name}
                </button>
              </>
            )}
            {selectedTerm && (
              <>
                <FiChevronRight className="text-gray-400" />
                <button 
                  onClick={() => setSelectedSubject(null)}
                  className="hover:text-blue-600 transition-colors"
                >
                  {selectedTerm.name}
                </button>
              </>
            )}
            {selectedSubject && (
              <>
                <FiChevronRight className="text-gray-400" />
                <span className="text-gray-900 font-medium">{selectedSubject.name}</span>
              </>
            )}
          </div>
        </nav>

        {/* Admin Upload Section */}
        {user && user.role === 'admin' && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-orange-900 mb-2">Admin Panel</h3>
                <p className="text-orange-700 text-sm sm:text-base leading-relaxed">
                  {selectedSubject 
                    ? `Upload resources for ${selectedSubject.name} - ${selectedTerm?.name} - ${selectedClass?.name}` 
                    : selectedTerm 
                    ? `Select a subject to upload resources for ${selectedTerm.name} - ${selectedClass?.name}`
                    : selectedClass 
                    ? `Select a term and subject to upload resources for ${selectedClass.name}`
                    : "Select a class, term, and subject to upload resources"
                  }
                </p>
              </div>
              <button 
                onClick={() => selectedClass && selectedTerm && selectedSubject ? setShowUploadModal(true) : null}
                disabled={!selectedClass || !selectedTerm || !selectedSubject}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base font-medium ${
                  selectedClass && selectedTerm && selectedSubject
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } lg:flex-shrink-0`}
              >
                <FiUpload className="mr-1 sm:mr-2 w-4 h-4" />
                <span className="hidden sm:inline">Upload Resource</span>
                <span className="sm:hidden">Upload</span>
              </button>
            </div>
          </div>
        )}

        {/* Login Prompt for Non-Admin Users */}
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Welcome to Examination Portal</h3>
                <p className="text-blue-700 text-sm sm:text-base leading-relaxed">
                  Login as a student to track your quiz progress, or as an admin/teacher to upload resources and manage content.
                </p>
              </div>
              <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-3 flex-shrink-0">
                <span className="text-blue-600 text-xs sm:text-sm font-medium">Please login to continue</span>
                <FiUser className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        )}

        {/* Student Info Panel */}
        {user && user.role === 'student' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-2">Welcome, {user.name}!</h3>
                <p className="text-green-700 text-sm sm:text-base leading-relaxed">
                  Access study materials, take quizzes, and track your academic progress. Good luck with your studies!
                </p>
              </div>
              <div className="text-green-600 flex justify-center sm:justify-end">
                <FiAward className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading classes...</p>
          </div>
        )}

        {/* Class Selection */}
        {!loading && !selectedClass && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Select Your Class</h2>
            
            {/* Pre-Primary Section */}
            <div className="mb-12">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-6 flex items-center">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 text-pink-600 text-sm sm:text-base">🌟</span>
                Pre-Primary Classes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {classes.filter(cls => ['Nursery', 'LKG', 'UKG'].includes(cls.name)).map((classItem) => (
                                      <div
                      key={classItem.id}
                      onClick={() => setSelectedClass(classItem)}
                      className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group p-4 sm:p-6"
                    >
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{classItem.name}</h3>
                        <FiChevronRight className="text-gray-400 group-hover:text-pink-500 transition-colors w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">{classItem.description}</p>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <FiBook className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{classItem.terms.length} Terms Available</span>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Primary Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 text-green-600">📚</span>
                Primary Classes (I - V)
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.filter(cls => ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'].includes(cls.name)).map((classItem) => (
                  <div
                    key={classItem.id}
                    onClick={() => setSelectedClass(classItem)}
                    className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{classItem.name}</h3>
                      <FiChevronRight className="text-gray-400 group-hover:text-green-500 transition-colors" />
                    </div>
                    <p className="text-gray-600 mb-4">{classItem.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiBook className="mr-2" />
                      <span>{classItem.terms.length} Terms Available</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle School Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600">🎯</span>
                Middle School (VI - VIII)
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.filter(cls => ['Class VI', 'Class VII', 'Class VIII'].includes(cls.name)).map((classItem) => (
                  <div
                    key={classItem.id}
                    onClick={() => setSelectedClass(classItem)}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{classItem.name}</h3>
                      <FiChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <p className="text-gray-600 mb-4">{classItem.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiBook className="mr-2" />
                      <span>{classItem.terms.length} Terms Available</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 text-orange-600">🏆</span>
                Secondary & Senior Secondary (IX - XII)
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {classes.filter(cls => ['Class IX', 'Class X', 'Class XI', 'Class XII'].includes(cls.name)).map((classItem) => (
                  <div
                    key={classItem.id}
                    onClick={() => setSelectedClass(classItem)}
                    className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{classItem.name}</h3>
                      <FiChevronRight className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <p className="text-gray-600 mb-4">{classItem.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiBook className="mr-2" />
                      <span>{classItem.terms.length} Terms Available</span>
                    </div>
                    {['Class X', 'Class XII'].includes(classItem.name) && (
                      <div className="mt-3">
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                          Board Exam
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Term Selection */}
        {selectedClass && !selectedTerm && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {selectedClass.name} - Select Term
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {selectedClass.terms.map((term) => (
                <div
                  key={term.id}
                  onClick={() => setSelectedTerm(term)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{term.name}</h3>
                    <FiChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiUsers className="mr-2" />
                    <span>{term.subjects.length} Subjects Available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subject Selection */}
        {selectedTerm && !selectedSubject && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {selectedTerm.name} - Select Subject
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedTerm.subjects.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{subject.name}</h3>
                      <p className="text-sm text-gray-500">{subject.code}</p>
                    </div>
                    <FiChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiFileText className="mr-2" />
                    <span>{subject.resources.length} Resources Available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Display */}
        {selectedSubject && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {selectedSubject.name} - Study Resources
            </h2>
            
            {/* Resource Categories */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Syllabus */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <FiBook className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Syllabus</h3>
                </div>
                <div className="space-y-4">
                  {selectedSubject.resources
                    .filter(resource => resource.type === 'syllabus')
                    .map((resource) => (
                    <div key={resource.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          <p>By {resource.uploadedBy}</p>
                          <p>{new Date(resource.uploadDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleFileView(resource)}
                            className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center text-sm">
                            <FiFileText className="mr-1" />
                            View
                          </button>
                          <button 
                            onClick={() => handleFileDownload(resource)}
                            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center text-sm">
                            <FiDownload className="mr-1" />
                            Download
                          </button>
                          {user && user.role === 'admin' && (
                            <button 
                              onClick={() => handleResourceDelete(resource)}
                              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center text-sm">
                              <FiTrash2 className="mr-1" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Papers */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <FiFileText className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Question Papers</h3>
                </div>
                <div className="space-y-4">
                  {selectedSubject.resources
                    .filter(resource => resource.type === 'question_paper')
                    .map((resource) => (
                    <div key={resource.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          <p>By {resource.uploadedBy}</p>
                          <p>{new Date(resource.uploadDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleFileView(resource)}
                            className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center text-sm">
                            <FiFileText className="mr-1" />
                            View
                          </button>
                          <button 
                            onClick={() => handleFileDownload(resource)}
                            className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center text-sm">
                            <FiDownload className="mr-1" />
                            Download
                          </button>
                          {user && user.role === 'admin' && (
                            <button 
                              onClick={() => handleResourceDelete(resource)}
                              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center text-sm">
                              <FiTrash2 className="mr-1" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quizzes */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <FiAward className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Interactive Quizzes</h3>
                </div>
                <div className="space-y-4">
                  {selectedSubject.resources
                    .filter(resource => resource.type === 'quiz')
                    .map((resource) => (
                    <div key={resource.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      {resource.quiz && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center">
                            <FiClock className="mr-1" />
                            <span>{resource.quiz.duration} mins</span>
                          </div>
                          <div className="flex items-center">
                            <FiFileText className="mr-1" />
                            <span>{resource.quiz.totalQuestions} questions</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            resource.quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            resource.quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {resource.quiz.difficulty}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          <p>By {resource.uploadedBy}</p>
                          <p>{new Date(resource.uploadDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => resource.quiz && handleQuizStart(resource.quiz)}
                            className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center text-sm"
                          >
                            <FiPlay className="mr-1" />
                            Start Quiz
                          </button>
                          {user && user.role === 'admin' && (
                            <button 
                              onClick={() => handleResourceDelete(resource)}
                              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center text-sm">
                              <FiTrash2 className="mr-1" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && selectedClass && selectedTerm && selectedSubject && (
          <AdminUploadModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onUpload={handleResourceUpload}
            classId={selectedClass.id}
            termId={selectedTerm.id}
            subjectId={selectedSubject.id}
          />
        )}
      </div>
    </div>
  )
} 