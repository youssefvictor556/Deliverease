/**
 * Check if current user is admin
 */
function isAdmin() {
  return state.currentUser && state.currentUser.userType === 'admin';
}

/**
 * Open admin panel
 */
function openAdminPanel() {
  if (!isAdmin()) {
    alert('Access denied. Admin privileges required.');
    return;
  }
  
  const body = document.createElement('div');
  body.innerHTML = `
    <div style="text-align:center;margin-bottom:20px">
      <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">⚙️</div>
      <h2 style="margin:0 0 8px;color:#0f1724">Admin Panel</h2>
      <p style="color:var(--muted);margin:0;font-size:14px">Manage restaurants, menu items, and orders</p>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <button type="button" class="btn" id="manage-restaurants">
        <div style="font-size:24px;margin-bottom:4px">🏪</div>
        Manage Restaurants
      </button>
      <button type="button" class="btn" id="manage-menu">
        <div style="font-size:24px;margin-bottom:4px">🍔</div>
        Manage Menu Items
      </button>
      <button type="button" class="btn" id="manage-orders" style="grid-column:1/-1;background:linear-gradient(135deg,#10b981,#059669)">
        <div style="font-size:24px;margin-bottom:4px">✅</div>
        Approve Orders (Pending to Arrived)
      </button>
      <button type="button" class="btn ghost" id="clear-demo-data" style="grid-column:1/-1;border:2px solid #ef4444;color:#ef4444">
        <div style="font-size:20px;margin-bottom:4px">🗑️</div>
        Clear Demo Data
      </button>
    </div>
  `;
  
  showModal(body);
  
  document.getElementById('manage-restaurants').addEventListener('click', showRestaurantManagement);
  document.getElementById('manage-menu').addEventListener('click', showMenuManagement);
  document.getElementById('manage-orders').addEventListener('click', showOrderApproval);
  document.getElementById('clear-demo-data').addEventListener('click', clearDemoData);
}

/**
 * Show restaurant management interface
 */
function showRestaurantManagement() {
  const body = document.createElement('div');
  body.innerHTML = `
    <h3 style="margin:0 0 16px">Manage Restaurants</h3>
    
    <button type="button" class="btn" id="add-restaurant" style="margin-bottom:16px;width:100%">
      + Add New Restaurant
    </button>
    
    <div id="restaurant-list-admin" style="max-height:400px;overflow-y:auto">
      ${restaurants.map(r => `
        <div style="background:#f8fafc;padding:12px;border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong style="color:#0f1724">${r.name}</strong>
            <p style="margin:4px 0 0;color:var(--muted);font-size:13px">${r.desc}</p>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn small" onclick="editRestaurant('${r.id}')">Edit</button>
            <button class="btn small ghost" onclick="deleteRestaurant('${r.id}')" style="color:#ef4444;border-color:#ef4444">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  showModal(body);
  
  document.getElementById('add-restaurant').addEventListener('click', () => showRestaurantForm());
}

/**
 * Show restaurant form (add/edit)
 */
function showRestaurantForm(restaurantId = null) {
  const restaurant = restaurantId ? restaurants.find(r => r.id === restaurantId) : null;
  const isEdit = restaurant !== null;
  
  const body = document.createElement('div');
  body.innerHTML = `
    <h3 style="margin:0 0 16px">${isEdit ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
    
    <label style="font-weight:600;margin-bottom:8px;display:block">Restaurant ID</label>
    <input type="text" id="rest-id" placeholder="e.g., subway" ${isEdit ? 'disabled' : ''} value="${restaurant?.id || ''}" style="margin-bottom:16px">
    
    <label style="font-weight:600;margin-bottom:8px;display:block">Restaurant Name</label>
    <input type="text" id="rest-name" placeholder="e.g., Subway" value="${restaurant?.name || ''}" style="margin-bottom:16px">
    
    <label style="font-weight:600;margin-bottom:8px;display:block">Description</label>
    <input type="text" id="rest-desc" placeholder="Fresh subs made to order" value="${restaurant?.desc || ''}" style="margin-bottom:16px">
    
    <label style="font-weight:600;margin-bottom:8px;display:block">Cover Image</label>
    <input type="text" id="rest-cover" placeholder="photos/restaurant.jpg" value="${restaurant?.cover || ''}" style="margin-bottom:16px">
    
    <label style="font-weight:600;margin-bottom:8px;display:block">Categories (comma-separated)</label>
    <input type="text" id="rest-categories" placeholder="Subs,Wraps,Salads" value="${restaurant?.categories.join(',') || ''}" style="margin-bottom:16px">
  `;
  
  const footer = modal.querySelector('#modal-footer');
  if (footer) {
    footer.hidden = false;
    footer.innerHTML = '';
    
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn';
    saveBtn.textContent = isEdit ? 'Update Restaurant' : 'Add Restaurant';
    footer.appendChild(saveBtn);
    
    saveBtn.addEventListener('click', () => {
      const id = document.getElementById('rest-id').value.trim();
      const name = document.getElementById('rest-name').value.trim();
      const desc = document.getElementById('rest-desc').value.trim();
      const cover = document.getElementById('rest-cover').value.trim();
      const categories = document.getElementById('rest-categories').value.split(',').map(c => c.trim()).filter(c => c);
      
      if (!id || !name || !desc || categories.length === 0) {
        alert('Please fill in all required fields');
        return;
      }
      
      if (!isEdit && restaurants.find(r => r.id === id)) {
        alert('Restaurant ID already exists');
        return;
      }
      
      if (isEdit) {
        const index = restaurants.findIndex(r => r.id === restaurantId);
        restaurants[index] = { id: restaurantId, name, desc, cover, categories };
      } else {
        restaurants.push({ id, name, desc, cover, categories });
      }
      
      // Save to localStorage
      localStorage.setItem('restaurants', JSON.stringify(restaurants));
      
      closeModal();
      renderRestaurants();
      
      const success = document.createElement('div');
      success.innerHTML = `
        <div style="text-align:center">
          <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#00a896,#0a66c2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">✓</div>
          <h3 style="margin:0 0 8px">Success!</h3>
          <p style="color:var(--muted);margin:0">Restaurant ${isEdit ? 'updated' : 'added'} successfully.</p>
        </div>
      `;
      showModal(success);
      setTimeout(() => closeModal(), 1500);
    });
  }
  
  showModal(body);
}

/**
 * Edit restaurant
 */
function editRestaurant(restaurantId) {
  showRestaurantForm(restaurantId);
}

/**
 * Delete restaurant
 */
function deleteRestaurant(restaurantId) {
  if (!confirm('Are you sure you want to delete this restaurant? This will also delete all associated menu items.')) {
    return;
  }
  
  const index = restaurants.findIndex(r => r.id === restaurantId);
  if (index >= 0) {
    restaurants.splice(index, 1);
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
    
    // Also remove menu items for this restaurant
    const productNamesData = JSON.parse(localStorage.getItem('productNames') || '{}');
    delete productNamesData[restaurantId];
    localStorage.setItem('productNames', JSON.stringify(productNamesData));
    
    closeModal();
    renderRestaurants();
    
    alert('Restaurant deleted successfully');
  }
}

/**
 * Show menu management interface
 */
function showMenuManagement() {
  const body = document.createElement('div');
  body.innerHTML = `
    <h3 style="margin:0 0 16px">Manage Menu Items</h3>
    
    <label style="font-weight:600;margin-bottom:8px;display:block">Select Restaurant</label>
    <select id="menu-restaurant" style="margin-bottom:16px;width:100%">
      <option value="">-- Select Restaurant --</option>
      ${restaurants.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
    </select>
    
    <div id="menu-category-section" style="display:none">
      <label style="font-weight:600;margin-bottom:8px;display:block">Select Category</label>
      <select id="menu-category" style="margin-bottom:16px;width:100%">
        <option value="">-- Select Category --</option>
      </select>
    </div>
    
    <button type="button" class="btn" id="add-menu-item" style="margin-bottom:16px;width:100%;display:none">
      + Add Menu Item
    </button>
    
    <div id="menu-items-list" style="max-height:300px;overflow-y:auto"></div>
  `;
  
  showModal(body);
  
  const restSelect = document.getElementById('menu-restaurant');
  const catSection = document.getElementById('menu-category-section');
  const catSelect = document.getElementById('menu-category');
  const addBtn = document.getElementById('add-menu-item');
  const itemsList = document.getElementById('menu-items-list');
  
  restSelect.addEventListener('change', () => {
    const restId = restSelect.value;
    if (restId) {
      const restaurant = restaurants.find(r => r.id === restId);
      catSection.style.display = 'block';
      catSelect.innerHTML = '<option value="">-- Select Category --</option>' +
        restaurant.categories.map(c => `<option value="${c}">${c}</option>`).join('');
    } else {
      catSection.style.display = 'none';
      addBtn.style.display = 'none';
      itemsList.innerHTML = '';
    }
  });
  
  catSelect.addEventListener('change', () => {
    const restId = restSelect.value;
    const category = catSelect.value;
    
    if (restId && category) {
      addBtn.style.display = 'block';
      loadMenuItems(restId, category);
    } else {
      addBtn.style.display = 'none';
      itemsList.innerHTML = '';
    }
  });
  
  addBtn.addEventListener('click', () => {
    showMenuItemForm(restSelect.value, catSelect.value);
  });
  
  function loadMenuItems(restId, category) {
    const items = sampleItems(category, restId);
    
    if (items.length === 0) {
      itemsList.innerHTML = '<p style="text-align:center;color:var(--muted);padding:20px">No items in this category</p>';
      return;
    }
    
    itemsList.innerHTML = items.map(item => `
      <div style="background:#f8fafc;padding:12px;border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <strong style="color:#0f1724">${item.name}</strong>
          <p style="margin:4px 0 0;color:var(--muted);font-size:13px">${formatCurrency(item.price)}</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn small" onclick="editMenuItem('${restId}', '${category}', '${item.id}')">Edit</button>
          <button class="btn small ghost" onclick="deleteMenuItem('${restId}', '${category}', '${item.id}')" style="color:#ef4444;border-color:#ef4444">Delete</button>
        </div>
      </div>
    `).join('');
  }
}

/**
 * Show menu item form
 */
function showMenuItemForm(restId, category, itemId = null) {
  const items = sampleItems(category, restId);
  const item = itemId ? items.find(i => i.id === itemId) : null;
  const isEdit = item !== null;
  
  const body = document.createElement('div');
  body.innerHTML = `
    <h3 style="margin:0 0 16px">${isEdit ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
    
    <label style="font-weight:600;margin-bottom:8px;display:block">Item Name</label>
    <input type="text" id="item-name" placeholder="e.g., Big Mac" value="${item?.name || ''}" style="margin-bottom:16px">
    
    <label style="font-weight:600;margin-bottom:8px;display:block">Description</label>
    <input type="text" id="item-desc" placeholder="Item description" value="${item?.desc || ''}" style="margin-bottom:16px">
    
    <label style="font-weight:600;margin-bottom:8px;display:block">Price (EGP)</label>
    <input type="number" id="item-price" placeholder="50.00" step="0.01" value="${item?.price || ''}" style="margin-bottom:16px">
    
    <label style="font-weight:600;margin-bottom:8px;display:block">Image</label>
    <input type="text" id="item-image" placeholder="photos/item.jpg" value="${item?.image || ''}" style="margin-bottom:16px">
  `;
  
  const footer = modal.querySelector('#modal-footer');
  if (footer) {
    footer.hidden = false;
    footer.innerHTML = '';
    
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn';
    saveBtn.textContent = isEdit ? 'Update Item' : 'Add Item';
    footer.appendChild(saveBtn);
    
    saveBtn.addEventListener('click', () => {
      const name = document.getElementById('item-name').value.trim();
      const desc = document.getElementById('item-desc').value.trim();
      const price = parseFloat(document.getElementById('item-price').value);
      const image = document.getElementById('item-image').value.trim();
      
      if (!name || !desc || !price || price <= 0) {
        alert('Please fill in all required fields with valid values');
        return;
      }
      
      // Load product names
      let productNamesData = JSON.parse(localStorage.getItem('productNames') || JSON.stringify(productNames));
      
      if (!productNamesData[restId]) {
        productNamesData[restId] = {};
      }
      if (!productNamesData[restId][category]) {
        productNamesData[restId][category] = [];
      }
      
      if (isEdit) {
        const index = productNamesData[restId][category].findIndex(n => n === item.name);
        if (index >= 0) {
          productNamesData[restId][category][index] = name;
        }
        
        // Update product image map if needed
        const imgMap = JSON.parse(localStorage.getItem('productImageMap') || '{}');
        const oldKey = item.name.toLowerCase();
        delete imgMap[oldKey];
        if (image) {
          imgMap[name.toLowerCase()] = image.replace('photos/', '');
        }
        localStorage.setItem('productImageMap', JSON.stringify(imgMap));
      } else {
        productNamesData[restId][category].push(name);
        
        // Add to image map if image provided
        if (image) {
          const imgMap = JSON.parse(localStorage.getItem('productImageMap') || '{}');
          imgMap[name.toLowerCase()] = image.replace('photos/', '');
          localStorage.setItem('productImageMap', JSON.stringify(imgMap));
        }
      }
      
      localStorage.setItem('productNames', JSON.stringify(productNamesData));
      
      closeModal();
      
      const success = document.createElement('div');
      success.innerHTML = `
        <div style="text-align:center">
          <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#00a896,#0a66c2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">✓</div>
          <h3 style="margin:0 0 8px">Success!</h3>
          <p style="color:var(--muted);margin:0">Menu item ${isEdit ? 'updated' : 'added'} successfully.</p>
        </div>
      `;
      showModal(success);
      setTimeout(() => {
        closeModal();
        showMenuManagement();
      }, 1500);
    });
  }
  
  showModal(body);
}

/**
 * Edit menu item
 */
function editMenuItem(restId, category, itemId) {
  showMenuItemForm(restId, category, itemId);
}

/**
 * Delete menu item
 */
function deleteMenuItem(restId, category, itemId) {
  if (!confirm('Are you sure you want to delete this menu item?')) {
    return;
  }
  
  const items = sampleItems(category, restId);
  const item = items.find(i => i.id === itemId);
  
  if (item) {
    let productNamesData = JSON.parse(localStorage.getItem('productNames') || JSON.stringify(productNames));
    
    if (productNamesData[restId] && productNamesData[restId][category]) {
      const index = productNamesData[restId][category].findIndex(n => n === item.name);
      if (index >= 0) {
        productNamesData[restId][category].splice(index, 1);
      }
    }
    
    localStorage.setItem('productNames', JSON.stringify(productNamesData));
    
    closeModal();
    alert('Menu item deleted successfully');
    showMenuManagement();
  }
}

/**
 * Show order approval interface for admins
 */
function showOrderApproval() {
  const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  // Filter pending orders
  const pendingOrders = allOrders.filter(order => order.status === 'pending');
  
  const body = document.createElement('div');
  body.innerHTML = `
    <div style="text-align:center;margin-bottom:20px">
      <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">✅</div>
      <h2 style="margin:0 0 8px;color:#0f1724">Order Approval</h2>
      <p style="color:var(--muted);margin:0;font-size:14px">Pending Orders (${pendingOrders.length})</p>
    </div>
  `;
  
  if (pendingOrders.length === 0) {
    body.innerHTML += `
      <div style="text-align:center;padding:40px 20px;background:#f8fafc;border-radius:12px">
        <div style="font-size:48px;margin-bottom:16px;opacity:0.3">📭</div>
        <h3 style="margin:0 0 8px;color:#0f1724">No Pending Orders</h3>
        <p style="color:var(--muted);margin:0">All orders have been processed!</p>
      </div>
    `;
  } else {
    body.innerHTML += `
      <div style="display:flex;flex-direction:column;gap:12px;max-height:400px;overflow-y:auto">
        ${pendingOrders.map((order, idx) => `
          <div style="background:#f8fafc;padding:16px;border-radius:12px;border-left:4px solid #10b981">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px">
              <div>
                <div style="font-weight:700;color:#0f1724">Order #${order.id}</div>
                <div style="font-size:13px;color:var(--muted)">Customer: ${order.customer || 'N/A'}</div>
                <div style="font-size:13px;color:var(--muted)">Time: ${new Date(order.timestamp).toLocaleString()}</div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700;color:var(--accent);font-size:18px">${formatCurrency(order.total)}</div>
                <div style="font-size:12px;color:var(--muted);margin-top:4px">${order.items ? order.items.length : 0} items</div>
              </div>
            </div>
            
            <div style="background:white;padding:12px;border-radius:8px;margin-bottom:12px;max-height:120px;overflow-y:auto">
              ${order.items && order.items.length > 0 ? `
                <div style="font-size:13px;font-weight:600;color:#0f1724;margin-bottom:8px">Items:</div>
                ${order.items.map(item => `
                  <div style="font-size:12px;color:var(--muted);padding:4px 0">• ${item.name} (x${item.qty}) - ${formatCurrency(item.price * item.qty)}</div>
                `).join('')}
              ` : '<div style="color:var(--muted);font-size:12px">No items</div>'}
            </div>
            
            <button type="button" class="btn small" data-approve-order="${order.id}" style="width:100%;background:linear-gradient(135deg,#10b981,#059669)">
              ✓ Approve & Mark as Arrived
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  showModal(body);
  
  // Add event listeners for approve buttons
  document.querySelectorAll('[data-approve-order]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const orderId = e.target.dataset.approveOrder;
      approveOrder(orderId);
    });
  });
}

/**
 * Approve an order and change its status to 'arrived'
 * @param {string} orderId - Order ID to approve
 */
function approveOrder(orderId) {
  const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = allOrders.find(o => o.id === orderId);
  
  if (!order) {
    alert('Order not found');
    return;
  }
  
  // Update order status
  order.status = 'arrived';
  order.approvedAt = Date.now();
  order.approvedBy = state.currentUser.email;
  
  localStorage.setItem('orders', JSON.stringify(allOrders));
  
  closeModal();
  
  // Show success message
  const success = document.createElement('div');
  success.innerHTML = `
    <div style="text-align:center">
      <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">✓</div>
      <h3 style="margin:0 0 8px">Order Approved!</h3>
      <p style="color:var(--muted);margin:0">Order #${orderId} is now marked as Arrived</p>
    </div>
  `;
  showModal(success);
  setTimeout(() => closeModal(), 2000);
}

/**
 * Clear all demo/hardcoded data
 */
function clearDemoData() {
  if (!confirm('Are you sure you want to clear all orders, ratings, and cart data? This cannot be undone.')) {
    return;
  }
  
  // Clear all orders
  localStorage.removeItem('orders');
  
  // Clear all ratings
  localStorage.removeItem('ratings');
  
  // Clear cart
  state.cart = [];
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartUI();
  
  closeModal();
  
  // Show success message
  const success = document.createElement('div');
  success.innerHTML = `
    <div style="text-align:center">
      <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">✓</div>
      <h3 style="margin:0 0 8px">Demo Data Cleared!</h3>
      <p style="color:var(--muted);margin:0">All orders, ratings, and cart data have been removed.</p>
    </div>
  `;
  showModal(success);
  setTimeout(() => {
    closeModal();
    location.reload();
  }, 2000);
}

