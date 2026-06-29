import { getFormState, getValue, getOtherText, resetFormState } from './state.js';
import { APPS_SCRIPT_URL } from './config.js';

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
      },
      mode: 'no-cors'
    });
    // With mode: 'no-cors', we can't read the response
    // but the POST was sent, redirect was followed internally,
    // and doPost() saved the data before responding.
    // We assume success since no network error was thrown.
    return { success: true, message: 'Submission saved' };
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, message: 'Network error. Please check your connection and try again.' };
  }
}

async function checkConnection() {
  try {
    const res = await fetch(APPS_SCRIPT_URL, { method: 'GET' });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      console.log('Apps Script connection OK:', data);
      return data;
    } catch {
      console.error('Response is not JSON. You may be hitting a login page or error page.');
      console.log('Raw response (first 200 chars):', text.substring(0, 200));
      return { success: false, message: 'Invalid response — check browser console for details' };
    }
  } catch (err) {
    console.error('Connection check failed:', err);
    return { success: false, message: err.message };
  }
}

export { submitSurvey, buildPayload, generateSubmissionId, checkConnection };