# FaceStream ROI Monitor

Real-time face detection and video streaming system built with FastAPI, React, and Mediapipe. **Zero OpenCV usage.**

## 🚀 Quick Start (5-Minute Rule)

Ensure you have [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) installed.

```bash
# 1. Clone the repository
git clone <repo_url>
cd Real_Time_Face_Detection_Video_Streaming_System

# 2. Start the system
docker-compose up --build
```

The system will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🛠️ Tech Stack
- **Backend:** FastAPI, Mediapipe, Pillow, SQLAlchemy
- **Frontend:** React (Vite), Tailwind CSS
- **Database:** PostgreSQL
- **DevOps:** Docker

## 📖 Documentation
Detailed documentation can be found in the `docs/` and `meta_docs/` directories.
- [Architecture](meta_docs/architecture.md)
- [PRD](meta_docs/prd.md)
- [API Design](meta_docs/architecture.md#2-api-design--contracts)

## ⚖️ License
MIT
