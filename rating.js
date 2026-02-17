/* DeliverEase - Rating Management
 * Handles item ratings and reviews from customers
 */

/**
 * Get average rating for an item
 * @param {string} itemId - Item ID
 * @returns {number} Average rating (0-5)
 */
function getAverageRating(itemId) {
  const ratings = getItemRatings(itemId);
  if (ratings.length === 0) return 0;
  
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return (sum / ratings.length).toFixed(1);
}

/**
 * Get all ratings for an item
 * @param {string} itemId - Item ID
 * @returns {Array} Array of rating objects
 */
function getItemRatings(itemId) {
  const allRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
  return allRatings[itemId] || [];
}

/**
 * Save a rating for an item
 * @param {string} itemId - Item ID
 * @param {number} rating - Rating value (1-5)
 * @param {string} comment - Optional comment
 */
function saveRating(itemId, rating, comment = '') {
  const allRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
  
  if (!allRatings[itemId]) {
    allRatings[itemId] = [];
  }
  
  allRatings[itemId].push({
    rating: Number(rating),
    comment: comment,
    timestamp: Date.now(),
    user: state.currentUser ? state.currentUser.email : 'anonymous'
  });
  
  localStorage.setItem('ratings', JSON.stringify(allRatings));
}

/**
 * Open rating modal for an item
 * @param {Object} item - Item to rate
 */
function openRatingModal(item) {
  if (!state.currentUser) {
    openLogin(true);
    return;
  }
  
  const body = document.createElement('div');
  body.innerHTML = `
    <div style="text-align:center;margin-bottom:20px">
      <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#fbbf24,#f59e0b);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">⭐</div>
      <h2 style="margin:0 0 8px;color:#0f1724">Rate ${item.name}</h2>
      <p style="color:var(--muted);margin:0;font-size:14px">Share your experience with this item</p>
    </div>
    
    <div style="margin-bottom:20px">
      <label style="font-weight:600;margin-bottom:12px;display:block">Your Rating:</label>
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:20px" id="rating-stars">
        <button class="star-btn" data-rating="1">⭐</button>
        <button class="star-btn" data-rating="2">⭐⭐</button>
        <button class="star-btn" data-rating="3">⭐⭐⭐</button>
        <button class="star-btn" data-rating="4">⭐⭐⭐⭐</button>
        <button class="star-btn" data-rating="5">⭐⭐⭐⭐⭐</button>
      </div>
    </div>
    
    <div style="margin-bottom:20px">
      <label style="font-weight:600;margin-bottom:8px;display:block">Your Comment (Optional):</label>
      <textarea id="rating-comment" placeholder="Tell us what you think..." style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:8px;font-family:inherit;font-size:14px;resize:vertical;min-height:80px"></textarea>
    </div>
  `;
  
  showModal(body);
  
  const footer = modal.querySelector('#modal-footer');
  if (footer) {
    footer.hidden = false;
    footer.innerHTML = '';
    
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn';
    submitBtn.textContent = 'Submit Rating';
    submitBtn.type = 'button';
    footer.appendChild(submitBtn);
    
    let selectedRating = 0;
    const starBtns = body.querySelectorAll('.star-btn');
    
    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        starBtns.forEach(b => b.style.opacity = '0.5');
        for (let i = 0; i < Number(btn.dataset.rating); i++) {
          starBtns[i].style.opacity = '1';
        }
        selectedRating = Number(btn.dataset.rating);
      });
    });
    
    submitBtn.addEventListener('click', () => {
      if (selectedRating === 0) {
        alert('Please select a rating');
        return;
      }
      
      const comment = document.getElementById('rating-comment').value.trim();
      saveRating(item.id, selectedRating, comment);
      
      closeModal();
      
      // Show success message
      const success = document.createElement('div');
      success.innerHTML = `
        <div style="text-align:center">
          <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">✓</div>
          <h3 style="margin:0 0 8px">Thank You!</h3>
          <p style="color:var(--muted);margin:0">Your rating has been recorded.</p>
        </div>
      `;
      showModal(success);
      setTimeout(() => closeModal(), 2000);
    });
  }
}
