$files = @("es\index.html", "es\contacto.html", "es\servicios.html", "es\precios.html", "es\sobre-nosotros.html")

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        $content = $content -replace 'href="/es/index\.html"', 'href="index.html"'
        $content = $content -replace 'href="/es/contacto\.html"', 'href="contacto.html"'
        $content = $content -replace 'href="/es/servicios\.html"', 'href="servicios.html"'
        $content = $content -replace 'href="/es/precios\.html"', 'href="precios.html"'
        $content = $content -replace 'href="/es/sobre-nosotros\.html"', 'href="sobre-nosotros.html"'
        $content = $content -replace 'href="/es/contacto\.html#booking-form"', 'href="contacto.html#booking-form"'
        Set-Content $file -Value $content -Encoding UTF8
        Write-Host "Fixed: $file"
    }
}
