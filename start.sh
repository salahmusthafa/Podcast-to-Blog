#!/bin/bash

# Podcast to Blog Startup Script

echo "🎙️  Starting Podcast to Blog..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found"
    exit 1
fi

# Navigate to backend and install dependencies
echo "📦 Installing backend dependencies..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found in backend directory"
    echo "📝 Please create .env file with your OpenAI API key:"
    echo "   OPENAI_API_KEY=your_openai_api_key_here"
fi

# Go back to root directory
cd ..

# Check if frontend .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  No .env.local file found"
    echo "📝 Please create .env.local file with:"
    echo "   NEXT_PUBLIC_API_URL=http://localhost:8000"
fi

echo "🚀 Starting servers..."

# Start backend in background
echo "🔧 Starting backend server on http://localhost:8000"
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server on http://localhost:3000"
npm run dev &
FRONTEND_PID=$!

echo "✅ Podcast to Blog is starting up!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup
echo "🛑 Stopping servers..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "✅ Servers stopped" 