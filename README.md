# VERIDECK
## Cockpit Audio & Weather-Radar Verification Workbench

### 1. Project Overview
VERIDECK is a frontend prototype developed for the Honeywell Hackathon (Problem Statement 1). The application serves as an interactive engineering workstation designed to automate the functional equivalence verification of pilot/cockpit interactions and avionics rendering.

The system covers two independent verification workflows within a shared application shell:
- **Part A — Audio Annunciation Verification:** Validating voice outputs against specification.
- **Part B — Weather-Radar Image Verification:** Verifying that the *actual* rendered radar image matches the *expected/reference* radar image (Note: This is a rendering verification tool, *not* a weather prediction tool).

### 2. Problem Statement
This application addresses the engineering challenge of verifying avionics outputs programmatically rather than manually.

**Part A (Audio) Verification Requirements:**
- Process WAV input against an expected annunciation specification.
- Perform phrase verification, repetition, and word-order checks.
- Handle one-time versus continuous pattern rules.
- Verify timing tolerances and silence gaps between phrases.
- Provide a voice/gender classification interface.
- Maintain an evidence-oriented verification trail.

**Part B (Radar) Verification Requirements:**
- Compare an expected/reference image against an actual image.
- Perform image-pair verification to ensure functional equivalence.
- Support configurable exclusions/constraints (e.g., ignoring text, borders, or chrome).
- Provide alignment and comparison visualization.
- Calculate an overall similarity score.
- Output a deterministic PASS/FAIL verdict with supporting evidence/reporting.

### 3. Solution
The frontend architecture implements a modular approach, separating the distinct verification challenges while maintaining a unified reporting and history layer.

```text
User
 ↓
VERIDECK Web Application
 ↓
├── Part A: Audio Verification Module
└── Part B: Radar Image Verification Module
 ↓
Evidence / Verification Results
 ↓
Reports & Run History
```

Part A and Part B are structurally independent modules that do not leak logic into one another, allowing for clean scalability.

### 4. Key Features

#### Part A — Audio Verification
- **WAV Input Selection:** Interface to select audio test cases against specific DO-160/360-style rules.
- **Custom Waveform Viewer:** HTML Canvas-based visualizer showing the audio track.
- **Segment Overlays:** Visual overlays mapping silence gaps, detected speech, and expected positions.
- **Evidence Tabs:** Interactive data tables breaking down checks, timing gaps, word alignment, and pitch (F0) tracking.

#### Part B — Radar Verification
- **Pair Selection:** Interface to select expected/actual radar image pairs.
- **Difference Viewer:** Layered Canvas rendering showing 'Expected', 'Actual', and a pixelated 'Difference' overlay (highlighting matched, expected-only, actual-only, and ignored regions).
- **Interactive Swipe:** Slider tool to manually compare the expected and actual renders.
- **Configuration Constraints:** Toggles to ignore text, icons, window chrome, and set minimum similarity thresholds.
- **Spatial Breakdown:** Detailed metrics for spatial agreement, mask dilation, and translation offsets.

#### Platform Features
- **Dashboard:** Unified telemetry overview for both modules.
- **Test Runs:** Historical tabular log of all verification executions.
- **Reports:** Report generation interface with mock JSON and Excel export functionality.
- **Calibration Lab:** Interactive threshold tuning using ROC-style curves for radar, and configurable timing boundaries for audio.
- **Settings:** Centralized configuration panel.
- **Mock API Layer:** Simulated asynchronous processing to demonstrate the UX of long-running verification tasks.
- **Evidence Visualization:** Deterministic PASS/FAIL banners with clear reasoning.

### 5. Application Screens
- **Dashboard (`/`):** High-level metrics and recent runs table.
- **Audio Verification (`/audio`):** The Part A verification suite and waveform visualizer.
- **Radar Verification (`/radar`):** The Part B verification suite and canvas difference viewer.
- **Test Runs (`/runs`):** Historical execution logs.
- **Reports (`/reports`):** Generated compliance bundles and export actions.
- **Calibration Lab (`/calibration`):** Threshold tuning and data visualizations.
- **Settings (`/settings`):** Application and module configurations.

### 6. Architecture

```text
Frontend (React + Vite)
├── Dashboard
├── Audio Verification
├── Radar Verification
├── Test Runs
├── Reports
└── Calibration Lab

[ Mock Service & API Layer ]
├── audioApi (Simulates NLP/Acoustic processing)
├── radarApi (Simulates spatial/image comparison)
├── runHistoryApi (Simulates database persistence)
└── calibrationApi (Simulates data aggregation)
```

*Note: All backend data processing, ML inference, and database interactions are currently mocked within the service layer.*

### 7. Technology Stack
This prototype is built exclusively with modern frontend web technologies:
- **React 19**
- **TypeScript 5.8**
- **Vite 6**
- **Tailwind CSS 4**
- **Recharts** (Calibration data visualization)
- **WaveSurfer.js** (Underlying audio buffer processing)
- **Lucide React** (Iconography)

### 8. Project Structure
```text
src/
├── components/
│   ├── audio/      # Waveform and audio-specific UI
│   ├── layout/     # AppShell, Sidebar, Topbar
│   ├── radar/      # Difference viewer, canvas layers
│   └── ui/         # Shared Badges, Panels, Buttons
├── data/           # Mock JSON payloads for audio, radar, and history
├── hooks/          # Custom React hooks (e.g., useToast)
├── pages/          # Top-level routing components (Dashboard, Audio, Radar, etc.)
├── services/       # Mock API wrapper simulating network latency and pipelines
└── types/          # Global TypeScript interfaces for the verification schemas
```

### 9. Getting Started

#### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

#### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/paulnehemiah-a/CV_Honeywell_Aero_Hack.git
   ```
2. Navigate into the directory:
   ```bash
   cd CV_Honeywell_Aero_Hack
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

#### Run the Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

#### Additional Commands
- `npm run build` — Typecheck and build the production bundle.
- `npm run preview` — Serve the production build locally.

### 10. Demo Workflow
To experience the prototype, follow this suggested workflow:
1. Open the **Dashboard** to view system telemetry.
2. Navigate to **Audio Verification** (Part A).
3. Select a test case from the dropdown.
4. Click **Analyze & Verify** to trigger the simulated verification pipeline.
5. Inspect the generated evidence tabs (Checks, Waveform, Alignment, Timing, Gender) and the final PASS/FAIL verdict.
6. Navigate to **Radar Verification** (Part B).
7. Select an image pair from the dropdown.
8. Toggle comparison constraints (e.g., Ignore Text) in the side panel.
9. Click **Build Pair & Compare**.
10. Inspect the interactive difference view, similarity scores, and spatial breakdown.
11. Open **Reports** to simulate downloading the results as JSON or Excel.

### 11. Mock Data / Current Prototype Status
**IMPORTANT:** This repository currently contains a frontend prototype. AI inference, audio processing, computer vision processing, and backend API responses are mocked where applicable.

**What is real and implemented:**
- The complete frontend user interface.
- Client-side navigation and state management.
- Complex data visualizations (HTML Canvas rendering, Recharts).
- Interactive parameter configuration and UI feedback loops.
- Simulated asynchronous verification pipelines (Pipeline Stepper).

**What is planned (Currently Mocked):**
- Real audio file ingestion and inference.
- Real speech-to-text (NLP) alignment.
- Real programmatic timing and gender (F0) acoustic analysis.
- Real radar image processing and computer vision alignment algorithms.
- Real backend API integration and database persistence.

### 12. Design Philosophy
The interface intentionally avoids marketing or consumer app aesthetics. It is designed as an engineering workstation:
- **Dark Aesthetic:** Dark charcoal backgrounds reduce eye strain in dimly lit environments.
- **Semantic Colors:** Strict adherence to `PASS` (Green), `FAIL` (Red), `INFO` (Blue), and `WARN` (Amber) for rapid visual parsing.
- **Technical Typography:** Extensive use of monospace fonts for data, telemetry, and identifiers to ensure tabular alignment and readability.
- **Evidence-First Visualization:** High information density prioritizing raw data and metrics over whitespace.
- **Minimal Decoration:** Decorative animations are omitted in favor of precise, deterministic UI states.

### 13. Engineering Principles
- **Evidence-first Verification:** Every PASS/FAIL verdict must be accompanied by inspectable, deterministic evidence.
- **Explainability:** Users must understand exactly *why* a test failed via visual bounding boxes or timing metrics.
- **Modular Architecture:** Complete separation of concerns between Part A and Part B.
- **Backend-ready Service Abstraction:** The mock API layer is structured to be easily swapped for `fetch` calls to a real REST/gRPC backend.
- **Deterministic UI States:** Loading, processing, success, and error states are rigidly defined to represent real-world latency.

### 14. Future Integration
When the verification engines are fully developed, the frontend is designed to consume them via a standard REST API structure:

```text
[ Planned Future State ]

Frontend (VERIDECK)
 ↓
REST API Gateway
 ↓
├── Audio Verification Engine (Python/ML)
└── Radar Verification Engine (OpenCV/Python)
 ↓
Verification Results & Raw Metrics
 ↓
Database (Evidence + Reports)
```

### 15. Hackathon Context
This project was developed exclusively for the Honeywell Aero Hackathon. The implementation and scope are targeted specifically at fulfilling the requirements of **Problem Statement 1**.

### 16. Disclaimer
*This project is a hackathon prototype and is not intended for production avionics or safety-critical operational use.*
