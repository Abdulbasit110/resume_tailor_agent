# ResumeAI - AI-Powered Resume Tailoring Platform

A complete full-stack application that intelligently analyzes and tailors resumes for specific job descriptions. Built with FastAPI backend, Next.js frontend, and powered by the OpenAI Agent SDK with Gemini LLM.

## Features

- 🎨 **Modern Web Interface**: Beautiful, responsive React frontend with real-time resume analysis
- 📄 **Smart Document Processing**: Extract text from PDF resumes with intelligent parsing
- 🤖 **AI-Powered Analysis**: Advanced resume analysis using Gemini 2.0 Flash via OpenAI Agent SDK
- 🎯 **Job-Specific Tailoring**: Intelligent matching and tailoring suggestions for specific job descriptions
- 📊 **Detailed Feedback**: Match scores, specific recommendations, and actionable improvements
- 💾 **Export Options**: Download tailored analysis in multiple formats (Markdown, Text)
- 🚀 **Fast & Reliable**: FastAPI backend with CORS support for seamless integration
- 🎨 **Professional UI**: Custom Tailwind CSS components with dark mode support

## Project Structure

```
resume_tailor_agent/
├── agent.py                 # AI agent configuration with Gemini LLM
├── main.py                  # FastAPI backend server
├── pyproject.toml           # Python dependencies
├── .env                     # Environment variables
└── resume_tailor_agent/     # Next.js frontend
    ├── app/
    │   ├── page.tsx         # Main resume tailoring interface
    │   ├── layout.tsx       # App layout with fonts and metadata
    │   └── globals.css      # Tailwind CSS styles and theme
    ├── components/ui/       # Reusable UI components
    │   ├── button.tsx
    │   ├── card.tsx
    │   ├── label.tsx
    │   └── textarea.tsx
    └── package.json         # Frontend dependencies
```

## Setup & Installation

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd resume_tailor_agent
   uv sync
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```bash
   # Gemini API configuration (via LiteLLM)
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=8000
   ```

3. **Start the backend server:**
   ```bash
   uv run python main.py
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   cd resume_tailor_agent/resume_tailor_agent
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The web interface will be available at `http://localhost:3000`

## Quick Start

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Upload a PDF resume
4. Paste a job description (optional)
5. Click "Tailor Resume with AI"
6. Review the AI analysis and download results

## API Endpoints

### 1. Health Check
```
GET /
```
Returns API status and confirms the service is running.

### 2. Tailor Resume (Main Endpoint)
```
POST /tailor-resume
```
**Parameters:**
- `file`: Resume file (PDF format supported)
- `job_description`: Optional job description for targeted tailoring

**Response:**
```json
{
  "success": true,
  "analysis": "Detailed AI analysis with match score, recommendations, and specific improvements..."
}
```

**Sample Analysis Output:**
- Resume match score (e.g., 7/10)
- Key improvement recommendations
- Specific text suggestions for summary, experience, and skills sections
- Skills and experiences to highlight
- Targeting modifications for the specific role

## Frontend Features

### ResumeAI Web Interface

- **Drag & Drop Upload**: Easy resume file upload with visual feedback
- **Real-time Processing**: Live progress indicators during AI analysis
- **Beautiful Markdown Rendering**: Professional formatting of AI recommendations
- **Download Options**: Export analysis as Markdown or plain text
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Dark Mode Support**: Automatic theme switching based on system preferences

### UI Components

- Custom Tailwind CSS components with professional styling
- Lucide React icons for modern visual elements
- Smooth animations and transitions
- Accessible form controls and navigation

## API Usage Examples

### Using curl:

```bash
# Basic resume analysis
curl -X POST "http://localhost:8000/tailor-resume" \
  -F "file=@path/to/your/resume.pdf"

# Resume tailoring with job description
curl -X POST "http://localhost:8000/tailor-resume" \
  -F "file=@path/to/your/resume.pdf" \
  -F "job_description=Software Engineer position requiring Python, FastAPI, and ML experience..."
```

### Interactive API Documentation:

Once the backend server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes | - |
| `PORT` | Backend server port | No | 8000 |

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework for building APIs
- **OpenAI Agent SDK**: Agent framework with structured output support
- **Gemini 2.0 Flash**: Google's latest LLM via LiteLLM integration
- **PyPDF**: PDF text extraction library
- **Pydantic**: Data validation and serialization
- **Python-dotenv**: Environment variable management

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with modern hooks
- **Tailwind CSS 4**: Utility-first CSS framework
- **React Markdown**: Markdown rendering with custom components
- **Lucide React**: Beautiful icon library
- **TypeScript**: Type safety and better developer experience

### AI Agent
- **Structured Output**: Pydantic models for consistent response format
- **Prompt Engineering**: Specialized instructions for resume analysis
- **LiteLLM Integration**: Seamless connection to Gemini API

## Supported File Formats

Currently supports:
- **PDF**: Primary format for resume uploads
- **Future**: Planning to add DOCX, TXT, and other formats

## Architecture Overview

```
Frontend (Next.js) → API Calls → Backend (FastAPI) → AI Agent (Gemini) → Structured Response
```

1. **User Interface**: React components handle file upload and display results
2. **API Layer**: FastAPI processes requests and manages file handling  
3. **AI Processing**: OpenAI Agent SDK with Gemini LLM analyzes resumes
4. **Response Rendering**: Markdown formatting with custom styling

## Development & Deployment

### Development
- Backend runs on `http://localhost:8000` with auto-reload
- Frontend runs on `http://localhost:3000` with hot reload
- CORS enabled for seamless local development

### Production Considerations
- Configure CORS origins properly
- Set up environment variables securely
- Consider rate limiting for API endpoints
- Implement file size limits and validation

## Contributing

This is part of a "7 Agents in 7 Days" project focusing on practical AI applications. The goal is to create focused, production-ready tools that solve real problems.

**Key Principles:**
- Keep it simple and user-focused
- Ensure reliable AI responses with structured output
- Maintain clean, modern UI/UX
- Build for both API and web interface usage
