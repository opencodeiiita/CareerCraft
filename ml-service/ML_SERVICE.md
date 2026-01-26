# CareerCraft ML Service

The ML Service is the intelligence engine of CareerCraft, responsible for parsing resumes, analyzing content, matching jobs, and generating cover letters. It is built using **FastAPI** for high performance and easy asynchronous processing.

##  Purpose & Responsibilities

1.  **Resume Parsing**: Extract raw text from PDF and DOCX files.
2.  **Analysis**: Evaluate resumes for ATS compatibility, keyword density, and structural completeness.
3.  **Job Matching**: Compute semantic similarity between a resume and a job description using NLP models.
4.  **Generative AI**: Create personalized cover letters using LLMs (e.g., Gemma 2 via Ollama).

##  High-Level Overview

The service operates as a stateless REST API. Frontends communicate directly with it for analysis tasks to minimize latency and backend load.

*   **Framework**: FastAPI (Python)
*   **NLP Core**: Spacy (`en_core_web_sm`)
*   **Embeddings**: `sentence-transformers` for semantic matching.
*   **GenAI**: Integration with local LLMs (Ollama) or external APIs for text generation.

##  API Endpoints

### 1. Resume Extraction
*   **Endpoint**: `POST /resume/extract-text`
*   **Input**: `file` (UploadFile - PDF/DOCX)
*   **Output**: `{"filename": "name.pdf", "text": "extracted text..."}`

### 2. Resume Analysis
*   **Endpoint**: `POST /resume/analyze`
*   **Input**: `{"content": "resume text string"}`
*   **Output**: JSON containing skills, ATS score, missing keywords, and section analysis.

### 3. Job Match
*   **Endpoint**: `POST /resume/job-match`
*   **Input**: `{"resume_analysis": {...}, "job_description": "text"}`
*   **Output**: Job fit score (0-100), matched/missing skills, feedback.

### 4. Cover Letter Generation
*   **Endpoint**: `POST /cover-letter/generate-cover-letter`
*   **Input**: `resume_analysis`, `job_info`, `tone`
*   **Output**: Structured JSON with greeting, body paragraphs, and closing.

##  Limitations & Assumptions

*   **Stateless**: No data is persisted in the ML Service. All context must be passed in the request.
*   **Model Dependencies**: Requires local LLM setup (Ollama) for cover letter generation if not using an external API key.
*   **Hardware**: Performance depends on CPU/GPU availability for inference.
