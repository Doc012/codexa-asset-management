import { getUserById, updateAllUserDetails, changePassword } from "../../../services/userService.js";
import { getUser, logout } from "../authContext.js";

document.addEventListener("DOMContentLoaded", async () => {
  // --- Tabs ---
  const tabButtons = document.querySelectorAll(".settings-tab-btn");
  const panels = document.querySelectorAll(".settings-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active-panel"));

      btn.classList.add("active");
      const targetPanel = document.getElementById(btn.dataset.target);
      if (targetPanel) targetPanel.classList.add("active-panel");
    });
  });

  // --- User + elements ---
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const department = document.getElementById("department");
  const profileForm = document.getElementById("profile-form");

  const securityForm = document.getElementById("security-form");
  const currentPassword = document.getElementById("sec-current");
  const newPassword = document.getElementById("sec-new");
  const confirmPassword = document.getElementById("sec-confirm");
  const errorEl = document.getElementById("password-error");

  const userId = getUser()?.id;
  if (!userId) {
    console.error("No user in session — redirecting to login");
    window.location.href = "/pages/auth/login.html";
    return;
  }

  let currentUser;
  try {
    currentUser = await getUserById(userId);
    firstName.value = currentUser.firstName || "";
    lastName.value = currentUser.lastName || "";
    email.value = currentUser.email || "";
    department.value = currentUser.department || "";
  } catch (error) {
    console.error("Failed to load user:", error);
  }

  // --- Profile form ---
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const profileData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      department: currentUser.department,
      picUrl: currentUser.picUrl
    };

    showConfirmationModal(async () => {
      await updateAllUserDetails(userId, profileData);
    }, {
      confirmTitle: "Update your details",
      confirmMessage: "Are you sure you want to update your details?",
      successMessage: "Your details have been updated successfully.",
      errorTitle: "Update Failed"
    });
  });

  // --- Security form ---
  securityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (errorEl) errorEl.textContent = "";

    if (newPassword.value.length < 8) {
      if (errorEl) errorEl.textContent = "New password must be at least 8 characters.";
      return;
    }
    if (newPassword.value !== confirmPassword.value) {
      if (errorEl) errorEl.textContent = "New password and confirmation do not match.";
      return;
    }
    if (newPassword.value === currentPassword.value) {
      if (errorEl) errorEl.textContent = "New password must be different from the current password.";
      return;
    }

    const passwordRequest = {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    };

    showConfirmationModal(async () => {
      await changePassword(userId, passwordRequest);
      securityForm.reset();
    }, {
      confirmTitle: "Update your password",
      confirmMessage: "Are you sure you want to change your password?",
      successMessage: "Your password has been updated successfully.",
      errorTitle: "Password Update Failed"
    });
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await logout();
  });
});

// --- Modal with real success/error states ---
function showConfirmationModal(onConfirm, options = {}) {
  const {
    confirmTitle = "Confirm",
    confirmMessage = "Are you sure?",
    successMessage = "Success.",
    errorTitle = "Update Failed",
  } = options;

  const modal = document.getElementById("updated-details");
  const title = modal.querySelector("h2");
  const message = modal.querySelector("p");
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  modal.style.display = "flex";
  modal.classList.remove("modal-error", "modal-success");
  title.textContent = confirmTitle;
  message.textContent = confirmMessage;
  confirmBtn.style.display = "inline-block";
  confirmBtn.textContent = "Confirm";
  confirmBtn.disabled = false;
  cancelBtn.textContent = "Cancel";

  const resetModal = () => {
    modal.style.display = "none";
    modal.classList.remove("modal-error", "modal-success");
  };

  confirmBtn.onclick = async () => {
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Processing...";

    try {
      await onConfirm();

      modal.classList.add("modal-success");
      title.textContent = "Success";
      message.textContent = successMessage;
      confirmBtn.style.display = "none";
      cancelBtn.textContent = "Close";
      cancelBtn.onclick = resetModal;

    } catch (err) {
      console.error(err);
      modal.classList.add("modal-error");
      title.textContent = errorTitle;
      message.textContent = err.message || "Something went wrong. Please try again.";
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Try Again";
      cancelBtn.textContent = "Close";
      cancelBtn.onclick = resetModal;
    }
  };

  cancelBtn.onclick = () => modal.style.display = "none";
}