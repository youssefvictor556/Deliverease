/* DeliverEase - Shopping Cart Management
 * Handles cart operations: add, update, remove, and display
 */

/**
 * Add an item to the shopping cart
 * @param {Object} item - Item to add to cart
 */
function addToCart(item) {
  // Check if user is logged in
  if (!state.currentUser) {
    openLogin(true);
    return;
  }
  
  const existing = state.cart.find(i => i.id === item.id);
  
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...item, qty: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartUI();
}

/**
 * Update cart UI with current cart count
 */
function updateCartUI() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = count;
}

/**
 * Change quantity of an item in the cart
 * @param {string} id - Item ID
 * @param {number} delta - Quantity change (+1 or -1)
 */
function changeQty(id, delta) {
  const item = state.cart.find(x => x.id === id);
  if (!item) return;
  
  item.qty = Math.max(0, (item.qty || 1) + delta);
  
  if (item.qty === 0) {
    state.cart = state.cart.filter(x => x.id !== id);
  }
  
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartUI();
}

/**
 * Remove an item from the cart
 * @param {string} id - Item ID
 */
function removeFromCart(id) {
  state.cart = state.cart.filter(x => x.id !== id);
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartUI();
}

// Helper function to create cart item HTML
function createCartItemHTML(item) {
  const imgSrc = item.image || getProductImage(item.id.split('-')[1] || 'Burgers', item.id.split('-')[0] || 'mcd', item.name);
  return `
    <img src="${imgSrc}" alt="${item.name}">
    <div class="ci-meta">
      <div class="ci-name">${item.name}</div>
      <div class="ci-desc">${item.desc}</div>
    </div>
    <div class="ci-actions">
      <div class="ci-qty">
        <button type="button" class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
        <span class="qty">${item.qty}</span>
        <button type="button" class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
      </div>
      <div class="ci-price">${formatCurrency(item.price * item.qty)}</div>
      <button type="button" class="btn ghost remove-btn" data-id="${item.id}">Remove</button>
    </div>
  `;
}

// Helper function to attach cart item handlers
function attachCartHandlers(container, renderCartInModal) {
  container.querySelectorAll('.qty-btn').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      const action = b.getAttribute('data-action');
      changeQty(id, action === 'inc' ? 1 : -1);
      if (renderCartInModal) renderCartInModal();
    });
  });
  
  container.querySelectorAll('.remove-btn').forEach(b => {
    b.addEventListener('click', () => {
      removeFromCart(b.getAttribute('data-id'));
      if (renderCartInModal) renderCartInModal();
    });
  });
}

/**
 * Open cart modal and display cart contents
 */
function openCart() {
  if (!state.currentUser) {
    openLogin(true);
    return;
  }
  
  const body = document.createElement('div');
  if (state.cart.length === 0) {
    body.innerHTML = '<p>Your cart is empty.</p>';
    showModal(body);
    return;
  }
  
  const container = document.createElement('div');
  container.className = 'cart-container';
  const left = document.createElement('div');
  left.className = 'cart-list';
  const right = document.createElement('div');
  right.className = 'cart-summary';
  
  let total = 0;
  state.cart.forEach(it => {
    total += it.price * it.qty;
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = createCartItemHTML(it);
    left.appendChild(item);
    const img = item.querySelector('img');
    if (img) setupImageFallback(img, it.name);
  });
  
  const summary = document.createElement('div');
  summary.className = 'summary-box';
  summary.innerHTML = `
    <div style="display:flex;justify-content:space-between">
      <div>Subtotal</div>
      <div id="cart-subtotal">${formatCurrency(total)}</div>
    </div>
    <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">
      <button type="button" class="btn" id="cart-checkout">Proceed to payment</button>
    </div>
  `;
  right.appendChild(summary);
  container.appendChild(left);
  container.appendChild(right);
  body.appendChild(container);
  showModal(body);
  
  attachCartHandlers(body, renderCartInModal);
  
  const checkoutBtn = document.getElementById('cart-checkout');
  if (checkoutBtn) checkoutBtn.addEventListener('click', showPaymentMethods);
  
  // Helper to re-render cart content inside modal when qty changes
  function renderCartInModal() {
    try {
      const leftBox = document.querySelector('.cart-list');
      const subtotal = document.getElementById('cart-subtotal');
      if (!leftBox) return;
      
      leftBox.innerHTML = '';
      let newTotal = 0;
      
      state.cart.forEach(it => {
        newTotal += it.price * it.qty;
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = createCartItemHTML(it);
        leftBox.appendChild(item);
        const img = item.querySelector('img');
        if (img) setupImageFallback(img, it.name);
      });
      
      if (subtotal) subtotal.textContent = formatCurrency(newTotal);
      attachCartHandlers(leftBox, renderCartInModal);
    } catch (_e) {}
  }
}

