"""
Job Skill Extractor Service
Extracts required skills from job descriptions using spaCy and regex.
"""

import re
import spacy
from typing import List, Set

# Load spaCy model with automatic download
def load_spacy_model():
    """Load spaCy model, downloading if necessary."""
    try:
        return spacy.load("en_core_web_sm")
    except OSError:
        print("Downloading spaCy model 'en_core_web_sm'...")
        import subprocess
        import sys
        subprocess.check_call([
            sys.executable, "-m", "spacy", "download", "en_core_web_sm"
        ])
        return spacy.load("en_core_web_sm")

nlp = load_spacy_model()


# Skill-heavy section keywords
SKILL_SECTION_PATTERNS = [
    r"(?i)required\s+skills?",
    r"(?i)technical\s+skills?",
    r"(?i)qualifications?",
    r"(?i)requirements?",
    r"(?i)must\s+have",
    r"(?i)experience\s+with",
    r"(?i)proficiency\s+in",
    r"(?i)knowledge\s+of",
]

# Common soft skills to filter out
SOFT_SKILLS = {
    "communication", "teamwork", "leadership", "problem solving",
    "critical thinking", "time management", "adaptability", "creativity",
    "interpersonal", "organizational", "analytical", "detail oriented",
    "self motivated", "collaborative", "flexible", "motivated"
}

# Generic terms to filter out
GENERIC_TERMS = {
    "designers", "engineers", "managers", "developers", "end", "requirements",
    "designs", "specifications", "environment", "application", "system",
    "solutions", "clients", "users", "team", "project", "role", "work",
    "experience", "knowledge", "skills", "ability", "understanding",
    "technologies", "tools", "platforms", "languages", "frameworks", "libraries", 
    "concepts", "principles", "best practices", "methodologies", "other",
    "technical", "product", "software", "processes", "support", "services",
    "orchestration", "containerization"
}

# Whitelist of common technologies to always extract if present
COMMON_TECH_STACK = {
    "java", "python", "c", "c++", "c#", ".net", "rust", "golang", "swift", "kotlin", "php", "ruby", "scala",
    "typescript", "javascript", "js", "react", "angular", "vue", "next.js", "node.js", "express", "django", "flask", "fastapi", "spring boot", "spring",
    "docker", "kubernetes", "k8s", "aws", "azure", "gcp", "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
    "git", "github", "gitlab", "linux", "bash", "html", "css", "sass", "graphql", "rest api",
    "terraform", "ansible", "jenkins", "circleci", "pytorch", "tensorflow", "keras", "pandas", "numpy", "scikit-learn",
    "excel", "power bi", "tableau", "jira", "confluence", "figma"
}


def extract_skill_sections(job_description: str) -> str:
    """
    Extract skill-heavy sections from job description using regex.
    
    Args:
        job_description: Raw job description text
        
    Returns:
        Combined text from skill-relevant sections
    """
    skill_text = []
    lines = job_description.split('\n')
    
    in_skill_section = False
    section_buffer = []
    
    for line in lines:
        line_stripped = line.strip()
        
        # Check if this line starts a skill section
        is_section_header = any(
            re.search(pattern, line_stripped) 
            for pattern in SKILL_SECTION_PATTERNS
        )
        
        if is_section_header:
            in_skill_section = True
            section_buffer = []
        
        # If in skill section, accumulate lines
        if in_skill_section:
            section_buffer.append(line_stripped)
            
            # End section if we hit a blank line after content
            if not line_stripped and len(section_buffer) > 1:
                skill_text.append(' '.join(section_buffer))
                in_skill_section = False
                section_buffer = []
    
    # Add any remaining buffer
    if section_buffer:
        skill_text.append(' '.join(section_buffer))
    
    # If no specific sections found, use entire description
    if not skill_text:
        skill_text.append(job_description)
    
    return ' '.join(skill_text)


def clean_and_normalize_skill(skill: str) -> str:
    """
    Normalize skill text: lowercase, remove special chars, deduplicate spaces.
    
    Args:
        skill: Raw skill text
        
    Returns:
        Normalized skill string
    """
    # Lowercase
    skill = skill.lower()
    
    # Remove special characters except dots, hyphens, pluses, sharps
    skill = re.sub(r'[^\w\s.+#-]', '', skill)
    
    # Normalize whitespace
    skill = ' '.join(skill.split())
    
    # Remove trailing/leading dots or dashes
    skill = skill.strip('.-')
    
    return skill


def extract_technical_skills(text: str) -> List[str]:
    """
    Extract technical skills using spaCy NLP and pattern matching.
    
    Args:
        text: Text to extract skills from
        
    Returns:
        List of normalized technical skills
    """
    # Process with spaCy
    doc = nlp(text)
    
    skills = set()
    
    # Extract noun phrases as potential skills
    for chunk in doc.noun_chunks:
        skill = clean_and_normalize_skill(chunk.text)
        
        # Filter out soft skills and very short/long phrases
        if skill in SOFT_SKILLS or skill in GENERIC_TERMS:
            continue
            
        # Aggressive cleaning: Remove common non-skill prefixes
        prefixes_to_strip = ["technical ", "other ", "strong ", "proven ", "excellent ", "good ", "demonstrated ", "proficient ", "solid "]
        for prefix in prefixes_to_strip:
            if skill.startswith(prefix):
                skill = skill[len(prefix):].strip()
        
        # Re-check validity after stripping
        if not skill or len(skill) < 2:
            continue
            
        # split again to check length
        parts = skill.split()
        
        # Filter: Phrases ending with generic roles/artifacts
        # e.g. "product managers", "technical designs", "software engineers", "strong understanding"
        bad_suffixes = {
            "managers", "engineers", "developers", "designs", "requirements", 
            "specifications", "teams", "clients", "users", "environments",
            "understanding", "knowledge", "familiarity", "proficiency", "experience"
        }
        if parts[-1] in bad_suffixes:
            continue
            
        if (skill and 
            len(skill) >= 2 and 
            len(parts) <= 4 and
            skill not in SOFT_SKILLS and
            skill not in GENERIC_TERMS):
            
            # Additional heuristic: Single lowercase words are often not tech skills unless well-known
            # (matches "java", "python", "agile" but filters "end", "designers" etc if they slip through)
            if len(parts) == 1 and skill.islower() and len(skill) < 4 and skill not in ["git", "aws", "sql"]:
                 continue
                 
            # If it's a known generic term ending in 's', filter it (e.g. "managers")
            if skill.endswith('s') and skill[:-1] in GENERIC_TERMS:
                continue

            skills.add(skill)
            skills.add(skill)
    
    # Extract named entities (PRODUCT, ORG) as potential tech skills
    for ent in doc.ents:
        if ent.label_ in ["PRODUCT", "ORG"]:
            skill = clean_and_normalize_skill(ent.text)
            if skill and len(skill) >= 2:
                skills.add(skill)
    
    # Pattern-based extraction for common tech terms
    # Technologies often appear in specific patterns
    tech_patterns = [
        r'\b[A-Z][a-z]+(?:\.[a-z]+)+\b',  # e.g., Node.js, React.js
        r'\b[A-Z]{2,}\b',  # e.g., AWS, SQL, API
        r'\b\w+\+\+\b',  # e.g., C++
        r'\b[Cc]#\b',  # C#
    ]
    
    for pattern in tech_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            skill = clean_and_normalize_skill(match)
            if skill:
                skills.add(skill)

    # Dictionary-based extraction for known tech stack (High precision)
    # This ensures we don't miss "Java", "Python" even if NLP fails
    text_lower = text.lower()
    for tech in COMMON_TECH_STACK:
        # Use regex to find whole words only to avoid substring matching (e.g. "java" in "javascript")
        # Escape special chars like "+" in "c++"
        pattern = r'\b' + re.escape(tech) + r'\b'
        if re.search(pattern, text_lower):
            skills.add(tech)
            
    # Special handling for "Go" programming language
    # Only match "Go" if it looks like a language (e.g. "Go, Python", "Go/C++", "knowledge of Go")
    # Avoid matching "go to", "go live", etc.
    if re.search(r'(?i)(\b(in|with|using|and|or)\s+Go\b)|(\bGo\s*[,/])|([,/]\s*Go\b)', text):
        skills.add("go")

    return list(skills)


def deduplicate_skills(skills: List[str]) -> List[str]:
    """
    Remove duplicate skills (including substring matches).
    
    Args:
        skills: List of skills
        
    Returns:
        Deduplicated list of skills
    """
    # Sort by length (longest first) to keep more specific terms
    sorted_skills = sorted(set(skills), key=len, reverse=True)
    
    unique_skills = []
    seen_tokens = set()
    
    for skill in sorted_skills:
        tokens = set(skill.split())
        
        # Check if this is a subset of already seen skills
        if not tokens.issubset(seen_tokens):
            unique_skills.append(skill)
            seen_tokens.update(tokens)
    
    return unique_skills


def extract_job_skills(job_description: str) -> List[str]:
    """
    Main function to extract technical skills from job description.
    
    Args:
        job_description: Raw job description text
        
    Returns:
        List of normalized, deduplicated technical skills
    """
    # Extract skill-relevant sections
    skill_text = extract_skill_sections(job_description)
    
    # Extract technical skills
    skills = extract_technical_skills(skill_text)
    
    # Deduplicate
    skills = deduplicate_skills(skills)
    
    # Sort alphabetically for consistency
    skills.sort()
    
    return skills
