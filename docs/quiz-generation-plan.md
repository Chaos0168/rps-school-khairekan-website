# Automatic Quiz Generation from PDF Syllabus - Implementation Plan

## Overview
This document outlines how to implement automatic quiz generation from uploaded PDF syllabus files using AI/ML technologies.

## Architecture Overview

### 1. PDF Processing Pipeline
```
PDF Upload → Text Extraction → Content Analysis → Question Generation → Quiz Creation
```

### 2. Technology Stack Required

#### Backend Services
- **PDF Processing**: PDF.js, PyPDF2, or Apache Tika
- **AI/ML Services**: OpenAI GPT, Google Gemini, or Hugging Face Transformers
- **Text Processing**: spaCy, NLTK for preprocessing
- **Database**: PostgreSQL/MongoDB for storing questions and metadata

#### Frontend Integration
- **File Upload**: Enhanced upload component with PDF preview
- **Progress Tracking**: Real-time generation status
- **Question Review**: Admin interface to review and edit generated questions

## Implementation Steps

### Phase 1: PDF Text Extraction

```javascript
// Example using PDF.js in Node.js
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractTextFromPDF(pdfBuffer) {
  const pdf = await pdfjsLib.getDocument(pdfBuffer).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}
```

### Phase 2: Content Structure Analysis

```javascript
// Analyze syllabus structure and extract topics
function analyzeSyllabusStructure(text) {
  const topics = [];
  const chapters = [];
  
  // Use regex patterns or NLP to identify:
  // - Chapter headings
  // - Topic lists
  // - Learning objectives
  // - Key concepts
  
  const chapterRegex = /Chapter\s+\d+[:\-\s]+(.*?)(?=Chapter|\n\n|$)/gi;
  const topicRegex = /(?:Topic|Unit)\s*\d*[:\-\s]+(.*?)(?=Topic|Unit|\n\n|$)/gi;
  
  // Extract chapters
  let chapterMatch;
  while ((chapterMatch = chapterRegex.exec(text)) !== null) {
    chapters.push({
      title: chapterMatch[1].trim(),
      content: chapterMatch[0]
    });
  }
  
  // Extract topics
  let topicMatch;
  while ((topicMatch = topicRegex.exec(text)) !== null) {
    topics.push({
      title: topicMatch[1].trim(),
      content: topicMatch[0]
    });
  }
  
  return { chapters, topics };
}
```

### Phase 3: AI-Powered Question Generation

#### Option 1: Using OpenAI GPT API

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateQuestions(topicContent, difficulty = 'medium', count = 5) {
  const prompt = `
Based on the following educational content, generate ${count} multiple-choice questions with 4 options each.
Difficulty level: ${difficulty}
Format each question as JSON with: question, options (array of 4), correctAnswer (index), explanation

Content:
${topicContent}

Requirements:
- Questions should test understanding, not just memorization
- Include a mix of conceptual and application-based questions
- Provide clear explanations for correct answers
- Make sure incorrect options are plausible but clearly wrong

Response format:
{
  "questions": [
    {
      "question": "What is...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "The correct answer is A because..."
    }
  ]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Question generation failed:', error);
    throw error;
  }
}
```

#### Option 2: Using Google Gemini API

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateQuestionsWithGemini(content, difficulty, count) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Generate ${count} ${difficulty} level multiple-choice questions from this syllabus content...`;
  
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

### Phase 4: Question Quality Validation

```javascript
function validateGeneratedQuestions(questions) {
  const validatedQuestions = [];
  
  for (const question of questions) {
    // Check question quality
    if (
      question.question.length > 10 &&
      question.options.length === 4 &&
      question.correctAnswer >= 0 && 
      question.correctAnswer < 4 &&
      question.explanation &&
      question.explanation.length > 20
    ) {
      // Additional checks:
      // - No duplicate options
      // - Reasonable option lengths
      // - Clear question phrasing
      
      const uniqueOptions = new Set(question.options.map(opt => opt.toLowerCase()));
      if (uniqueOptions.size === 4) {
        validatedQuestions.push(question);
      }
    }
  }
  
  return validatedQuestions;
}
```

### Phase 5: Integration with Examination Portal

```javascript
// Enhanced upload handler in AdminUploadModal
const handleSyllabusUpload = async (file) => {
  try {
    // Upload PDF
    const uploadResponse = await uploadFile(file);
    
    // Extract text
    const extractedText = await extractTextFromPDF(file);
    
    // Analyze structure
    const { chapters, topics } = analyzeSyllabusStructure(extractedText);
    
    // Generate questions for each topic
    const allQuestions = [];
    for (const topic of topics.slice(0, 3)) { // Limit to first 3 topics
      const questions = await generateQuestions(topic.content, 'medium', 3);
      allQuestions.push(...questions.questions);
    }
    
    // Validate questions
    const validQuestions = validateGeneratedQuestions(allQuestions);
    
    // Create quiz automatically
    if (validQuestions.length >= 5) {
      const autoQuiz = {
        id: Date.now(),
        title: `Auto-Generated Quiz: ${file.name}`,
        description: `Automatically generated from syllabus content`,
        duration: Math.max(validQuestions.length * 2, 15), // 2 min per question, min 15
        totalQuestions: validQuestions.length,
        difficulty: 'Medium',
        questions: validQuestions,
        isAutoGenerated: true,
        sourceFile: file.name
      };
      
      // Save both syllabus and auto-generated quiz
      await saveResource({
        type: 'syllabus',
        file: uploadResponse.fileUrl,
        autoGeneratedQuiz: autoQuiz
      });
      
      return {
        success: true,
        message: `Syllabus uploaded and ${validQuestions.length} questions generated automatically!`,
        generatedQuestions: validQuestions.length
      };
    }
    
  } catch (error) {
    console.error('Auto-generation failed:', error);
    // Fallback: just upload the syllabus without quiz generation
    return { success: true, message: 'Syllabus uploaded (quiz generation failed)' };
  }
};
```

## Database Schema for Auto-Generated Content

```sql
-- Enhanced resources table
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  class_id INTEGER NOT NULL,
  term_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  file_url VARCHAR(500),
  uploaded_by VARCHAR(100),
  upload_date DATE,
  is_auto_generated BOOLEAN DEFAULT FALSE,
  source_file_name VARCHAR(255),
  extraction_metadata JSONB, -- Store PDF analysis results
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auto-generated questions tracking
CREATE TABLE auto_generated_questions (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER REFERENCES resources(id),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of options
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  confidence_score FLOAT, -- AI confidence in question quality
  reviewed BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question generation logs
CREATE TABLE generation_logs (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER REFERENCES resources(id),
  ai_model VARCHAR(50),
  total_questions_generated INTEGER,
  questions_approved INTEGER,
  processing_time_seconds INTEGER,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Frontend Enhancements

### Enhanced Upload Component with Auto-Generation

```tsx
const SyllabusUploadComponent = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [autoQuizEnabled, setAutoQuizEnabled] = useState(true);
  
  return (
    <div className="space-y-6">
      {/* Auto-quiz toggle */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="auto-quiz"
          checked={autoQuizEnabled}
          onChange={(e) => setAutoQuizEnabled(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="auto-quiz" className="text-sm font-medium">
          Automatically generate quiz from syllabus content
        </label>
      </div>
      
      {/* Generation progress */}
      {isGenerating && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium text-blue-900">
              Generating quiz questions...
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            Analyzing content and creating questions with AI
          </p>
        </div>
      )}
      
      {/* Rest of upload component */}
    </div>
  );
};
```

## Cost and Performance Considerations

### API Costs (Estimated)
- **OpenAI GPT-4**: ~$0.03 per syllabus (10-15 questions)
- **Google Gemini Pro**: ~$0.01 per syllabus
- **Processing Time**: 30-60 seconds per syllabus

### Optimization Strategies
1. **Caching**: Cache generated questions for similar content
2. **Batch Processing**: Process multiple PDFs together
3. **Quality Scoring**: Only keep high-confidence questions
4. **Human Review**: Admin approval workflow for generated questions

## Security and Privacy

### Data Protection
- Encrypt uploaded PDFs in transit and at rest
- Anonymize content before sending to AI services
- Implement audit logs for all AI generations
- Allow opting out of AI processing

### Content Validation
- Scan for inappropriate content
- Verify educational relevance
- Check for copyright compliance

## Deployment Requirements

### Environment Variables
```bash
# AI Service APIs
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key

# Processing Limits
MAX_PDF_SIZE_MB=10
MAX_QUESTIONS_PER_TOPIC=5
GENERATION_TIMEOUT_SECONDS=120

# Feature Flags
ENABLE_AUTO_QUIZ_GENERATION=true
REQUIRE_ADMIN_APPROVAL=true
```

### Infrastructure
- **GPU Instance**: For local model inference (optional)
- **Queue System**: Redis/Bull for processing jobs
- **Storage**: AWS S3/Google Cloud Storage for PDFs
- **Monitoring**: Track generation success rates and costs

## Future Enhancements

1. **Multi-language Support**: Generate questions in Hindi and English
2. **Difficulty Adaptation**: Adjust based on class level
3. **Image Questions**: Extract and use diagrams from PDFs
4. **Adaptive Learning**: Personalize questions based on student performance
5. **Voice Questions**: Generate audio-based questions for better accessibility

## Implementation Timeline

- **Week 1-2**: PDF processing and text extraction
- **Week 3-4**: AI integration and question generation
- **Week 5**: Quality validation and admin review system
- **Week 6**: Frontend integration and testing
- **Week 7**: Performance optimization and security review
- **Week 8**: Production deployment and monitoring

This implementation would transform the examination portal into an intelligent, self-updating system that continuously generates fresh quiz content from uploaded syllabi, significantly reducing manual question creation work for teachers while ensuring content alignment with curriculum. 