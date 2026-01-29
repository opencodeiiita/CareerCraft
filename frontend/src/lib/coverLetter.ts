const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL;

export interface ResumeAnalysisResponse {
  personal_info: {
    name: string;
    email: string;
    phone: string;
    location?: string;
  };
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  missing_skills?: string[];
}

export interface CoverLetterRequest {
  resume_analysis: ResumeAnalysisResponse;
  job_info: {
    company_name: string;
    job_title: string;
    job_description: string;
  };
  tone: 'formal' | 'confident' | 'friendly';
}

export interface CoverLetterResponse {
  company_name: string;
  job_title: string;
  tone: string;
  cover_letter: {
    greeting: string;
    body: string[];
    closing: string;
    sign_off: string;
    candidate_name: string;
  };
  missing_skills?: string[];
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysisResponse> {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/resume/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: resumeText }),
    });

    if (!response.ok) {
      throw new Error(`Resume analysis failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume. Please try again.');
  }
}

export async function generateCoverLetter(request: CoverLetterRequest): Promise<CoverLetterResponse> {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/cover-letter/generate-cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Cover letter generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw new Error('Failed to generate cover letter. Please try again.');
  }
}

export async function uploadResume(file: File): Promise<{ text: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${ML_SERVICE_URL}/resume/extract-text`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Resume upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { text: data.text };
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error('Failed to upload resume. Please try again.');
  }
}
