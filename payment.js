/**
 * Show payment method selection (Visa / Cash)
 */
function showPaymentMethods() {
  // Check if user is logged in
  if (!state.currentUser) {
    openLogin(true);
    return;
  }
  
  const body = document.createElement('div');
  body.innerHTML = `
    <h3>Select payment method</h3>
    <div style="display:flex;gap:12px;margin-top:12px">
      <button type="button" id="pay-visa" class="btn">Pay with Visa</button>
      <button type="button" id="pay-cash" class="btn ghost">Cash on Delivery</button>
    </div>
    <p style="color:var(--muted);margin-top:10px">Choose Visa for card payment, or Cash to pay on delivery.</p>
  `;
  showModal(body);
  
  document.getElementById('pay-visa').addEventListener('click', () => {
    state.paymentMethod = 'visa';
    showPayment();
  });
  document.getElementById('pay-cash').addEventListener('click', () => {
    state.paymentMethod = 'cash';
    showCashPayment();
  });
}

/**
 * Show cash on delivery payment form
 */
function showCashPayment() {
  const body = document.createElement('div');
  body.innerHTML = `
    <h3>Cash on Delivery</h3>
    <p style="color:var(--muted)">Enter contact details and delivery address. Driver will collect cash.</p>
    <label>Full name</label>
    <input id="cod-name" type="text" placeholder="Full name" value="${state.currentUser.fname} ${state.currentUser.lname}">
    <label>Phone</label>
    <input id="cod-phone" type="tel" placeholder="0100xxxxxxx">
    <label>Address</label>
    <input id="cod-address" type="text" placeholder="Street, City" value="${state.currentUser.address || ''}">
  `;
  
  const footer = modal.querySelector('#modal-footer');
  if (footer) {
    footer.hidden = false;
    footer.innerHTML = '';
    const placeBtn = document.createElement('button');
    placeBtn.type = 'button';
    placeBtn.className = 'btn';
    placeBtn.textContent = 'Place order (Cash)';
    footer.appendChild(placeBtn);
    
    placeBtn.addEventListener('click', () => {
      const name = document.getElementById('cod-name').value.trim();
      const phone = document.getElementById('cod-phone').value.trim();
      const addr = document.getElementById('cod-address').value.trim();
      
      if (!name || !phone || !addr) {
        alert('Please fill contact and address');
        return;
      }
      
      const order = {
        id: 'COD' + Date.now(),
        items: state.cart,
        address: { name, phone, addr },
        total: state.cart.reduce((sum, item) => sum + item.qty * item.price, 0),
        paymentMethod: 'cash',
        userEmail: state.currentUser.email,
        customer: `${state.currentUser.fname} ${state.currentUser.lname}`,
        orderDate: new Date().toISOString(),
        timestamp: Date.now(),
        status: 'pending'
      };
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      state.cart = [];
      localStorage.setItem('cart', JSON.stringify(state.cart));
      updateCartUI();
      closeModal();
      
      const success = document.createElement('div');
      success.innerHTML = `
        <div style="text-align:center">
          <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#00a896,#0a66c2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">✓</div>
          <h3 style="margin:0 0 8px">Order Placed!</h3>
          <p style="color:var(--muted);margin:0">Order <strong>${order.id}</strong> placed. Pay <strong>${formatCurrency(order.total)}</strong> on delivery.</p>
        </div>
      `;
      showModal(success);
      
      const f = modal.querySelector('#modal-footer');
      if (f) {
        f.hidden = false;
        f.innerHTML = '';
        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'btn';
        okBtn.textContent = 'Done';
        okBtn.addEventListener('click', () => closeModal());
        f.appendChild(okBtn);
      }
    });
  }
  
  showModal(body);
}

/**
 * Show checkout form for address
 */
function showCheckout() {
  closeModal();
  const form = document.createElement('div');
  form.innerHTML = `
    <h3>Delivery Address</h3>
    <label>Full name</label>
    <input id="addr-name" type="text" placeholder="Jane Doe" value="${state.currentUser.fname} ${state.currentUser.lname}">
    <label>Street address</label>
    <input id="addr-line" type="text" placeholder="123 Main St" value="${state.currentUser.address || ''}">
    <label>City</label>
    <input id="addr-city" type="text" placeholder="City">
    <label>Phone</label>
    <input id="addr-phone" type="tel" placeholder="(555) 555-5555">
    <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">
      <button type="button" class="btn" id="to-payment">Continue to Payment</button>
    </div>
  `;
  showModal(form);
  
  document.getElementById('to-payment').addEventListener('click', () => {
    const name = document.getElementById('addr-name').value.trim();
    const line = document.getElementById('addr-line').value.trim();
    if (!name || !line) {
      alert('Please enter name and address');
      return;
    }
    const address = {
      name,
      line,
      city: document.getElementById('addr-city').value,
      phone: document.getElementById('addr-phone').value
    };
    localStorage.setItem('lastAddress', JSON.stringify(address));
    showPayment();
  });
}

/**
 * Show payment form for card payment
 */
function showPayment() {
  const el = document.createElement('div');
  el.innerHTML = `
    <h3>Payment</h3>
    <div class="payment-grid">
      <div style="flex:1">
        <label>Cardholder name</label>
        <input id="card-name" type="text" placeholder="Jane Doe" value="${state.currentUser.fname} ${state.currentUser.lname}">
        <label>Card number</label>
        <input id="card-number" type="text" placeholder="4242 4242 4242 4242">
        <div class="form-row">
          <div style="flex:1">
            <label>Expiry</label>
            <input id="card-exp" type="text" placeholder="MM/YY">
          </div>
          <div style="width:120px">
            <label>CVC</label>
            <input id="card-cvc" type="text" placeholder="123">
          </div>
        </div>
      </div>
      <aside class="payment-summary">
        <h4>Order Summary</h4>
        <div id="summary-items" style="max-height:160px;overflow:auto;margin-bottom:8px"></div>
        <div style="display:flex;justify-content:space-between;font-weight:700">
          <div>Total</div>
          <div id="summary-total"></div>
        </div>
      </aside>
    </div>
  `;
  showModal(el);
  
  // Populate summary
  const sumBox = document.getElementById('summary-items');
  let total = 0;
  
  if (state.cart.length === 0) {
    sumBox.innerHTML = '<div>Your cart is empty</div>';
  } else {
    state.cart.forEach(it => {
      total += it.price * it.qty;
      const r = document.createElement('div');
      r.style.display = 'flex';
      r.style.justifyContent = 'space-between';
      r.style.marginBottom = '6px';
      r.innerHTML = `
        <div>${it.name} × ${it.qty}</div>
        <div>${formatCurrency(it.price * it.qty)}</div>
      `;
      sumBox.appendChild(r);
    });
  }
  
  document.getElementById('summary-total').textContent = formatCurrency(total);
  
  // Footer pay button
  const footer = modal.querySelector('#modal-footer');
  if (footer) {
    footer.hidden = false;
    footer.innerHTML = '';
    const pay = document.createElement('button');
    pay.type = 'button';
    pay.className = 'btn';
    pay.id = 'pay-now';
    pay.textContent = 'Pay now';
    footer.appendChild(pay);
  }
  
  const payBtn = document.getElementById('pay-now');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      const num = document.getElementById('card-number').value.replace(/\s+/g, '');
      if (!/^[0-9]{13,19}$/.test(num)) {
        alert('Enter a valid card number (digits only)');
        return;
      }
      
      // Show processing state
      payBtn.disabled = true;
      payBtn.textContent = 'Processing...';
      
      setTimeout(() => {
        const order = {
          id: 'ORD' + Date.now(),
          items: state.cart,
          address: JSON.parse(localStorage.getItem('lastAddress') || '{}'),
          total,
          paymentMethod: 'visa',
          userEmail: state.currentUser.email,
          customer: `${state.currentUser.fname} ${state.currentUser.lname}`,
          orderDate: new Date().toISOString(),
          timestamp: Date.now(),
          status: 'pending'
        };
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        state.cart = [];
        localStorage.setItem('cart', JSON.stringify(state.cart));
        updateCartUI();
        
        // Show success dialog
        const success = document.createElement('div');
        success.innerHTML = `
          <div style="text-align:center">
            <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#00a896,#0a66c2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">✓</div>
            <h3 style="margin:0 0 8px">Payment Successful!</h3>
            <p style="color:var(--muted);margin:0">Order <strong>${order.id}</strong> placed. Total: <strong>${formatCurrency(order.total)}</strong></p>
            <p style="color:var(--muted);margin:8px 0 0;font-size:13px">This is a demo. No real payment was processed.</p>
          </div>
        `;
        closeModal();
        showModal(success);
        
        // Clear footer and set a close button
        const f = modal.querySelector('#modal-footer');
        if (f) {
          f.hidden = false;
          f.innerHTML = '';
          const ok = document.createElement('button');
          ok.type = 'button';
          ok.className = 'btn';
          ok.textContent = 'Done';
          ok.addEventListener('click', () => {
            closeModal();
          });
          f.appendChild(ok);
        }
      }, 1200);
    });
  }
}