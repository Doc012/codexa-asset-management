import { register }     from "../authContext.js";
import { requireGuest } from "../authGuard.js";

await requireGuest();

const form           = document.getElementById("registerForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput  = document.getElementById("lastName");
const emailInput     = document.getElementById("email");
const passInput      = document.getElementById("password");
const department     = "Unassigned";
const submitBtn      = document.getElementById("submitBtn");
const errorBox       = document.getElementById("errorBox");
const successBox     = document.getElementById("successBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();

  if (passInput.value.length < 8) {
    showError("Password must be at least 8 characters.");
    return;
  }

  setLoading(true);

  try {
    const data = await register(
      firstNameInput.value.trim(),
      lastNameInput.value.trim(),
      emailInput.value.trim(),
      passInput.value,
      department
    );

    showSuccess(data.message || "Registration successful! Check your email to verify your account.");
    form.reset();

  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
});

function setLoading(loading) {
  submitBtn.disabled    = loading;
  submitBtn.textContent = loading ? "Registering..." : "Register";
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden      = false;
}

function showSuccess(message) {
  successBox.textContent = message;
  successBox.hidden      = false;
}

function clearMessages() {
  errorBox.textContent   = "";
  errorBox.hidden        = true;
  successBox.textContent = "";
  successBox.hidden      = true;
}
