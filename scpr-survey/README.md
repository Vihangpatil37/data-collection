# 🎓 SCPR Career Guidance Survey

Smart Career Path Recommendation System — a vanilla HTML/CSS/JS survey that collects structured data from Indian high-school/college students and writes each submission to a Google Sheet via Google Apps Script.

## Project Structure

```
scpr-survey/
├── index.html
├── vercel.json
├── README.md
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── config.js
│   ├── formConfig.js
│   ├── state.js
│   ├── render.js
│   ├── validation.js
│   ├── storage.js
│   ├── toast.js
│   ├── navigation.js
│   ├── api.js
│   └── main.js
└── apps-script/
    └── Code.gs
```

## How to Run Locally

Simply open `index.html` in your browser:

```
start index.html
```

Or serve it with a local HTTP server:

```
npx serve .
```

## How to Set Up the Google Sheet + Apps Script

1. Create a new Google Sheet.
2. Open **Extensions → Apps Script**.
3. Delete any default code and paste the contents of `apps-script/Code.gs`.
4. Deploy the script:
   - Click **Deploy → New deployment**
   - Select type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
5. Copy the deployment URL (looks like `https://script.google.com/macros/s/.../exec`).
6. Open `js/config.js` and replace the placeholder URL with the copied URL:

```js
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

**Note:** Every time you change the Apps Script code, you must create a new deployment version (or use "Manage deployments" → edit) for changes to take effect on the existing URL.

## How to Deploy to Vercel

1. Drag and drop the `scpr-survey` folder into the Vercel dashboard, OR use the CLI:

```
npx vercel --prod
```

2. Framework preset: **Other** (no build command)
3. Output directory: root (`.`)

No build step is required — this is a pure static site.

## Troubleshooting

### CORS Issues / "Blocked by CORS policy"

The form uses `text/plain` content type for `fetch()` POST requests instead of `application/json`. This is intentional — Google Apps Script Web Apps reject `application/json` preflight requests under simple CORS. The Apps Script backend parses the JSON from `e.postData.contents`.

If you see CORS errors in the console:
- Confirm `js/config.js` has the correct Apps Script URL.
- Ensure the Web App is deployed with "Anyone" access.
- Check that the `Content-Type` header is `text/plain;charset=utf-8` (not `application/json`).

### Draft Not Restoring

If your survey progress is not restored after a refresh:
- Check that your browser allows `localStorage` for the file/site (private/incognito browsing may block `localStorage` for `file://` protocols).
- Try serving via HTTP (e.g. `npx serve .`) instead of opening directly with the `file://` protocol.

### Data Not Appearing in the Sheet

- Verify the sheet is named exactly `SCPR_Survey_Data`.
- Check the Apps Script execution logs in the Apps Script editor for errors.
- Ensure a new deployment version was created after any code changes.
