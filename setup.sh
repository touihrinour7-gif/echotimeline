#!/bin/bash

# EchoTimeline Quick Setup Script
# This script helps you set up the project quickly

set -e

echo "🎨 EchoTimeline Setup Script"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Setting up environment variables..."
    
    # Copy example env
    cp .env.example .env
    
    echo ""
    echo "📝 Please edit .env file with your Supabase credentials:"
    echo "   VITE_SUPABASE_URL=your_project_url"
    echo "   VITE_SUPABASE_ANON_KEY=your_anon_key"
    echo ""
    
    read -p "Press Enter when you've updated the .env file..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🏗️  Project setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure your Supabase database is set up (run supabase-setup.sql)"
echo "2. Create the 'photos' storage bucket in Supabase"
echo "3. Run 'npm run dev' to start development server"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - DEPLOYMENT.md - Deployment guide"
echo "   - TESTING.md - Testing guide"
echo ""
echo "🚀 To start the app:"
echo "   npm run dev"
echo ""
