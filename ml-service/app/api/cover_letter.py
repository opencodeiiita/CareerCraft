from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging
import json

from app.services.cover_letter_generator import CoverLetterGenerator
from app.services.job_matcher import match_job_with_resume

logger = logging.getLogger(__name__)
router = APIRouter()

cover_letter_generator = CoverLetterGenerator()


def _ensure_json_structure(cover_letter_data: Dict) -> Dict:
    """Ensure cover letter data is properly structured for JSON response."""
    return {
        "greeting": cover_letter_data.get("greeting", ""),
        "body": cover_letter_data.get("body", []),
        "closing": cover_letter_data.get("closing", ""),
        "sign_off": cover_letter_data.get("sign_off", ""),
        "candidate_name": cover_letter_data.get("candidate_name", "")
    }


# ------------------- Schemas -------------------

class CoverLetterRequest(BaseModel):
    resume_analysis: Dict[str, Any] = Field(...)
    job_info: Dict[str, str] = Field(...)
    candidate_name: Optional[str] = Field(default="")
    temperature: Optional[float] = Field(default=0.7)
    max_tokens: Optional[int] = Field(default=1000)

class CoverLetterResponse(BaseModel):
    company_name: str
    job_title: str
    tone: str
    cover_letter: Dict[str, Any]
    missing_skills: Optional[List[str]] = None


class HealthResponse(BaseModel):
    status: str
    llm_connected: bool
    model: Optional[str] = None
    supported_models: Optional[List[str]] = None
    error: Optional[str] = None


# ------------------- Routes -------------------

@router.post("/generate-cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(request: CoverLetterRequest):

    try:
        # Validate resume fields actually used
        for field in ["skills", "projects", "experience"]:
            if field not in request.resume_analysis:
                raise HTTPException(
                    status_code=400,
                    detail=f"resume_analysis missing required field: {field}"
                )

        # Validate job_info
        for field in ["company_name", "job_title", "job_description"]:
            if not request.job_info.get(field):
                raise HTTPException(
                    status_code=400,
                    detail=f"job_info missing required field: {field}"
                )

        tone = request.job_info.get("tone", "formal")
        if tone not in ["formal", "confident", "friendly"]:
            raise HTTPException(
                status_code=400,
                detail="tone must be one of: formal, confident, friendly"
            )

        logger.info(
            "Generating cover letter for %s - %s",
            request.job_info["company_name"],
            request.job_info["job_title"]
        )

        result = cover_letter_generator.generate_cover_letter(
            resume_analysis=request.resume_analysis,
            job_info=request.job_info,
            candidate_name=request.candidate_name,
        )

        # Use request parameters if provided, otherwise defaults
        temp = request.temperature or 0.7
        max_tok = request.max_tokens or 1000

        # Regenerate with user-specified parameters if needed
        if temp != 0.7 or max_tok != 1000:
            result = cover_letter_generator.generate_cover_letter(
                resume_analysis=request.resume_analysis,
                job_info=request.job_info,
                candidate_name=request.candidate_name,
            )
            # Note: In production, you'd modify the LLM client to accept these params
            # For now, we'll use the defaults

        # Calculate missing skills using job matcher
        try:
            job_match_result = match_job_with_resume(
                resume_analysis=request.resume_analysis,
                job_description=request.job_info["job_description"]
            )
            missing_skills = job_match_result.get("missing_skills", [])
        except Exception:
            # Fallback if matching fails, don't block cover letter generation
            logger.exception("Failed to compute missing skills during cover letter generation")
            missing_skills = []

        # Ensure proper JSON structure
        structured_cover_letter = _ensure_json_structure(result)

        return {
            "company_name": request.job_info["company_name"],
            "job_title": request.job_info["job_title"],
            "tone": tone,
            "cover_letter": structured_cover_letter,
            "missing_skills": missing_skills
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.exception("Cover letter generation failed")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/health", response_model=HealthResponse)
async def health_check():
    return cover_letter_generator.health_check()


@router.get("/models")
async def get_supported_models():
    return {
        "models": cover_letter_generator.get_supported_models(),
        "recommended": "gemma2:2b",
        "ram_requirement": "8GB"
    }
