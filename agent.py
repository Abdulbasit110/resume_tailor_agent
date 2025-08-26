import os
from dotenv import load_dotenv
from agents import Agent
from pydantic import BaseModel

load_dotenv()

class ResumeTailorResult(BaseModel):
    tailored_resume: str

def create_resume_tailor_agent():
    agent = Agent(
        name="Resume Tailor Specialist",
        instructions="""You are an expert resume tailoring specialist. Your role is to:

    1. Analyze the provided resume text and job description
    2. Identify key skills, experiences, and qualifications in the resume
    3. Match relevant resume content to job requirements
    4. Suggest specific improvements to better align the resume with the job
    5. Recommend which sections to emphasize or de-emphasize
    6. Provide actionable feedback for customizing the resume

    Always provide:
    - A summary of how well the resume matches the job
    - Specific recommendations for improvements
    - Key skills/experiences to highlight
    - Suggested modifications to better target the role
    - A confidence score for the match

    Be concise but thorough in your analysis.""",
        model="litellm/gemini/gemini-2.0-flash-001",
        output_type=ResumeTailorResult
    )

    return agent
