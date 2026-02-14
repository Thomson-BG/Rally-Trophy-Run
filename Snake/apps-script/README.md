# Trophy Run High Scores (Apps Script)

1. Create a new Google Sheet for Trophy Run scores.
2. Open **Extensions → Apps Script**.
3. Paste the contents of `Code.gs` and `appsscript.json` into the Apps Script project.
4. Deploy as **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL and paste it into `CONFIG.appsScriptUrl` in `/Users/joshuathomson/Documents/Projects/Codex/Snake/snake.js`.

The script logs scores to the `Scores` sheet and returns the top scores in descending order.
