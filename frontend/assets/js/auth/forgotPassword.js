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

/**
 * Toggles the loading state of the form submit button.
 * @param {boolean} loading - True if the form is processing, false otherwise.
 */
function setLoading(loading) {
  submitBtn.disabled    = loading;
  submitBtn.textContent = loading ? "Sending..." : "Send Reset Link";
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