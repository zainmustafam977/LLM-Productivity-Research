# LLM Programming Productivity Analysis

> **A comprehensive interactive analysis dashboard** exploring how LLM-powered coding tools (Autocomplete & Conversational AI) impact programming speed, code quality, and developer experience.

[![Last Updated](https://img.shields.io/badge/Last%20Updated-June%204%2C%202026-blue)](https://zainmustafam977.github.io/LLM-Productivity-Research/)

## 🔗 Live Demo

**[View the Analysis Dashboard →](https://zainmustafam977.github.io/LLM-Productivity-Research/)**

## 📊 Study Overview

This research project is part of **CS326 Human Computer Interaction** at the University of Management and Technology, supervised by Professor Qamar Abbas Arbie.

| Metric | Value |
|--------|-------|
| **Participants** | 24 valid (29 total) |
| **Tasks** | 3 (CSV, PDF, TXT parsing) |
| **Conditions** | Control, Autocomplete, Conversational |
| **UX Dimensions** | 10 semantic differentials |
| **Statistical Tests** | Cohen's d, Pearson correlation |

## 🔬 Key Findings

- **AI boosts speed significantly** — Autocomplete achieves Cohen's d = 1.25 (large effect, p < 0.01)
- **Code quality is maintained** — Maintainability Index shows negligible variation (d = 0.12)
- **Conversational AI enables learning** — Highest satisfaction scores for unfamiliar tasks
- **AI replaces browser searches** — Near-zero browser dependency with AI conditions

## 📁 Repository Structure

```
├── analysis/           # Interactive analysis dashboard
│   ├── index.html      # Main dashboard page
│   ├── styles.css      # Styling (light/dark mode)
│   ├── charts.js       # Chart.js visualizations (38 charts)
│   ├── data.js         # Preprocessed study data
│   ├── app.js          # Application logic & interactivity
│   └── assets/         # Team photos and images
├── data-analysis/      # Raw data and analysis notebooks
│   ├── csv/            # Anonymized study data
│   └── analysis.ipynb  # R notebook for analysis
├── study/              # Code skeletons for participants
├── index.html          # Root redirect to dashboard
└── README.md           # This file
```

## 🚀 Features

- **38 interactive charts** — Demographics, speed, quality, UX, correlations
- **Dark mode** — Toggle or auto-detect system preference
- **Responsive design** — Works on desktop, tablet, and mobile
- **Statistical annotations** — p-values, effect sizes, confidence indicators
- **Data export** — Download any chart as PNG
- **Accessibility** — ARIA labels, keyboard navigation, skip links
- **Deep linking** — URL hash sync for shareable section links

## 🛠️ Technologies

- HTML5, CSS3 (custom properties, glassmorphism)
- JavaScript (ES6+)
- [Chart.js 4.4.4](https://www.chartjs.org/)
- Google Fonts (Fraunces, Space Grotesk, JetBrains Mono)

## 👥 Team

- **Muhammad Zain** — F2023266257
- **Muhammad Umar** — F20232661022

---

*Last updated: June 4, 2026*