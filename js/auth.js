

let authMode = 'signin';

function openAuthModal() {
  if (currentUser) { signOut(); return; }
  document.getElementById('auth-modal').classList.add('open');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('open');
}

function toggleAuthMode() {
  authMode = authMode === 'signin' ? 'signup' : 'signin';
  const isSignup = authMode === 'signup';

  document.getElementById('modal-title').textContent  = isSignup ? 'Create account' : 'Welcome back';
  document.getElementById('modal-sub').textContent    = isSignup
    ? 'Join LUMIÈRE for a curated experience.'
    : 'Sign in to track your orders and save your wishlist.';
  document.getElementById('auth-submit').textContent  = isSignup ? 'Create Account' : 'Sign In';
  document.getElementById('toggle-text').textContent  = isSignup ? 'Already have an account?' : "Don't have an account?";
  document.getElementById('name-group').style.display = isSignup ? 'block' : 'none';
  document.getElementById('auth-error').style.display = 'none';
}

async function submitAuth() {
  if (!sb) {
    showToast('Supabase not configured. Add credentials to js/config.js');
    closeAuthModal();
    return;
  }

  const email    = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const errEl    = document.getElementById('auth-error');
  errEl.style.display = 'none';

  if (!email || !password) {
    errEl.textContent   = 'Please fill in all fields.';
    errEl.style.display = 'block';
    return;
  }

  let result;
  if (authMode === 'signin') {
    result = await sb.auth.signInWithPassword({ email, password });
  } else {
    const name = document.getElementById('auth-name').value.trim();
    result = await sb.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    });
  }

  if (result.error) {
    
    const msg = result.error.message || 'Authentication failed.';
    if (msg === 'Failed to fetch') {
      errEl.textContent = 'Unable to connect to Supabase.\n' +
        '1) Check your network connection.\n' +
        '2) Make sure you are running a local server (not file://).\n' +
        '3) Confirm SUPABASE_URL and SUPABASE_ANON_KEY in js/config.js are correct.';
    } else if (msg.toLowerCase().includes('invalid login credentials')) {
      errEl.textContent = 'Invalid login credentials.\n' +
        'If you just created an account, verify your email in the link sent to your inbox, then sign in again.';
    } else {
      errEl.textContent = msg;
    }
    errEl.style.whiteSpace = 'pre-wrap';
    errEl.style.display = 'block';
  } else {
    if (authMode === 'signin') {
      closeAuthModal();
      showToast('Welcome back!');
    } else {
      
      authMode = 'signin';
      toggleAuthMode();
      errEl.textContent = 'Account created successfully!\n' +
        'Please check your email and verify your account before signing in.\n' +
        'Then use the same credentials on the Sign In form.';
      errEl.style.whiteSpace = 'pre-wrap';
      errEl.style.color = '#0a7';
      errEl.style.display = 'block';
      showToast('Signup success. Verify your email and sign in.');

      
      if (result?.data?.session) {
        closeAuthModal();
        showToast('Account created and signed in!');
      }
    }
  }
}

async function signOut() {
  if (sb) await sb.auth.signOut();
  currentUser = null;
  updateAuthUI();
  showToast('Signed out successfully.');
}

function updateAuthUI() {
  const btn = document.getElementById('auth-btn');
  if (currentUser) {
    const name = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
    btn.textContent = `Hi, ${name.split(' ')[0]} · Sign Out`;
  } else {
    btn.textContent = 'Sign In';
  }
}
