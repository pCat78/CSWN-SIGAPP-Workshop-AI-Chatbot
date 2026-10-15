# Chatbot app

Requires Node 20.19+ or 22.12+ (Vite 8) and Python 3.9+.

## 1. Backend (Flask)
cd backend
python3 -m pip install -U flask openai python-dotenv
cp .env .env      # then fill in OPENAI_API_KEY
python3 server.py          # http://127.0.0.1:5000

## 2. Frontend (React + TypeScript + Vite 8.3.4) — second terminal
cd frontend
npm install
npm run dev               # http://127.0.0.1:5173

Search bar: type and press Enter -> the chatbot reply appears in the card.
Button: "New chat" clears the conversation.

## Checks
npm run typecheck         # TypeScript
npm run audit             # npm audit
