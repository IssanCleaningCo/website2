# Fix Spanish Navigation Links - Convert Absolute to Relative Paths
# This script fixes the navigation issues when opening Spanish pages directly from files

$spanishFiles = @(
    "es\index.html",
    "es\contacto.html", 
    "es\servicios.html",
    "es\precios.html",
    "es\sobre-nosotros.html"
)

Write-Host "🔧 Fixing Spanish navigation links..."

foreach ($file in $spanishFiles) {
    if (Test-Path $file) {
        Write-Host "📝 Processing: $file"
        
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Fix navigation links
        $content = $content -replace 'href="/es/index\.html"', 'href="index.html"'
        $content = $content -replace 'href="/es/contacto\.html"', 'href="contacto.html"'
        $content = $content -replace 'href="/es/servicios\.html"', 'href="servicios.html"'
        $content = $content -replace 'href="/es/precios\.html"', 'href="precios.html"'
        $content = $content -replace 'href="/es/sobre-nosotros\.html"', 'href="sobre-nosotros.html"'
        
        # Fix hash links
        $content = $content -replace 'href="/es/contacto\.html#booking-form"', 'href="contacto.html#booking-form"'
        
        # Save the updated content
        Set-Content $file -Value $content -Encoding UTF8
        Write-Host "✅ Fixed: $file"
    }
    else {
        Write-Host "❌ File not found: $file"
    }
}

Write-Host ""
Write-Host "🎉 All Spanish navigation links have been converted to relative paths!"
Write-Host "📁 Now you can open Spanish pages directly from files without issues."
