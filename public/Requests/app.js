const apiUrl = "http://localhost:3000";
let token = "";
let user = null;

// Registration form event listener
document
  .getElementById("registration-form")
  .addEventListener("submit", async (e) => {
    await registerUser(e);
  });

// Login form event listener
document.getElementById("login-form").addEventListener("submit", async (e) => {
  await loginUser(e);
});

// Logout button event listener
document.getElementById("logout").addEventListener("click", logout);

// Plant form event listener
document.getElementById("plant-form").addEventListener("submit", async (e) => {
  await submitPlantRequest(e);
});

// Load data and functions after successful login
function handleSuccessfulLogin() {
  if (user.isAdmin) {
    document.getElementById("admin-panel").classList.remove("hidden");
    loadRequests();
  } else {
    document.getElementById("plant-selection").classList.remove("hidden");
    document.getElementById("user-requests").classList.remove("hidden");
    loadPlants();
    loadUserRequests();
  }
}