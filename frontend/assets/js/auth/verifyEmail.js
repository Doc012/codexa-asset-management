import { verifyEmail } from "../../authContext.js";

const params      = new URLSearchParams(window.location.search);
const emailToken  = params.get("token");

const loadingBox  = document.getElementById("loadingBox");
const errorBox    = document.getElementById("errorBox");
const successBox  = document.getElementById("successBox");

if (!emailToken) {
  loadingBox.hidden = true;
  showError("This verification link is invalid or has expired. Please register again or contact support.");
} else {
  try {
    const data = await verifyEmail(emailToken);
    loadingBox.hidden = true;
    showSuccess((data.message || "Email verified successfully.") + " You can now log in.");
  } catch (err) {
    loadingBox.hidden = true;
    showError(err.message);
  }
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