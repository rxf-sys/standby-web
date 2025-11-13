#!/bin/bash

# StandBy Web - Environment Setup Script
# This script helps you set up your .env.local file interactively

echo "🚀 StandBy Web - Environment Setup"
echo "======================================"
echo ""

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup aborted."
        exit 1
    fi
fi

echo "Please provide your Supabase credentials."
echo "You can find them in your Supabase project under Settings → API"
echo ""

# Prompt for Supabase URL
read -p "Supabase Project URL (e.g., https://xyz.supabase.co): " SUPABASE_URL

# Validate URL
if [[ ! $SUPABASE_URL =~ ^https://.*\.supabase\.co$ ]]; then
    echo "❌ Invalid Supabase URL format. Please use the full URL (e.g., https://xyz.supabase.co)"
    exit 1
fi

# Prompt for Supabase Anon Key
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY

# Validate Anon Key (basic check)
if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Anon Key cannot be empty."
    exit 1
fi

# Prompt for App URL (with default)
read -p "App URL (default: http://localhost:3000): " APP_URL
APP_URL=${APP_URL:-http://localhost:3000}

# Prompt for App Name (with default)
read -p "App Name (default: StandBy): " APP_NAME
APP_NAME=${APP_NAME:-StandBy}

# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# App Configuration
NEXT_PUBLIC_APP_URL=$APP_URL
NEXT_PUBLIC_APP_NAME=$APP_NAME

# Optional: Analytics
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Sentry
# NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
EOF

echo ""
echo "✅ .env.local file created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Apply the database schema: Open Supabase SQL Editor and run supabase/schema.sql"
echo "2. Load seed data (optional): Run supabase/seed.sql in Supabase SQL Editor"
echo "3. Install dependencies: npm install"
echo "4. Start development server: npm run dev"
echo ""
echo "🎉 Happy coding!"
