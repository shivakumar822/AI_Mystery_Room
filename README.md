# AI Mystery Room 🔍🕵️‍♂️

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/shivakumar822/AI_Mystery_Room)
**GitHub Repository:** [https://github.com/shivakumar822/AI_Mystery_Room.git](https://github.com/shivakumar822/AI_Mystery_Room.git)

AI Mystery Room is a full-stack, AI-powered mystery-solving web application built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB**, and **Google Gemini AI**.

Users commission custom murder mystery or heist scenarios, investigate crime scene dossiers, inspect forensic clues, request hints, and formally submit accusations. The application dynamically calculates scores and unveils the culprit only after an accusation is rendered.

---

## 🌟 Features

- **Gemini-Powered Mystery Engine**: Generates logically consistent, intricate mysteries with suspects, alibis, forensic clues, and a hidden culprit using `@google/genai`.
- **Three Investigation Difficulties**:
  - **Easy**: 3 suspects, 5 clues, 2 hints (100 base points)
  - **Medium**: 4 suspects, 7 clues, 3 hints (150 base points)
  - **Hard**: 5 suspects, 9 clues, 3 hints (200 base points)
- **Strict Solution Security**: The culprit, solution explanation, and undiscovered evidence are never exposed in active investigation API responses.
- **Dynamic Evidence Board**: Clues remain sealed until examined by the player, rewarding +5 points each.
- **Detective Notebook & Hints**: Progressive hints can be unlocked one by one (-10 point penalty per hint).
- **Formal Accusation & Verdict**: Submit an irrevocable accusation to permanently close the case and reveal the full forensic explanation, verdict, and final score.
- **Atmospheric Noir Aesthetic**: Deep navy and charcoal palette, gold and amber accents, forensic stamps, and responsive layout.

---

## 🏗️ Project Architecture

```
AI-Mystery-Room/
├── SPEC.md                      # Specification document
├── README.md                    # Setup & documentation
├── .gitignore                   # Ignored files & environment secrets
├── client/                      # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/          # Navbar, SuspectCard, ClueCard, HintModal, etc.
│   │   ├── pages/               # HomePage, CreatePage, RoomPage, ResultsPage
│   │   ├── services/            # Axios API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── server/                      # Node.js + Express + MongoDB Backend
    ├── src/
    │   ├── config/              # MongoDB & Gemini AI SDK setup
    │   ├── controllers/         # Case lifecycle controller
    │   ├── models/              # Mongoose Case model
    │   ├── routes/              # Express API routes
    │   ├── services/            # Gemini prompt engine & scoring service
    │   ├── middleware/          # Rate limiting & error handlers
    │   ├── validators/          # Zod schema validation
    │   ├── utils/               # Sanitization & security utilities
    │   ├── app.js               # Express app
    │   └── server.js            # Server entry point
    ├── test/                    # Unit tests for scoring & security
    ├── package.json
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended; v24 supported)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)
- [Google Gemini API Key](https://aistudio.google.com/)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-mystery-room
   GEMINI_API_KEY=your_gemini_api_key_here
   CLIENT_URL=http://localhost:5173
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

---

### 2. Frontend Setup

1. In a separate terminal, navigate to the `client/` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Testing

Run the backend unit tests to verify scoring formulas and solution sanitization:

```bash
cd server
npm test
```

---

## 📡 API Specification

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/cases` | Generate a new mystery using Gemini AI |
| `GET` | `/api/cases/:id` | Retrieve active case docket (sanitized) |
| `POST` | `/api/cases/:id/clues/:clueId/discover` | Examine & unseal a crime clue (+5 pts) |
| `POST` | `/api/cases/:id/hints` | Unlock progressive hint in order (-10 pts) |
| `POST` | `/api/cases/:id/accuse` | Submit suspect accusation & finalize case |
| `GET` | `/api/cases/:id/result` | Retrieve verdict, culprit, and score |

---

## 🚢 Deployment Guide

### Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and allow network access (`0.0.0.0/0` or Render outbound IPs).
3. Copy the connection URI string to `MONGODB_URI`.

### Backend (Render)
1. Push the repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/), create a new **Web Service**.
3. Set the Root Directory to `server`.
4. Set Build Command to `npm install` and Start Command to `npm start`.
5. Add Environment Variables:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `CLIENT_URL` (your Vercel frontend URL)

### Frontend (Vercel)
1. In [Vercel](https://vercel.com/), import the GitHub repository.
2. Set Root Directory to `client`.
3. Framework Preset: **Vite**.
4. Set Environment Variable:
   - `VITE_API_URL` (pointing to `https://<your-render-app>.onrender.com/api`)
5. Deploy.
