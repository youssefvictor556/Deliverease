/**
 * Open login/register modal
 * @param {boolean} required - If true, indicates user must login
 * @param {string} mode - 'login' or 'register'
 */
function openLogin(required = false, mode = 'login') {
  if (!modal || !modalBody) return;
  
  const title = modal.querySelector('#modal-title');
  if (title) title.textContent = mode === 'register' ? 'Create Account' : (required ? 'Please Sign In to Continue' : 'Sign In');
  
  const body = document.createElement('div');
  
  if (mode === 'register') {
    body.innerHTML = `
      <div style="text-align:center;margin-bottom:20px">
        <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,var(--accent),var(--accent-2));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">👤</div>
        <h2 style="margin:0 0 8px;color:#0f1724">Create Your Account</h2>
        <p style="color:var(--muted);margin:0;font-size:14px">Join us to start ordering delicious food</p>
      </div>
      <label style="font-weight:600;margin-bottom:8px;display:block">First Name</label>
      <input id="auth-fname" type="text" placeholder="John" autofocus style="margin-bottom:16px">
      <label style="font-weight:600;margin-bottom:8px;display:block">Last Name</label>
      <input id="auth-lname" type="text" placeholder="Doe" style="margin-bottom:16px">
      <label style="font-weight:600;margin-bottom:8px;display:block">Email Address</label>
      <input id="auth-email" type="email" placeholder="your.email@example.com" style="margin-bottom:16px">
      <label style="font-weight:600;margin-bottom:8px;display:block">Password</label>
      <input id="auth-pass" type="password" placeholder="At least 6 characters" style="margin-bottom:16px">
      <label style="font-weight:600;margin-bottom:8px;display:block">Address</label>
      <input id="auth-address" type="text" placeholder="123 Main St, City" style="margin-bottom:16px">
      <p style="text-align:center;color:var(--muted);font-size:13px;margin-top:16px">
        Already have an account? <a href="#" id="switch-to-login" style="color:var(--accent);font-weight:600">Sign In</a>
      </p>
    `;
  } else {
    body.innerHTML = `
      <div style="text-align:center;margin-bottom:20px">
        <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,var(--accent),var(--accent-2));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">👤</div>
        <h2 style="margin:0 0 8px;color:#0f1724">${required ? 'Welcome to DeliverEase' : 'Sign In'}</h2>
        <p style="color:var(--muted);margin:0;font-size:14px">${required ? 'Sign in to start ordering delicious food' : 'Access your account'}</p>
      </div>
      <label style="font-weight:600;margin-bottom:8px;display:block">Email Address</label>
      <input id="auth-email" type="email" placeholder="your.email@example.com" autofocus style="margin-bottom:16px">
      <label style="font-weight:600;margin-bottom:8px;display:block">Password</label>
      <input id="auth-pass" type="password" placeholder="Enter your password" style="margin-bottom:16px">
      ${required ? '<div style="background:#fff3cd;padding:12px;border-radius:8px;margin-top:12px;border:1px solid #ffc107"><p style="margin:0;color:#856404;font-size:13px">⚠️ You must sign in to add items to cart and place orders.</p></div>' : ''}
      <p style="text-align:center;color:var(--muted);font-size:13px;margin-top:16px">
        Don't have an account? <a href="#" id="switch-to-register" style="color:var(--accent);font-weight:600">Create Account</a>
      </p>
    `;
  }
  
  const footer = modal.querySelector('#modal-footer');
  if (footer) {
    footer.hidden = false;
    footer.innerHTML = '';
  }
  
  showModal(body);
  
  // Add switch links
  const switchToRegister = document.getElementById('switch-to-register');
  const switchToLogin = document.getElementById('switch-to-login');
  
  if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      openLogin(required, 'register');
    });
  }
  
  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      openLogin(required, 'login');
    });
  }
  
  if (footer) {
    if (mode === 'register') {
      const reg = document.createElement('button');
      reg.type = 'button';
      reg.className = 'btn';
      reg.textContent = 'Create Account';
      footer.appendChild(reg);
      
      reg.addEventListener('click', handleRegister);
    } else {
      const log = document.createElement('button');
      log.type = 'button';
      log.className = 'btn';
      log.textContent = 'Sign In';
      footer.appendChild(log);
      
      log.addEventListener('click', handleLogin);
    }
  }
}

/**
 * Handle registration
 */
function handleRegister() {
  try {
    const fname = document.getElementById('auth-fname').value.trim();
    const lname = document.getElementById('auth-lname').value.trim();
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-pass').value;
    const address = document.getElementById('auth-address').value.trim();
    
    if (!fname || !lname || !email || !pass || !address) {
      alert('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    if (pass.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
      alert('This email is already registered. Please sign in instead.');
      return;
    }
    
    users[email] = { 
      fname, 
      lname, 
      password: pass, 
      address,
      userType: 'customer',
      created: Date.now() 
    };
    localStorage.setItem('users', JSON.stringify(users));
    
    state.currentUser = { email, fname, lname, address, userType: 'customer' };
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    closeModal();
    
    updateLoginButton();
    
    // Show success message
    const success = document.createElement('div');
    success.innerHTML = `
      <div style="text-align:center">
        <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#00a896,#0a66c2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">✓</div>
        <h3 style="margin:0 0 8px">Registration Successful!</h3>
        <p style="color:var(--muted);margin:0">Welcome, ${fname}! You're now logged in.</p>
      </div>
    `;
    showModal(success);
    setTimeout(() => closeModal(), 2000);
  } catch (err) {
    console.error(err);
    alert('Registration error. Please try again.');
  }
}

/**
 * Handle login
 */
function handleLogin() {
  try {
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-pass').value;
    
    if (!email || !pass) {
      alert('Please enter both email and password');
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[email] && users[email].password === pass) {
      const userData = users[email];
      state.currentUser = { 
        email, 
        fname: userData.fname, 
        lname: userData.lname, 
        address: userData.address,
        userType: userData.userType || 'customer'
      };
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
      closeModal();
      
      updateLoginButton();
      
      // Show success message
      const success = document.createElement('div');
      success.innerHTML = `
        <div style="text-align:center">
          <div style="width:60px;height:60px;margin:0 auto 16px;background:linear-gradient(135deg,#00a896,#0a66c2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:white">✓</div>
          <h3 style="margin:0 0 8px">Login Successful!</h3>
          <p style="color:var(--muted);margin:0">Welcome back, ${userData.fname}!</p>
        </div>
      `;
      showModal(success);
      setTimeout(() => closeModal(), 2000);
      
      // Refresh UI for both admin and customer
      renderRestaurants();
      updateCartUI();
    } else {
      alert('Invalid email or password. Please try again.');
    }
  } catch (err) {
    console.error(err);
    alert('Login error. Please try again.');
  }
}

/**
 * Update login button based on user state
 */
function updateLoginButton() {
  const loginBtn = document.getElementById('btn-login');
  const ordersBtn = document.getElementById('btn-orders');
  
  if (state.currentUser) {
    loginBtn.textContent = 'Logout';
    loginBtn.onclick = () => {
      state.currentUser = null;
      localStorage.removeItem('currentUser');
      state.cart = [];
      localStorage.setItem('cart', JSON.stringify(state.cart));
      updateCartUI();
      loginBtn.textContent = 'Log in';
      loginBtn.onclick = () => openLogin(false, 'login');
      if (ordersBtn) ordersBtn.style.display = 'none';
      alert('Logged out successfully');
      renderRestaurants();
    };
    
    // Show appropriate button based on user type
    if (ordersBtn) {
      if (state.currentUser.userType === 'admin') {
        // Admin sees "Order Stats" button
        ordersBtn.textContent = '📊 Order Stats';
        ordersBtn.style.display = 'inline-block';
        ordersBtn.onclick = openOrderStats;
      } else {
        // Customer sees "Orders" button
        ordersBtn.textContent = '📋 Orders';
        ordersBtn.style.display = 'inline-block';
        ordersBtn.onclick = openOrderHistory;
      }
    }
  } else {
    loginBtn.textContent = 'Log in';
    loginBtn.onclick = () => openLogin(false, 'login');
    if (ordersBtn) ordersBtn.style.display = 'none';
  }
}

/**
 * Initialize admin account
 */
function initializeAdminAccount() {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const adminEmail = 'admin@gmail.com';
  
  if (!users[adminEmail]) {
    users[adminEmail] = {
      fname: 'admin',
      lname: 'admin',
      password: 'admin123',
      address: 'admin street',
      userType: 'admin',
      created: Date.now()
    };
    localStorage.setItem('users', JSON.stringify(users));
  }
}

// Initialize admin on load
initializeAdminAccount();