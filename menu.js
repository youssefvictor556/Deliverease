/* DeliverEase - Menu Management
 * Handles restaurant listing and menu display with ratings and admin controls
 */

/**
 * Render all restaurants in the restaurant list
 */
function renderRestaurants() {
  restaurantList.innerHTML = '';
  
  // Add admin button if user is admin
  if (isAdmin()) {
    const adminBtn = document.createElement('div');
    adminBtn.style.cssText = 'grid-column:1/-1;margin-bottom:16px';
    adminBtn.innerHTML = `
      <button type="button" class="btn" id="open-admin-panel" style="width:100%;background:linear-gradient(135deg,#f59e0b,#d97706)">
        <div style="font-size:20px;margin-bottom:4px">⚙️</div>
        Admin Panel - Manage Restaurants & Menu
      </button>
    `;
    restaurantList.appendChild(adminBtn);
    
    document.getElementById('open-admin-panel').addEventListener('click', openAdminPanel);
  }
  
  restaurants.forEach(restaurant => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${restaurant.cover}" alt="${restaurant.name}">
      <h3>${restaurant.name}</h3>
      <p>${restaurant.desc}</p>
      <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center">
        <button type="button" class="btn" data-open="${restaurant.id}">View Menu</button>
        <small style='color:var(--muted)'>${restaurant.categories.length} categories</small>
      </div>
    `;
    
    restaurantList.appendChild(card);
    
    const btn = card.querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => openMenu(restaurant.id));
    }
    
    const img = card.querySelector('img');
    if (img) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openMenu(restaurant.id));
      setupImageFallback(img, restaurant.name);
    }
  });
}

/**
 * Open menu for a specific restaurant
 * @param {string} restId - Restaurant ID
 */
function openMenu(restId) {
  const restaurant = restaurants.find(x => x.id === restId);
  if (!restaurant) return;
  
  restaurantsSection.classList.add('hidden');
  menuSection.classList.remove('hidden');
  
  menuHeader.innerHTML = `
    <img src="${restaurant.cover}" alt="${restaurant.name}">
    <div>
      <h2>${restaurant.name}</h2>
      <p style='color:var(--muted)'>${restaurant.desc}</p>
    </div>
  `;
  
  const headerImg = menuHeader.querySelector('img');
  if (headerImg) {
    setupImageFallback(headerImg, restaurant.name);
  }
  
  categoryTabs.innerHTML = '';
  restaurant.categories.forEach((category, idx) => {
    const btn = document.createElement('button');
    btn.textContent = category;
    if (idx === 0) btn.classList.add('active');
    
    btn.addEventListener('click', () => {
      categoryTabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderItems(restaurant.id, category);
    });
    
    categoryTabs.appendChild(btn);
  });
  
  renderItems(restaurant.id, restaurant.categories[0]);
}

/**
 * Render menu items for a specific category with ratings
 * @param {string} restId - Restaurant ID
 * @param {string} category - Category name
 */
function renderItems(restId, category) {
  const items = sampleItems(category, restId);
  menuItems.innerHTML = '';
  
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card product';
    card.dataset.restaurant = restId;
    const imgSrc = item.image || getProductImage(category, restId, item.name);
    
    // Get rating info
    const avgRating = getAverageRating(item.id);
    const ratings = getItemRatings(item.id);
    const ratingCount = ratings.length;
    
    card.innerHTML = `
      <img src="${imgSrc}" alt="${item.name}">
      <div class="meta">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        ${ratingCount > 0 ? `
          <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
            <div style="color:#fbbf24;font-size:14px">
              ${'⭐'.repeat(Math.round(avgRating))}${'☆'.repeat(5-Math.round(avgRating))}
            </div>
            <span style="color:var(--muted);font-size:13px">${avgRating} (${ratingCount})</span>
          </div>
        ` : `
          <div style="margin-top:8px;color:var(--muted);font-size:13px">No reviews yet</div>
        `}
      </div>
      <div class="actions">
        <div style="font-weight:700;color:var(--accent);font-size:18px">${formatCurrency(item.price)}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="btn small btn-add-cart">+ Add</button>
          <button type="button" class="btn small ghost btn-rate">⭐ Rate</button>
        </div>
      </div>
    `;
    
    menuItems.appendChild(card);
    
    const img = card.querySelector('img');
    if (img) {
      setupImageFallback(img, item.name);
    }
    
    const addBtn = card.querySelector('.btn-add-cart');
    if (addBtn) {
      addBtn.addEventListener('click', () => addToCart(item));
    }
    
    const rateBtn = card.querySelector('.btn-rate');
    if (rateBtn) {
      rateBtn.addEventListener('click', () => openRatingModal(item));
    }
  });
}