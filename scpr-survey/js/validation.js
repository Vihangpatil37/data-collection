import { getValue, getOtherText } from './state.js';
import { formConfig } from './formConfig.js';

function validateSection(sectionIndex) {
  const section = formConfig.sections[sectionIndex];
  if (!section || !section.questions) return true;

  const errors = [];
  const firstErrorField = null;

  for (const question of section.questions) {
    const fieldError = validateField(question);
    if (fieldError) {
      errors.push({ questionId: question.id, message: fieldError });
    }
  }

  return errors.length === 0 ? { valid: true, errors: [] } : { valid: false, errors, firstFieldId: errors[0]?.questionId };
}

function validateField(question) {
  const value = getValue(question.id);

  if (question.type === 'checkbox') {
    if (question.id === 'consent' || question.id === 'anonymity') {
      if (value !== true) {
        return `Please check this box to continue.`;
      }
      return null;
    }

    const selected = Array.isArray(value) ? value : [];

    if (question.required && question.minSelected && selected.length < question.minSelected) {
      return `Please select at least ${question.minSelected} option${question.minSelected > 1 ? 's' : ''}.`;
    }

    if (question.exactSelected && selected.length !== question.exactSelected) {
      if (selected.length < question.exactSelected) {
        return `Please select exactly ${question.exactSelected} options (currently ${selected.length} selected).`;
      }
    }

    if (question.maxSelected && selected.length > question.maxSelected) {
      return `Please select at most ${question.maxSelected} options.`;
    }

    if (question.allowOtherSpecify && selected.includes('Other (please specify)')) {
      const otherText = getOtherText(question.id);
      if (!otherText || otherText.trim() === '') {
        return 'Please tell us more';
      }
    }

    return null;
  }

  if (question.type === 'radio') {
    if (question.required && !value) {
      return 'Please select an option.';
    }

    if (question.allowOtherSpecify && value === 'Other (please specify)') {
      const otherText = getOtherText(question.id);
      if (!otherText || otherText.trim() === '') {
        return 'Please tell us more';
      }
    }

    return null;
  }

  if (question.type === 'scale') {
    if (question.required && !value) {
      return 'Please select a rating.';
    }
    return null;
  }

  if (question.type === 'text' || question.type === 'email') {
    if (question.id === 'email') {
      const wantsRecs = getValue('wantsRecommendations');
      if (wantsRecs === "Yes! Please send me recommendations") {
        if (!value || value.trim() === '') {
          return 'Email is required to receive recommendations.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return 'Please enter a valid email address.';
        }
      }
      return null;
    }

    if (question.required) {
      if (!value || value.trim() === '') {
        return 'This field is required.';
      }
    }

    if (question.min && value && value.trim().length < question.min) {
      return `Please enter at least ${question.min} characters.`;
    }

    return null;
  }

  if (question.type === 'textarea') {
    if (question.required && (!value || value.trim() === '')) {
      return 'This field is required.';
    }
    return null;
  }

  return null;
}

function showFieldError(questionId, message) {
  const errorDiv = document.getElementById(`error-${questionId}`);
  if (errorDiv) {
    errorDiv.textContent = message;
  }

  const input = document.getElementById(questionId);
  if (input) {
    input.classList.add('error');
  }

  const radioInputs = document.querySelectorAll(`input[name="${questionId}"]`);
  if (radioInputs.length > 0) {
    radioInputs.forEach(inp => inp.classList.add('error'));
  }

  const otherInput = document.getElementById(`other-text-${questionId}`);
  if (otherInput) {
    otherInput.classList.add('error');
  }
}

function clearFieldError(questionId) {
  const errorDiv = document.getElementById(`error-${questionId}`);
  if (errorDiv) {
    errorDiv.textContent = '';
  }

  const input = document.getElementById(questionId);
  if (input) {
    input.classList.remove('error');
  }

  const radioInputs = document.querySelectorAll(`input[name="${questionId}"]`);
  if (radioInputs.length > 0) {
    radioInputs.forEach(inp => inp.classList.remove('error'));
  }

  const otherInput = document.getElementById(`other-text-${questionId}`);
  if (otherInput) {
    otherInput.classList.remove('error');
  }
}

function validateAllSections() {
  let allErrors = [];

  // Sections 0 through 7 are form sections (Section 9 is success screen)
  for (let i = 0; i <= 7; i++) {
    const result = validateSection(i);
    if (!result.valid) {
      allErrors = allErrors.concat(result.errors);
    }
  }

  return allErrors.length === 0 ? { valid: true, errors: [] } : { valid: false, errors: allErrors };
}

export {
  validateSection,
  validateField,
  showFieldError,
  clearFieldError,
  validateAllSections
};