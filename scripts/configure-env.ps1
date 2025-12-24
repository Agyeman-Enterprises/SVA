# Interactive .env.local Configuration Script
# This script helps configure .env.local with Supabase credentials

Write-Host ""
Write-Host "🔧 SVA LMS - Environment Configuration" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "📝 Creating .env.local..." -ForegroundColor Yellow
    $template = @"
# Supabase Database Connection
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
DB_HOST=db.[PROJECT-REF].supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=[YOUR-PASSWORD]
DB_NAME=postgres
DB_SSL=true

# JWT Secret
JWT_SECRET=bf107f3a6a30af6dbca977bc461e93238ada539b5d7f8eb8e9b1d70191f5539c

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
"@
    $template | Out-File -FilePath .env.local -Encoding utf8
    Write-Host "✅ Created .env.local template" -ForegroundColor Green
    Write-Host ""
}

Write-Host "📋 To configure .env.local:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project (or create a new one)" -ForegroundColor White
Write-Host "3. Go to: Project Settings → Database" -ForegroundColor White
Write-Host "4. Scroll to 'Connection string' → Click 'URI' tab" -ForegroundColor White
Write-Host "5. Copy the connection string" -ForegroundColor White
Write-Host ""
Write-Host "The connection string looks like:" -ForegroundColor Gray
Write-Host "  postgresql://postgres:YOUR_PASSWORD@db.abcdefghijklmnop.supabase.co:5432/postgres" -ForegroundColor Yellow
Write-Host ""
Write-Host "From this string, extract:" -ForegroundColor Cyan
Write-Host "  - Password: The part after 'postgres:' and before '@'" -ForegroundColor White
Write-Host "  - Project Ref: The part between 'db.' and '.supabase.co'" -ForegroundColor White
Write-Host ""
Write-Host "Then edit .env.local and replace:" -ForegroundColor Cyan
Write-Host "  [YOUR-PASSWORD] → Your actual password" -ForegroundColor White
Write-Host "  [PROJECT-REF] → Your project reference" -ForegroundColor White
Write-Host ""
Write-Host "Example:" -ForegroundColor Cyan
Write-Host "  If connection string is:" -ForegroundColor Gray
Write-Host "    postgresql://postgres:mypass123@db.abcdefghijklmnop.supabase.co:5432/postgres" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Then .env.local should have:" -ForegroundColor Gray
Write-Host "    DB_PASSWORD=mypass123" -ForegroundColor Green
Write-Host "    DB_HOST=db.abcdefghijklmnop.supabase.co" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tip: Open .env.local in your editor and make the replacements" -ForegroundColor Cyan
Write-Host ""

