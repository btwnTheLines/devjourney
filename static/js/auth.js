// static/js/auth.js

// Utility to get Django's CSRF token
function getCSRFToken() {
  return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

// Modal elements
const loginModal = document.getElementById("loginModal");
const logoutModal = document.getElementById("logoutModal");

// --- LOGIN MODAL HANDLERS ---
document.getElementById("openLoginModal")?.addEventListener("click", () => {
  loginModal.classList.remove("hidden");
});
document.getElementById("closeLoginModal")?.addEventListener("click", () => {
  loginModal.classList.add("hidden");
});

// --- LOGOUT MODAL HANDLERS ---
document.getElementById("openLogoutModal")?.addEventListener("click", () => {
  logoutModal.classList.remove("hidden");
});
document.getElementById("closeLogoutModal")?.addEventListener("click", () => {
  logoutModal.classList.add("hidden");
});

// --- AJAX LOGIN FORM ---
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const response = await fetch("/login/", {
    method: "POST",
    headers: { "X-CSRFToken": getCSRFToken() },
    body: formData,
  });
  const data = await response.json();

  const errorDiv = document.getElementById("loginError");
  if (data.success) {
    window.location.reload(); // refresh page to show logged-in UI
  } else {
    errorDiv.textContent = data.message;
    errorDiv.classList.remove("hidden");
  }
});

// --- AJAX LOGOUT CONFIRMATION ---
document.getElementById("confirmLogout")?.addEventListener("click", async () => {
  const response = await fetch("/logout/", {
    method: "POST",
    headers: { "X-CSRFToken": getCSRFToken() },
  });
  const data = await response.json();
  if (data.success) {
    window.location.reload();
  }
});
