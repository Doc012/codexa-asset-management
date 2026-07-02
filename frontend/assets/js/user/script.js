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
        
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            sidebar.classList.toggle("mobile-open");
            
            sidebar.classList.remove("closed");
            if (content) content.classList.remove("expanded");
        } else {
            sidebar.classList.toggle("closed");
            if (content) content.classList.toggle("expanded");
            
            sidebar.classList.remove("mobile-open");
        }
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

const savedImage = localStorage.getItem("profilePicture");
if (savedImage && profileImage && profileInitial) {
    profileImage.src = savedImage;
    profileImage.style.display = "block";
    profileInitial.style.display = "none";
}
const modal = document.getElementById("btnConfirmation");
const deleteBtn = document.getElementById("request");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const successMessage = document.getElementById("successMessage");

if (deleteBtn && modal) {
  deleteBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });
}

if (confirmBtn && modal && successMessage) {
  confirmBtn.addEventListener("click", () => {
    modal.style.display = "none";
    successMessage.style.display = "block";

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 1000);
  });
}

if (cancelBtn && modal && successMessage) {
  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
    successMessage.textContent = "Cancelled.";
    successMessage.style.display = "block";
  });
}
/**
 * Switches the active tab view and highlights the selected tab button.
 * @param {Event} event - The click event triggering the tab change.
 * @param {string} tabId - The DOM ID of the tab content container to display.
 */
function switchTab(event, tabId) {
    if (event) event.preventDefault();
    
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active-content'));

    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active-content');

    event.currentTarget.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.getElementById('profileContainer');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadInput = document.getElementById('profileUpload');
    const profileInitial = document.getElementById('profileInitial');
    const profileImage = document.getElementById('profileImage');

    if (profileContainer) {
        profileContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            profileContainer.classList.toggle('open');
        });
        document.addEventListener('click', () => profileContainer.classList.remove('open'));
    }

    if (uploadBtn && uploadInput) {
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            uploadInput.click();
        });

        uploadInput.addEventListener('change', function() {
            const rawFile = this.files[0];
            if (rawFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                    profileImage.style.display = 'block';
                    profileInitial.style.display = 'none';
                }
                reader.readAsDataURL(rawFile);
            }
        });
    }
});


/**
 * Switches the active settings panel view and highlights the selected settings tab button.
 * @param {Event} event - The click event triggering the settings tab change.
 * @param {string} targetPanelId - The DOM ID of the settings panel container to display.
 */
function switchSettingsTab(event, targetPanelId) {
    if (event) event.preventDefault();

    const panels = document.querySelectorAll('.settings-panel');
    panels.forEach(p => p.classList.remove('active-panel'));

    const tabs = document.querySelectorAll('.settings-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));

    const target = document.getElementById(targetPanelId);
    if (target) target.classList.add('active-panel');
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}