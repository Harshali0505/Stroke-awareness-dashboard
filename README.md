# Stroke Awareness Dashboard

A comprehensive analytical dashboard designed to visualize and interpret stroke awareness levels within the community. This project supports targeted public health actions by identifying demographics with low awareness and highlighting key knowledge gaps.

## 🚀 Key Features

The dashboard provides multiple specialized views to analyze awareness from different perspectives:

- **Overall Awareness**: A high-level overview of awareness scores and categorizations (Low, Moderate, High).
- **Demographics**: Breakdown of awareness levels by Age, Gender, and Education.
- **Lifestyle**: Correlation between awareness and lifestyle factors like Smoking, Alcohol consumption, and Physical activity.
- **Knowledge Gap**: Analysis of specific areas where awareness is lacking, such as stroke symptoms and risk factors.
- **Emergency**: Insights into how participants handle emergency stroke situations (e.g., calling 102/108).
- **Community**: Analysis of community-level awareness and sources of information.
- **Insights**: Consolidated data-driven insights and recommendations for public health intervention.
- **Personas**: Targeted analysis based on common profiles within the community.
- **About**: Detailed information about the study and the dashboard's purpose.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) (Version 19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Routing**: [React Router](https://reactrouter.com/) (Version 7)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Styling**: Vanilla CSS with custom design tokens.

## 📁 Project Structure

```text
Stroke-awareness-dashboard/
├── analytics/         # JSON data files used for charts
├── public/            # Static assets
└── src/
    ├── components/    # Reusable UI components (Navbar, Charts, Cards)
    ├── data/          # Data fetching hooks
    ├── pages/         # Dashboard page components
    ├── App.jsx        # Main application component & routes
    └── index.css      # Global styles and design tokens
```

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Recommended: Latest LTS)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd Stroke-awareness-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build:
```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Locally previews the production build.
