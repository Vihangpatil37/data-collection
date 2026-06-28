const STORAGE_KEY = 'scpr_survey_draft_v1';

function saveDraft(formState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formState));
    return true;
  } catch (e) {
    console.warn('Could not save draft to localStorage:', e);
    return false;
  }
}

function loadDraft() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  } catch (e) {
    console.warn('Could not load draft from localStorage:', e);
    return null;
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.warn('Could not clear draft from localStorage:', e);
    return false;
  }
}

function hasDraft() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (e) {
    return false;
  }
}

export { saveDraft, loadDraft, clearDraft, hasDraft };