import { getFormState, getValue, getOtherText, resetFormState } from './state.js';
import { APPS_SCRIPT_URL } from './config.js';

/**
 * NOTE: We use text/plain content type instead of application/json because
 * Google Apps Script Web Apps reject application/json preflight requests
 * under simple CORS. Apps Script will JSON.parse(e.postData.contents) on its end.
 */

function buildPayload() {
  const state = getFormState();
  
  const payload = {
    submissionId: generateSubmissionId(),
    timestamp: new Date().toISOString(),
    age: state.age || '',
    gender: state.gender || '',
    grade: state.grade || '',
    stream: processOtherField('stream', state.stream),
    marks: state.marks || '',
    favoriteSubjects: processOtherArrayField('favoriteSubjects', state.favoriteSubjects),
    activities: processOtherArrayField('activities', state.activities),
    subjectAreas: state.subjectAreas || [],
    careerFields: processOtherArrayField('careerFields', state.careerFields),
    problemSolving: state.problemSolving || '',
    communication: state.communication || '',
    teamwork: state.teamwork || '',
    leadership: state.leadership || '',
    technicalSkills: state.technicalSkills || '',
    creativity: state.creativity || '',
    analyticalThinking: state.analyticalThinking || '',
    timeManagement: state.timeManagement || '',
    adaptability: state.adaptability || '',
    careerPriorities: state.careerPriorities || [],
    dreamCareer: state.dreamCareer || '',
    interestedCareers: processOtherArrayField('interestedCareers', state.interestedCareers),
    backupCareer: state.backupCareer || '',
    careerConfidence: state.careerConfidence || '',
    familyInfluence: state.familyInfluence || '',
    counselingAccess: state.counselingAccess || '',
    skillsToImprove: state.skillsToImprove || [],
    comments: state.comments || '',
    email: state.email || '',
    consent: !!state.consent,
    anonymity: !!state.anonymity
  };

  return payload;
}

function processOtherField(questionId, value) {
  if (value === 'Other (please specify)') {
    const otherText = getOtherText(questionId);
    if (otherText && otherText.trim()) {
      return `Other: ${otherText.trim()}`;
    }
  }
  return value || '';
}

function processOtherArrayField(questionId, values) {
  if (!values || !Array.isArray(values)) return [];
  
  return values.map(val => {
    if (val === 'Other (please specify)') {
      const otherText = getOtherText(questionId);
      if (otherText && otherText.trim()) {
        return `Other: ${otherText.trim()}`;
      }
    }
    return val;
  });
}

function generateSubmissionId() {
  try {
    return crypto.randomUUID();
  } catch (e) {
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(36).substr(2, 9);
    return `scpr-${ts}-${rand}`;
  }
}

async function submitSurvey() {
  const payload = buildPayload();
  const url = APPS_SCRIPT_URL;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, message: 'Network error. Please check your connection and try again.' };
  }
}

export { submitSurvey, buildPayload, generateSubmissionId };