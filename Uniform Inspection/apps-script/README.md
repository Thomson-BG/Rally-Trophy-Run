# Google Apps Script Backend Setup

This folder contains the Apps Script backend used by the Uniform Inspection app.

## 1) Create the Sheet
1. Create a new Google Sheet (name is up to you, e.g., "Bulldog Uniform Inspection").
2. Open **Extensions → Apps Script**.

## 2) Add the Script
1. Replace the contents of `Code.gs` in the Apps Script editor with the contents of `Code.gs` from this folder.
2. Add the `appsscript.json` manifest (File → Project settings → "Show 'appsscript.json' manifest file in editor").
3. Save the project.

## 3) Deploy as Web App
1. Click **Deploy → New deployment**.
2. Select **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Deploy and copy the Web App URL.

## 4) Connect the Front-End
Edit `/Users/joshuathomson/Documents/Projects/Codex/Uniform Inspection/app.js`:
- Set `dataMode` to `apps_script`.
- Paste the Web App URL into `appsScriptUrl`.

Example:
```js
const CONFIG = {
  dataMode: 'apps_script',
  appsScriptUrl: 'https://script.google.com/macros/s/XXXX/exec'
};
```

## 5) Run the App
Serve the front-end locally (avoid opening the HTML with `file://`):
```bash
cd "/Users/joshuathomson/Documents/Projects/Codex/Uniform Inspection"
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## Notes
- The backend auto-creates the `Admin`, `Users`, `Students`, and `Inspections` sheets on first request.
- Default admin password is `Bulldog1!` (same as the app default).
- Student leader accounts must be approved in the Admin Dashboard before they can sign in.
