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

confirmBtn.addEventListener("click", () => {
  modal.style.display = "none";
  successMessage.textContent = "Your file has been updated successfully.";
  successMessage.style.display = "block";

  setTimeout(() => {
    successMessage.style.display = "none";
  }, 1000);

  console.log("File updated in system!");
});


cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

function switchTab(event, tabId) {
    if (event) event.preventDefault();
    
    // 1. Hide all tab contents and remove active class
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active-content'));

    // 2. Remove the active styling class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // 3. Show the targeted tab content panel
    document.getElementById(tabId).classList.add('active-content');

    // 4. Highlight the currently clicked button with your blue CSS profile
    event.currentTarget.classList.add('active');
}



// // --- SETTINGS TAB ENGINE MANAGER ---
// function switchSettingsTab(event, targetTabId) {
//     if (event) event.preventDefault();

//     // Hide all sibling content panes
//     const tabPanels = document.querySelectorAll('#settingsPage .tab-content');
//     tabPanels.forEach(panel => {
//         panel.classList.remove('active-content');
//     });

//     // Strip out active highlight attributes off matching buttons
//     const menuButtons = document.querySelectorAll('#settingsPage .tab-btn');
//     menuButtons.forEach(btn => {
//         btn.classList.remove('active');
//     });

//     // Inject view layout active states back online
//     const targetBlock = document.getElementById(targetTabId);
//     if (targetBlock) {
//         targetBlock.classList.add('active-content');
//     }
//     if (event && event.currentTarget) {
//         event.currentTarget.classList.add('active');
//     }
// }

// // --- SIMULATED CLIENT SIDE PERSISTENCE HANDLER ---
// function saveSettings(event, messageText) {
//     event.preventDefault(); // Halt document refresh action
    
//     const toast = document.getElementById('successMessage');
//     if (toast) {
//         toast.innerText = messageText;
//         toast.style.display = 'block';
        
//         // Hide notification safely out of viewport after 3 seconds
//         setTimeout(() => {
//             toast.style.display = 'none';
//         }, 3000);
//     }
// }

// --- USER INTERFACE RUNTIME BINDINGS INIT ---
document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.getElementById('profileContainer');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadInput = document.getElementById('profileUpload');
    const profileInitial = document.getElementById('profileInitial');
    const profileImage = document.getElementById('profileImage');

    // Toggle global navigation context header menu open states on click
    if (profileContainer) {
        profileContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            profileContainer.classList.toggle('open');
        });
        document.addEventListener('click', () => profileContainer.classList.remove('open'));
    }

    // Trigger local photo storage choose pipelines
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


function switchSettingsTab(event, targetPanelId) {
    if (event) event.preventDefault();

    // 1. Hide all internal form panels
    const panels = document.querySelectorAll('.settings-panel');
    panels.forEach(p => p.classList.remove('active-panel'));

    // 2. CLEAR THE BLUE STYLE FROM ALL TABS (Fixes your exact bug)
    // We target '.settings-tab-btn' explicitly to match your HTML class names
    const tabs = document.querySelectorAll('.settings-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));

    // 3. Mount active visible state back to selected panel container
    const target = document.getElementById(targetPanelId);
    if (target) target.classList.add('active-panel');
    
    // 4. Apply the blue active highlight to ONLY the clicked button
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}



