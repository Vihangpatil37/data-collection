import { formConfig } from './formConfig.js';
import { getCurrentSection, setCurrentSection } from './state.js';
import { validateSection, showFieldError } from './validation.js';
import { showToast } from './toast.js';

function showSection(index) {
  document.querySelectorAll('.section').forEach((section, i) => {
    section.classList.toggle('active', i === index);
  });

  setCurrentSection(index);
  updateProgress(index);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleNext(currentIndex) {
  clearAllErrors();

  const result = validateSection(currentIndex);
  if (!result.valid) {
    result.errors.forEach(error => {
      showFieldError(error.questionId, error.message);
    });

    showToast('Please fix the errors before continuing.', 'error');

    if (result.errors.length > 0) {
      const firstErrorField = result.errors[0].questionId;
      setTimeout(() => {
        const firstErrorEl = document.getElementById(`error-${firstErrorField}`);
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
    return;
  }

  showSection(currentIndex + 1);
}

function handleBack(currentIndex) {
  clearAllErrors();
  showSection(currentIndex - 1);
}

function updateProgress(currentIndex) {
  const totalSections = 8;
  const progress = ((currentIndex + 1) / totalSections) * 100;
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }
}

function clearAllErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
  });
  document.querySelectorAll('.input.error, input.error, .other-specify-input.error').forEach(el => {
    el.classList.remove('error');
  });
}

export { showSection, handleNext, handleBack, updateProgress, clearAllErrors };