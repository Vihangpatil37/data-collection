import { formConfig } from './formConfig.js';
import { initializeFormState, resetFormState, setValue, setOtherText, getValue, getFormState, updateFormState, setCurrentSection, getCurrentSection } from './state.js';
import { renderApp, renderSuccessScreen } from './render.js';
import { showSection, handleNext, handleBack } from './navigation.js';
import { clearFieldError, showFieldError, validateAllSections, validateSection } from './validation.js';
import { saveDraft, loadDraft, clearDraft, hasDraft } from './storage.js';
import { showToast } from './toast.js';
import { submitSurvey } from './api.js';

let autosaveTimer = null;

function init() {
  initializeFormState();

  renderApp();

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  if (hasDraft()) {
    const savedState = loadDraft();
    if (savedState) {
      Object.keys(savedState).forEach(key => {
        setValue(key, savedState[key]);
      });
      restoreFormFromState();
      showToast('Restored your previous progress.', 'info');
    }
  }

  wireEventListeners();
  showSection(0);
}

function wireEventListeners() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;

    if (action === 'next') {
      const currentIndex = parseInt(btn.dataset.targetSection);
      handleNext(currentIndex);
    } else if (action === 'back') {
      const currentIndex = parseInt(btn.dataset.targetSection);
      handleBack(currentIndex);
    } else if (action === 'submit') {
      doSubmit();
    } else if (action === 'reset') {
      resetSurvey();
    }
  });

  document.addEventListener('change', (e) => {
    const target = e.target;

    if (target.matches('input[type="radio"]')) {
      handleRadioChange(target);
    } else if (target.matches('input[type="checkbox"]')) {
      handleCheckboxChange(target);
    }
  });

  document.addEventListener('input', (e) => {
    const target = e.target;

    if (target.matches('.input:not([type="radio"]):not([type="checkbox"])')) {
      handleTextInput(target);
    } else if (target.matches('.other-specify-input')) {
      handleOtherSpecify(target);
    }
  });

}

function handleRadioChange(input) {
  const questionId = input.dataset.question;
  const value = input.value;

  setValue(questionId, value);
  clearFieldError(questionId);

  const question = findQuestion(questionId);
  if (question && question.allowOtherSpecify) {
    const otherWrapper = document.getElementById(`other-wrapper-${questionId}`);
    if (otherWrapper) {
      if (value === 'Other (please specify)') {
        otherWrapper.style.display = 'block';
      } else {
        otherWrapper.style.display = 'none';
        const otherInput = document.getElementById(`other-text-${questionId}`);
        if (otherInput) {
          otherInput.value = '';
          setOtherText(questionId, '');
        }
      }
    }
  }

  if (questionId === 'wantsRecommendations') {
    const emailContainer = document.getElementById('email-container');
    const emailInput = document.getElementById('email');
    if (emailContainer) {
      emailContainer.style.display = value === "Yes! Please send me recommendations" ? 'block' : 'none';
      if (value !== "Yes! Please send me recommendations" && emailInput) {
        emailInput.value = '';
        setValue('email', '');
      }
    }
  }

  scheduleAutosave();
}

function handleCheckboxChange(input) {
  const questionId = input.dataset.question;
  const value = input.value;

  const question = findQuestion(questionId);

  if (questionId === 'consent' || questionId === 'anonymity') {
    setValue(questionId, input.checked);
    clearFieldError(questionId);
    scheduleAutosave();
    return;
  }

  let selected = getValue(questionId);
  if (!Array.isArray(selected)) selected = [];

  if (input.checked) {
    if (question) {
      if (question.exactSelected && selected.length >= question.exactSelected) {
        input.checked = false;
        return;
      }
      if (question.maxSelected && selected.length >= question.maxSelected) {
        input.checked = false;
        return;
      }
    }
    selected.push(value);
  } else {
    selected = selected.filter(v => v !== value);
  }

  setValue(questionId, selected);
  clearFieldError(questionId);

  if (question && question.allowOtherSpecify && value === 'Other (please specify)') {
    const otherWrapper = document.getElementById(`other-wrapper-${questionId}`);
    if (otherWrapper) {
      if (input.checked) {
        otherWrapper.style.display = 'block';
      } else {
        otherWrapper.style.display = 'none';
        const otherInput = document.getElementById(`other-text-${questionId}`);
        if (otherInput) {
          otherInput.value = '';
          setOtherText(questionId, '');
        }
      }
    }
  }

  if (question && (question.exactSelected || question.maxSelected)) {
    const max = question.exactSelected || question.maxSelected;
    updateCheckboxLimits(questionId, max, input.checked);
    updateCounter(questionId, selected.length, question.exactSelected || question.maxSelected);
  }

  scheduleAutosave();
}

function updateCheckboxLimits(questionId, max, wasChecked) {
  const selected = getValue(questionId);
  const currentCount = Array.isArray(selected) ? selected.length : 0;
  const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${questionId}"]`);

  checkboxes.forEach(cb => {
    if (currentCount >= max && !cb.checked) {
      cb.disabled = true;
    } else {
      cb.disabled = false;
    }
  });
}

function updateCounter(questionId, count, max) {
  const counter = document.getElementById(`counter-${questionId}`);
  if (counter) {
    counter.textContent = `${count}/${max} selected`;
  }
}

function handleTextInput(input) {
  const questionId = input.id || input.dataset.question;
  const value = input.value;

  setValue(questionId, value);
  clearFieldError(questionId);

  scheduleAutosave();
}

function handleOtherSpecify(input) {
  const questionId = input.dataset.otherFor;
  const value = input.value;

  setOtherText(questionId, value);

  const otherError = document.getElementById(`other-error-${questionId}`);
  if (otherError) {
    otherError.textContent = '';
  }
  input.classList.remove('error');

  scheduleAutosave();
}

function scheduleAutosave() {
  if (autosaveTimer) {
    clearTimeout(autosaveTimer);
  }

  autosaveTimer = setTimeout(() => {
    const formState = getFormState();
    saveDraft(formState);
  }, 400);
}

async function doSubmit() {
  const validationResult = validateAllSections();
  if (!validationResult.valid) {
    validationResult.errors.forEach(error => {
      showFieldError(error.questionId, error.message);
    });
    showToast('Please fix all errors before submitting.', 'error');

    const firstError = validationResult.errors[0];
    if (firstError) {
      import('./navigation.js').then(mod => {
        const sectionWithError = findSectionForQuestion(firstError.questionId);
        if (sectionWithError !== -1) {
          mod.showSection(sectionWithError);
        }
      });
    }
    return;
  }

  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Submitting...';
  }

  try {
    const result = await submitSurvey();

    if (result.success === true) {
      clearDraft();
      showToast('Your survey has been submitted successfully!', 'success');
      renderSuccessScreen();
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch (error) {
    showToast(error.message || 'Could not submit survey. Please try again.', 'error');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  }
}

function restoreFormFromState() {
  const state = getFormState();

  document.querySelectorAll('input[type="radio"]').forEach(input => {
    const questionId = input.dataset.question;
    if (state[questionId] === input.value) {
      input.checked = true;
      handleRadioChange(input);
    }
  });

  document.querySelectorAll('input[type="checkbox"]').forEach(input => {
    const questionId = input.dataset.question;
    if (questionId === 'consent' || questionId === 'anonymity') {
      if (state[questionId] === true) {
        input.checked = true;
      }
      return;
    }
    const selected = Array.isArray(state[questionId]) ? state[questionId] : [];
    if (selected.includes(input.value)) {
      input.checked = true;
      if (input.value === 'Other (please specify)') {
        const otherWrapper = document.getElementById(`other-wrapper-${questionId}`);
        if (otherWrapper) {
          otherWrapper.style.display = 'block';
          const otherInput = document.getElementById(`other-text-${questionId}`);
          if (otherInput) {
            otherInput.value = state[`${questionId}OtherText`] || '';
          }
        }
      }
    }
  });

  document.querySelectorAll('input.input, textarea.input').forEach(input => {
    const questionId = input.id || input.dataset.question;
    if (state[questionId] !== undefined && state[questionId] !== null && input.type !== 'radio' && input.type !== 'checkbox') {
      input.value = state[questionId];
    }
  });

  document.querySelectorAll('.other-specify-input').forEach(input => {
    const questionId = input.dataset.otherFor;
    const otherText = state[`${questionId}OtherText`];
    if (otherText) {
      input.value = otherText;
    }
  });

  const wantsRecs = state.wantsRecommendations;
  if (wantsRecs === "Yes! Please send me recommendations") {
    const emailContainer = document.getElementById('email-container');
    if (emailContainer) {
      emailContainer.style.display = 'block';
    }
  }

  document.querySelectorAll('[id^="counter-"]').forEach(counter => {
    const questionId = counter.id.replace('counter-', '');
    const selected = Array.isArray(state[questionId]) ? state[questionId] : [];
    const question = findQuestion(questionId);
    if (question) {
      const max = question.exactSelected || question.maxSelected;
      if (max) {
        counter.textContent = `${selected.length}/${max} selected`;
        updateCheckboxLimits(questionId, max, false);
      }
    }
  });
}

function findQuestion(questionId) {
  for (const section of formConfig.sections) {
    const question = section.questions.find(q => q.id === questionId);
    if (question) return question;
  }
  return null;
}

function findSectionForQuestion(questionId) {
  for (let i = 0; i < formConfig.sections.length; i++) {
    const section = formConfig.sections[i];
    const question = section.questions.find(q => q.id === questionId);
    if (question) return i;
  }
  return -1;
}

function resetSurvey() {
  resetFormState();
  clearDraft();
  renderApp();

  document.querySelectorAll('input, textarea').forEach(el => {
    el.value = '';
    el.checked = false;
  });

  initializeFormState();
  showSection(0);
}

document.addEventListener('DOMContentLoaded', init);

export { handleCheckboxChange, handleRadioChange };