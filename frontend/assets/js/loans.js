/* ======================================
   ASSET IQ ENTERPRISE DASHBOARD
   JavaScript Controller
====================================== */

/* ===============================
   ELEMENT REFERENCES
================================ */
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const content = document.getElementById("mainContent");
const navItems = document.querySelectorAll(".nav-item");

const profileContainer = document.querySelector(".profile-container");
const profileDropdown = document.querySelector(".profile-dropdown");
const profileUpload = document.getElementById("profileUpload");
const profileImage = document.getElementById("profileImage");
const profileInitial = document.getElementById("profileInitial");

const aiBtn = document.getElementById("aiBtn");
const aiPanel = document.getElementById("aiPanel");
const closeAiBtn = document.getElementById("closeAI");
const chatBox = document.getElementById("chatBox");
const chatContainer = document.querySelector(".chat-input-container");
const chatInput = chatContainer ? chatContainer.querySelector("input") : null;
const sendAiBtn = document.getElementById("sendAiMessageBtn");

const assetTable = document.getElementById("assetTable");
const totalAssets = document.getElementById("totalAssets");
const assetSearch = document.querySelector(".table-search");
const totalLoans = document.getElementById("totalLoans");

/* ===============================
   DATA STORE STATE
================================ */
const API_URL = "http://localhost:8080/api/v1/assets";
const LOANS_API_URL = "http://localhost:8080/api/v1/loans";
const PROFILE_API_URL = "http://localhost:8080/api/v1/users/profile";

let assets = [];
let loans = [];
let currentUser = null;

/* ===============================
   SIDEBAR TOGGLE (Desktop & Mobile)
================================ */
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

// Close mobile sidebar clicking outside or on nav items
document.addEventListener("DOMContentLoaded", () => {
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            sidebar.classList.remove("mobile-open");
        });
    });

    sidebar.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.addEventListener("click", () => {
        sidebar.classList.remove("mobile-open");
    });
});

/* ===============================
   PAGE NAVIGATION
================================ */
navItems.forEach(item => {
    item.addEventListener("click", () => {
        const activeNav = document.querySelector(".nav-item.active");
        if (activeNav) activeNav.classList.remove("active");
        
        item.classList.add("active");

        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active");
        });

        const pageName = item.dataset.page;
        const targetPage = document.getElementById(pageName + "Page");
        if (targetPage) targetPage.classList.add("active");

        if (pageName === "assets") loadAssets();
        if (pageName === "loans") loadLoans();
        if (pageName === "settings") loadUserProfile();
    });
});

/* ===============================
   PROFILE DROPDOWN & AVATAR UPLOAD
================================ */
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

/* ===============================
   PROFILE API INTEGRATION
================================ */
async function loadUserProfile() {
    try {
        const response = await fetch(PROFILE_API_URL);
        if (!response.ok) throw new Error("Could not load user profile data");
        currentUser = await response.json();
        renderUserProfile(currentUser);
    }
    catch(error) {
        console.error("Backend profile error:", error);
        const nameEl = document.getElementById("profileFullName");
        const emailEl = document.getElementById("profileEmail");
        if (nameEl) nameEl.textContent = "Error loading data";
        if (emailEl) emailEl.textContent = "Error loading data";
    }
}

function renderUserProfile(user) {
    if (!user) return;

    const fullNameElem = document.getElementById("profileFullName");
    const emailElem = document.getElementById("profileEmail");
    const deptElem = document.getElementById("profileDepartment");
    const roleElem = document.getElementById("profileRole");

    if (fullNameElem) fullNameElem.textContent = user.fullName;
    if (emailElem) emailElem.textContent = user.email;
    if (deptElem) deptElem.textContent = user.department;
    
    if (roleElem) {
        roleElem.textContent = user.role;
        roleElem.className = `status-badge ${user.role.toLowerCase() === 'admin' ? 'approved' : 'unknown'}`;
    }

    const navInitial = document.getElementById("profileInitial");
    const welcomeHeader = document.querySelector(".welcome-card h1");

    if (navInitial && user.fullName) {
        navInitial.textContent = user.fullName.charAt(0).toUpperCase();
    }

    if (welcomeHeader && user.fullName) {
        welcomeHeader.innerHTML = `Welcome Back, ${user.fullName.split(' ')[0]}`;
    }
}

/* ===============================
   ASSET API INTEGRATION
================================ */
async function loadAssets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Could not load assets");
        assets = await response.json();
        renderAssets(assets);
        updateDashboard();
    }
    catch(error) {
        console.error("Backend assets error:", error);
        if (assetTable) {
            assetTable.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--danger);">Failed to connect to Asset API</td></tr>`;
        }
    }
}

function renderAssets(assetList) {
    if (!assetTable) return;
    assetTable.innerHTML = "";

    if (assetList.length === 0) {
        assetTable.innerHTML = `<tr><td colspan="8" style="text-align:center;">No assets found.</td></tr>`;
        return;
    }

    assetList.forEach(asset => {
        const imageSource = asset.photoPath 
          ? `<img src="${asset.photoPath}" alt="${asset.title}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border);">`
          : `<div style="width: 40px; height: 40px; border-radius: 6px; background: #F3F4F6; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--muted);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            </div>`;
        
        const formattedCost = asset.cost 
            ? new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(asset.cost)
            : 'N/A';

        assetTable.innerHTML += `
        <tr>
            <td>${imageSource}</td>
            <td><strong>${asset.title || "Unknown"}</strong></td>
            <td>${asset.category || "N/A"}</td>
            <td><code style="background: #f4f4f4; padding: 2px 6px; border-radius: 4px;">${asset.serialNumber || "N/A"}</code></td>
            <td>${asset.acquisitionDate || "-"}</td>
            <td>${formattedCost}</td>
            <td>
                <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted);">
                    <span style="width: 6px; height: 6px; background-color: #9CA3AF; border-radius: 50%;"></span>
                    ${asset.location || "N/A"}
                </span>
            </td>
            <td>
                <span class="status-badge ${(asset.condition || 'unknown').toLowerCase()}">
                    ${asset.condition || "Unknown"}
                </span>
            </td>
        </tr>`;
    });
}

/* ===============================
   LOANS API INTEGRATION
================================ */
async function loadLoans() {
    try {
        const response = await fetch(LOANS_API_URL);
        if (!response.ok) throw new Error("Could not load tracking logs");
        loans = await response.json();
        updateDashboard();
        renderLoans(loans);
    }
    catch(error) {
        console.error("Backend loans error:", error);
        const loanTable = document.getElementById("loanTable");
        if (loanTable) {
            loanTable.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger);">Failed to connect to Loan Allocation API</td></tr>`;
        }
    }
}

function renderLoans(loanList) {
    const loanTable = document.getElementById("loanTable");
    if (!loanTable) return;
    loanTable.innerHTML = "";

    if (loanList.length === 0) {
        loanTable.innerHTML = `<tr><td colspan="7" style="text-align:center;">No loans on file.</td></tr>`;
        return;
    }

    loanList.forEach(loan => {
        const checkout = loan.checkoutDate ? loan.checkoutDate : `<span style="color:var(--muted); font-style:italic;">Pending Out</span>`;
        const returned = loan.returnDate ? loan.returnDate : `<span style="color:var(--muted);">—</span>`;

        loanTable.innerHTML += `
        <tr>
            <td><strong>#LN-${loan.loanId}</strong></td>
            <td><code>AST-${loan.assetId}</code></td>
            <td>${loan.requestDate}</td>
            <td>${checkout}</td>
            <td>${loan.dueDate}</td>
            <td>${returned}</td>
            <td><span class="status-badge ${loan.status.toLowerCase()}">${loan.status}</span></td>
        </tr>`;
    });
}

// Independent Deep Filter for Loans
const loanSearch = document.getElementById("loanSearch");
if (loanSearch) {
    loanSearch.addEventListener("input", (event) => {
        const searchText = event.target.value.toLowerCase().trim();
        const filtered = loans.filter(loan => {
            return (
                loan.loanId.toString().includes(searchText) ||
                loan.assetId.toString().includes(searchText) ||
                loan.status.toLowerCase().includes(searchText) ||
                (loan.requestDate && loan.requestDate.includes(searchText)) ||
                (loan.dueDate && loan.dueDate.includes(searchText))
            );
        });
        renderLoans(filtered);
    });
}

/* ===============================
   UPDATE DASHBOARD STATS
================================ */
function updateDashboard() {
    if (totalAssets) totalAssets.textContent = assets.length;
    if (totalLoans) totalLoans.textContent = loans.length;
}

/* ===============================
   ASSET SEARCH (ALL FIELDS)
================================ */
if (assetSearch) {
    assetSearch.addEventListener("input", (event) => {
        const searchText = event.target.value.toLowerCase().trim();
        const filtered = assets.filter(asset => {
            const assetCost = asset.cost ? asset.cost.toString() : "";
            return (
                (asset.title && asset.title.toLowerCase().includes(searchText)) ||
                (asset.category && asset.category.toLowerCase().includes(searchText)) ||
                (asset.serialNumber && asset.serialNumber.toLowerCase().includes(searchText)) ||
                (asset.location && asset.location.toLowerCase().includes(searchText)) ||
                (asset.condition && asset.condition.toLowerCase().includes(searchText)) ||
                (asset.acquisitionDate && asset.acquisitionDate.toLowerCase().includes(searchText)) ||
                assetCost.includes(searchText)
            );
        });
        renderAssets(filtered);
    });
}

/* ==========================================
   INTELLIGENT FUNCTIONAL AI CONTROLLER
========================================== */

// Handle Toggle and Shift Behavior layout securely
if (aiBtn && aiPanel) {
    aiBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = aiPanel.classList.toggle("open");
        
        if (isOpen) {
            document.body.classList.add("ai-layout-open");
        } else {
            document.body.classList.remove("ai-layout-open");
        }
    });
}

if (closeAiBtn) {
    closeAiBtn.addEventListener("click", () => {
        aiPanel.classList.remove("open");
        document.body.classList.remove("ai-layout-open");
    });
}

// Live Functional AI Core Engine
function generateAiResponse(userQuery) {
    const query = userQuery.toLowerCase().trim();
    const userName = currentUser ? currentUser.fullName.split(' ')[0] : "User";
    const totalAssetCount = assets ? assets.length : 0;
    const totalLoanCount = loans ? loans.length : 0;

    if (query.includes("how many assets") || query.includes("total assets") || query.includes("inventory")) {
        return `You currently have **${totalAssetCount} assets** registered in the database inventory system.`;
    }
    
    if (query.includes("my loans") || query.includes("how many loans") || query.includes("active items")) {
        return `There are currently **${totalLoanCount} active loan allocations** matching your profile signatures.`;
    }

    if (query.includes("who am i") || query.includes("my profile") || query.includes("my details")) {
        if (!currentUser) return "I'm currently unable to retrieve your profile connections.";
        return `Identity verified. You are logged in as **${currentUser.fullName}** (${currentUser.email}), working inside the **${currentUser.department}** with **${currentUser.role}** access permissions.`;
    }

    if (query.includes("status of") || query.includes("find asset")) {
        const targetSearch = query.replace("status of", "").replace("find asset", "").trim();
        if (!targetSearch || assets.length === 0) return "Please specify an accurate asset identifier label.";
        
        const found = assets.find(a => a.title.toLowerCase().includes(targetSearch));
        if (found) {
            return `Asset Located: **${found.title}** (Serial: \`${found.serialNumber}\`) is currently deployed at **${found.location}** with an operational condition rating of **${found.condition}**.`;
        }
        return `I searched the system register but could not find any asset matching "${targetSearch}".`;
    }

    return `Hello ${userName}, I am connected directly to your active live inventory system. Ask me real-time questions like:
    <br>• *"How many assets do I have?"*
    <br>• *"Who am I?"*
    <br>• *"Status of [Asset Name]"*`;
}

function appendChatMessage(sender, text) {
    if (!chatBox) return;
    
    const msgDiv = document.createElement("div");
    // Standardizes styling to match look and feel
    msgDiv.className = sender === 'user' ? 'chat-msg user' : 'chat-msg system';
    msgDiv.style.marginBottom = "15px";
    msgDiv.style.padding = "12px 14px";
    msgDiv.style.borderRadius = "12px";
    msgDiv.style.fontSize = "14px";
    msgDiv.style.lineHeight = "1.5";
    msgDiv.style.maxWidth = "85%";

    if (sender === 'user') {
        msgDiv.style.backgroundColor = "#F3F4F6";
        msgDiv.style.marginLeft = "auto";
    } else {
        msgDiv.style.backgroundColor = "#E8F5E9";
        msgDiv.style.color = "#1B5E20";
        msgDiv.style.marginRight = "auto";
        msgDiv.style.borderLeft = "3px solid var(--primary)";
    }

    msgDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Asset IQ AI'}</strong><br>${text}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleUserMessageSubmit() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    appendChatMessage('user', text);
    chatInput.value = "";

    setTimeout(() => {
        const responseText = generateAiResponse(text);
        appendChatMessage('system', responseText);
    }, 400);
}

// Attach listeners cleanly 
if (sendAiBtn && chatInput) {
    sendAiBtn.addEventListener("click", handleUserMessageSubmit);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleUserMessageSubmit();
    });
}

/* ===============================
   INITIAL STARTUP APPS LOAD
================================ */
window.addEventListener("load", async () => {
    await loadUserProfile();
    await loadAssets();
    await loadLoans(); 
});