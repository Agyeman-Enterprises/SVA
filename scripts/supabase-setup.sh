#!/bin/bash
# Supabase Setup Script
# This script helps set up SVA LMS on Supabase

echo "🚀 SVA LMS - Supabase Setup"
echo "============================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << 'EOF'
# Supabase Database Connection
# Replace [YOUR-PASSWORD] and [PROJECT-REF] with your Supabase credentials
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
DB_HOST=[PROJECT-REF].supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=[YOUR-PASSWORD]
DB_NAME=postgres
DB_SSL=true

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=REPLACE_WITH_GENERATED_SECRET

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF
    echo "✅ Created .env.local template"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Supabase credentials"
    echo "   See SUPABASE_SETUP.md for detailed instructions"
    echo ""
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Create Supabase project at https://supabase.com"
echo "2. Get connection string from Project Settings → Database"
echo "3. Update .env.local with your credentials"
echo "4. Run: npm run db:push"
echo "5. Run: npm run db:seed"
echo "6. Run: npm run validate"
echo ""

