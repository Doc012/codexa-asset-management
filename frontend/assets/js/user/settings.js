import { getUserById, updateUserProfile } from "../../../services/userService.js";
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".settings-tab-btn");
  const panels = document.querySelectorAll(".settings-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active-panel"));

      btn.classList.add("active");

      const targetId = btn.dataset.target; // same as getAttribute("data-target")
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

  try {
    const user = await getUserById();
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
      const updated = await updateUserProfile(profileData);
      console.log("Profile updated:", updated);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile.");
    }
  });
});
