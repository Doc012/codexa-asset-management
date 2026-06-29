import { resetPassword } from "../../js/authContext.js";
import { requireGuest }  from "../../js/authGuard.js";

await requireGuest();

const params        = new URLSearchParams(window.location.search);
const resetToken    = params.get("token");

const form          = document.getElementById("resetForm");
const passInput     = document.getElementById("newPassword");
const submitBtn     = document.getElementById("submitBtn");
const errorBox      = document.getElementById("errorBox");
const successBox    = document.getElementById("successBox");
const invalidBox    = document.getElementById("invalidTokenBox");

if (!resetToken) {
  invalidBox.hidden = false;
  form.hidden       = true;
}

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

/**
 * Toggles the loading state of the reset form submit button.
 * @param {boolean} loading - True if processing password reset, false otherwise.
 */
function setLoading(loading) {
  submitBtn.disabled    = loading;
  submitBtn.textContent = loading ? "Resetting..." : "Reset Password";
}

/**
 * Displays an error message to the user.
 * @param {string} msg - The error message text.
 */
function showError(msg)   { errorBox.textContent   = msg; errorBox.hidden   = false; }

/**
 * Displays a success message to the user.
 * @param {string} msg - The success message text.
 */
function showSuccess(msg) { successBox.textContent = msg; successBox.hidden = false; }

/**
 * Resets and hides all error and success messages.
 */
function clearMessages()  {
  errorBox.textContent = ""; errorBox.hidden = true;
  successBox.textContent = ""; successBox.hidden = true;
}