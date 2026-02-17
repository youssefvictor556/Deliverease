/**
 * Handle keyboard events in modal (Escape to close, Tab for focus trap)
 * @param {KeyboardEvent} e - Keyboard event
 */
function _handleModalKeydown(e) {
  if (!modal || modal.classList.contains('hidden')) return;
  
  if (e.key === 'Escape') {
    e.preventDefault();
    closeModal();
    return;
  }
  
  if (e.key === 'Tab') {
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusable || focusable.length === 0) {
      e.preventDefault();
      return;
    }
    
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

/**
 * Show modal with content
 * @param {HTMLElement|string} node - Content to display
 */
function showModal(node) {
  try {
    modalBody.innerHTML = '';
    if (typeof node === 'string') {
      modalBody.innerHTML = node;
    } else {
      modalBody.appendChild(node);
    }
    
    if (!modalBody.hasChildNodes() || modalBody.textContent.trim() === '') {
      modalBody.innerHTML = '<div style="padding:12px;color:#263544">No content available.</div>';
    }
    
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
    
    try {
      _lastActiveElement = document.activeElement;
      document.body.style.overflow = 'hidden';
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) modalContent.focus();
      document.addEventListener('keydown', _handleModalKeydown);
    } catch (e) {}
  } catch (err) {
    console.error('Error rendering modal content', err, node);
    modalBody.innerHTML = '<div style="padding:12px;color:#b91c1c">An error occurred rendering this dialog. See console for details.</div>';
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }
}

/**
 * Close modal and restore focus
 */
function closeModal() {
  try {
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }
    document.removeEventListener('keydown', _handleModalKeydown);
    document.body.style.overflow = '';
    
    if (_lastActiveElement && typeof _lastActiveElement.focus === 'function') {
      _lastActiveElement.focus();
    }
    _lastActiveElement = null;
    
    try {
      if (modalBody) modalBody.innerHTML = '';
      const footer = modal && modal.querySelector ? modal.querySelector('#modal-footer') : null;
      if (footer) {
        footer.innerHTML = '';
        footer.hidden = true;
      }
    } catch (_e) {
      /* non-fatal */
    }
  } catch (err) {
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }
  }
}

