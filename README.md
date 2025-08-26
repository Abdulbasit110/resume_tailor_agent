# Resume Tailor Agent

A FastAPI-based resume tailoring agent that uses Docling for document text extraction and the OpenAI Agent SDK with Gemini LLM for intelligent resume analysis and tailoring suggestions.

## Features

- 📄 **Document Processing**: Extract text from various resume formats (PDF, DOCX, etc.) using Docling
- 🤖 **AI-Powered Analysis**: Intelligent resume analysis using Gemini LLM via the OpenAI Agent SDK
- 🎯 **Job-Specific Tailoring**: Tailor resumes for specific job descriptions
- 🚀 **Fast API**: RESTful API endpoints for easy integration
- 🔧 **Simple & Clean**: Minimalist approach focused on core functionality

## Setup

1. **Install dependencies:**
   ```bash
   cd resume_tailor_agent
   uv sync
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root with one of these configurations:
   
   **Option 1: OpenAI (Recommended for simplicity)**
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   MODEL_NAME=gpt-3.5-turbo
   PORT=8000
   ```
   
   **Option 2: Gemini via LiteLLM**
   ```bash
   OPENAI_API_KEY=your_gemini_api_key_here
   OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
   MODEL_NAME=gemini-1.5-flash
   PORT=8000
   ```

3. **Run the application:**
   ```bash
   uv run python main.py
   ```

   Or using uvicorn directly:
   ```bash
   uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### 1. Health Check
```
GET /
```
Returns API status.

### 2. Tailor Resume (Main Endpoint)
```
POST /tailor-resume
```
**Parameters:**
- `file`: Resume file (PDF, DOCX, etc.)
- `job_description`: Optional job description for targeted tailoring

**Response:**
```json
{
  "success": true,
  "original_filename": "resume.pdf",
  "extracted_text_length": 1250,
  "analysis": "AI-generated analysis and suggestions...",
  "has_job_description": true
}
```

### 3. Extract Text Only
```
POST /extract-text
```
**Parameters:**
- `file`: Resume file

**Response:**
```json
{
  "success": true,
  "filename": "resume.pdf",
  "extracted_text": "Extracted resume text...",
  "text_length": 1250
}
```

## Usage Examples

### Using curl:

```bash
# Basic resume analysis
curl -X POST "http://localhost:8000/tailor-resume" \
  -F "file=@path/to/your/resume.pdf"

# Resume tailoring with job description
curl -X POST "http://localhost:8000/tailor-resume" \
  -F "file=@path/to/your/resume.pdf" \
  -F "job_description=Software Engineer position requiring Python, FastAPI, and ML experience..."

# Extract text only
curl -X POST "http://localhost:8000/extract-text" \
  -F "file=@path/to/your/resume.pdf"
```

### Interactive API Documentation:

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Your Gemini API key | Yes | - |
| `PORT` | Server port | No | 8000 |

## Supported File Formats

Thanks to Docling, the agent supports various document formats:
- PDF
- DOCX
- PPTX
- Images (PNG, JPG, etc.)
- HTML
- And more!

## Architecture

1. **FastAPI**: Web framework for API endpoints
2. **Docling**: Document processing and text extraction
3. **OpenAI Agent SDK**: Agent framework with tool support
4. **Gemini LLM**: AI model via LiteLLM for analysis
5. **Function Tools**: Custom tools for resume analysis

## Contributing

This is part of a "7 Agents in 7 Days" project - each agent focuses on one core functionality. Keep it simple and focused!
