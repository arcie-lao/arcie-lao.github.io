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
      if (data.role == 'admin') {
          document.getElementById('admin-section').classList.remove('hidden');
      }
      document.getElementById('usage-section').classList.remove('hidden');
  } else {
      alert(data.error);
  }
}

// Get the current API usage count
async function getUsage() {
  const response = await fetch(`${BASE_URL}admin/usage`, {
      method: 'GET',
      credentials: 'include'
  });

  const data = await response.json();
  if (response.ok) {
      document.getElementById('usage-output').innerText = `Current Usage: ${data.usage.api_usage}`;
  } else {
      alert(data.error);
  }
}

async function getUsers() {
  const response = await fetch(`${BASE_URL}admin/users`, {
      method: 'GET',
      credentials: 'include'
  });

  const data = await response.json();
  if (response.ok) {
    for (let i = 0; i < data.users.length; i++) {
        const user = data.users[i];
        const userElement = document.createElement('div');
        userElement.innerText = `User ${i + 1}: ${user.email}, Role: ${user.role}, API Usage: ${user.api_usage}`;
        document.getElementById('users-output').appendChild(userElement);
    }
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
  document.getElementById('admin-section').classList.add('hidden');
  document.getElementById('usage-section').classList.add('hidden');
  document.getElementById('usage-output').innerText = '';
  document.getElementById('login-section').classList.remove('hidden');
  document.getElementById('register-section').classList.remove('hidden');
}
