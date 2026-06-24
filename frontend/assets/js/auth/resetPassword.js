/**
 * resetPassword.js
 * Handles reset-password.html
 * Reads ?token=... from the URL — this is the link clicked from the email.
 */

import { resetPassword } from "../../authContext.js";
import { requireGuest }  from "../../authGuard.js";

await requireGuest();

// ── Read token from URL ───────────────────────────────────────────────────────
const params        = new URLSearchParams(window.location.search);
const resetToken    = params.get("token");

const form          = document.getElementById("resetForm");
const passInput     = document.getElementById("newPassword");
const submitBtn     = document.getElementById("submitBtn");
const errorBox      = document.getElementById("errorBox");
const successBox    = document.getElementById("successBox");
const invalidBox    = document.getElementById("invalidTokenBox");

// If no token in URL, show an error immediately and disable the form
if (!resetToken) {
  invalidBox.hidden = false;
  form.hidden       = true;
}

// ── Form submit ───────────────────────────────────────────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();

  if (passInput.value.length < 8) {
    showError("Password must be at least 8 characters.");
    return;
  }

  setLoading(true);

  try {
    const data = await resetPassword(resetToken, passInput.value);
    showSuccess(data.message + " Redirecting to login...");
    form.reset();

    setTimeout(() => {
      window.location.href = "/pages/auth/login.html";
    }, 2500);

  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
});

function setLoading(loading) {
  submitBtn.disabled    = loading;
  submitBtn.textContent = loading ? "Resetting..." : "Reset Password";
}

function showError(msg)   { errorBox.textContent   = msg; errorBox.hidden   = false; }
function showSuccess(msg) { successBox.textContent = msg; successBox.hidden = false; }
function clearMessages()  {
  errorBox.textContent = ""; errorBox.hidden = true;
  successBox.textContent = ""; successBox.hidden = true;
}
