/**
 * forgotPassword.js
 * Handles forgot-password.html
 */

import { forgotPassword } from "../../js/authContext.js";
import { requireGuest }   from "../../js/authGuard.js";

await requireGuest();

const form       = document.getElementById("forgotForm");
const emailInput = document.getElementById("email");
const submitBtn  = document.getElementById("submitBtn");
const errorBox   = document.getElementById("errorBox");
const successBox = document.getElementById("successBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();
  setLoading(true);

  try {
    const data = await forgotPassword(emailInput.value.trim());
    showSuccess(data.message);
    form.reset();
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
});

function setLoading(loading) {
  submitBtn.disabled    = loading;
  submitBtn.textContent = loading ? "Sending..." : "Send Reset Link";
}

function showError(msg)   { errorBox.textContent   = msg; errorBox.hidden   = false; }
function showSuccess(msg) { successBox.textContent = msg; successBox.hidden = false; }
function clearMessages()  {
  errorBox.textContent = ""; errorBox.hidden = true;
  successBox.textContent = ""; successBox.hidden = true;
}
