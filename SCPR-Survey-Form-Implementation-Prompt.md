# SCPR Career Guidance Survey — Vanilla HTML/CSS/JS Implementation Prompt

> **Instructions for the AI coding agent:** Build this project completely, end-to-end, in one pass. Do not use React, Vue, Vite, Webpack, npm build tooling, or any frontend framework. This is a **pure static site** — plain HTML5, CSS3, and vanilla JavaScript (ES6+, no transpilation, no bundler). It must run by simply opening `index.html` in a browser or deploying the folder as-is to Vercel with zero build step. Every requirement below is mandatory unless marked "optional." Do not skip validation, autosave, the "Other — please specify" conditional fields, or the Apps Script backend — the project is only "done" when the full data flow (browser → Apps Script → Google Sheet) works and the exact copy/wording in §5 is used verbatim.

---

## 1. Project Objective

Build a single-page, multi-section survey titled **"🎓 SCPR Career Guidance Survey"** with subtitle **"Smart Career Path Recommendation System"** and tagline **"Help us build better career guidance for students like you!"**. It collects structured data from Indian high-school/college students (academics, interests, skills, career preferences) and writes each submission as a row to a Google Sheet via a Google Apps Script Web App. The visual style mimics **Google Forms**: clean, minimal, card-based, blue accent, generous white space — friendly and warm in tone (uses emoji in section headers, per the copy in §5), not corporate.

---

## 2. Tech Stack (strict)

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic tags, one `index.html`) |
| Styling | Plain CSS3 (CSS variables for theme, no Sass/Tailwind/Bootstrap) |
| Logic | Vanilla JavaScript ES6+, split into small ES modules (`<script type="module">`) |
| Form state | Plain JS object (`formState`), no library |
| Validation | Hand-written validation functions, no Zod/Yup |
| HTTP | Native `fetch()`, no Axios |
| Notifications | Custom-built toast component (vanilla JS + CSS), no React-Toastify |
| Persistence | `localStorage` (native Web Storage API) |
| Backend | Google Apps Script (`Code.gs`), deployed as Web App |
| Database | Google Sheets |
| Hosting | Vercel (static site, no build command) |
| Fonts | Google Fonts — Roboto (400, 500, 700) |

---

## 3. File / Folder Structure

Create exactly this structure:

```
scpr-survey/
├── index.html
├── vercel.json
├── README.md
├── css/
│   ├── variables.css        (CSS custom properties: colors, spacing, radii, shadows)
│   ├── base.css             (resets, typography, global elements)
│   ├── layout.css           (header, progress bar, section cards, footer)
│   ├── components.css       (inputs, radio/checkbox cards, buttons, toast, scale inputs, info/intro cards)
│   └── responsive.css       (mobile-first breakpoints: 480px, 768px, 1024px)
├── js/
│   ├── config.js            (APPS_SCRIPT_URL constant — placeholder for user to fill in)
│   ├── formConfig.js        (single source of truth: all 9 sections, intro copy, and 28 questions as data)
│   ├── state.js             (formState object, getters/setters, change tracking)
│   ├── render.js            (builds DOM for intro banners/sections/questions/"Other" fields from formConfig data)
│   ├── validation.js        (per-field + per-section validation rules and error messages)
│   ├── storage.js           (localStorage autosave: save on change, restore on load, clear on submit)
│   ├── toast.js             (showToast(type, message) — success/error/info variants)
│   ├── navigation.js        (section show/hide, progress bar %, next/back/review)
│   ├── api.js               (submitSurvey(payload) → fetch POST to Apps Script)
│   └── main.js              (app bootstrap: render → restore autosave → wire events)
└── apps-script/
    └── Code.gs              (backend: doPost, doGet, doOptions, sheet writer)
```

Do not flatten this into a single `script.js` — keep the module split above for maintainability.

---

## 4. Design System

Define these as CSS variables in `variables.css` and use them everywhere (no hard-coded hex values in other files):

```css
:root {
  --color-primary: #1a73e8;
  --color-primary-hover: #1558b3;
  --color-bg: #ffffff;
  --color-surface: #f8f9fa;
  --color-border: #dadce0;
  --color-text: #202124;
  --color-text-secondary: #5f6368;
  --color-error: #d93025;
  --color-success: #188038;
  --color-info-bg: #e8f0fe;
  --color-info-border: #1a73e8;
  --radius-card: 8px;
  --shadow-card: 0 1px 2px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.08);
  --font-family: 'Roboto', Arial, sans-serif;
  --max-width: 640px;
}
```

- Background: white page, light-gray (`--color-surface`) behind cards for contrast, like Google Forms.
- Each **question** is its own card: white background, `--radius-card`, `--shadow-card`, padding 24px, margin-bottom 16px.
- Each **section** that has intro/explanatory copy (see §5) renders an **info card** above its first question: tinted background (`--color-info-bg`), left border accent (`--color-info-border`), emoji + heading, body paragraphs, and (for Section 1) a bulleted privacy list with ✓ icons. This is a distinct visual style from question cards so users immediately recognize it as "read this" rather than "answer this."
- Required questions show a red asterisk after the label. Optional questions show a small "(Optional)" label in `--color-text-secondary`.
- Active/focused inputs get a 2px `--color-primary` outline (no harsh browser default outline).
- Mobile-first: single column, full-width cards under 768px; centered `--max-width` column above that.
- Use subtle CSS transitions (200ms ease) for: section fade/slide on navigation, button hover, toast slide-in, progress bar width.
- **Do not render literal ASCII box-drawing characters** (e.g. `═══`, `─────`) anywhere in the UI — those exist only in the source content as plaintext mockup dividers. Translate every such divider into an actual styled section-header element (icon + heading + optional subheading) using CSS, not text characters.
- Similarly, `○`, `☐`, and `⭕` in the source content are plaintext stand-ins for real `<input type="radio">` / `<input type="checkbox">` elements — never render them as literal characters.

---

## 5. Form Structure — All Sections, Intro Copy & Questions

Encode this entire structure (including the intro/banner copy) as a JS data array in `formConfig.js`. Each section object should support: `{ id, icon, title, intro: { heading, body[], list?, closing? } | null, questions: [...] }`. `render.js` must generate **all** DOM — both the intro cards and the question cards — purely from this data; do not hand-write any question or intro HTML directly in `index.html`.

### Page Header (rendered once, above Section 1, not part of any section)
- Title: `🎓 SCPR Career Guidance Survey`
- Subtitle: `Smart Career Path Recommendation System`
- Tagline: `Help us build better career guidance for students like you!`

### Section 1 — Welcome & Consent
**Intro card** (render verbatim, as real paragraphs/list items — not ASCII art):

> 🌟 **Welcome to the Career Guidance Survey**
>
> Hi there! 👋
>
> I'm building a Smart Career Path Recommendation System that uses Artificial Intelligence to help students discover the right career.
>
> This survey takes 10-12 minutes. Your honest answers will help make career guidance better for everyone!
>
> **🔒 Privacy Guaranteed:**
> - ✓ Your answers are completely ANONYMOUS
> - ✓ No one will know it's you
> - ✓ You can stop anytime
> - ✓ You can skip any question you're not comfortable with
>
> By continuing, you agree to participate voluntarily.

**Questions:**
- `consent` (checkbox, required): "I agree to participate in this survey"
- `anonymity` (checkbox, required): "I understand my answers are anonymous"

### Section 2 — 📋 About You
1. `age` (radio, required) — Label: *"What is your age?"*
   Options: `14 years, 15 years, 16 years, 17 years, 18 years, 19-20 years, 21-25 years`
2. `gender` (radio, optional) — Label: *"What is your gender?"* Helper text: *"(Optional — for analysis only)"*
   Options: `Male, Female, Prefer not to say, Other` (plain "Other" — **no** specify text field for this question)
3. `grade` (radio, required) — Label: *"Which class/grade are you currently in?"*
   Options: `Class 10, Class 11, Class 12, 1st Year College, 2nd Year College, 3rd Year College, Other` (plain "Other" — **no** specify text field for this question)

### Section 3 — 📚 Academic Information
4. `stream` (radio, required, `allowOtherSpecify: true`) — Label: *"What is your academic stream?"*
   Options:
   - `Science (PCM - Physics, Chemistry, Math)`
   - `Science (PCB - Physics, Chemistry, Biology)`
   - `Commerce`
   - `Arts/Humanities`
   - `Diploma (Engineering)`
   - `Other (please specify)` → reveals a required text input when selected
5. `marks` (radio, required) — Label: *"What was your marks percentage in your last exam?"*
   Options: `90-100% (Excellent), 75-89% (Good), 60-74% (Above Average), 40-59% (Average), Below 40%`
6. `favoriteSubjects` (checkbox group, required, min 1, `allowOtherSpecify: true`) — Label: *"Which subjects are your favorites?"* Helper: *"(Select all that apply)"*
   Options: `Mathematics, Physics, Chemistry, Biology, Computer Science / IT, English / Literature, History / Geography, Economics, Accountancy, Business Studies, Art / Drawing, Physical Education, Languages, Other (please specify)` → reveals a required text input when checked

### Section 4 — 🌟 Your Interests
7. `activities` (checkbox group, required, min 1, `allowOtherSpecify: true`) — Label: *"What activities do you enjoy doing?"* Helper: *"(Select all that apply)"*
   Options: `Solving puzzles and brain teasers, Building or making things with hands, Writing stories, articles, or blogs, Drawing, painting, or creating art, Programming or coding, Researching topics I'm curious about, Teaching or explaining things to others, Leading groups or organizing events, Helping people or volunteering, Working with numbers and calculations, Playing sports or physical activities, Playing musical instruments, Photography or videography, Traveling and exploring new places, Other (please specify)` → reveals a required text input when checked
8. `subjectAreas` (checkbox group, required, **exactly 3**) — Label: *"Which subject areas interest you the most?"* Helper: *"(Select exactly 3)"*
   Options: `Mathematics & Logic, Science & Experiments, Technology & Computers, Business & Finance, Arts & Creativity, Health & Biology, Law & Society, Languages & Communication, History & Culture, Sports & Fitness, Environment & Nature, Psychology & Human Behavior` (no "Other" on this question)
9. `careerFields` (checkbox group, required, min 1, `allowOtherSpecify: true`) — Label: *"Which career fields excite you the most?"* Helper: *"(Select all that apply)"*
   Options: `Technology / Information Technology, Healthcare / Medicine, Education / Teaching, Business / Finance / Banking, Engineering, Creative Arts / Design, Law / Justice / Legal, Research / Science, Government / Public Services, Sports / Fitness, Media / Journalism, Agriculture / Environment, Hospitality / Tourism, Not sure yet, Other (please specify)` → reveals a required text input when checked

### Section 5 — 💪 Your Skills Assessment
**Intro card** (render once at the top of this section, above question 10):

> Rate yourself honestly on a scale of 1 to 5:
> - 1 = Beginner / Needs Improvement
> - 2 = Basic / Getting Started
> - 3 = Average / Comfortable
> - 4 = Good / Strong
> - 5 = Excellent / Very Confident

**Questions** — each rendered as a horizontal 1–5 linear-scale radio row, required, with the skill name as the main label and the italicized phrase as a small description line underneath it:
10. `problemSolving` — **Problem Solving** — *Ability to analyze and solve complex problems*
11. `communication` — **Communication** — *Speaking, writing, and expressing ideas clearly*
12. `teamwork` — **Teamwork** — *Working effectively in groups and teams*
13. `leadership` — **Leadership** — *Motivating and guiding others*
14. `technicalSkills` — **Technical Skills** — *Using computers, software, and tools*
15. `creativity` — **Creativity** — *Generating new ideas and thinking outside the box*
16. `analyticalThinking` — **Analytical Thinking** — *Breaking down complex problems logically*
17. `timeManagement` — **Time Management** — *Managing time and meeting deadlines effectively*
18. `adaptability` — **Adaptability** — *Adjusting to new situations and learning quickly*

### Section 6 — 🎯 Career Preferences
19. `careerPriorities` (checkbox group, required, **exactly 3**) — Label: *"What matters MOST to you in a career?"* Helper: *"(Select top 3)"*
    Options: `High salary / Good earnings, Work-life balance (time for family and hobbies), Making a positive social impact, Continuous learning and growth opportunities, Job security and stability, Creative freedom and expression, Working with people and helping them, Working independently / alone, Leadership and management opportunities, International exposure and travel, Prestige and recognition, Fast-paced and challenging environment`
20. `dreamCareer` (text input, required, min 3 chars) — Label: *"What is your DREAM career?"* Helper: *"(What would you love to do if anything were possible?)"* Placeholder: *"What would you love to do if anything were possible?"*
21. `interestedCareers` (checkbox group, required, min 1, `allowOtherSpecify: true`) — Label: *"Which careers are you MOST interested in?"* Helper: *"(Select all that apply)"*
    Options: `Software Developer / Engineer, Data Scientist / Analyst, Doctor / Medical Professional, Nurse / Healthcare Worker, Teacher / Professor, Business Owner / Entrepreneur, Banker / Financial Analyst, Graphic Designer / Artist, Lawyer / Advocate, Scientist / Researcher, Government Officer / IAS, Civil Engineer, Mechanical Engineer, Electrical Engineer, Journalist / Writer, Pilot / Aviation Professional, Sports Professional, Photographer / Videographer, Social Worker, Architect, Psychologist / Counselor, Marketing Professional, Human Resources (HR) Professional, Not sure yet, Other (please specify)` → reveals a required text input when checked
22. `backupCareer` (text input, optional) — Label: *"Do you have a backup career option in mind?"* Helper: *"(Optional — just in case your first choice doesn't work out)"*
23. `careerConfidence` (radio, required) — Label: *"How confident are you about your career choice?"*
    Options: `Very confident - I know exactly what I want, Somewhat confident - I have a good idea, Unsure - I'm still exploring options, Completely undecided - I have no idea yet`

### Section 7 — ➕ Additional Questions (Optional)
24. `familyInfluence` (radio, optional) — Label: *"Does your family influence your career choice?"*
    Options: `Yes, they actively guide me, Yes, they have certain expectations, No, I'm free to choose on my own, Not sure`
25. `counselingAccess` (radio, optional) — Label: *"Do you have access to career counseling at your institution?"*
    Options: `Yes, we have good counseling services, Yes, but it's limited, No, we don't have any, Not sure`
26. `skillsToImprove` (checkbox group, optional, **max 3**) — Label: *"Which skills would you like to improve the most?"* Helper: *"(Select top 3)"*
    Options: `Problem Solving, Communication Skills, Leadership Skills, Technical Skills, Time Management, Creative Thinking, Teamwork, Public Speaking, Negotiation Skills, Emotional Intelligence, Critical Thinking`
27. `comments` (textarea, optional) — Label: *"Any other thoughts, questions, or comments about your career journey?"*

### Section 8 — 📧 Stay Connected (Optional)
Intro line: *"Would you like to receive personalized career recommendations based on your answers?"*
- `wantsRecommendations` (radio, optional): `Yes! Please send me recommendations` / `No, thanks`
- `email` (text input, conditional) — rendered indented directly under the "Yes!" option; becomes **required** and email-validated only when `wantsRecommendations === "Yes! Please send me recommendations"`. Label: *"Email"*

The **Submit** button sits at the bottom of Section 8 (there is no separate input page for Section 9 — see below).

### Section 9 — ✅ Thank You! (Success Screen, not a fillable page)
This section has **no questions**. It is the screen shown **after** a successful submission, replacing the form entirely. Render this exact copy:

> ✅ **Thank You!**
>
> Thank you so much for completing this survey! 🎉
>
> Your answers will help us build a better career guidance system for students like you.
>
> You're helping make a difference!

Include a checkmark/success animation (simple CSS keyframe — e.g. a circle that draws itself, or a scale+fade pop-in) and an optional **"Submit another response"** button that resets `formState`, clears the draft, and returns to Section 1.

### Conditional "Other — Please Specify" Fields (cross-cutting behavior)
The following questions — and **only** these — have `allowOtherSpecify: true` in `formConfig.js`: `stream`, `favoriteSubjects`, `activities`, `careerFields`, `interestedCareers`. (`gender` and `grade` also have an "Other" option, but per the source copy they do **not** prompt for specify text — leave them as plain options.)

Implementation rules:
- When the "Other (please specify)" option is selected/checked, `render.js` reveals a small text input directly beneath that option (indented, lighter border) with placeholder *"Please specify..."*.
- That text input is **required** the moment "Other" is selected; unchecking/deselecting "Other" hides and clears it.
- In `state.js`, store the specify text in a field named `<questionId>OtherText` (e.g. `streamOtherText`).
- Before building the submission payload in `api.js`, replace the literal `"Other (please specify)"` value in that field's data with `"Other: <specify text>"` (for radios, replace the single value; for checkbox arrays, replace just that one array entry) so the Google Sheet receives meaningful data instead of the literal word "Other".

---

## 6. Functional Requirements

### 6.1 Navigation
- One section visible at a time (Google Forms style), with **Back** / **Next** buttons. Section 1's intro card and Section 5's scale-legend intro card render above their respective first question, inside the same section view.
- "Next" runs validation for the current section only; on failure, scroll to and highlight the first invalid field, show inline error text under it, and do **not** advance.
- Section 8's button reads **Submit** (there is no separate "next" into Section 9 — Section 9 only appears after a successful submit).
- Progress bar fill % = `(current section index + 1) / total fillable sections (8) * 100`, animated via CSS `width` transition.

### 6.2 Validation (implement in `validation.js`, pure functions, no library)
- Both consent checkboxes must be `true`.
- All fields marked `required` in `formConfig.js` must be non-empty.
- `subjectAreas`: exactly 3 selected — block at 4th click (disable remaining checkboxes) and show a counter "2/3 selected".
- `careerPriorities`: exactly 3 selected, same UX as above.
- `skillsToImprove`: max 3, disable further checkboxes at 3, no minimum.
- Any question with `allowOtherSpecify: true`: if "Other (please specify)" is selected, the matching `<questionId>OtherText` field must be non-empty (trimmed) before the section can advance — show "Please tell us more" under the text input if empty.
- `age`: must be one of the listed options (radio enforces this; no free text).
- `email`: standard regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), only validated if `wantsRecommendations` is "Yes! Please send me recommendations".
- `dreamCareer`: min 3 characters after trim.
- Every validation failure must show a specific, human-readable message under the field (e.g. "Please select exactly 3 areas (currently 2 selected)") — no generic "This field is required" for the count-based ones.

### 6.3 Autosave (`storage.js`)
- On every input/change event, debounce 400ms, then write the full `formState` object (JSON-stringified) to `localStorage` under key `scpr_survey_draft_v1`.
- On `main.js` bootstrap, before rendering, check for an existing draft in `localStorage`; if found, restore `formState` and pre-check/pre-fill all matching inputs (including any `<questionId>OtherText` fields and re-revealing their text inputs), and show a toast: "Restored your previous progress."
- On successful submission, call `localStorage.removeItem('scpr_survey_draft_v1')`.
- Wrap all storage calls in try/catch (private browsing mode can throw).

### 6.4 Toast Notifications (`toast.js`)
- Build a minimal toast system: a fixed-position container (bottom-right desktop, bottom-center mobile), `showToast(message, type)` where `type` is `success | error | info`.
- Auto-dismiss after 4s with a slide-out animation; allow manual dismiss via an ✕ button.
- Use for: autosave restore notice, submission success, submission error (network/server failure), validation summary on attempted skip-ahead.

### 6.5 Submission Flow (`api.js`)
1. On final Submit, run full-form validation (all sections, including all "Other"-specify checks) as a safety net.
2. Build the payload object matching the exact column list in §7, applying the "Other: `<text>`" substitution described at the end of §5.
3. Generate a `submissionId` client-side (e.g. `crypto.randomUUID()` or timestamp+random fallback) and include a client `timestamp` (ISO string) — the Apps Script will also stamp server time.
4. `fetch(APPS_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type': 'text/plain;charset=utf-8'} })` — **use `text/plain` content-type**, not `application/json`, because Google Apps Script Web Apps reject `application/json` preflight requests under simple CORS; Apps Script will `JSON.parse(e.postData.contents)` on its end. Document this clearly in code comments so it isn't "fixed" incorrectly later.
5. Show a loading spinner on the submit button (`disabled`, spinner icon swapped in) while the request is in flight.
6. On success (`response.success === true`): clear localStorage draft, show success toast, replace the form view with the Section 9 Success Screen (exact copy above).
7. On failure (network error or `response.success === false`): show error toast with `response.message` or a generic fallback, re-enable the submit button, **do not clear the draft**.

---

## 7. Google Apps Script Backend (`apps-script/Code.gs`)

Build a complete, deployable script with three entry points. Sheet name: `SCPR_Survey_Data`.

Column order (row 1 = these exact headers):
```
Timestamp, SubmissionID, Age, Gender, Class, Stream, Marks, FavoriteSubjects,
Activities, SubjectAreas, CareerFields, ProblemSolving, Communication, Teamwork,
Leadership, TechnicalSkills, Creativity, AnalyticalThinking, TimeManagement,
Adaptability, CareerPriorities, DreamCareer, InterestedCareers, BackupCareer,
CareerConfidence, FamilyInfluence, CounselingAccess, SkillsToImprove, Comments,
Email, Consent, Anonymity
```

Reference implementation to adapt:

```javascript
const SHEET_NAME = 'SCPR_Survey_Data';
const HEADERS = [
  'Timestamp','SubmissionID','Age','Gender','Class','Stream','Marks',
  'FavoriteSubjects','Activities','SubjectAreas','CareerFields',
  'ProblemSolving','Communication','Teamwork','Leadership','TechnicalSkills',
  'Creativity','AnalyticalThinking','TimeManagement','Adaptability',
  'CareerPriorities','DreamCareer','InterestedCareers','BackupCareer',
  'CareerConfidence','FamilyInfluence','CounselingAccess','SkillsToImprove',
  'Comments','Email','Consent','Anonymity'
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function arr_(val) {
  return Array.isArray(val) ? val.join('; ') : (val || '');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    const row = [
      new Date(),
      data.submissionId || Utilities.getUuid(),
      data.age || '', data.gender || '', data.grade || '', data.stream || '',
      data.marks || '', arr_(data.favoriteSubjects), arr_(data.activities),
      arr_(data.subjectAreas), arr_(data.careerFields),
      data.problemSolving || '', data.communication || '', data.teamwork || '',
      data.leadership || '', data.technicalSkills || '', data.creativity || '',
      data.analyticalThinking || '', data.timeManagement || '', data.adaptability || '',
      arr_(data.careerPriorities), data.dreamCareer || '',
      arr_(data.interestedCareers), data.backupCareer || '',
      data.careerConfidence || '', data.familyInfluence || '',
      data.counselingAccess || '', arr_(data.skillsToImprove),
      data.comments || '', data.email || '',
      data.consent === true, data.anonymity === true
    ];
    sheet.appendRow(row);
    return jsonOut_({ success: true, message: 'Submission saved', submissionId: row[1] });
  } catch (err) {
    return jsonOut_({ success: false, message: err.message });
  }
}

function doGet(e) {
  return jsonOut_({ success: true, message: 'SCPR Survey API is live' });
}

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

**Deployment steps the agent must document in `README.md`:**
1. Create a new Google Sheet, open Extensions → Apps Script, paste `Code.gs`.
2. Deploy → New deployment → type "Web app" → Execute as "Me" → Who has access "Anyone".
3. Copy the deployment URL into `js/config.js` as `APPS_SCRIPT_URL`.
4. Note: every time the script code changes, a **new deployment version** must be made (or use "Manage deployments" → edit) for changes to take effect on the existing URL.

---

## 8. README.md Contents (agent must write this file)

- Project description
- Folder structure
- How to run locally (just open `index.html`, or `npx serve .`)
- How to set up the Google Sheet + Apps Script (steps above)
- Where to put the Apps Script URL (`js/config.js`)
- How to deploy to Vercel (drag-and-drop the folder, or `vercel --prod`; framework preset = "Other", no build command, output directory = root)
- Troubleshooting: CORS issues, "blocked by CORS policy" fix (use `text/plain` content type as in §6.5), draft-not-restoring (private browsing blocks localStorage)

---

## 9. Build Order (follow this sequence)

1. Scaffold the folder structure from §3.
2. Write `formConfig.js` with the full data model from §5 — **including the intro copy, the legend, and the `allowOtherSpecify` flags** — get this 100% right first, since everything else renders from it.
3. Write `variables.css`, `base.css` — establish the design system from §4.
4. Write `render.js` to dynamically build the page header, all intro/info cards, and all 9 sections' question cards from `formConfig.js` into `index.html`'s single `<main id="survey-root">` container, including the conditional "Other — please specify" text inputs.
5. Write `layout.css`, `components.css` to style the rendered output (radio/checkbox cards, scale inputs, intro cards, buttons, progress bar).
6. Write `state.js` to track answers as the user interacts, including `<questionId>OtherText` fields.
7. Write `validation.js` and wire it into the Next/Submit button handlers in `navigation.js`, including the Other-specify required-text rule.
8. Write `storage.js`, hook into `state.js` change events, wire restore-on-load into `main.js`.
9. Write `toast.js` and call it from the relevant points above.
10. Write `responsive.css` last, test at 375px, 768px, 1024px+.
11. Write `config.js` (placeholder URL) and `api.js` (including the "Other: `<text>`" substitution); wire the Submit button to the real flow from §6.5.
12. Write `apps-script/Code.gs` per §7.
13. Write `README.md` per §8, and `vercel.json` (minimal — static site needs none, but include an empty `{}` or rewrites if you add clean URLs).
14. Self-test against the full checklist in §10 before declaring done.

---

## 10. Acceptance Checklist (must all pass)

- [ ] Page header (title/subtitle/tagline) and the Section 1 welcome/privacy intro card render with the exact copy from §5, as real styled HTML — not ASCII art
- [ ] All 9 sections render correctly from `formConfig.js`, including Section 5's scale-legend intro card and per-skill description subtitles
- [ ] All ~28 questions render with the exact labels/helper text/options from §5
- [ ] Both consent checkboxes block progress until checked
- [ ] "Exactly 3" fields (`subjectAreas`, `careerPriorities`) enforce the count both ways (block 4th, require a 3rd); `skillsToImprove` caps at 3 with no minimum
- [ ] Selecting "Other (please specify)" on `stream`, `favoriteSubjects`, `activities`, `careerFields`, or `interestedCareers` reveals a required text input; `gender` and `grade`'s "Other" options do **not**
- [ ] Email field only required/validated when "Yes! Please send me recommendations" is selected in Section 8
- [ ] Progress bar updates correctly on every Back/Next
- [ ] Refreshing mid-survey restores answers (including any Other-specify text) from `localStorage` with a toast notice
- [ ] Submit button shows a loading state and is disabled during the request
- [ ] Successful submission clears the draft, shows success toast, and shows the Section 9 success screen with the exact thank-you copy
- [ ] Failed submission (test by pointing `config.js` at a bad URL) shows an error toast and preserves the draft
- [ ] Data appears correctly in the `SCPR_Survey_Data` Google Sheet with all 32 columns populated, correct timestamp, unique submission ID, and "Other" values substituted with the user's specified text
- [ ] Fully responsive from 360px width up through desktop
- [ ] No console errors in browser devtools
- [ ] No React/Vue/build-tool dependency anywhere in the repo
- [ ] Deploys to Vercel as a static site with zero build configuration
