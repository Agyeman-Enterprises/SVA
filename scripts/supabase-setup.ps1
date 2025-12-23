# Supabase Setup Script for PowerShell
# This script helps set up SVA LMS on Supabase

Write-Host "🚀 SVA LMS - Supabase Setup" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "📝 Creating .env.local template..." -ForegroundColor Yellow
    
    $envContent = @"
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
"@
    
    $envContent | Out-File -FilePath .env.local -Encoding utf8
    Write-Host "Created .env.local template" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit .env.local and add your Supabase credentials" -ForegroundColor Yellow
    Write-Host "   See SUPABASE_SETUP.md for detailed instructions" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create Supabase project at https://supabase.com"
Write-Host "2. Get connection string from Project Settings → Database"
Write-Host "3. Update .env.local with your credentials"
Write-Host "4. Run: npm run db:push"
Write-Host "5. Run: npm run db:seed"
Write-Host "6. Run: npm run validate"
Write-Host ""

