/**
 * Open order statistics modal for admin
 * This function calculates and displays various statistics about orders
 */
function openOrderStats() {
  if (!isAdmin()) {
    alert('Access denied. Admin privileges required.');
    return;
  }
  
  // Get all orders from localStorage
  const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  if (allOrders.length === 0) {
    const body = document.createElement('div');
    body.innerHTML = `
      <div style="text-align:center;margin-bottom:20px">
        <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">📊</div>
        <h2 style="margin:0 0 8px;color:#0f1724">Order Statistics</h2>
        <p style="color:var(--muted);margin:0;font-size:14px">System-wide order analytics</p>
      </div>
      
      <div style="text-align:center;padding:40px 20px">
        <div style="font-size:48px;margin-bottom:16px;opacity:0.3">📊</div>
        <h3 style="margin:0 0 8px;color:#0f1724">No Orders Yet</h3>
        <p style="color:var(--muted);margin:0">Statistics will appear once customers start placing orders.</p>
      </div>
    `;
    showModal(body);
    return;
  }
  
  // Calculate statistics
  const stats = calculateOrderStats(allOrders);
  
  const body = document.createElement('div');
  body.innerHTML = `
    <div style="text-align:center;margin-bottom:20px">
      <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">📊</div>
      <h2 style="margin:0 0 8px;color:#0f1724">Order Statistics</h2>
      <p style="color:var(--muted);margin:0;font-size:14px">System-wide order analytics</p>
    </div>
    
    <!-- Summary Cards -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px">
      <div style="background:linear-gradient(135deg,#00a896,#0a66c2);padding:20px;border-radius:12px;color:white;text-align:center">
        <div style="font-size:32px;font-weight:700;margin-bottom:4px">${stats.totalOrders}</div>
        <div style="font-size:14px;opacity:0.9">Total Orders</div>
      </div>
      
      <div style="background:linear-gradient(135deg,#10b981,#059669);padding:20px;border-radius:12px;color:white;text-align:center">
        <div style="font-size:32px;font-weight:700;margin-bottom:4px">${formatCurrency(stats.totalRevenue)}</div>
        <div style="font-size:14px;opacity:0.9">Total Revenue</div>
      </div>
      
      <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:20px;border-radius:12px;color:white;text-align:center">
        <div style="font-size:32px;font-weight:700;margin-bottom:4px">${formatCurrency(stats.averageOrderValue)}</div>
        <div style="font-size:14px;opacity:0.9">Average Order</div>
      </div>
      
      <div style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);padding:20px;border-radius:12px;color:white;text-align:center">
        <div style="font-size:32px;font-weight:700;margin-bottom:4px">${formatCurrency(stats.highestOrderValue)}</div>
        <div style="font-size:14px;opacity:0.9">Highest Order</div>
      </div>
    </div>
    
    <!-- Most Ordered Items -->
    <div style="background:#f8fafc;padding:20px;border-radius:12px;margin-bottom:20px">
      <h3 style="margin:0 0 16px;color:#0f1724;font-size:18px">🔥 Top 5 Most Ordered Items</h3>
      ${stats.mostOrderedItems.length > 0 ? `
        <div style="display:flex;flex-direction:column;gap:12px">
          ${stats.mostOrderedItems.slice(0, 5).map((item, index) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:white;border-radius:8px">
              <div style="display:flex;align-items:center;gap:12px">
                <div style="width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent-2));border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700">${index + 1}</div>
                <div>
                  <div style="font-weight:600;color:#0f1724">${item.name}</div>
                  <div style="font-size:13px;color:var(--muted)">Ordered ${item.quantity} times</div>
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700;color:var(--accent)">${formatCurrency(item.totalRevenue)}</div>
                <div style="font-size:12px;color:var(--muted)">Total Revenue</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : '<p style="color:var(--muted);text-align:center">No item data available</p>'}
    </div>
    
    <!-- Payment Method Breakdown -->
    <div style="background:#f8fafc;padding:20px;border-radius:12px;margin-bottom:20px">
      <h3 style="margin:0 0 16px;color:#0f1724;font-size:18px">💳 Payment Methods</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div style="background:white;padding:16px;border-radius:8px;text-align:center">
          <div style="font-size:24px;margin-bottom:8px">💳</div>
          <div style="font-size:28px;font-weight:700;color:var(--accent);margin-bottom:4px">${stats.paymentMethods.visa}</div>
          <div style="font-size:14px;color:var(--muted)">Card Payments</div>
          <div style="font-size:13px;color:var(--muted);margin-top:4px">${formatCurrency(stats.paymentRevenue.visa)}</div>
        </div>
        <div style="background:white;padding:16px;border-radius:8px;text-align:center">
          <div style="font-size:24px;margin-bottom:8px">💵</div>
          <div style="font-size:28px;font-weight:700;color:var(--success);margin-bottom:4px">${stats.paymentMethods.cash}</div>
          <div style="font-size:14px;color:var(--muted)">Cash on Delivery</div>
          <div style="font-size:13px;color:var(--muted);margin-top:4px">${formatCurrency(stats.paymentRevenue.cash)}</div>
        </div>
      </div>
    </div>
    
    <!-- Order Status Breakdown -->
    <div style="background:#f8fafc;padding:20px;border-radius:12px">
      <h3 style="margin:0 0 16px;color:#0f1724;font-size:18px">📋 Order Status</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:16px">
        ${Object.entries(stats.orderStatus).map(([status, count]) => {
          const colors = {
            'pending': { bg: '#fef3c7', text: '#92400e' },
            'approved': { bg: '#dbeafe', text: '#1e40af' },
            'preparing': { bg: '#e0e7ff', text: '#4338ca' },
            'arrived': { bg: '#d1fae5', text: '#065f46' },
            'delivered': { bg: '#d1fae5', text: '#065f46' },
            'cancelled': { bg: '#fee2e2', text: '#991b1b' }
          };
          const color = colors[status] || { bg: '#f3f4f6', text: '#374151' };
          return `
            <div style="background:${color.bg};padding:16px;border-radius:8px;text-align:center">
              <div style="font-size:24px;font-weight:700;color:${color.text};margin-bottom:4px">${count}</div>
              <div style="font-size:12px;color:${color.text};text-transform:capitalize;font-weight:600">${status}</div>
            </div>
          `;
        }).join('')}
      </div>
      ${stats.orderStatus.pending && stats.orderStatus.pending > 0 ? `
        <button type="button" class="btn" id="go-to-approval" style="width:100%;background:linear-gradient(135deg,#10b981,#059669)">
          ✅ Approve Pending Orders (${stats.orderStatus.pending})
        </button>
      ` : ''}
    </div>
    
    <!-- Recent Orders -->
    <div style="background:#f8fafc;padding:20px;border-radius:12px;margin-top:20px">
      <h3 style="margin:0 0 16px;color:#0f1724;font-size:18px">🕐 Recent Orders (Last 5)</h3>
      <div style="max-height:300px;overflow-y:auto">
        ${stats.recentOrders.slice(0, 5).map(order => `
          <div style="background:white;padding:12px;border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-weight:600;color:#0f1724">Order #${order.id}</div>
              <div style="font-size:13px;color:var(--muted)">${order.itemCount} items • ${order.paymentMethod === 'visa' ? '💳 Card' : '💵 Cash'}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:700;color:var(--accent)">${formatCurrency(order.total)}</div>
              <div style="font-size:12px;color:var(--muted)">${new Date(order.orderDate).toLocaleDateString()}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  showModal(body);
  
  // Add event listener for approval button
  const approvalBtn = document.getElementById('go-to-approval');
  if (approvalBtn) {
    approvalBtn.addEventListener('click', () => {
      closeModal();
      showOrderApproval();
    });
  }
}

/**
 * Calculate order statistics from orders array
 * @param {Array} orders - Array of order objects
 * @returns {Object} Statistics object
 */
function calculateOrderStats(orders) {
  const stats = {
    totalOrders: orders.length,
    totalRevenue: 0,
    averageOrderValue: 0,
    highestOrderValue: 0,
    mostOrderedItems: [],
    paymentMethods: { visa: 0, cash: 0 },
    paymentRevenue: { visa: 0, cash: 0 },
    orderStatus: {},
    recentOrders: []
  };
  
  // Item tracking
  const itemMap = new Map();
  
  orders.forEach(order => {
    // Total revenue
    stats.totalRevenue += order.total || 0;
    
    // Highest order value
    if (order.total > stats.highestOrderValue) {
      stats.highestOrderValue = order.total;
    }
    
    // Payment methods
    if (order.paymentMethod === 'visa') {
      stats.paymentMethods.visa++;
      stats.paymentRevenue.visa += order.total || 0;
    } else if (order.paymentMethod === 'cash') {
      stats.paymentMethods.cash++;
      stats.paymentRevenue.cash += order.total || 0;
    }
    
    // Order status
    const status = order.status || 'pending';
    stats.orderStatus[status] = (stats.orderStatus[status] || 0) + 1;
    
    // Track items
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const key = item.name;
        if (itemMap.has(key)) {
          const existing = itemMap.get(key);
          existing.quantity += item.qty || 1;
          existing.totalRevenue += (item.price || 0) * (item.qty || 1);
        } else {
          itemMap.set(key, {
            name: item.name,
            quantity: item.qty || 1,
            totalRevenue: (item.price || 0) * (item.qty || 1)
          });
        }
      });
    }
    
    // Recent orders
    stats.recentOrders.push({
      id: order.id,
      total: order.total,
      itemCount: order.items ? order.items.length : 0,
      paymentMethod: order.paymentMethod,
      orderDate: order.orderDate || Date.now()
    });
  });
  
  // Calculate average
  stats.averageOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;
  
  // Convert item map to sorted array
  stats.mostOrderedItems = Array.from(itemMap.values())
    .sort((a, b) => b.quantity - a.quantity);
  
  // Sort recent orders by date
  stats.recentOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  
  return stats;
}