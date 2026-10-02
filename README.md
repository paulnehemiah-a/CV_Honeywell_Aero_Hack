# VeriDeck 🛫

**Cockpit Audio & Weather-Radar Verification Workbench**

VeriDeck is an interactive, frontend-only prototype developed for the **Honeywell Aero Hackathon**. It serves as an engineering workstation designed to automate and visualize the verification of cockpit avionics systems, specifically targeting audio annunciations and precipitation radar renderings. 

Built with a strict, professional "aerospace engineering" design system, VeriDeck prioritizes clarity, data density, and functional precision over marketing-style aesthetics.

![VeriDeck Dashboard](https://img.shields.io/badge/Status-Prototype-blue) ![React](https://img.shields.io/badge/React-19-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6) ![Vite](https://img.shields.io/badge/Vite-6.0-646cff)

## 🎯 Problem Statement
The goal is to automate the functional equivalence verification of pilot/cockpit interactions. The prototype is split into two distinct, independent modules that share a common reporting application shell:

1. **Part A: Cockpit Audio Verification**
2. **Part B: Weather-Radar Image Verification**

---

## ✨ Features

### 🎧 Part A: Audio Verification
Verify voice annunciations against expected phrase specifications and RTCA DO-160/360 equivalents.
- **Waveform Analysis:** Custom HTML Canvas-based waveform viewer with precision overlays.
- **Timing & Silence Gaps:** Strict validation of expected vs. actual pauses between phrases.
- **Pitch Tracking:** Fundamental frequency (F0) analysis to verify correct voice gender output.
- **Alignment Metrics:** NLP-style confidence scoring and word alignment mapping.

### 📡 Part B: Radar Verification
Determine whether two weather-radar precipitation renderings are functionally equivalent.
- **Spatial Alignment:** Canvas-layered comparison showing 'Expected' vs 'Actual' radar renders.
- **Difference Overlay:** Pixel-perfect visual breakdown highlighting "Matched", "Expected Only", "Actual Only", and "Ignored" regions.
- **Custom Constraints:** Tunable thresholds for spatial agreement, mask dilation, and boundary tolerance.
- **Interactive Swipe:** Seamlessly swipe between simulated radar outputs.

### 📊 Lab & Reporting
- **Calibration Lab:** ROC-style threshold sweeps (False Pass vs. False Fail rates) to tune the system mathematically.
- **History & Reports:** Persistent run logs with mock JSON/Excel data exports.

---

## 🛠 Tech Stack
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (v4) with custom Aerospace UI tokens
- **Icons:** Lucide React
- **Charts:** Recharts
- **Audio Rendering:** WaveSurfer.js + Custom Canvas Overlays

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

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

### Running the Application

Start the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the prototype.

---

## 🎨 Design Philosophy
The UI follows a strict engineering theme:
- **Dark Charcoal Backgrounds** (`#0b0f15`, `#111720`) to reduce eye strain in dimly lit environments.
- **Semantic Colors:** Strict adherence to `PASS` (Green), `FAIL` (Red), `INFO` (Blue), and `WARN` (Amber).
- **Monospace Typography:** Extensive use of `JetBrains Mono` for telemetry, IDs, numbers, and hex outputs to ensure readability and alignment.
- **No Animations (Mostly):** Eliminated unnecessary decorative animations, focusing purely on loading states and data visualization.

---

*This project was developed for a hackathon. The data and backend API calls are completely mocked to demonstrate the frontend interactive experience.*
