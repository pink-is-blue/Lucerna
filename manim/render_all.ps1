$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$pythonExe = Join-Path $repoRoot ".venv\Scripts\python.exe"
if (!(Test-Path $pythonExe)) {
    throw "Python venv not found at $pythonExe. Create the venv and install manim first."
}

Set-Location $PSScriptRoot

$ffmpegCmd = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpegCmd) {
    $ffmpegPath = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter ffmpeg.exe -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($ffmpegPath) {
        $ffmpegDir = Split-Path $ffmpegPath -Parent
        $env:Path = "$ffmpegDir;" + $env:Path
    } else {
        throw "ffmpeg not found. Install ffmpeg and ensure it is on PATH."
    }
}

$sceneList = @(
    "TitleScene",
    "CultureScene",
    "NVCenterCaptureScene",
    "MicroscopeZoomScene",
    "NVDiamondScene",
    "PhotonicsScene",
    "OutroScene"
)

foreach ($scene in $sceneList) {
    Write-Host "Rendering $scene..."
    & $pythonExe -m manim -pqh .\lucerna_storyboard.py $scene
}

Write-Host "All scenes rendered."
