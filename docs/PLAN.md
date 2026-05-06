# Execution Plan: Robust FaceStream ROI Monitor

## 🎯 Goal
Build a high-performance, containerized video streaming system with real-time face detection (No-OpenCV) and ROI data persistence.

## 🛠️ Tech Stack
- **Backend:** FastAPI, Mediapipe, Pillow, SQLAlchemy.
- **Database:** PostgreSQL.
- **Frontend:** React (Vite), Tailwind CSS (Premium SOC Dashboard).
- **Infrastructure:** Docker, `docker-compose`.

---

## 🏗️ Phase 1: Foundation & Backend Robustness (ORCHESTRATED)
**Agents:** `backend-specialist`, `database-architect`, `security-auditor`

### 1.1 Project Setup & Version Control
- [ ] Initialize Git repository.
- [ ] Create comprehensive `.gitignore`.
- [ ] Setup `docker-compose.yml` (Backend, DB, Frontend skeletons).
- [ ] **Verification:** Run `git status` and check container connectivity.

### 1.2 Database Layer (`database-architect`)
- [ ] Implement SQLAlchemy models for `face_detections`.
- [ ] Configure PostgreSQL with optimized indices for timestamp/session_id.
- [ ] **Verification:** `python .agent/skills/database-design/scripts/schema_validator.py`

### 1.3 Vision Service & API (`backend-specialist`)
- [ ] Implement `VisionService` using Mediapipe (BlazeFace) and Pillow.
- [ ] Implement 3 core endpoints:
    - `POST /api/v1/feed/ingest` (Byte-stream handling).
    - `GET /api/v1/feed/stream` (MJPEG streaming).
    - `GET /api/v1/roi` (JSON metadata).
- [ ] **Verification:** Unit tests for ROI coordinate math.

### 1.4 Security & Robustness (`security-auditor`)
- [ ] Implement sliding window rate limiting (middleware).
- [ ] Implement byte-size payload limits and MIME-type validation.
- [ ] Implement graceful error handling for corrupt frames.
- [ ] **Verification:** `python .agent/skills/vulnerability-scanner/scripts/security_scan.py`

---

## 🎨 Phase 2: Premium Frontend Implementation
**Agents:** `frontend-specialist`, `performance-optimizer`
**Skills:** `ui-ux-pro-max`, `react-best-practices`, `web-design-guidelines`

- [ ] Generate Design System via `ui-ux-pro-max` (SOC Dashboard / Dark Mode).
- [ ] Implement Real-time MJPEG viewer component.
- [ ] Implement ROI Data Dashboard with live updates.
- [ ] Audit for accessibility and performance.
- [ ] **Verification:** `python .agent/skills/webapp-testing/scripts/playwright_runner.py`

---

## 🏁 Phase 3: Finalization & Attestation
- [ ] Generate `architecture.png`.
- [ ] Finalize `AI_ATTESTATION.md` and `CHANGELOG.md`.
- [ ] Final end-to-end verification.

---

## 🎼 Orchestration Roles

| Agent | Focus Area | Verification Script |
| :--- | :--- | :--- |
| **database-architect** | Schema, SQLi prevention | `schema_validator.py` |
| **backend-specialist** | API, Vision logic | `test_runner.py` |
| **security-auditor** | Rate limiting, Robustness | `security_scan.py` |
| **frontend-specialist** | Premium UI/UX | `ux_audit.py` |
| **test-engineer** | CI/CD, E2E | `verify_all.py` |
