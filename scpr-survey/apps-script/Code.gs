/**
 * SCPR Career Guidance Survey - Google Apps Script Backend
 * 
 * Deploy as a Web App in Google Apps Script:
 * 1. Create a new Google Sheet
 * 2. Open Extensions → Apps Script
 * 3. Paste this code
 * 4. Deploy → New deployment → type "Web app" → Execute as "Me" → Who has access "Anyone"
 * 5. Copy the URL and paste it into js/config.js as APPS_SCRIPT_URL
 * 
 * IMPORTANT: Every time the script code changes, create a new deployment version
 * for changes to take effect on the existing URL.
 */

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

/**
 * Gets or creates the survey sheet with headers
 */
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

/**
 * Converts an array to a semicolon-separated string for sheet storage
 */
function arr_(val) {
  return Array.isArray(val) ? val.join('; ') : (val || '');
}

/**
 * POST handler - receives survey submission from the web app
 */
function doPost(e) {
  try {
    var payload;
    if (e.parameter && e.parameter.data) {
      payload = JSON.parse(e.parameter.data);
    } else {
      payload = JSON.parse(e.postData.contents);
    }
    var sheet = getSheet_();
    var row = [
      new Date(),
      payload.submissionId || Utilities.getUuid(),
      payload.age || '', payload.gender || '', payload.grade || '', payload.stream || '',
      payload.marks || '', arr_(payload.favoriteSubjects), arr_(payload.activities),
      arr_(payload.subjectAreas), arr_(payload.careerFields),
      payload.problemSolving || '', payload.communication || '', payload.teamwork || '',
      payload.leadership || '', payload.technicalSkills || '', payload.creativity || '',
      payload.analyticalThinking || '', payload.timeManagement || '', payload.adaptability || '',
      arr_(payload.careerPriorities), payload.dreamCareer || '',
      arr_(payload.interestedCareers), payload.backupCareer || '',
      payload.careerConfidence || '', payload.familyInfluence || '',
      payload.counselingAccess || '', arr_(payload.skillsToImprove),
      payload.comments || '', payload.email || '',
      payload.consent === true, payload.anonymity === true
    ];
    sheet.appendRow(row);
    return jsonOut_({ success: true, message: 'Submission saved', submissionId: row[1] });
  } catch (err) {
    return jsonOut_({ success: false, message: err.message });
  }
}

/**
 * GET handler - health check endpoint
 */
function doGet(e) {
  return jsonOut_({ success: true, message: 'SCPR Survey API is live' });
}

/**
 * OPTIONS handler - required for CORS preflight
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Helper to return JSON responses
 */
function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}