// Use global API_BASE if available, otherwise declare it
if (typeof window.API_BASE === 'undefined') {
  window.API_BASE = "http://localhost:5001/api";
}
const API_BASE = window.API_BASE;

const form = document.getElementById("registerForm");
const statusDiv = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (data.success) {
      statusDiv.textContent = "Registration successful! Please login.";
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      statusDiv.textContent = data.message || "Registration failed";
    }
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "Connection error";
  }
});
