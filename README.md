# Minimal Static Task Tracker Dashboard with CAPTCHA Solver

This web app displays tasks from `attachments/tasks.json` and attempts to solve a CAPTCHA image provided via URL parameter or fallback image.

## Features
- Loads and displays tasks with their title and status.
- Reads CAPTCHA image URL from `?url=…` parameter.
- Fetches the CAPTCHA image, displays it, and sends it to OCR.space API.
- Shows the parsed text of the CAPTCHA.

## Files Included
- `index.html` - Main HTML file
- `style.css` - Basic page styling
- `script.js` - JavaScript logic for loading tasks and solving CAPTCHA
- `attachments/tasks.json` - JSON file with task data
- `attachments/sample.png` - fallback CAPTCHA image

## Usage
Open `index.html` in a browser with optional URL parameter:

`http://localhost/index.html?url=your_captcha_image_url`

or just open the file directly; it will use the sample.png as fallback.

## Notes
- Make sure the `attachments/tasks.json` exists and is correctly formatted.
- CORS policies may restrict fetches if running from local files depending on browser security settings.