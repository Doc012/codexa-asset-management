import { logout } from "../authContext.js";

document.addEventListener("DOMContentLoaded", async () => {
  const btn = document.getElementById("logoutBtn");
  if (btn) {
    btn.addEventListener("click", async () => {
      try {
        await logout();
        window.location.href = "/pages/auth/login.html";
      } catch (err) {
        console.error("Logout failed:", err);
      }
    });
  }
});
