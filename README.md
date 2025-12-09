# E-Commerce Recommendation System

A full-stack application for product recommendations and sentiment analysis using FastAPI (backend) and React + Vite (frontend).

## Project Structure

```
kelompokfprsbp/
├── backend/          # FastAPI backend server
│   ├── data/         # CSV data files
│   ├── models/       # ML model checkpoints
│   ├── main.py       # FastAPI application
│   └── ingestion.py  # Database ingestion script
├── src/              # React frontend
├── public/           # Static assets
└── package.json      # Frontend dependencies
```

## Backend Setup

### Prerequisites
- Python 3.8+
- pip

### 1. Install Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory

### 3. Ingest Data

Run the ingestion script to populate the database from CSV files:

```powershell
cd backend
python ingestion.py
```

### 4. Run Backend Server

```powershell
cd backend
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

API documentation available at Swagger UI: `http://localhost:8000/docs`

## Frontend Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### 1. Install Dependencies

```powershell
npm install
```

Or using yarn:
```powershell
yarn install
```

### 2. Run Development Server

```powershell
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Available Scripts

### Backend
- `python ingestion.py` - Ingest data from CSV to database
- `uvicorn main:app --reload` - Run development server with hot reload

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production