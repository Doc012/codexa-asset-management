import { login }        from "../../js/authContext.js";
import { requireGuest } from "../../js/authGuard.js";

await requireGuest();

const form        = document.getElementById("loginForm");
const emailInput  = document.getElementById("email");
const passInput   = document.getElementById("password");
const submitBtn   = document.getElementById("submitBtn");
const errorBox    = document.getElementById("errorBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();
  setLoading(true);

  try {
    const user = await login(emailInput.value.trim(), passInput.value);

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
