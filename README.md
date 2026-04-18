# Stroke Awareness Dashboard

A high-performance, research-driven analytical dashboard designed to visualize and interpret stroke awareness levels within the community. This platform utilizes multi-model clustering analysis to segment the population into actionable behavioral archetypes, supporting data-backed public health interventions.

![Dashboard Preview](https://img.shields.io/badge/UI-Theme--Responsive-blueviolet)
![Data Analysis](https://img.shields.io/badge/Analysis-Clustering--Driven-green)

---

## 🚀 Key Features

The dashboard provides a deep-dive analysis across several critical dimensions:

-   **🌓 Dynamic Theme System**: Full Light/Dark mode support using a semantic CSS variable system for maximum accessibility and visual comfort.
*   **🧠 Behavioral Personas**: Mapping the population into four distinct archetypes (Hidden Risk, Behavior Gap, Ideal, and Most Critical) based on K-Means and GMM clustering.
*   **📊 Advanced Visualization**: Interactive charts for demographic breakdowns, knowledge gaps, and emergency response propensities using Recharts.
*   **🏥 Emergency Funnel**: Visualizing the "awareness-to-action" gap, tracking how knowledge translates into immediate medical response.
*   **🍎 Lifestyle Analytics**: Correlating stroke awareness with behavioral risk factors like smoking, physical inactivity, and alcohol consumption.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19 + Vite
*   **State Management**: React Hooks & Context
*   **Data Visualization**: Recharts (D3-based)
*   **Routing**: React Router 7
*   **Styling**: Vanilla CSS with a custom Design System (Tokens & Themes)
*   **Data Analysis**: Python (Pandas, Scikit-Learn) for the underlying clustering engine.

---

## 📁 Project Structure

```text
Stroke-awareness-dashboard/
├── public/                 # Static assets & analytics data
├── src/
│   ├── components/         # Reusable UI components (Navbar, Charts, Cards)
│   ├── data/               # Data fetching logic
│   ├── pages/              # Dashboard page views (Landing, Personas, etc.)
│   ├── themes.css          # Design system tokens (Colors, Spacing, Modes)
│   ├── index.css           # Global layout & typography
│   └── App.jsx             # Routing & Application Core
└── models/                 # (External) Clustering analysis scripts & results
```

---

## 📈 Data Pipeline

The dashboard is powered by a dedicated machine learning pipeline located in the `models/clustering_v2` directory.

### 1. Analysis Logic
The population segmentation is performed using five key z-scaled features:
-   Awareness Score
-   Lifestyle Risk Score
-   Urgency Perception
-   Age
-   Action Propensity

### 2. Updating Data
To synchronize the dashboard with the latest clustering outputs, run the generator script:
```bash
python ../../models/clustering_v2/generate_dashboard_json.py
```
This script populates `dashboard_stats.json`, which the dashboard consumes to update its KPIs, charts, and persona metrics.

---

## 🏁 Getting Started

### Prerequisites
-   **Node.js** (Latest LTS)
-   **Python 3.x** (If running the data pipeline)

### Installation
1.  Navigate to the dashboard directory:
    ```bash
    cd dashboard/Stroke-awareness-dashboard
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Project
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📜 Available Scripts

-   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
-   `npm run build`: Optimizes the application for production.
-   `npm run preview`: Previews the production build locally.
-   `npm run lint`: Ensures code quality and adherence to styling guidelines.

---
*Developed as part of the Stroke Awareness Research Project.*
