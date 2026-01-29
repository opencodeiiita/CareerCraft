"""
Semantic Skill Matcher Service
Uses Sentence Transformers to semantically match resume skills with job skills.
"""

# Disable TensorFlow to avoid Keras 3 compatibility issues
import os
os.environ['TRANSFORMERS_NO_TF'] = '1'

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Tuple, Dict

# Cache the model in memory (lazy loading)
_model = None


def get_model() -> SentenceTransformer:
    """
    Get or load the Sentence Transformer model (cached).
    
    Returns:
        SentenceTransformer model instance
    """
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model


# Similarity thresholds
# Similarity thresholds
MATCH_THRESHOLD = 0.90  # Almost exact match
PARTIAL_THRESHOLD = 0.80  # Strict partial match to ensure Java != JavaScript


def compute_skill_embeddings(skills: List[str]) -> np.ndarray:
    """
    Compute embeddings for a list of skills.
    
    Args:
        skills: List of skill strings
        
    Returns:
        Numpy array of embeddings
    """
    if not skills:
        return np.array([])
    
    model = get_model()
    embeddings = model.encode(skills, convert_to_numpy=True)
    return embeddings


def match_single_skill(
    resume_skill: str,
    resume_embedding: np.ndarray,
    jd_skills: List[str],
    jd_embeddings: np.ndarray
) -> Tuple[str, float, str]:
    """
    Match a single resume skill against all job description skills.
    
    Args:
        resume_skill: Resume skill text
        resume_embedding: Embedding for resume skill
        jd_skills: List of job description skills
        jd_embeddings: Embeddings for JD skills
        
    Returns:
        Tuple of (best_match_skill, similarity_score, match_type)
    """
    if len(jd_skills) == 0:
        return (None, 0.0, "missing")
    
    # Compute cosine similarities
    resume_embedding = resume_embedding.reshape(1, -1)
    similarities = cosine_similarity(resume_embedding, jd_embeddings)[0]
    
    # Find best match
    best_idx = np.argmax(similarities)
    best_score = similarities[best_idx]
    best_jd_skill = jd_skills[best_idx]
    
    # Classify match type
    if best_score >= MATCH_THRESHOLD:
        match_type = "matched"
    elif best_score >= PARTIAL_THRESHOLD:
        match_type = "partial"
    else:
        match_type = "no_match"
    
    return (best_jd_skill, float(best_score), match_type)


def semantic_skill_matching(
    resume_skills: List[str],
    jd_skills: List[str]
) -> Dict:
    """
    Perform semantic matching between resume skills and job description skills.
    
    Args:
        resume_skills: Skills from resume
        jd_skills: Skills from job description
        
    Returns:
        Dictionary with matched, partial, and missing skills
    """
    # Handle edge cases
    if not resume_skills:
        return {
            "matched_skills": [],
            "partial_matches": [],
            "missing_skills": jd_skills,
            "unmatched_resume_skills": []
        }
    
    if not jd_skills:
        return {
            "matched_skills": [],
            "partial_matches": [],
            "missing_skills": [],
            "unmatched_resume_skills": resume_skills
        }
    
    # Compute embeddings
    resume_embeddings = compute_skill_embeddings(resume_skills)
    jd_embeddings = compute_skill_embeddings(jd_skills)
    
    # Track which JD skills have been matched
    jd_matched = set()
    jd_partial = set()
    
    matched_skills = []
    partial_matches = []
    unmatched_resume_skills = []
    
    # Match each resume skill
    for i, resume_skill in enumerate(resume_skills):
        best_jd_skill, score, match_type = match_single_skill(
            resume_skill,
            resume_embeddings[i],
            jd_skills,
            jd_embeddings
        )
        
        if match_type == "matched":
            matched_skills.append(resume_skill)
            jd_matched.add(best_jd_skill)
        elif match_type == "partial":
            partial_matches.append(resume_skill)
            jd_partial.add(best_jd_skill)
        else:
            unmatched_resume_skills.append(resume_skill)
    
    # Identify missing skills (JD skills with no good resume match)
    missing_skills = [
        skill for skill in jd_skills
        if skill not in jd_matched and skill not in jd_partial
    ]
    
    return {
        "matched_skills": matched_skills,
        "partial_matches": partial_matches,
        "missing_skills": missing_skills,
        "unmatched_resume_skills": unmatched_resume_skills
    }


def compute_skill_match_percentage(
    matched_count: int,
    partial_count: int,
    total_jd_skills: int,
    partial_weight: float = 0.5
) -> float:
    """
    Compute skill match percentage with partial matches weighted.
    
    Args:
        matched_count: Number of matched skills
        partial_count: Number of partially matched skills
        total_jd_skills: Total skills in job description
        partial_weight: Weight for partial matches (default 0.5)
        
    Returns:
        Match percentage (0-100)
    """
    if total_jd_skills == 0:
        return 100.0
    
    weighted_matches = matched_count + (partial_count * partial_weight)
    percentage = (weighted_matches / total_jd_skills) * 100
    
    return min(round(percentage, 1), 100.0)
