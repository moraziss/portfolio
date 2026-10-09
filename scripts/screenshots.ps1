# Regenerates the README screenshots with headless Edge (or Chrome).
#   powershell -ExecutionPolicy Bypass -File scripts/screenshots.ps1
$ErrorActionPreference = 'Stop'

$browser = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) { throw 'Edge or Chrome not found' }

$root = Split-Path $PSScriptRoot -Parent
$out  = Join-Path $root 'docs\screenshots'
New-Item -ItemType Directory -Force $out | Out-Null

function Shot($name, $query, $width, $height, $scale, $page = 'index.html') {
  $url = ([System.Uri](Join-Path $root $page)).AbsoluteUri + $query
  $file = Join-Path $out "$name.png"
  $profile = Join-Path $env:TEMP ("shot-" + [guid]::NewGuid())
  & $browser --headless=new --disable-gpu --hide-scrollbars "--user-data-dir=$profile" `
    "--window-size=$width,$height" "--force-device-scale-factor=$scale" `
    --virtual-time-budget=12000 "--screenshot=$file" $url | Out-Null
  Remove-Item $profile -Recurse -Force -ErrorAction SilentlyContinue
  if (-not (Test-Path $file)) { throw "screenshot was not created: $file" }
  Write-Host ("ok  {0}  {1:N0} KB" -f $name, ((Get-Item $file).Length / 1KB))
}

Shot 'hero-light'   '?lang=en&theme=light' 1440  900  1.5
Shot 'hero-dark'    '?lang=en&theme=dark'  1440  900  1.5
Shot 'full-light'   '?lang=en&theme=light' 1440 4150  1

# Headless browsers refuse windows narrower than ~500 px, which is still a phone-width layout (< 640 px).
Shot 'mobile-light' '?lang=en&theme=light'  500 1000  2
Shot 'mobile-dark'  '?lang=en&theme=dark'   500 1000  2

# One A4 page of the résumé. The résumé sources are kept locally (not in this repository),
# so this step runs only where they exist.
if (Test-Path (Join-Path $root 'resume\resume-en.html')) {
  Shot 'resume-en'  ''                      794 1123  1.5 'resume\resume-en.html'
}
