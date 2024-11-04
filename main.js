const BASE_URL = 'https://arcielao.com/4537_project/';

// Register a new user
async function register() {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const response = await fetch(`${BASE_URL}auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  alert(data.message || data.error);
}

// Log in a user
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch(`${BASE_URL}auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
  });

  const data = await response.json();
  if (response.ok) {
      alert('Login successful');
      document.getElementById('login-section').classList.add('hidden');
      document.getElementById('register-section').classList.add('hidden');
      document.getElementById('usage-section').classList.remove('hidden');
  } else {
      alert(data.error);
  }
}

// Get the current API usage count
async function getUsage() {
  const response = await axios.get(`${BASE_URL}admin/usage`, { withCredentials: true });

  const data = response.data;
  if (response.status === 200) {
      document.getElementById('usage-output').innerText = `Current Usage: ${data.usage.api_usage}`;
  } else {
      alert(data.error);
  }
}

// Increment the API usage count
async function incrementUsage() {
  const response = await fetch(`${BASE_URL}admin/increment-usage`, {
      method: 'POST',
  });

  const data = await response.json();
  if (response.ok) {
      alert(data.message);
      getUsage(); // Refresh the usage count
  } else {
      alert(data.error);
  }
}

// Log out the user
async function logout() {
  const response = await fetch(`${BASE_URL}auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  const data = await response.json();
  alert(data.message);
  document.getElementById('usage-section').classList.add('hidden');
  document.getElementById('login-section').classList.remove('hidden');
  document.getElementById('register-section').classList.remove('hidden');
}
