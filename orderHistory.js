/**
 * Get user's order history
 */
function getUserOrders() {
  if (!state.currentUser) return [];
  
  const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  return allOrders.filter(order => 
    order.address && order.address.name && 
    state.currentUser.email === order.userEmail
  ).reverse(); // Most recent first
}

/**
 * Open order history modal
 */
function openOrderHistory() {
  if (!state.currentUser) {
    openLogin(true);
    return;
  }
  
  const orders = getUserOrders();
  
  const body = document.createElement('div');
  body.innerHTML = `
    <div style="text-align:center;margin-bottom:20px">
      <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,var(--accent),var(--accent-2));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">📋</div>
      <h2 style="margin:0 0 8px;color:#0f1724">Order History</h2>
      <p style="color:var(--muted);margin:0;font-size:14px">View your past orders</p>
    </div>
    
    ${orders.length === 0 ? `
      <div style="text-align:center;padding:40px 20px">
        <div style="font-size:48px;margin-bottom:16px;opacity:0.3">🛒</div>
        <h3 style="margin:0 0 8px;color:#0f1724">No Orders Yet</h3>
        <p style="color:var(--muted);margin:0">Start ordering delicious food to see your history here!</p>
      </div>
    ` : `
      <div style="max-height:500px;overflow-y:auto">
        ${orders.map(order => `
          <div style="background:#f8fafc;padding:16px;border-radius:12px;margin-bottom:12px;border:2px solid #eef3f8">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px">
              <div>
                <strong style="color:#0f1724;font-size:16px">Order #${order.id}</strong>
                <p style="margin:4px 0 0;color:var(--muted);font-size:13px">
                  ${new Date(order.orderDate || Date.now()).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div style="text-align:right">
                <div style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;background:${
                  order.status === 'delivered' ? '#d1fae5' : 
                  order.status === 'cancelled' ? '#fee2e2' : '#fef3c7'
                };color:${
                  order.status === 'delivered' ? '#065f46' : 
                  order.status === 'cancelled' ? '#991b1b' : '#92400e'
                }">
                  ${order.status ? order.status.toUpperCase() : 'PENDING'}
                </div>
                <p style="margin:8px 0 0;color:var(--accent);font-weight:700;font-size:18px">
                  ${formatCurrency(order.total)}
                </p>
              </div>
            </div>
            
            <div style="border-top:1px solid #e5e7eb;padding-top:12px;margin-top:12px">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                <span style="font-weight:600;color:#0f1724">Payment:</span>
                <span style="color:var(--muted)">${order.paymentMethod === 'visa' ? '💳 Card' : '💵 Cash on Delivery'}</span>
              </div>
              
              ${order.address ? `
                <div style="display:flex;align-items:start;gap:6px;margin-bottom:8px">
                  <span style="font-weight:600;color:#0f1724">Delivery to:</span>
                  <div style="color:var(--muted);flex:1">
                    <div>${order.address.name}</div>
                    ${order.address.addr ? `<div style="font-size:13px">${order.address.addr}</div>` : ''}
                    ${order.address.phone ? `<div style="font-size:13px">📞 ${order.address.phone}</div>` : ''}
                  </div>
                </div>
              ` : ''}
              
              <div style="margin-top:12px">
                <div style="font-weight:600;color:#0f1724;margin-bottom:6px">Items:</div>
                ${order.items.map(item => `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:14px">
                    <div style="color:#556779">
                      ${item.name} <span style="color:var(--muted)">× ${item.qty}</span>
                    </div>
                    <div style="color:#0f1724;font-weight:500">${formatCurrency(item.price * item.qty)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div style="margin-top:12px;display:flex;gap:8px">
              <button class="btn small" onclick="reorderItems('${order.id}')">🔄 Reorder</button>
              ${order.status === 'delivered' ? `
                <button class="btn small ghost" onclick="rateOrderItems('${order.id}')">⭐ Rate Items</button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `}
  `;
  
  showModal(body);
}

/**
 * Reorder items from a previous order
 */
function reorderItems(orderId) {
  const orders = getUserOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    alert('Order not found');
    return;
  }
  
  // Add all items to cart
  order.items.forEach(item => {
    const existing = state.cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty += item.qty;
    } else {
      state.cart.push({ ...item });
    }
  });
  
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartUI();
  closeModal();
  
  const success = document.createElement('div');
  success.innerHTML = `
    <div style="text-align:center">
      <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#00a896,#0a66c2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">✓</div>
      <h3 style="margin:0 0 8px">Items Added to Cart!</h3>
      <p style="color:var(--muted);margin:0">${order.items.length} items from order #${order.id} have been added to your cart.</p>
    </div>
  `;
  showModal(success);
  setTimeout(() => closeModal(), 2000);
}

/**
 * Open rating interface for order items
 */
function rateOrderItems(orderId) {
  const orders = getUserOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    alert('Order not found');
    return;
  }
  
  closeModal();
  
  // Show rating options for each item
  const body = document.createElement('div');
  body.innerHTML = `
    <h3 style="margin:0 0 16px">Rate Your Order</h3>
    <p style="color:var(--muted);margin:0 0 20px;font-size:14px">How was your experience with these items?</p>
    
    <div style="display:grid;gap:12px">
      ${order.items.map(item => `
        <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #eef3f8">
          <div style="font-weight:600;color:#0f1724;margin-bottom:8px">${item.name}</div>
          <button class="btn small" onclick="openRatingModal({id:'${item.id}',name:'${item.name}',desc:'${item.desc}',price:${item.price}})">
            ${hasUserRated(item.id) ? '⭐ Update Rating' : '⭐ Rate This Item'}
          </button>
        </div>
      `).join('')}
    </div>
  `;
  
  showModal(body);
}