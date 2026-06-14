
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const content = document.getElementById("mainContent");
const navItems = document.querySelectorAll(".nav-item");

const profileContainer = document.querySelector(".profile-container");
const profileDropdown = document.querySelector(".profile-dropdown");
const profileUpload = document.getElementById("profileUpload");
const profileImage = document.getElementById("profileImage");


const API_URL = "http://localhost:8080/api/v1/assets";
const LOANS_API_URL = "http://localhost:8080/api/v1/loans";
const PROFILE_API_URL = "http://localhost:8080/api/v1/users";

let assets = [];
let loans = [];
let currentUser = null;

if (menuBtn && sidebar && content) {
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Desktop toggles
        sidebar.classList.toggle("closed");
        if (content) content.classList.toggle("expanded");
        // Mobile toggle
        sidebar.classList.toggle("mobile-open");
    });
}





if (profileContainer) {
    profileContainer.addEventListener("click", (e) => {
        profileContainer.classList.toggle("open");
        e.stopPropagation();
    });
}

document.addEventListener("click", () => {
    if (profileContainer) profileContainer.classList.remove("open");
});

if (profileUpload) {
    profileUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            if (profileImage) {
                profileImage.src = e.target.result;
                profileImage.style.display = "block";
            }
            if (profileInitial) profileInitial.style.display = "none";
            localStorage.setItem("profilePicture", e.target.result);
        };
        reader.readAsDataURL(file);
    });
}


const uploadBtn = document.getElementById("uploadBtn");
if (uploadBtn && profileUpload) {
    uploadBtn.addEventListener("click", () => profileUpload.click());
}

// Hydrate saved picture
const savedImage = localStorage.getItem("profilePicture");
if (savedImage && profileImage && profileInitial) {
    profileImage.src = savedImage;
    profileImage.style.display = "block";
    profileInitial.style.display = "none";
}


////////////////////////////////////////////////////////////////////////////////////////
// Reusable confirmation function
// Get elements
const modal = document.getElementById("btnConfirmation");
const deleteBtn = document.getElementById("request");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const successMessage = document.getElementById("successMessage");

// Show modal
deleteBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Confirm action
confirmBtn.addEventListener("click", () => {
  modal.style.display = "none";
  successMessage.textContent = "Your file has been updated successfully.";
  successMessage.style.display = "block";

  setTimeout(() => {
    successMessage.style.display = "none";
  }, 1000);

  // Add your update/delete logic here
  console.log("File updated in system!");
});

// Cancel action
cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});




////////////////////////////////////////////////////////////////////////////////////////



