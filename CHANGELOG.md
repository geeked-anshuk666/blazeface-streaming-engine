# Changelog

All notable changes to the Real-Time Face Detection Video Streaming System will be documented in this file.

## [Unreleased]
### Added
- `frontend/src/pages/Dashboard.jsx` with real-time SVG confidence gauge, event logs, and pipeline telemetry UI.
- `frontend/src/pages/LandingPage.jsx` with glassmorphism UI, metrics grid, and system architecture visualization.
- `backend/download_model.py` helper script to automatically fetch the Mediapipe BlazeFace TF Lite model.
- CORS middleware in `backend/main.py` allowing cross-origin requests from the frontend dev server.
- `frontend/index.html` configured with Cormorant and Montserrat font families for a premium SOC aesthetic.

### Changed
- Refactored frontend styling system to explicitly use inline CSS grids and flexbox properties to bypass Tailwind v4 JIT compilation dropouts.
- Updated `backend/schemas.py` and `backend/models.py` to enforce strict ROI bounding box metrics logging.
- Removed arbitrary SOC monitor branding from the dashboard sidebar for a cleaner identity.
- Refined Dashboard Control buttons with explicit color coding (Green for Initialize, Red for Halt).

### Fixed
- Fixed overlapping UI cards in the dashboard and landing page by replacing Tailwind padding/gap utility classes with explicit inline styling block boundaries.
- Resolved SVG gauge distortion in the dashboard metrics grid by applying strict flex-shrink rules.
