document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const requestForm = document.getElementById('requestForm');
    const plantRequestSection = document.getElementById('plantRequest');
    const adminPanelSection = document.getElementById('adminPanel');
    const requestsDiv = document.getElementById('requests');
    const logoutButton = document.getElementById('logout');
    const adminLogoutButton = document.getElementById('adminLogout');
  
    const apiUrl = 'http://localhost:3000';
  
    let token = null;
  
    const showElement = (element) => {
      element.style.display = 'block';
    };
  
    const hideElement = (element) => {
      element.style.display = 'none';
    };
  
    // Register User
    registrationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('regUsername').value;
      const password = document.getElementById('regPassword').value;
  
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      if (response.ok) {
        alert('Registration successful! Please login.');
      } else {
        alert('Registration failed.');
      }
    });
  
    // Login User
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
  
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      if (response.ok) {
        const data = await response.json();
        token = data.token;
        if (username === 'admin') {
          loadAdminPanel();
        } else {
          loadPlantRequestForm();
        }
        hideElement(registrationForm.parentElement);
        hideElement(loginForm.parentElement);
      } else {
        alert('Login failed.');
      }
    });
  
    // Load Plant Request Form
    const loadPlantRequestForm = async () => {
      showElement(plantRequestSection);
  
      const plantsResponse = await fetch(`${apiUrl}/plants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const plants = await plantsResponse.json();
  
      const plantArea = document.getElementById('plantArea');
      const plantVariety = document.getElementById('plantVariety');
      plantArea.innerHTML = '';
      plantVariety.innerHTML = '';
  
      plants.plants.forEach((plant) => {
        const areaOption = document.createElement('option');
        areaOption.value = plant.area;
        areaOption.textContent = plant.area;
        plantArea.appendChild(areaOption);
  
        const varietyOption = document.createElement('option');
        varietyOption.value = plant.variety;
        varietyOption.textContent = plant.variety;
        plantVariety.appendChild(varietyOption);
      });
    };
  
    // Submit Plant Request
    requestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const plantId = 1; // Sample plant ID
      const area = document.getElementById('plantArea').value;
      const variety = document.getElementById('plantVariety').value;
      const number = document.getElementById('plantNumber').value;
  
      const response = await fetch(`${apiUrl}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plantId, area, variety, number })
      });
  
      if (response.ok) {
        alert('Request submitted successfully!');
      } else {
        alert('Request submission failed.');
      }
    });
  
    // Logout
    logoutButton.addEventListener('click', () => {
      token = null;
      hideElement(plantRequestSection);
      showElement(registrationForm.parentElement);
      showElement(loginForm.parentElement);
    });
  
    // Load Admin Panel
    const loadAdminPanel = async () => {
      showElement(adminPanelSection);
  
      const requestsResponse = await fetch(`${apiUrl}/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const requests = await requestsResponse.json();
  
      requestsDiv.innerHTML = '';
      requests.requests.forEach((request) => {
        const requestDiv = document.createElement('div');
        requestDiv.className = 'request';
  
        requestDiv.innerHTML = `
          <p>Request ID: ${request.id}</p>
          <p>User ID: ${request.userId}</p>
          <p>Area: ${request.area}</p>
          <p>Variety: ${request.variety}</p>
          <p>Number: ${request.number}</p>
          <p>Payment Status: ${request.paymentStatus}</p>
          <p>Approval Status: ${request.approvalStatus}</p>
          <input type="text" placeholder="Admin Comment" id="comment-${request.id}">
          <button onclick="approveRequest(${request.id}, true)">Approve</button>
          <button onclick="approveRequest(${request.id}, false)">Deny</button>
        `;
  
        requestsDiv.appendChild(requestDiv);
      });
    };
  
    // Approve or Deny Request
    window.approveRequest = async (id, status) => {
      const comment = document.getElementById(`comment-${id}`).value;
  
      const response = await fetch(`${apiUrl}/admin/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ approvalStatus: status, adminComment: comment })
      });
  
      if (response.ok) {
        alert('Request updated successfully!');
        loadAdminPanel();
      } else {
        alert('Request update failed.');
      }
    };
  
    // Admin Logout
    adminLogoutButton.addEventListener('click', () => {
      token = null;
      hideElement(adminPanelSection);
      showElement(registrationForm.parentElement);
      showElement(loginForm.parentElement);
    });
  });
  