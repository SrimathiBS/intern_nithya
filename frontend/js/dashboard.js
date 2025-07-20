// Run after page loads
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token) {
    alert("Access denied! Please login first.");
    window.location.href = "login.html";
  } else {
    document.getElementById("usernameDisplay").textContent = username;
  }
});

// Logout function
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}
