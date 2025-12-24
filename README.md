# CareerCraft — Resume Evaluator & Job Match Assistant

CareerCraft is an **AI-powered career enhancement platform** designed to help job seekers optimize their resumes, evaluate job-fit, and generate tailored cover letters.  
It uses modern **AI, NLP, and web technologies** to simulate real-world Applicant Tracking Systems (ATS) and hiring workflows.

The platform provides actionable insights that improve resume quality, skill alignment, and overall job readiness.

---

## 🚀 Key Features

### 📝 Resume Analyzer (ATS Optimization)
- Upload **PDF / DOCX** resumes
- ATS-style scoring based on:
  - Keyword alignment
  - Resume structure & formatting
  - Readability
  - Section completeness
- Detailed improvement suggestions

---

### 🎯 Skill Match & Job Fit Scoring
- Paste or select a **target job description**
- Get:
  - Job match percentage
  - Identified missing skills
  - Role-specific improvement tips
- Personalized upskilling recommendations with learning resources

---

### ✍️ AI Cover Letter Generator
- Generates **professionally tailored cover letters**
- Uses:
  - Resume content
  - Job description insights
- Supports tone customization:
  - Formal
  - Confident
  - Friendly
- One-click **PDF export**

---

### 📊 User Dashboard & History Tracking
- Secure user authentication
- Store:
  - Resumes
  - Generated cover letters
  - Job match results
- Track progress across multiple applications
- Manage multiple resume versions

---

## 🧠 System Architecture

CareerCraft follows a **microservice-based architecture**:

CareerCraft/
├── frontend/ # User Interface (Next.js)  
├── backend/ # API & Authentication (Node.js / Express)  
└── ml-service/ # AI & NLP Engine (FastAPI)  

### Architecture Flow

Frontend → Backend → ML Service → Backend → Frontend


---

## 🛠️ Tech Stack

### Frontend
- Next.js 
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### ML Service
- Python
- FastAPI
- NLP-based keyword & role matching
- Rule-based + AI-expandable models

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/CareerCraft.git
cd CareerCraft
```

2️⃣ Start ML Service

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

3️⃣ Start Backend

```bash
cd backend
npm install
npm run dev
```

4️⃣ Start Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 👨‍💻 Contributors

See CONTRIBUTORS.md for the full list of contributors.

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Acknowledgements

Inspired by real-world ATS systems and modern hiring workflows.  
Built for learning, experimentation, and real-world impact.
