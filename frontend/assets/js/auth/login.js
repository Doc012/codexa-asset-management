/**
 * login.js
 * Handles login.html — form submit, error display, loading state, redirect.
 */

import { login }        from "../../js/authContext.js";
import { requireGuest } from "../../js/authGuard.js";

// ── Guard: redirect to dashboard if already logged in ─────────────────────────
await requireGuest();

// ── DOM refs ──────────────────────────────────────────────────────────────────
const form        = document.getElementById("loginForm");
const emailInput  = document.getElementById("email");
const passInput   = document.getElementById("password");
const submitBtn   = document.getElementById("submitBtn");
const errorBox    = document.getElementById("errorBox");

// ── Form submit ───────────────────────────────────────────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();
  setLoading(true);

  try {
    const user = await login(emailInput.value.trim(), passInput.value);

    // Redirect based on role
    const roleRoutes = {
      ADMIN:         "/pages/private/admin/dashboard.html",
      MANAGER: "/pages/private/manager/dashboard.html",
      STAFF: "/pages/private/user/dashboard.html",
    };

    window.location.href = roleRoutes[user.role] ?? "/index.html";

  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function setLoading(loading) {
  submitBtn.disabled     = loading;
  submitBtn.textContent  = loading ? "Logging in..." : "Login";
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden      = false;
}

function clearError() {
  errorBox.textContent = "";
  errorBox.hidden      = true;
}
