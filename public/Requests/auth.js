async function registerUser(e) {
    e.preventDefault();
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;
  
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
    alert(data.message);
  }
  
  async function loginUser(e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
  
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
    if (data.token) {
      token = data.token;
      user = data.user;
      document.getElementById("user-info").classList.remove("hidden");
      document.getElementById("username").textContent = user.username;
      document.getElementById("role").textContent = user.isAdmin ? "Admin" : "User";
      document.getElementById("login").classList.add("hidden");
      document.getElementById("registration").classList.add("hidden");
  
      handleSuccessfulLogin();
    } else {
      alert(data.error);
    }
  }
  
  function logout() {
    token = "";
    user = null;
    document.getElementById("user-info").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
    document.getElementById("registration").classList.remove("hidden");
    document.getElementById("plant-selection").classList.add("hidden");
    document.getElementById("admin-panel").classList.add("hidden");
    document.getElementById("user-requests").classList.add("hidden");
  }