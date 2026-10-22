# Chatbot app

Requires Node 20.19+ or 22.12+ (Vite 8) and Python 3.9+.

## Setup

1. Open a terminal window
2. Install frontend dependencies: "cd frontend && npm install"
3. Install backend dependencies:
    a. "cd backend"
    b. "python -m venv .venv"
    c. Activate the virtual environment, but this is operating system dependent
        i. Windows: ".venv/Scripts/activate"
        ii. Mac/Linux: "source .venv/bin/activate"
    d. Install packages: "pip install -r requirements.txt"

## 1. Backend (Flask)
cd backend
cp .env.example .env      # then fill in OPENAI_API_KEY
python server.py          # http://127.0.0.1:5000

## 2. Frontend (React + TypeScript + Vite 8.3.4) — second terminal
cd frontend
npm run dev               # http://127.0.0.1:5173

Search bar: type and press Enter -> the chatbot reply appears in the card.
Button: "New chat" clears the conversation.

## Checks
npm run typecheck         # TypeScript
npm run audit             # npm audit
