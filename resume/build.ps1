# Builds the résumé PDFs from resume.html / resume-en.html with headless Edge (or Chrome).
#   dist\*.pdf    — full version, with phone number: send these to recruiters
#   ..\assets\*.pdf — public version, no phone number: linked from the website
$ErrorActionPreference = 'Stop'

$browser = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) { throw 'Edge or Chrome not found' }

$here   = $PSScriptRoot
$dist   = Join-Path $here 'dist'
$assets = Join-Path (Split-Path $here -Parent) 'assets'
New-Item -ItemType Directory -Force $dist, $assets | Out-Null

function Export-Pdf($html, $hash, $out) {
  $url = ([System.Uri](Join-Path $here $html)).AbsoluteUri + $hash
  $profile = Join-Path $env:TEMP ("resume-build-" + [guid]::NewGuid())
  & $browser --headless=new --disable-gpu --no-pdf-header-footer "--user-data-dir=$profile" `
    --virtual-time-budget=10000 "--print-to-pdf=$out" $url | Out-Null
  Remove-Item $profile -Recurse -Force -ErrorAction SilentlyContinue
  if (-not (Test-Path $out)) { throw "PDF was not created: $out" }
  $pages = [regex]::Matches([System.Text.Encoding]::GetEncoding(28591).GetString([System.IO.File]::ReadAllBytes($out)), '/Type\s*/Page(?![s\w])').Count
  if ($pages -ne 1) { Write-Warning "$out has $pages pages (expected 1)" }
  Write-Host "ok  ($pages page) $out"
}

# Public version (no phone) — goes on the website.
Export-Pdf 'resume.html'    '' (Join-Path $assets 'Grushin_Vadim_Go_Developer_RU.pdf')
Export-Pdf 'resume-en.html' '' (Join-Path $assets 'Grushin_Vadim_Go_Developer_EN.pdf')

# Full version (with phone) — for recruiters. The number lives only in phone.local.txt,
# which is git-ignored, so it never reaches the public repository.
$phoneFile = Join-Path $here 'phone.local.txt'
if (Test-Path $phoneFile) {
  $hash = '#phone=' + [uri]::EscapeDataString((Get-Content $phoneFile -Raw).Trim())
  Export-Pdf 'resume.html'    $hash (Join-Path $dist 'Grushin_Vadim_Go_Developer_RU.pdf')
  Export-Pdf 'resume-en.html' $hash (Join-Path $dist 'Grushin_Vadim_Go_Developer_EN.pdf')
} else {
  Write-Host 'skip dist\: create resume\phone.local.txt with your phone number to build the full version'
}
