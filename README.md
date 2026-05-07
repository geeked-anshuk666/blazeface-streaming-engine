# BlazeFace Streaming Engine

> **A high-performance, real-time face detection streaming platform built with zero OpenCV dependencies.**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

FaceStream is a highly optimized full-stack application that provides real-time Face Detection telemetry. It bypasses the traditional heavyweight OpenCV stack, instead opting for a lightning-fast combination of **FastAPI**, **MediaPipe (BlazeFace)**, and a **React/Vite Bento UI**. This repository was engineered for high throughput, sub-100ms latency on commodity CPUs, and strict edge-deployment compatibility.

---

## Live Demos
- **Frontend (Vercel):** [https://blazeface-streaming-engine.vercel.app](https://blazeface-streaming-engine.vercel.app) *(Placeholder: Update after deployment)*
- **Backend API (Render):** [https://blazeface-streaming-engine.onrender.com](https://blazeface-streaming-engine.onrender.com) *(Placeholder: Update after deployment)*

---

## Table of Contents
1. [Core Features](#-core-features)
2. [System Architecture](#-system-architecture)
3. [Manual Setup & Installation](#-manual-setup--installation)
4. [Deployment (Split Architecture)](#-deployment-split-architecture)
5. [License](#-license)

---

## Core Features
* **Zero OpenCV Usage**: Replaces heavy `cv2` pipelines with pure MediaPipe inference and Pillow-based annotation, drastically reducing the container footprint and memory usage.
* **MJPEG Streaming Loop**: An asynchronous FastAPI backend maintains a persistent stream, extracting Region of Interest (ROI) bounding boxes continuously at 15+ FPS on standard CPU hardware.
* **SOC Dashboard**: A royal, glassmorphism-inspired React dashboard featuring live telemetry, SVG confidence gauges, and structural event logging.
* **Hardened Pipeline**: Includes strict payload limits (2MB max per frame), rate limiting, and CORS security out of the box.

---

## System Architecture

The architecture explicitly separates the ingestion layer, the inference layer, and the rendering layer.

### 1. Clean Separation of Concerns
```mermaid
sequenceDiagram
    participant FE as React Frontend
    participant E1 as API: Receive Feed
    participant VS as Vision Service (Mediapipe/Pillow)
    participant DB as PostgreSQL/SQLite
    participant E3 as API: Serve ROI Data
    participant E2 as API: Serve Processed Feed
    
    FE->>E1: Send Video Stream (Bytes)
    E1->>VS: Extract Frame
    VS->>VS: Detect Single Face & Draw ROI Box
    VS->>DB: Store ROI Data
    VS-->>E2: Buffer Processed Frame
    E2-->>FE: Stream Processed Video
    FE->>E3: Request Historical ROI
    DB-->>E3: Query Results
    E3-->>FE: JSON ROI Data
```

### 2. API Design & Contracts
API Design & Contracts adhere strictly to HTTP semantics:
- **Endpoint 1 (Receive Feed):** `POST /api/v1/feed/ingest`
- **Endpoint 2 (Serve Feed):** `GET /api/v1/feed/stream`
- **Endpoint 3 (Serve ROI Data):** `GET /api/v1/roi`

### 3. Vision Processing Layer
The vision processing layer explicitly uses **Mediapipe BlazeFace** for CPU-efficient detection and **Pillow** for non-OpenCV drawing.
- **Edge Case Handling:**
  - **No face detected:** Return original frame, skip DB insert.
  - **Multiple faces:** Algorithm strictly isolates the first/largest face detected.
  - **Corrupt frame:** Catch image parsing errors, drop frame, log warning, do not crash server.

### 4. Threat Model & Security Fundamentals
| Attack Vector | Control | Layer |
| :--- | :--- | :--- |
| **Malicious Image Buffer** | MIME-type validation + Buffer limit | Backend Middleware |
| **SQL Injection** | SQLAlchemy ORM parameterized queries | Data Layer |
| **WS Resource Exhaustion** | Rate limiting / Per-Session connection limits | FastAPI |
| **XSS** | React component-based rendering (auto-escape) | Frontend |

---

## Manual Setup & Installation

Want to run the SOC monitor locally without Docker? Follow these manual setup steps.

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8888
```
*The API will be available at `http://localhost:8888` and Swagger docs at `http://localhost:8888/docs`.*

### 2. Frontend Setup
Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
*The Dashboard will be available at `http://localhost:5173`.*

---

## Deployment (Split Architecture)

FaceStream is designed for a split-deployment model to ensure the streaming backend isn't killed by serverless timeouts.

### 1. Frontend (Vercel)
The React/Vite dashboard is completely statically generated and optimized for Vercel.
1. Connect this GitHub repository to Vercel.
2. Set the **Root Directory** to `frontend`.
3. Add the Environment Variable: `VITE_API_URL=<YOUR_BACKEND_URL>`.
4. Deploy. (Routing is automatically handled by the included `vercel.json`).

### 2. Backend (Render / Railway / Fly.io)
The FastAPI backend requires persistent infrastructure to keep the MJPEG WebSocket/Streaming connections alive.
1. Connect this GitHub repository to Render.
2. Render will automatically detect the included `render.yaml` blueprint.
3. The system will deploy the backend (port 8888) with zero manual configuration.

---

## License
MIT
