from __future__ import annotations

import os
import tempfile
from pathlib import Path
from typing import Optional

import uvicorn
from docling.document_converter import DocumentConverter
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader

from agent import  create_resume_tailor_agent
from agents import Runner

app = FastAPI(title="Resume Tailor Agent", version="1.0.0")

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize document converter
converter = DocumentConverter()
agent = create_resume_tailor_agent()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Resume Tailor Agent API is running!"}


@app.post("/tailor-resume")
async def tailor_resume_endpoint(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(default="")
):
    """
    Main endpoint to upload a resume file and get tailoring suggestions
    """
    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Create temporary file to save uploaded content
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Extract text using PyPDF
            reader = PdfReader(tmp_file_path)
            resume_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    resume_text += text + "\n"

            print(resume_text, "resume_text")
            if not resume_text.strip():
                raise HTTPException(status_code=400, detail="Could not extract text from the resume")
            
            # Prepare the prompt for the agent
            if job_description.strip():
                prompt = f"""Please analyze this resume against the job description and provide tailoring recommendations:

RESUME TEXT:
{resume_text}

JOB DESCRIPTION:
{job_description}

Please provide a detailed analysis with specific recommendations for improving this resume to better match the job requirements."""
            else:
                prompt = f"""Please analyze this resume and provide general improvement recommendations:

RESUME TEXT:
{resume_text}

Please provide a detailed analysis with recommendations for improving this resume."""
            
            # Get analysis from the agent
            try:
                response = await Runner.run(agent, prompt)
                print(response, "agent response")
                # Extract the structured response
                analysis = response.final_output
                    
            except Exception as agent_error:
                # Fallback analysis if agent fails
                analysis = f"Agent analysis failed: {str(agent_error)}. Document was successfully extracted but analysis is unavailable."
            
            return {
                "success": True,
                "analysis": analysis.tailored_resume,
            }
            
        finally:
            # Clean up temporary file
            os.unlink(tmp_file_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

def main():
    """Run the FastAPI application"""
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=True
    )


if __name__ == "__main__":
    main()
