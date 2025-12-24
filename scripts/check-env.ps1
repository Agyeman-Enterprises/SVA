# Check .env.local configuration
if (-not (Test-Path .env.local)) {
    Write-Host "❌ .env.local not found" -ForegroundColor Red
    exit 1
}

$content = Get-Content .env.local -Raw
$hasPlaceholders = $false

if ($content -match '\[YOUR-PASSWORD\]') {
    Write-Host "⚠️  Found [YOUR-PASSWORD] placeholder" -ForegroundColor Yellow
    $hasPlaceholders = $true
}

if ($content -match '\[PROJECT-REF\]') {
    Write-Host "⚠️  Found [PROJECT-REF] placeholder" -ForegroundColor Yellow
    $hasPlaceholders = $true
}

if ($content -match 'REPLACE_WITH') {
    Write-Host "⚠️  Found REPLACE_WITH placeholder" -ForegroundColor Yellow
    $hasPlaceholders = $true
}

if ($hasPlaceholders) {
    Write-Host ""
    Write-Host "❌ .env.local needs configuration" -ForegroundColor Red
    Write-Host "Please update with your Supabase credentials from:" -ForegroundColor Yellow
    Write-Host "  Supabase Dashboard → Settings → Database → Connection string" -ForegroundColor Gray
    exit 1
} else {
    Write-Host "✅ .env.local appears configured" -ForegroundColor Green
    exit 0
}

