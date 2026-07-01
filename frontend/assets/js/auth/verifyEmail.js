import { verifyEmail } from "../../js/authContext.js";

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
    showSuccess((data.message || "Email verified successfully.") + " Redirecting to login…");

    setTimeout(() => {
      window.location.href = "/pages/auth/login.html";
    }, 3000);

  } catch (err) {
    loadingBox.hidden = true;
    showError(err.message);
  }
}

function showError(msg) {
  errorBox.querySelector("span").textContent = msg;
  errorBox.hidden = false;
}

function showSuccess(msg) {
  successBox.querySelector("span").textContent = msg;
  successBox.hidden = false;
}