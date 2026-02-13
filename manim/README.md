# Lucerna Manim Storyboard

This folder contains a detailed Manim storyboard for the Lucerna animation.

## Quick start

1. Create a Python environment and install Manim:
   - `pip install -r requirements.txt`

2. Render all scenes:
   - `manim -pqh lucerna_storyboard.py TitleScene`
   - `manim -pqh lucerna_storyboard.py CultureScene`
   - `manim -pqh lucerna_storyboard.py NVCenterCaptureScene`
   - `manim -pqh lucerna_storyboard.py MicroscopeZoomScene`
   - `manim -pqh lucerna_storyboard.py NVDiamondScene`
   - `manim -pqh lucerna_storyboard.py PhotonicsScene`
   - `manim -pqh lucerna_storyboard.py OutroScene`

   Or run the helper script:
   - `powershell -ExecutionPolicy Bypass -File .\render_all.ps1`

3. Stitch all scenes into one MP4 (requires ffmpeg):
   - `powershell -ExecutionPolicy Bypass -File .\stitch.ps1`

## Notes

- Update PROJECT_TITLE in lucerna_storyboard.py to change the project name.
- Each scene pauses between steps; use your video player to advance step-by-step.
- stitch.ps1 adds a 2s pause between scenes and writes manim/lucerna_full.mp4.
