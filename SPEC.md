
# AI Mystery Room — Project Specification

## 1. Project Overview

AI Mystery Room is a full-stack AI-powered mystery-solving web application.

Users create a mystery by entering a premise and selecting a difficulty level. Gemini AI generates a unique mystery containing a story, suspects, clues, hints, and a logically consistent solution.

Players investigate the case, discover clues, request hints, and accuse a suspect.

The application reveals the verdict, culprit, explanation, and final score only after the player submits an accusation.

The project must be fully functional, responsive, secure, and deployed.

---

## 2. Development Instructions for Antigravity

Before writing code:

1. Read this entire specification.
2. Create a clear implementation plan.
3. Set up the project structure.
4. Implement the backend and database.
5. Implement the frontend.
6. Integrate Gemini AI.
7. Test the complete application.
8. Fix all critical errors.
9. Prepare the application for deployment.

Do not generate the entire application in one step.

Build and verify each major feature before proceeding.

Do not use mock data as a replacement for the actual Gemini API integration in the final application.

If an API key or external service is unavailable, explain the limitation and provide a clear setup instruction.

---

## 3. Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Gemini API using the official @google/genai SDK
- Zod for validation

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 4. Project Structure

Create the following structure:

AI-Mystery-Room/
├── SPEC.md
├── README.md
├── .gitignore
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── server/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   ├── middleware/
    │   ├── validators/
    │   ├── utils/
    │   └── app.js
    ├── .env.example
    └── package.json

Keep frontend and backend code separate.

---

## 5. User Experience and Pages

### 5.1 Home Page

Purpose: Introduce the game and allow users to start a new mystery.

Required elements:
- Application logo and name.
- Short introduction.
- Start Mystery button.
- Brief explanation of how the game works.
- Difficulty overview.

Clicking Start Mystery opens the Create Mystery page.

### 5.2 Create Mystery Page

Required elements:
- Mystery premise textarea.
- Difficulty selector: Easy, Medium, Hard.
- Generate Mystery button.
- Example premise suggestions.
- Input validation.

Rules:
- Premise must contain at least 20 characters.
- Maximum premise length: 500 characters.
- Difficulty is required.
- Disable the generate button while the mystery is being created.

Show a loading state while Gemini generates the mystery.

### 5.3 Investigation Room

Required elements:
- Mystery title.
- Story introduction.
- Investigation progress.
- Suspect cards.
- Clue discovery section.
- Hint button.
- Accusation button.

Players must be able to investigate the case without seeing the actual culprit or solution.

Suspect cards should display:
- Suspect name.
- Description.
- Relationship to the victim.
- Alibi.

Clue cards should display:
- Clue title.
- Clue description after discovery.
- Discovery status.

Undiscovered clues must not reveal their actual content.

### 5.4 Accusation Page or Modal

Required elements:
- List of suspects.
- Suspect selection.
- Confirmation before submission.
- Submit Accusation button.

The player must select one suspect before submitting.

Once an accusation is submitted, the case becomes completed and cannot be played again.

### 5.5 Results Page

Display:
- Correct or incorrect verdict.
- Actual culprit.
- Player's accusation.
- Explanation of the mystery solution.
- Final score.
- Number of clues discovered.
- Number of hints used.
- Play Again button.

The results page must only be accessible after the case has been completed.

---

## 6. Difficulty Configuration

Use the following configuration:

| Difficulty | Suspects | Clues | Hints |
|---|---:|---:|---:|
| Easy | 3 | 5 | 2 |
| Medium | 4 | 7 | 3 |
| Hard | 5 | 9 | 3 |

Each generated mystery must contain exactly the required number of suspects, clues, and hints.

---

## 7. Gemini AI Integration

Use the Gemini API only from the backend.

The API key must never be exposed in frontend code.

### Mystery Generation

Gemini must generate a structured mystery containing:

- Title.
- Story introduction.
- Victim information.
- Suspects.
- Clues.
- Hints.
- Culprit.
- Explanation.
- Evidence connecting the culprit to the crime.

The generated mystery must have a logically consistent solution.

The clues must support the solution without making it immediately obvious.

Each suspect must have a believable motive, opportunity, and alibi.

The solution must be uniquely identifiable from the available evidence.

### Required Output Structure

Use a structured JSON response similar to:

{
  "title": "The Midnight Gallery",
  "story": "A valuable painting has disappeared...",
  "victim": {
    "name": "Alexander Reed",
    "description": "The owner of the gallery"
  },
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Elena",
      "description": "Gallery manager",
      "motive": "Financial dispute",
      "alibi": "Claims to have been in the office"
    }
  ],
  "clues": [
    {
      "id": "clue_1",
      "title": "Broken Window",
      "description": "A broken window was found...",
      "evidence": "The glass fragments were found inside the room"
    }
  ],
  "hints": [
    "Pay attention to the location of the glass fragments"
  ],
  "solution": {
    "culpritId": "suspect_1",
    "explanation": "The evidence establishes that...",
    "reasoning": [
      "The suspect had access to the gallery",
      "The alibi conflicts with the evidence"
    ]
  }
}

The example above is illustrative. Generate the exact number of suspects, clues, and hints required by the selected difficulty.

Use Zod to validate Gemini's response before saving it.

If the response is invalid:
1. Retry generation a limited number of times.
2. Validate the new response.
3. Return a safe error if generation still fails.

Never save an invalid mystery.

---

## 8. Database Design

Create a Mongoose model named Case.

Required fields:

- title
- story
- victim
- difficulty
- suspects
- clues
- hints
- solution
- discoveredClueIds
- hintsUsed
- accusation
- score
- status
- createdAt
- updatedAt

### Case Status

Use:
- active
- completed

### Security

The solution must be stored separately from the public mystery response.

Do not return:
- culpritId
- solution explanation
- solution reasoning

until the player has submitted an accusation.

The frontend must never receive the hidden solution during an active investigation.

Do not rely on frontend hiding alone.

The backend must enforce this requirement.

---

## 9. Backend API Specification

Base URL:

/api

### 9.1 Generate Mystery

POST /api/cases

Request:

{
  "premise": "A valuable diamond disappears from a locked museum",
  "difficulty": "medium"
}

Response:

{
  "success": true,
  "case": {
    "id": "case_id",
    "title": "The Missing Diamond",
    "story": "Mystery introduction",
    "difficulty": "medium",
    "suspects": [],
    "clues": [],
    "hintsRemaining": 3,
    "status": "active"
  }
}

The response must not include the culprit or solution.

### 9.2 Retrieve Mystery

GET /api/cases/:id

Return the active mystery and the player's current progress.

Do not reveal the solution before completion.

### 9.3 Discover Clue

POST /api/cases/:id/clues/:clueId/discover

Mark the clue as discovered.

Return the clue's actual content.

Rules:
- The case must be active.
- The clue must belong to the case.
- Discovering the same clue multiple times must not increase the score repeatedly.

### 9.4 Request Hint

POST /api/cases/:id/hints

Request and response must use the current case ID.

Rules:
- The case must be active.
- Hints must be revealed in order.
- A hint cannot be requested after all hints are used.
- Each hint can only be used once.

Response:

{
  "success": true,
  "hint": "Pay attention to the suspect's timeline",
  "hintsRemaining": 2
}

### 9.5 Submit Accusation

POST /api/cases/:id/accuse

Request:

{
  "suspectId": "suspect_1"
}

The backend must:
1. Validate the suspect ID.
2. Confirm that the case is active.
3. Compare the accusation with the actual culprit.
4. Calculate the score.
5. Mark the case completed.
6. Return the result.

Response:

{
  "success": true,
  "result": {
    "correct": true,
    "culprit": "Elena",
    "explanation": "The evidence proves...",
    "score": 145
  }
}

Do not allow multiple accusations.

### 9.6 Retrieve Result

GET /api/cases/:id/result

Return the completed case result only.

If the case is active, return an appropriate error.

---

## 10. Scoring Rules

Base points:

| Difficulty | Correct Accusation |
|---|---:|
| Easy | 100 |
| Medium | 150 |
| Hard | 200 |

Additional points:
- Each discovered clue: +5.
- Each hint used: -10.
- Minimum score: 0.

Incorrect accusation:
- Base points: 0.
- Clue and hint adjustments are still applied.
- Minimum score: 0.

Formula:

Correct accusation:

score = max(0, basePoints + discoveredClues * 5 - hintsUsed * 10)

Incorrect accusation:

score = max(0, discoveredClues * 5 - hintsUsed * 10)

All score calculations must happen on the backend.

---

## 11. Validation and Error Handling

Validate:
- Mystery premise.
- Difficulty.
- Case ID.
- Clue ID.
- Suspect ID.
- Gemini response.
- Case status.

Use appropriate HTTP status codes.

Examples:
- 400: Invalid request.
- 404: Case not found.
- 409: Case already completed.
- 429: Rate limit exceeded.
- 500: Internal server error.

Never expose API keys, stack traces, or hidden solution data in error responses.

Display clear error messages in the frontend.

---

## 12. Security Requirements

- Store secrets in environment variables.
- Validate all API requests.
- Use CORS with the configured frontend origin.
- Add rate limiting to mystery generation and hint requests.
- Never trust scores or progress values sent by the frontend.
- Never expose the hidden solution before an accusation.
- Prevent duplicate clue discovery and duplicate accusations.
- Use safe error messages.
- Do not commit `.env` files to GitHub.

---

## 13. Frontend Design Requirements

Create a polished, modern detective-themed interface.

Visual direction:
- Dark mystery atmosphere.
- Deep navy and charcoal backgrounds.
- Gold or amber accents.
- Clear typography.
- Subtle animations.
- Clean suspect and clue cards.

The interface must be responsive on:
- Desktop.
- Tablet.
- Mobile.

Use accessible colors, readable text, and keyboard-friendly controls.

Do not use unnecessary animations that interfere with gameplay.

---

## 14. Loading and Empty States

Provide loading states for:
- Mystery generation.
- Case retrieval.
- Clue discovery.
- Hint requests.
- Accusation submission.

Provide error states for:
- Gemini API failures.
- Database connection failures.
- Invalid mystery generation.
- Network errors.
- Invalid requests.

The user must be able to retry recoverable errors.

---

## 15. Environment Variables

Backend `.env`:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173

Frontend `.env`:

VITE_API_URL=http://localhost:5000/api

Create `.env.example` files without real secrets.

---

## 16. Testing Requirements

Test:
- Mystery generation at all difficulty levels.
- Correct number of suspects, clues, and hints.
- Invalid Gemini output handling.
- Clue discovery.
- Duplicate clue prevention.
- Hint limits.
- Correct accusations.
- Incorrect accusations.
- Score calculation.
- Solution privacy.
- Completed case restrictions.
- API error handling.
- Responsive design.

Verify that the solution cannot be accessed before accusation by inspecting API responses and network requests.

---

## 17. Deployment Requirements

### Database
- Create a MongoDB Atlas database.
- Configure the database connection string.
- Restrict database access appropriately.

### Backend
- Deploy the Express server to Render.
- Configure environment variables.
- Verify API endpoints.

### Frontend
- Deploy the React application to Vercel.
- Configure the production API URL.
- Verify all pages and API requests.

Test the complete mystery-solving experience on the production website.

---

## 18. Acceptance Criteria

The project is complete only when:

1. Users can create mysteries at all three difficulty levels.
2. Gemini generates valid, logically consistent mysteries.
3. Players can investigate suspects and discover clues.
4. Players can request hints.
5. Players can submit accusations.
6. The culprit remains hidden until the accusation.
7. The backend calculates scores correctly.
8. The results page displays the correct verdict and explanation.
9. The application works on mobile and desktop.
10. The deployed application works without critical errors.

---

## 19. Final Deliverables

- Complete source code.
- SPEC.md.
- README.md with setup instructions.
- GitHub repository.
- Deployed website URL.
- Successful demonstration of the complete mystery-solving flow.
