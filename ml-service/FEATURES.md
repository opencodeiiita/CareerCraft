# ML Service Features

## Resume Analysis

### ATS Scoring
The service calculates an Application Tracking System (ATS) score based on:
*   **Keyword Presence**: Industry-standard terminology.
*   **Section Detection**: identifying key headers like Experience, Education, Skills.
*   **Readability**: Text complexity and formatting checks.

### Skill Extraction
Uses **Spacy**'s Named Entity Recognition (NER) and pattern matching to extract skills from raw text, categorizing them into technical and soft skills.

## Job Matching

### Semantic Similarity
Detailed comparison between resume content and job descriptions using **Sentence Transformers**. This goes beyond simple keyword matching to understand the *context* of experience vs. requirements.

### Gap Analysis
Identifies exactly which skills are missing from the resume relative to the job description, providing actionable advice to the user.

## Cover Letter Generation

### Context-Aware Creation
Generates unique cover letters by combining:
1.  **Candidate Profile**: Extracted skills and experience.
2.  **Job Requirements**: Company name, role, and description.
3.  **Tone Selection**: User choice of Formal, Confident, or Friendly styles.

### Structured Output
The generation process strictly enforces a JSON structure, ensuring the frontend can render the Greeting, Body, and Closing as distinct, edible components rather than a raw text block.

### Configuration
*   **Models**: Supports pluggable LLM backends (default: `gemma2:2b`).
*   **Parameters**: specific `temperature` and `max_tokens` settings can tune creativity.
