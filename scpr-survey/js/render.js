import { formConfig } from './formConfig.js';

function renderApp() {
  const root = document.getElementById('survey-root');
  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'container';

  container.appendChild(renderHeader());
  container.appendChild(renderProgressBar());
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';
  container.appendChild(mainContent);

  formConfig.sections.forEach((section, index) => {
    const sectionEl = renderSection(section, index);
    mainContent.appendChild(sectionEl);
  });

  root.appendChild(container);

  return root;
}

function renderHeader() {
  const header = document.createElement('header');
  header.className = 'page-header';

  const title = document.createElement('h1');
  title.textContent = formConfig.header.title;
  header.appendChild(title);

  const subtitle = document.createElement('h2');
  subtitle.textContent = formConfig.header.subtitle;
  header.appendChild(subtitle);

  const tagline = document.createElement('p');
  tagline.textContent = formConfig.header.tagline;
  header.appendChild(tagline);

  return header;
}

function renderProgressBar() {
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.id = 'progress-bar';
  progressBar.style.width = '12.5%';
  progressContainer.appendChild(progressBar);

  return progressContainer;
}

function renderSection(section, index) {
  const sectionEl = document.createElement('div');
  sectionEl.className = 'section';
  sectionEl.id = section.id;

  if (section.id === 'section9') {
    return sectionEl;
  }

  const sectionHeader = document.createElement('div');
  sectionHeader.className = 'section-header';

  const heading = document.createElement('h3');
  heading.textContent = `${section.icon} ${section.title}`;
  sectionHeader.appendChild(heading);

  sectionEl.appendChild(sectionHeader);

  const sectionBody = document.createElement('div');
  sectionBody.className = 'section-body';

  if (section.intro) {
    if (typeof section.intro === 'string') {
      const introParagraph = document.createElement('p');
      introParagraph.className = 'section-intro-text';
      introParagraph.textContent = section.intro;
      sectionBody.appendChild(introParagraph);
    } else {
      sectionBody.appendChild(renderIntroCard(section.intro));
    }
  }

  section.questions.forEach(question => {
    sectionBody.appendChild(renderQuestion(question));
  });

  sectionEl.appendChild(sectionBody);

  if (section.id === 'section8') {
    sectionEl.appendChild(renderSubmitFooter());
  } else {
    sectionEl.appendChild(renderFooter(index));
  }

  return sectionEl;
}

function renderIntroCard(intro) {
  const introCard = document.createElement('div');
  introCard.className = 'section-intro';

  if (intro.heading) {
    const heading = document.createElement('h4');
    heading.innerHTML = intro.heading;
    introCard.appendChild(heading);
  }

  if (intro.body && Array.isArray(intro.body)) {
    let isCliosingSection = false;
    intro.body.forEach((paragraph, idx) => {
      if (paragraph === '' && idx > 0) {
        return;
      }
      
      if (paragraph.startsWith('🔒') || (paragraph.startsWith('By continuing') && intro.body.some(p => p.includes('Privacy')))) {
        isCliosingSection = true;
      }

      if (paragraph.startsWith('- ')) {
        return;
      }

      if (paragraph.startsWith('1 =') || paragraph.startsWith('2 =') || paragraph.startsWith('3 =') || paragraph.startsWith('4 =') || paragraph.startsWith('5 =') || paragraph.startsWith('- 1 =') || paragraph.startsWith('- 2 =') || paragraph.startsWith('- 3 =') || paragraph.startsWith('- 4 =') || paragraph.startsWith('- 5 =')) {
        return;
      }

      const p = document.createElement('p');
      p.innerHTML = paragraph;
      introCard.appendChild(p);
    });

    const listItems = intro.body.filter(p => {
      const trimmed = p.trim();
      return trimmed.startsWith('- ✓') || trimmed.startsWith('- 1 =') || trimmed.startsWith('- 2 =') || trimmed.startsWith('- 3 =') || trimmed.startsWith('- 4 =') || trimmed.startsWith('- 5 =');
    });

    if (listItems.length > 0) {
      const ul = document.createElement('ul');
      listItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = item.replace(/^- /, '').trim();
        ul.appendChild(li);
      });
      introCard.appendChild(ul);
    }
  }

  if (intro.list) {
    const ul = document.createElement('ul');
    intro.list.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = item;
      ul.appendChild(li);
    });
    introCard.appendChild(ul);
  }

  if (intro.closing) {
    const closing = document.createElement('p');
    closing.innerHTML = intro.closing;
    introCard.appendChild(closing);
  }

  return introCard;
}

function renderQuestion(question) {
  const card = document.createElement('div');
  card.className = 'question-card';
  card.id = `question-${question.id}`;

  if (question.type === 'scale') {
    card.appendChild(renderScaleQuestion(question));
  } else if (question.type === 'checkbox') {
    card.appendChild(renderCheckboxQuestion(question));
  } else if (question.type === 'radio') {
    card.appendChild(renderRadioQuestion(question));
  } else if (question.type === 'text' || question.type === 'email') {
    card.appendChild(renderTextQuestion(question));
  } else if (question.type === 'textarea') {
    card.appendChild(renderTextareaQuestion(question));
  }

  return card;
}

function renderScaleQuestion(question) {
  const wrapper = document.createElement('div');

  const header = document.createElement('div');
  header.className = 'question-header';

  const label = document.createElement('div');
  label.className = 'question-label';
  label.innerHTML = `${question.label}${question.required ? '<span class="required-mark">*</span>' : '<span class="optional-mark"> (Optional)</span>'}`;
  header.appendChild(label);

  if (question.description) {
    const desc = document.createElement('div');
    desc.className = 'scale-description';
    desc.textContent = question.description;
    header.appendChild(desc);
  }

  wrapper.appendChild(header);

  const inputGroup = document.createElement('div');
  inputGroup.className = 'scale-input';

  for (let i = question.min; i <= question.max; i++) {
    const radioOption = document.createElement('div');
    radioOption.className = 'radio-option';
    radioOption.style.flex = '1';
    radioOption.style.textAlign = 'center';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = question.id;
    input.value = i;
    input.id = `${question.id}-${i}`;
    input.dataset.question = question.id;

    const radioLabel = document.createElement('label');
    radioLabel.htmlFor = `${question.id}-${i}`;
    radioLabel.style.display = 'flex';
    radioLabel.style.flexDirection = 'column';
    radioLabel.style.alignItems = 'center';
    radioLabel.style.gap = '0.25rem';
    radioLabel.innerHTML = `<strong>${i}</strong>`;

    radioOption.appendChild(input);
    radioOption.appendChild(radioLabel);
    inputGroup.appendChild(radioOption);
  }

  wrapper.appendChild(inputGroup);

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.id = `error-${question.id}`;
  wrapper.appendChild(errorDiv);

  return wrapper;
}

function renderRadioQuestion(question) {
  const wrapper = document.createElement('div');

  const header = document.createElement('div');
  header.className = 'question-header';

  const label = document.createElement('div');
  label.className = 'question-label';
  label.innerHTML = `${question.label}${question.required ? '<span class="required-mark">*</span>' : ''}`;
  header.appendChild(label);

  if (question.helper) {
    const helper = document.createElement('div');
    helper.className = 'question-helper';
    helper.textContent = question.helper;
    header.appendChild(helper);
  }

  wrapper.appendChild(header);

  const inputGroup = document.createElement('div');
  inputGroup.className = 'radio-group';

  question.options.forEach((option, index) => {
    const optionEl = document.createElement('div');
    optionEl.className = 'radio-option';

    const optionLabel = document.createElement('label');
    
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = question.id;
    input.value = option;
    input.id = `${question.id}-${index}`;
    input.dataset.question = question.id;

    const span = document.createElement('span');
    span.className = 'option-value';
    span.textContent = option;

    optionLabel.appendChild(input);
    optionLabel.appendChild(span);
    optionEl.appendChild(optionLabel);

    if (question.allowOtherSpecify && (option === 'Other (please specify)' || option === 'Other – please specify')) {
      const otherWrapper = document.createElement('div');
      otherWrapper.className = 'other-specify-wrapper';
      otherWrapper.id = `other-wrapper-${question.id}`;
      otherWrapper.style.display = 'none';

      const otherInput = document.createElement('input');
      otherInput.type = 'text';
      otherInput.className = 'other-specify-input';
      otherInput.placeholder = 'Please specify...';
      otherInput.id = `other-text-${question.id}`;
      otherInput.dataset.otherFor = question.id;

      const otherError = document.createElement('div');
      otherError.className = 'error-message';
      otherError.id = `other-error-${question.id}`;

      otherWrapper.appendChild(otherInput);
      otherWrapper.appendChild(otherError);
      optionEl.appendChild(otherWrapper);
    }

    inputGroup.appendChild(optionEl);
  });

  wrapper.appendChild(inputGroup);

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.id = `error-${question.id}`;
  wrapper.appendChild(errorDiv);

  return wrapper;
}

function renderCheckboxQuestion(question) {
  const wrapper = document.createElement('div');

  const header = document.createElement('div');
  header.className = 'question-header';

  if (question.options.length > 0) {
    const label = document.createElement('div');
    label.className = 'question-label';
    label.innerHTML = `${question.label}${question.required ? '<span class="required-mark">*</span>' : ''}`;
    header.appendChild(label);
  }

  if (question.helper) {
    const helper = document.createElement('div');
    helper.className = 'question-helper';
    helper.textContent = question.helper;
    header.appendChild(helper);
  }

  if (question.exactSelected) {
    const counter = document.createElement('div');
    counter.className = 'counter-message';
    counter.id = `counter-${question.id}`;
    counter.textContent = `0/${question.exactSelected} selected`;
    counter.style.fontSize = '0.875rem';
    counter.style.color = 'var(--color-text-secondary)';
    counter.style.marginBottom = '0.5rem';
    header.appendChild(counter);
  }

  if (question.maxSelected) {
    const counter = document.createElement('div');
    counter.className = 'counter-message';
    counter.id = `counter-${question.id}`;
    counter.textContent = `0/${question.maxSelected} selected`;
    counter.style.fontSize = '0.875rem';
    counter.style.color = 'var(--color-text-secondary)';
    counter.style.marginBottom = '0.5rem';
    header.appendChild(counter);
  }

  wrapper.appendChild(header);

  const inputGroup = document.createElement('div');
  inputGroup.className = 'checkbox-group';

  if (question.options.length === 0) {
    const optionEl = document.createElement('div');
    optionEl.className = 'checkbox-option';

    const optionLabel = document.createElement('label');

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = question.id;
    input.value = 'true';
    input.id = question.id;
    input.dataset.question = question.id;

    const span = document.createElement('span');
    span.className = 'option-value';
    span.textContent = question.label;

    optionLabel.appendChild(input);
    optionLabel.appendChild(span);
    optionEl.appendChild(optionLabel);
    inputGroup.appendChild(optionEl);
  } else {
    question.options.forEach((option, index) => {
      const optionEl = document.createElement('div');
      optionEl.className = 'checkbox-option';

      const optionLabel = document.createElement('label');
      
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = question.id;
      input.value = option;
      input.id = `${question.id}-${index}`;
      input.dataset.question = question.id;

      const span = document.createElement('span');
      span.className = 'option-value';
      span.textContent = option;

      optionLabel.appendChild(input);
      optionLabel.appendChild(span);
      optionEl.appendChild(optionLabel);

      if (question.allowOtherSpecify && (option === 'Other (please specify)' || option === 'Other – please specify')) {
        const otherWrapper = document.createElement('div');
        otherWrapper.className = 'other-specify-wrapper';
        otherWrapper.id = `other-wrapper-${question.id}`;
        otherWrapper.style.display = 'none';

        const otherInput = document.createElement('input');
        otherInput.type = 'text';
        otherInput.className = 'other-specify-input';
        otherInput.placeholder = 'Please specify...';
        otherInput.id = `other-text-${question.id}`;
        otherInput.dataset.otherFor = question.id;

        const otherError = document.createElement('div');
        otherError.className = 'error-message';
        otherError.id = `other-error-${question.id}`;

        otherWrapper.appendChild(otherInput);
        otherWrapper.appendChild(otherError);
        optionEl.appendChild(otherWrapper);
      }

      inputGroup.appendChild(optionEl);
    });
  }

  wrapper.appendChild(inputGroup);

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.id = `error-${question.id}`;
  wrapper.appendChild(errorDiv);

  return wrapper;
}

function renderTextQuestion(question) {
  const wrapper = document.createElement('div');

  const header = document.createElement('div');
  header.className = 'question-header';

  const label = document.createElement('div');
  label.className = 'question-label';
  label.innerHTML = `${question.label}${question.required ? '<span class="required-mark">*</span>' : '<span class="optional-mark"> (Optional)</span>'}`;
  header.appendChild(label);

  if (question.helper) {
    const helper = document.createElement('div');
    helper.className = 'question-helper';
    helper.textContent = question.helper;
    header.appendChild(helper);
  }

  wrapper.appendChild(header);

  const input = document.createElement('input');
  input.type = question.type === 'email' ? 'email' : 'text';
  input.className = 'input';
  input.id = question.id;
  input.name = question.id;
  input.dataset.question = question.id;
  input.placeholder = question.placeholder || '';

  if (question.id === 'email') {
    const emailContainer = document.createElement('div');
    emailContainer.id = 'email-container';
    emailContainer.style.display = 'none';
    emailContainer.appendChild(input);
    wrapper.appendChild(emailContainer);
  } else {
    wrapper.appendChild(input);
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.id = `error-${question.id}`;
  wrapper.appendChild(errorDiv);

  return wrapper;
}

function renderTextareaQuestion(question) {
  const wrapper = document.createElement('div');

  const header = document.createElement('div');
  header.className = 'question-header';

  const label = document.createElement('div');
  label.className = 'question-label';
  label.innerHTML = `${question.label}${question.required ? '<span class="required-mark">*</span>' : '<span class="optional-mark"> (Optional)</span>'}`;
  header.appendChild(label);

  if (question.helper) {
    const helper = document.createElement('div');
    helper.className = 'question-helper';
    helper.textContent = question.helper;
    header.appendChild(helper);
  }

  wrapper.appendChild(header);

  const textarea = document.createElement('textarea');
  textarea.className = 'input textarea-input';
  textarea.id = question.id;
  textarea.name = question.id;
  textarea.dataset.question = question.id;
  textarea.placeholder = question.placeholder || '';

  wrapper.appendChild(textarea);

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.id = `error-${question.id}`;
  wrapper.appendChild(errorDiv);

  return wrapper;
}

function renderFooter(sectionIndex) {
  const footer = document.createElement('div');
  footer.className = 'footer';

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';

  if (sectionIndex > 0) {
    const backBtn = document.createElement('button');
    backBtn.className = 'button button-secondary';
    backBtn.textContent = '← Back';
    backBtn.dataset.action = 'back';
    backBtn.dataset.targetSection = sectionIndex;
    buttonGroup.appendChild(backBtn);
  }

  if (sectionIndex < 7) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'button button-primary';
    nextBtn.textContent = 'Next →';
    nextBtn.dataset.action = 'next';
    nextBtn.dataset.targetSection = sectionIndex;
    buttonGroup.appendChild(nextBtn);
  }

  footer.appendChild(buttonGroup);
  return footer;
}

function renderSubmitFooter() {
  const footer = document.createElement('div');
  footer.className = 'footer';

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';

  const backBtn = document.createElement('button');
  backBtn.className = 'button button-secondary';
  backBtn.textContent = '← Back';
  backBtn.dataset.action = 'back';
  backBtn.dataset.targetSection = 7;
  buttonGroup.appendChild(backBtn);

  const submitBtn = document.createElement('button');
  submitBtn.className = 'button button-success';
  submitBtn.id = 'submit-btn';
  submitBtn.textContent = 'Submit';
  submitBtn.dataset.action = 'submit';
  buttonGroup.appendChild(submitBtn);

  footer.appendChild(buttonGroup);
  return footer;
}

function renderSuccessScreen() {
  const section = document.getElementById('section9');
  section.innerHTML = '';
  section.className = 'section active';

  document.querySelectorAll('.section').forEach(el => {
    if (el.id !== 'section9') el.classList.remove('active');
  });

  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = '100%';
  }

  const successDiv = document.createElement('div');
  successDiv.className = 'success-screen';

  const successAnimation = document.createElement('div');
  successAnimation.className = 'success-animation';
  successAnimation.innerHTML = '<svg class="checkmark" viewBox="0 0 52 52"><circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>';
  successDiv.appendChild(successAnimation);

  const heading = document.createElement('h3');
  heading.innerHTML = '✅ <strong>Thank You!</strong>';
  successDiv.appendChild(heading);

  const p1 = document.createElement('p');
  p1.textContent = 'Thank you so much for completing this survey! 🎉';
  successDiv.appendChild(p1);

  const p2 = document.createElement('p');
  p2.textContent = 'Your answers will help us build a better career guidance system for students like you.';
  successDiv.appendChild(p2);

  const p3 = document.createElement('p');
  p3.textContent = "You're helping make a difference!";
  successDiv.appendChild(p3);

  const resetBtn = document.createElement('button');
  resetBtn.className = 'button button-primary';
  resetBtn.id = 'reset-survey-btn';
  resetBtn.dataset.action = 'reset';
  resetBtn.textContent = 'Submit another response';
  successDiv.appendChild(resetBtn);

  section.appendChild(successDiv);
}

export {
  renderApp,
  renderSuccessScreen,
  renderIntroCard,
  renderQuestion,
  renderFooter,
  renderSubmitFooter
};