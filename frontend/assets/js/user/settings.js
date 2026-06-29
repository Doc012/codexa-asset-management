import { getUserById, updateUserProfile } from "../../../services/userService.js";
import { getUser, logout } from "../authContext.js"

import { changePassword } from "../../../services/userService.js";

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".settings-tab-btn");
  const panels = document.querySelectorAll(".settings-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active-panel"));

      btn.classList.add("active");

      const targetId = btn.dataset.target; 
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active-panel");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const department = document.getElementById("department");
  const profileForm = document.getElementById("profileForm");

  const securityForm = document.getElementById("securityForm");
  const currentPassword = document.getElementById("sec-current");
  const newPassword = document.getElementById("sec-new");
  const confirmPassword = document.getElementById("sec-confirm");

  const userId = getUser()?.id;
  if (!userId) {
    console.error("No user in session — redirecting to login");
    window.location.href = "/pages/auth/login.html";
    return;
  }

  console.log(getUser());

  try {
    const user = await getUserById(userId);
    firstName.value = user.firstName || "";
    lastName.value = user.lastName || "";
    email.value = user.email || "";
    department.value = user.department || "";
  } catch (error) {
    console.error("Failed to load user:", error);
  }

  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const profileData = {
      firstName: firstName.value,
      lastName: lastName.value
    };

    try {
      const updated = await updateUserProfile(userId, profileData);
      console.log("Profile updated:", updated);
    } catch (error) {
      console.error("Update failed:", error);
    }
  });

  securityForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (newPassword.value.length < 8) {
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      return;
    }

    const passwordRequest = {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    }

    try {
      await changePassword(userId, passwordRequest);
      securityForm.reset();
    } catch (error) {
      console.error("Update failed:", error);
    }
  })


  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await logout();
  });

});
