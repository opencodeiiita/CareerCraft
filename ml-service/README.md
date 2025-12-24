# Careercraft – ML Service

It contains the **machine learning microservice** for **Careercraft**.  
It is a lightweight FastAPI-based service responsible for analyzing resumes and providing skill extraction and career recommendations.

The service is designed to be **minimal, fast, and independently deployable**, making it easy to scale or replace models in the future.

---

## 📁 Folder Structure

ml-service/  
├── main.py   # FastAPI application & API routes  
├── model.py   # ML logic (skill extraction & recommendations)  
└── requirements.txt # Python dependencies  

---

## ⚙️ Tech Stack

- **Python 3.9+**
- **FastAPI** – API framework
- **Uvicorn** – ASGI server
- **Pydantic** – Request validation

---

## 🚀 Features

- Resume text analysis
- Skill extraction from raw text
- Career / role recommendations
- Independent microservice architecture

---

## 🛠️ Setup Instructions

### 1️⃣ Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

3️⃣ Run the Service

```bash
uvicorn main:app --reload --port 8001
```
