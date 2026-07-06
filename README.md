# AgriIQ AI

### A Multi-Agent Agricultural Intelligence Platform for Smarter Farming Decisions

AgriIQ AI is a multi-agent agricultural intelligence platform that helps users analyze crop images and receive actionable farming insights. Instead of relying on a single AI response, the system uses multiple specialized agents that collaborate to identify crops, analyze potential issues, and generate useful recommendations.

Built as part of Kaggle's **AI Agents: Intensive Vibe Coding Capstone Project**, the goal of AgriIQ AI is to demonstrate how agent-based systems can be applied to solve practical agricultural challenges.

---

# Problem Statement

Farmers often need information about:

- Crop identification
- Disease analysis
- Farming recommendations
- Crop health insights

This information is usually scattered across different websites, videos, and resources, making decision-making slower and more difficult.

AgriIQ AI centralizes these tasks into a single platform where users can upload a crop image and receive structured, AI-powered guidance.

---

# Solution

AgriIQ AI uses a multi-agent architecture where different agents are responsible for different tasks.

Instead of one AI performing every operation, specialized agents collaborate to generate a final recommendation.

This approach improves organization, scalability, and explainability.

---

# Multi-Agent Architecture

### Orchestrator Agent

Coordinates the workflow and manages communication between agents.

### Crop Agent

- Identifies crop information
- Processes crop-related visual data

### Disease Agent

- Analyzes crop health
- Detects possible diseases or issues

### Advisory Agent

- Generates agricultural recommendations
- Suggests possible actions

### Planning Agent

- Combines outputs from all agents
- Produces the final response

---

# Architecture Overview

```text
User
  ↓
Frontend (Next.js)
  ↓
Backend (Node.js / Express)
  ↓
Orchestrator Agent
  ↓
Crop Agent
Disease Agent
Advisory Agent
Planning Agent
  ↓
Google Gemini
  ↓
Final Recommendation
```

---

# Features

- Crop image upload and analysis
- Multi-agent workflow
- AI-powered crop insights
- Disease analysis
- Agricultural recommendations
- Structured final report
- Modern responsive UI
- Cloud image handling
- Fully deployed web application

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- Node.js
- Express.js

## AI

- Google Gemini

## Database

- MongoDB

## Media Storage

- ImageKit

## Deployment

- Vercel
- Render

---

# Security Features

- Environment variable protection
- API key isolation
- Input validation
- Secure cloud-based image handling
- CORS configuration

---

# Deployment

## Frontend

Hosted on Vercel.

## Backend

Hosted on Render.

---

# Local Setup

## Clone the Repository

```bash
git clone <repository-url>
```

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Install Backend Dependencies

```bash
cd backend
npm install
```

## Create Environment Variables

Create a `.env` file inside the backend directory and add:

```env
GEMINI_API_KEY=
MONGODB_URI=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

## Run Development Servers

```bash
npm run dev
```

---

# Project Journey

This project was developed during Kaggle's AI Agents Intensive Vibe Coding Capstone Project.

The goal was not only to build a working application but also to explore how multi-agent systems can solve real-world problems.

The project was created using modern vibe-coding workflows and iterative development techniques, with a strong focus on agent collaboration, practical usability, and deployment.

---

# Future Improvements

- Regional language support
- Advanced crop health analysis
- Weather-based recommendations
- Market intelligence integration
- Expanded agricultural knowledge base

---

# Acknowledgements

- Kaggle
- Google AI
- Gemini API
- AI Agents Intensive Vibe Coding Course

---

# Live Demo

Frontend: https://agri-iq-ai.vercel.app/

Backend: https://agriiq-ai.onrender.com

---

# Screenshots

Add screenshots of:

1. Landing Page
<img width="631" height="289" alt="Landing Page" src="https://github.com/user-attachments/assets/3513211a-acc2-4255-bc56-13f1a47f6755" />
2. Upload Interface
<img width="631" height="289" alt="Upload Interface" src="https://github.com/user-attachments/assets/7c448777-93f5-4d3f-815a-09571a6426ad" />
3. Analysis Processing
4. Results Dashboard
<img width="631" height="289" alt="Results Dashboard" src="https://github.com/user-attachments/assets/a307f33c-5ed1-4571-84c3-3251fa841ca3" />
5. Agent Workflow
6. Mobile Responsive View
<img width="427" height="811" alt="Screenshot 2026-07-07 012033" src="https://github.com/user-attachments/assets/16aa4d9b-a59e-4999-95d3-663684f73d48" />


---

# License

This project was created for educational purposes as part of the Kaggle AI Agents Intensive Vibe Coding Capstone Project.
