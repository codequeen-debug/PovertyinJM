# Jamaica Poverty Index

A data-driven front-end application built to visualise community-level poverty across Jamaica's 14 parishes, developed as a final project for a front-end React development course.

## Live Link
https://povertyinjm.netlify.app/

## Overview

The Jamaica Poverty Index is an interactive dashboard that transforms raw socioeconomic data from the Planning Institute of Jamaica (PIOJ) into an accessible, filterable, and visually rich web experience. The project sits at the intersection of data analytics, cultural identity, and modern front-end development — combining a passion for Jamaica with a commitment to making public data legible and meaningful.

The dataset covers **829 communities** across all 14 parishes of Jamaica, capturing household-level consumption, poverty rates, and income inequality (GINI coefficients). What began as a data exploration exercise became a personal research tool — one that allows users to locate their own district, see the numbers behind their community, and feel genuinely connected to the data.

---

## Motivation

This project was driven by three converging interests:

- **Data science and analytics** — the belief that raw data, properly visualised, tells stories that reports alone cannot.
- **Cultural identity** — a desire to engage seriously with Jamaica's socioeconomic landscape using publicly available government data.
- **Front-end craftsmanship** — the goal of building something technically rigorous while remaining accessible to a general audience.

The intention is for this dashboard to serve as the foundation for a future academic research paper exploring the spatial distribution of poverty in Jamaica and the relationship between consumption, inequality, and geography.

---

## Dataset

**Source:** Planning Institute of Jamaica (PIOJ) — Poverty Maps dataset

| Field | Description |
|---|---|
| `COMMNAME` | Community name |
| `ParishName` | One of Jamaica's 14 parishes |
| `Population` | Total community population |
| `Households` | Number of households |
| `Poverty` | Poverty rate (% of population below poverty line) |
| `GINI` | Gini coefficient (0–1 scale; higher = more unequal) |
| `Consumptio` | Mean per-capita consumption (Jamaican dollars) |
| `Min_Consum` | Minimum consumption recorded in the community |
| `Max_Consum` | Maximum consumption recorded in the community |
| `COMM_CODE` | Unique community identifier |
| `GeoJSON` | Polygon geometry for map rendering |

**Coverage:** 829 communities across 14 parishes — Kingston, St. Andrew, St. Thomas, Portland, St. Mary, St. Ann, Trelawny, St. James, Hanover, Westmoreland, St. Elizabeth, Manchester, Clarendon, and St. Catherine.

---

## Features

### Parish and community filtering
Users can filter the dataset by parish to isolate communities of interest — including their own. The dashboard updates dynamically across all panels when a filter is applied.

### Data table
A sortable, searchable table displaying all community records with key metrics: poverty rate, GINI coefficient, population, household count, and consumption figures.

### Comparative analysis
A dedicated comparison tab allows side-by-side analysis of parishes or communities, surfacing differences in poverty rates, inequality, and consumption at a glance.

### Charts and visualisations
Multiple chart types render the data visually — including poverty rate distributions, consumption ranges, and GINI comparisons across parishes and communities.

### AI data assistant
An integrated conversational assistant powered by OpenRouter (GPT-4o Mini) and grounded in the PIOJ dataset. Users can ask natural-language questions — such as "which parish has the highest poverty rate?" or "what does the GINI score mean for St. Thomas?" — and receive contextual, data-informed responses.

### Preview panel
A summary panel that surfaces high-level statistics for the currently selected parish or community — total population, average poverty rate, average consumption, and GINI range.

### Authentication
User authentication via Firebase Auth, with protected routes ensuring data views are accessible only to signed-in users.


## Architecture

### Data Flow Diagram
<img width="596" height="550" alt="poverty_in_jm_system_architecture_v2" src="https://github.com/user-attachments/assets/2115e8fa-9ea1-460e-a7f4-cd1664f9bb0a" />

### Client Server Architecture
<img width="559" height="550" alt="poverty_in_jm_data_flow" src="https://github.com/user-attachments/assets/78be44eb-d5be-4866-8c38-2005b6f82f42" />



## Technical Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| State management | `useReducer` + React Context |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| AI assistant | OpenRouter API (GPT-4o Mini) |
| Styling | Custom CSS (`index.css`) |
| Charts | Recharts |
| Testing | Jest + React Testing Library |
| Deployment | Firebase Hosting |

---

## Project Structure

```
PovertyinJM/
├── index.html
├── vite.config.js
├── package.json
├── firebase.json
├── firestore.rules
├── .env                        # VITE_OPENROUTER_API_KEY (not committed)
└── src/
    ├── App.jsx                 # Root component, layout, routing
    ├── main.jsx                # Entry point
    ├── index.css               # Global styles
    ├── firebase.js             # Firebase initialisation
    ├── components/
    │   ├── Navbar.jsx
    │   ├── HeroSection.jsx
    │   ├── DataTable.jsx
    │   ├── CompareTab.jsx
    │   ├── InsightsTab.jsx
    │   ├── ChatWidget.jsx      # AI assistant (OpenRouter)
    │   ├── PreviewPanel.jsx
    │   └── AIchatbot.jsx
    ├── contexts/
    │   └── AuthContext.jsx
    ├── utils/
    │   └── firestoreHelpers.js
    ├── App.css
    └── pages/
        └── SignInPage.jsx
```

---

## Setup and Installation

### Prerequisites
- Node.js 18+
- A Firebase project with Authentication and Firestore enabled
- An OpenRouter API key

### Steps

```bash
# Clone the repository
git clone https://github.com/codequeen-debug/PovertyinJM.git
cd PovertyinJM

# Install dependencies
npm install

# Create your environment file
echo "VITE_OPENROUTER_API_KEY=your_key_here" > .env

# Start the development server
npm run dev
```

Configure your Firebase credentials in `src/firebase.js` using your project's config object from the Firebase console.

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_OPENROUTER_API_KEY` | API key for OpenRouter (AI assistant) |

> The `.env` file is excluded from version control via `.gitignore`. Never commit API keys to a public repository.

---

## Future Work

This dashboard is intended as a living project. Planned extensions include:

- **Choropleth map** — rendering community GeoJSON polygons as a colour-coded poverty map of Jamaica
- **Time-series analysis** — incorporating data from multiple survey years to track poverty trends over time
- **Research paper** — a formal academic write-up exploring spatial poverty patterns, the relationship between GINI and consumption, and policy implications for high-poverty communities
- **Export functionality** — allowing users to download filtered datasets as CSV for their own analysis

---

## Acknowledgements

Data sourced from the **Planning Institute of Jamaica (PIOJ)** Poverty Maps dataset. This project was developed independently as a final project for a front-end React development course, and reflects a personal commitment to making Jamaican public data more accessible and visually engaging.

---

## Author

**codequeen-debug**
GitHub: [github.com/codequeen-debug](https://github.com/codequeen-debug)
