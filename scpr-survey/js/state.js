import { formConfig } from './formConfig.js';

let formState = {};

const initialFormState = {
  consent: false,
  anonymity: false,
  age: null,
  gender: null,
  grade: null,
  stream: null,
  streamOtherText: "",
  marks: null,
  favoriteSubjects: [],
  favoriteSubjectsOtherText: "",
  activities: [],
  activitiesOtherText: "",
  subjectAreas: [],
  careerFields: [],
  careerFieldsOtherText: "",
  problemSolving: null,
  communication: null,
  teamwork: null,
  leadership: null,
  technicalSkills: null,
  creativity: null,
  analyticalThinking: null,
  timeManagement: null,
  adaptability: null,
  careerPriorities: [],
  dreamCareer: "",
  interestedCareers: [],
  interestedCareersOtherText: "",
  backupCareer: "",
  careerConfidence: null,
  familyInfluence: null,
  counselingAccess: null,
  skillsToImprove: [],
  comments: "",
  wantsRecommendations: null,
  email: ""
};

function initializeFormState() {
  formState = { ...initialFormState };
}

function getFormState() {
  return { ...formState };
}

function updateFormState(updates) {
  formState = { ...formState, ...updates };
}

function resetFormState() {
  formState = { ...initialFormState };
}

function getValue(field) {
  return formState[field];
}

function setValue(field, value) {
  formState[field] = value;
}

function setOtherText(questionId, value) {
  const otherField = `${questionId}OtherText`;
  formState[otherField] = value;
}

function getOtherText(questionId) {
  const otherField = `${questionId}OtherText`;
  return formState[otherField] || "";
}

function isFieldAnswered(field) {
  if (Array.isArray(formState[field])) {
    return formState[field].length > 0;
  }
  return formState[field] !== null && formState[field] !== "";
}

function getAllQuestions() {
  const questions = [];
  
  formConfig.sections.forEach(section => {
    section.questions.forEach(question => {
      questions.push(question.id);
    });
  });
  
  return questions;
}

function getCurrentSection() {
  return formState.currentSection || 0;
}

function setCurrentSection(sectionIndex) {
  formState.currentSection = sectionIndex;
}

function getSectionById(sectionId) {
  return formConfig.sections.find(section => section.id === sectionId);
}

function getQuestionById(questionId) {
  for (const section of formConfig.sections) {
    const question = section.questions.find(q => q.id === questionId);
    if (question) {
      return question;
    }
  }
  return null;
}

function isQuestionRequired(questionId) {
  const question = getQuestionById(questionId);
  return question && question.required;
}

function hasOtherSpecify(questionId) {
  const question = getQuestionById(questionId);
  return question && question.allowOtherSpecify;
}

export {
  initializeFormState,
  getFormState,
  updateFormState,
  resetFormState,
  getValue,
  setValue,
  setOtherText,
  getOtherText,
  isFieldAnswered,
  getAllQuestions,
  getCurrentSection,
  setCurrentSection,
  getSectionById,
  getQuestionById,
  isQuestionRequired,
  hasOtherSpecify
};