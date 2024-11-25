const BASE_URL = 'https://arcielao.com/4537_project/';
// const BASE_URL = 'http://localhost:3000/4537_project/';

window.onload = async function () {
  try {
      const response = await fetch(`${BASE_URL}auth/session`, {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
      });

      const data = await response.json();

      if (response.ok) {
          // Session is valid, update UI based on the user role
          updateUI(data.role);
      } else {
          showLogin(); // Invalid session, show login form
      }
  } catch (err) {
      console.error('Error validating session:', err);
      showLogin(); // Handle errors by showing the login page
  }
};

async function getApiStats() {
    try {
        const response = await fetch(`${BASE_URL}admin/apiUsageStats`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            const statsElement = document.getElementById('api-stats-output').getElementsByTagName('tbody')[0];
            statsElement.innerHTML = ''; // Clear previous rows

            for (let i = 0; i < data.stats.length; i++) {
                const stat = data.stats[i];
                const row = statsElement.insertRow();
                const methodCell = row.insertCell(0);
                methodCell.textContent = stat.method;
                const endpointCell = row.insertCell(1);
                endpointCell.textContent = stat.endpoint;
                const requestsCell = row.insertCell(2);
                requestsCell.textContent = stat.requestCount;
            }
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error getting API stats:", error);
        alert("An error occurred while getting API stats.");
    }
}

async function changePassword() {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    
    if (!oldPassword || !newPassword) {
        alert("Please fill out all fields.");
        return;
    }
    
    try {
        const response = await fetch(`${BASE_URL}auth/changePassword`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword, newPassword }),
            credentials: 'include'
        });
    
        const data = await response.json();
        alert(data.message || data.error);
    } catch (error) {
        console.error("Error changing password:", error);
        alert("An error occurred while changing password.");
    }
}

function getCookie(name) {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  for (let cookie of cookies) {
      if (cookie.startsWith(`${name}=`)) {
          return cookie.substring(name.length + 1);
      }
  }
  return null;
}

// Register a new user
async function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        alert(data.message || data.error);

        if (response.ok) {
            showLogin(); // Redirect to login after successful registration
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred during registration.");
    }
}

// Log in a user
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful");
            updateUI(data.role); // Pass the user role to update the UI
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login.");
    }
}

// Log out the user
async function logout() {
    try {
        const response = await fetch(`${BASE_URL}auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();
        alert(data.message);

        // Reset UI
        document.getElementById('login-section').classList.remove('hidden');
        document.getElementById('register-section').classList.add('hidden');
        document.getElementById('change-password-section').classList.add('hidden');
        document.getElementById('user-page').classList.add('hidden');
        document.getElementById('admin-page').classList.add('hidden');
    } catch (error) {
        console.error("Error during logout:", error);
        alert("An error occurred during logout.");
    }
}

async function deleteUser() {
    const email = document.getElementById('delete-email').value;
    try {
        const response = await fetch(`${BASE_URL}admin/deleteUserByEmail`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: document.getElementById('delete-email').value }),
            credentials: 'include'
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred while deleting user.");
    }
}

// Update the UI based on user role
function updateUI(role) {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('register-section').classList.add('hidden');

    if (role === "admin") {
        document.getElementById('admin-page').classList.remove('hidden');
        document.getElementById('user-page').classList.add('hidden');
        document.getElementById('change-password-section').classList.remove('hidden');
    } else {
        document.getElementById('user-page').classList.remove('hidden');
        document.getElementById('admin-page').classList.add('hidden');
        document.getElementById('change-password-section').classList.remove('hidden');
    }
}

// Show the registration form
function showRegister() {
    document.getElementById('register-section').classList.remove('hidden');
    document.getElementById('login-section').classList.add('hidden');
}

// Show the login form
function showLogin() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('register-section').classList.add('hidden');
}

let loadingInterval;

function startLoadingAnimation(elementId) {
    let dots = 0;
    const element = document.getElementById(elementId);
    loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4; // Cycle through 0, 1, 2, 3
        element.innerText = `Loading${'.'.repeat(dots)}`; // Update with dots
    }, 500); // Update every 500ms
}

function stopLoadingAnimation(elementId) {
    clearInterval(loadingInterval); // Stop the interval
    clearDiv(elementId);
}

// Upload audio file for analysis
async function uploadAudio(outputElementId, audioInputId) {
    clearDiv(outputElementId);
    const fileInput = document.getElementById(audioInputId);
    const files = fileInput.files;

    if (!files.length) {
        alert("Please select at least one audio file.");
        return;
    }

    startLoadingAnimation(outputElementId); // Start loading animation

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        // Must be same name as it is in multer config in backend
        formData.append('audioFiles[]', files[i]);
    }

    try {
        const response = await fetch(`${BASE_URL}api/analyze`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const rawData = await response.json();

        if (rawData.apiWarning) {
            alert(rawData.apiWarning);
        }

        const calculatedScores = await calculateScore(JSON.stringify(rawData.data));

        stopLoadingAnimation(outputElementId); // Stop loading animation

        if (response.ok) {
            const calculatedScoresTitle = document.createElement('h3');
            calculatedScoresTitle.innerText = `Calculated Scores:`;
            document.getElementById(outputElementId).appendChild(calculatedScoresTitle);

            for (let i = 0; i < calculatedScores.cumulativeScores.length; i++) {
                const score = calculatedScores.cumulativeScores[i];
                const scoreElement = document.createElement('div');
                scoreElement.innerText = `Label: ${score.label}, Score ${i + 1}: ${score.score}`;
                document.getElementById(outputElementId).appendChild(scoreElement);
            }

            const scores = rawData.data;
            for (let i = 0; i < scores.length; i++) {
              const fileLabel = document.createElement('h3');
              fileLabel.innerText = `File ${i + 1} Classification Results:`;
              document.getElementById(outputElementId).appendChild(fileLabel);

              for (let j = 0; j < scores[i].length; j++) {
                const score = scores[i][j];
                const scoreElement = document.createElement('div');
                scoreElement.innerText = `Label: ${score.label}, Score ${j + 1}: ${score.score}`;
                document.getElementById(outputElementId).appendChild(scoreElement);
              }
            }
        } else {
            alert(rawData.error);
        }
    } catch (error) {
        console.error("Error during audio upload:", error);
        alert("An error occurred during audio upload.");
        stopLoadingAnimation(outputElementId); // Stop loading animation on error
    }
}

async function calculateScore(scores) {

        try {
        const response = await fetch(`${BASE_URL}api/calculateScore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: scores,
        credentials: 'include'
        });
    
        const data = await response.json();
    
        if (response.ok) {
            return data;
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error during score calculation:", error);
        alert("An error occurred during score calculation.");
    }
}

// Get the current API usage count
async function getUsage(outputElementId) {
  clearDiv(outputElementId);
  const response = await fetch(`${BASE_URL}admin/usage`, {
      method: 'GET',
      credentials: 'include'
  });

  const data = await response.json();
  if (response.ok) {
      document.getElementById(outputElementId).innerText = `Current Usage: ${data.usage.api_usage}`;
  } else {
      alert(data.error);
  }
}

async function getUsers() {
  clearDiv('users-output');
  const response = await fetch(`${BASE_URL}admin/users`, {
      method: 'GET',
      credentials: 'include'
  });

  const data = await response.json();
  if (response.ok) {
    for (let i = 0; i < data.users.length; i++) {
        const user = data.users[i];
        const userElement = document.createElement('div');
        userElement.innerText = `User ${i + 1}: ${user.email}, Role: ${user.role}, Token: ${user.api_token}, API Usage: ${user.api_usage}`;
        document.getElementById('users-output').appendChild(userElement);
    }
  } else {
      alert(data.error);
  }
}

function clearDiv(id) {
  document.getElementById(id).innerHTML = '';
}
