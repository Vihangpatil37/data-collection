function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const titles = {
    success: 'Success',
    error: 'Error',
    info: 'Info'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const content = document.createElement('div');
  content.className = 'toast-content';

  const titleEl = document.createElement('div');
  titleEl.className = 'toast-title';
  titleEl.textContent = titles[type] || 'Info';
  content.appendChild(titleEl);

  const messageEl = document.createElement('div');
  messageEl.className = 'toast-message';
  messageEl.textContent = message;
  content.appendChild(messageEl);

  toast.appendChild(content);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    hideToast(toast);
  });
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => {
      hideToast(toast);
    }, duration);
  }
}

function hideToast(toast) {
  toast.style.transition = 'all 0.3s ease';
  toast.style.transform = 'translateX(100%)';
  toast.style.opacity = '0';
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

export { showToast, hideToast };