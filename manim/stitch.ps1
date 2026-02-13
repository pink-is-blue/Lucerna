$ErrorActionPreference = "Stop"

$quality = "1080p60"
$fps = 60
$pauseSeconds = 2
$width = 1920
$height = 1080

$sceneList = @(
    "TitleScene",
    "CultureScene",
    "NVCenterCaptureScene",
    "MicroscopeZoomScene",
    "NVDiamondScene",
    "PhotonicsScene",
    "OutroScene"
)

$videoDir = Join-Path $PSScriptRoot "media\videos\lucerna_storyboard\$quality"
if (!(Test-Path $videoDir)) {
    throw "Video directory not found: $videoDir. Render scenes first."
}

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

$pauseFile = Join-Path $PSScriptRoot "pause_2s.mp4"
$concatList = Join-Path $PSScriptRoot "concat_list.txt"
$outputFile = Join-Path $PSScriptRoot "lucerna_full.mp4"

Write-Host "Creating pause clip..."
ffmpeg -y -f lavfi -i "color=c=black:s=${width}x${height}:r=${fps}:d=${pauseSeconds}" -c:v libx264 -pix_fmt yuv420p $pauseFile

$list = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $sceneList.Count; $i++) {
    $scenePath = Join-Path $videoDir ("{0}.mp4" -f $sceneList[$i])
    if (!(Test-Path $scenePath)) {
        throw "Missing scene video: $scenePath"
    }
    $safeScene = (Resolve-Path $scenePath).Path -replace "\\", "/"
    $list.Add("file '$safeScene'")
    if ($i -lt $sceneList.Count - 1) {
        $safePause = (Resolve-Path $pauseFile).Path -replace "\\", "/"
        $list.Add("file '$safePause'")
    }
}

Set-Content -Path $concatList -Value $list

Write-Host "Stitching scenes into $outputFile ..."
ffmpeg -y -f concat -safe 0 -i $concatList -r $fps -c:v libx264 -pix_fmt yuv420p $outputFile

Write-Host "Done. Output: $outputFile"
