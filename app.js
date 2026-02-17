/**
 * Initialize the application
 */
function init() {
  // Load saved restaurants if any
  const savedRestaurants = localStorage.getItem('restaurants');
  if (savedRestaurants) {
    try {
      const parsed = JSON.parse(savedRestaurants);
      // Merge with default restaurants
      parsed.forEach(saved => {
        const index = restaurants.findIndex(r => r.id === saved.id);
        if (index >= 0) {
          restaurants[index] = saved;
        } else {
          restaurants.push(saved);
        }
      });
    } catch (e) {
      console.error('Error loading saved restaurants', e);
    }
  }
  
  // Load saved product names if any
  const savedProductNames = localStorage.getItem('productNames');
  if (savedProductNames) {
    try {
      const parsed = JSON.parse(savedProductNames);
      Object.assign(productNames, parsed);
    } catch (e) {
      console.error('Error loading saved product names', e);
    }
  }
  
  // Initialize DOM references
  restaurantList = document.getElementById('restaurant-list');
  menuSection = document.getElementById('menu-section');
  restaurantsSection = document.getElementById('restaurants');
  menuItems = document.getElementById('menu-items');
  categoryTabs = document.getElementById('category-tabs');
  menuHeader = document.getElementById('menu-header');
  cartCount = document.getElementById('cart-count');

  modal = document.getElementById('modal');
  modalBody = document.getElementById('modal-body');
  modalClose = document.getElementById('modal-close');
  
  // Ensure modal is hidden on startup
  if (modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
  }
  if (modalBody) modalBody.innerHTML = '';

  // Initialize UI
  renderRestaurants();
  updateCartUI();
  
  // Update login button text and orders button if user is logged in
  const loginBtn = document.getElementById('btn-login');
  const ordersBtn = document.getElementById('btn-orders');
  
  if (state.currentUser) {
    loginBtn.textContent = 'Logout';
    loginBtn.addEventListener('click', () => {
      state.currentUser = null;
      localStorage.removeItem('currentUser');
      state.cart = [];
      localStorage.setItem('cart', JSON.stringify(state.cart));
      updateCartUI();
      loginBtn.textContent = 'Log in';
      ordersBtn.style.display = 'none';
      alert('Logged out successfully');
      renderRestaurants(); // Refresh to remove admin panel if visible
      location.reload(); // Reload to reset event listeners
    });
    
    // FIXED: Show appropriate button based on user type
    if (ordersBtn) {
      if (state.currentUser.userType === 'admin') {
        // Admin sees "Order Stats" button
        ordersBtn.textContent = '📊 Order Stats';
        ordersBtn.style.display = 'inline-block';
        ordersBtn.addEventListener('click', openOrderStats);
      } else {
        // Customer sees "Orders" button
        ordersBtn.textContent = '📋 Orders';
        ordersBtn.style.display = 'inline-block';
        ordersBtn.addEventListener('click', openOrderHistory);
      }
    }
  } else {
    loginBtn.textContent = 'Log in';
    loginBtn.addEventListener('click', () => openLogin(false, 'login'));
    if (ordersBtn) ordersBtn.style.display = 'none';
  }
  
  // Setup event listeners
  document.getElementById('btn-cart').addEventListener('click', openCart);
  document.getElementById('back-to-list').addEventListener('click', () => {
    menuSection.classList.add('hidden');
    restaurantsSection.classList.remove('hidden');
  });
  
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  
  // Delegated handler as a fallback
  document.addEventListener('click', (e) => {
    const btn = e.target.closest?.('#modal-close');
    if (btn) { e.preventDefault(); closeModal(); }
  });
}

// Initialize once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
  });
} else {
  init();
}