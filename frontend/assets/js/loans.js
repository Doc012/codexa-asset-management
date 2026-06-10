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

const profileContainer =
    document.querySelector(".profile-container");

const profileDropdown =
    document.querySelector(".profile-dropdown");

const profileUpload =
    document.getElementById("profileUpload");

const profileImage =
    document.getElementById("profileImage");

const profileInitial =
    document.getElementById("profileInitial");

const aiBtn =
    document.getElementById("aiBtn");

const aiPanel =
    document.getElementById("aiPanel");

const closeAI =
    document.getElementById("closeAI");

const assetTable =
    document.getElementById("assetTable");

const totalAssets =
    document.getElementById("totalAssets");

const assetSearch =
    document.querySelector(".table-search");

const totalLoans = 
    document.getElementById("totalLoans");



/* ===============================
   SIDEBAR TOGGLE
================================ */

menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("closed");

    content.classList.toggle("expanded");

});

// smaller screens
document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const navItems = document.querySelectorAll(".nav-item");

    // Toggle sidebar
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebar.classList.toggle("mobile-open");
    });

    // Close when clicking menu items
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            sidebar.classList.remove("mobile-open");
        });
    });

    // Prevent closing when clicking sidebar
    sidebar.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Close when clicking outside
    document.addEventListener("click", () => {
        sidebar.classList.remove("mobile-open");
    });

});

/* ===============================
   PAGE NAVIGATION
================================ */

navItems.forEach(item => {


    item.addEventListener("click", () => {


        // remove old active menu
        document
            .querySelector(".nav-item.active")
            .classList.remove("active");


        // activate new menu
        item.classList.add("active");


        // hide all pages
        document
            .querySelectorAll(".page")
            .forEach(page => {

                page.classList.remove("active");

            });


        // show selected page
        const pageName =
            item.dataset.page;


        document
            .getElementById(
                pageName + "Page"
            )
            .classList.add("active");


        // Load assets only when user opens assets
        if(pageName === "assets") {

            loadAssets();

        }

        //Load loan when user opens loans
        if (pageName === "loans") {

          loadLoans();

        }

        if (pageName === "settings") {

          loadUserProfile();
        }


    });


});





/* ===============================
   PROFILE DROPDOWN
================================ */

profileContainer.addEventListener("click", (e) => {


    profileContainer.classList.toggle("open");


    e.stopPropagation();


});


document.addEventListener("click", () => {


    profileContainer.classList.remove("open");


});





/* ===============================
   PROFILE IMAGE UPLOAD
================================ */


profileUpload.addEventListener("change", (event) => {


    const file =
        event.target.files[0];


    if(!file) return;


    const reader =
        new FileReader();


    reader.onload = function(e) {


        profileImage.src =
            e.target.result;


        profileImage.style.display =
            "block";


        profileInitial.style.display =
            "none";


        localStorage.setItem(
            "profilePicture",
            e.target.result
        );


    };


    reader.readAsDataURL(file);


});




// Upload button inside dropdown
document
.getElementById("uploadBtn")
.addEventListener("click", () => {


    profileUpload.click();


});




// Load saved profile image
const savedImage =
    localStorage.getItem("profilePicture");


if(savedImage) {


    profileImage.src =
        savedImage;


    profileImage.style.display =
        "block";


    profileInitial.style.display =
        "none";


}





/* ===============================
   AI PANEL
================================ */


aiBtn.addEventListener("click", () => {


    aiPanel.classList.add("open");


});


closeAI.addEventListener("click", () => {


    aiPanel.classList.remove("open");


});

/* ===============================
   INITIAL LOAD
================================ */
window.addEventListener("load", async () => {
    await loadUserProfile(); // Fetch profile details right away
    await loadAssets();
    await loadLoans(); 
});


/* ===============================
   PROFILE API INTEGRATION
================================ */

const PROFILE_API_URL = "http://localhost:8080/api/v1/users/profile"; // Adjust to match your endpoint
let currentUser = null;

async function loadUserProfile() {
    try {
        const response = await fetch(PROFILE_API_URL);
        if(!response.ok) {
            throw new Error("Could not load user profile data");
        }
        currentUser = await response.json();
        renderUserProfile(currentUser);
    }
    catch(error) {
        console.error("Backend error:", error);
        // Fallback error messaging inside the profile panel fields
        document.getElementById("profileFullName").textContent = "Error loading data";
        document.getElementById("profileEmail").textContent = "Error loading data";
    }
}

function renderUserProfile(user) {
    if (!user) return;

    // 1. Update the settings page panel fields
    const fullNameElem = document.getElementById("profileFullName");
    const emailElem = document.getElementById("profileEmail");
    const deptElem = document.getElementById("profileDepartment");
    const roleElem = document.getElementById("profileRole");

    if (fullNameElem) fullNameElem.textContent = user.fullName;
    if (emailElem) emailElem.textContent = user.email;
    if (deptElem) deptElem.textContent = user.department;
    
    if (roleElem) {
        roleElem.textContent = user.role;
        // Apply styling based on role (ADMIN gets a primary green badge, USER gets a gray badge)
        roleElem.className = `status-badge ${user.role.toLowerCase() === 'admin' ? 'approved' : 'unknown'}`;
    }

    // 2. DYNAMIC BONUS: Update the Navbar Topbar layout components!
    const navInitial = document.getElementById("profileInitial");
    const welcomeHeader = document.querySelector(".welcome-card h1");

    // Extract the first letter of their name (e.g., "John Smith" -> "J")
    if (navInitial && user.fullName) {
        navInitial.textContent = user.fullName.charAt(0).toUpperCase();
    }

    // Change "Welcome Back, Steve" dynamically to match your true backend user
    if (welcomeHeader && user.fullName) {
        welcomeHeader.innerHTML = `Welcome Back, ${user.fullName.split(' ')[0]} 👋`;
    }
}



/* ===============================
   ASSET API INTEGRATION
================================ */


/*
 Make sure your Spring Boot backend
 is running on port 8080
*/

const API_URL =
    "http://localhost:8080/api/v1/assets";


let assets = [];



async function loadAssets() {


    try {


        const response =
            await fetch(API_URL);


        if(!response.ok) {


            throw new Error(
                "Could not load assets"
            );


        }


        assets =
            await response.json();


        renderAssets(assets);


        updateDashboard();


    }


    catch(error) {


        console.error(
            "Backend error:",
            error
        );


        assetTable.innerHTML =
        `
            <tr>
                <td colspan="4">
                    Failed to connect
                    to Asset API
                </td>
            </tr>
        `;


    }


}

/* ===============================
   LOANS API INTEGRATION
================================ */

const LOANS_API_URL = "http://localhost:8080/api/v1/loans"; // Adjust path matching your Spring Boot routes
let loans = [];

// 1. Fetch data from backend
async function loadLoans() {
    try {
        const response = await fetch(LOANS_API_URL);
        if(!response.ok) {
            throw new Error("Could not load tracking logs");
        }
        loans = await response.json();
        renderLoans(loans);
    }
    catch(error) {
        console.error("Backend error:", error);
        const loanTable = document.getElementById("loanTable");
        if(loanTable) {
            loanTable.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--danger);">
                        Failed to connect to Loan Allocation API
                    </td>
                </tr>`;
        }
    }
}

// 2. Render Loans Table Rows
function renderLoans(loanList) {
    const loanTable = document.getElementById("loanTable");
    if(!loanTable) return;

    loanTable.innerHTML = "";

    if (loanList.length === 0) {
        loanTable.innerHTML = `<tr><td colspan="7" style="text-align:center;">No loans on file.</td></tr>`;
        return;
    }

    loanList.forEach(loan => {
        // Handle fallback parsing for null values gracefully
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
            <td>
                <span class="status-badge ${loan.status.toLowerCase()}">
                    ${loan.status}
                </span>
            </td>
        </tr>
        `;
    });
}

// 3. Independent Deep Filter for Loans
const loanSearch = document.getElementById("loanSearch");
if(loanSearch) {
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
   RENDER ASSET TABLE (ALL FIELDS)
================================ */
function renderAssets(assetList) {

    if(!assetTable) return;

    assetTable.innerHTML = "";

    // If backend returns empty array, display a nice notice
    if (assetList.length === 0) {
        assetTable.innerHTML = `<tr><td colspan="8" style="text-align:center;">No assets found.</td></tr>`;
        return;
    }

    assetList.forEach(asset => {
        // Format cost safely (e.g., 1299.99 -> $1,299.99)
        const formattedCost = asset.cost 
            ? new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(asset.cost)
            : 'N/A';

        assetTable.innerHTML +=
        `
        <tr>
            <td>
                <img src="${asset.photoPath || ''}" alt="${asset.title || 'Asset'}" 
                     style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;" 
                     onerror="this.src='https://placehold.co/40?text=💻'">
            </td>

            <td><strong>${asset.title || "Unknown"}</strong></td>

            <td>${asset.category || "N/A"}</td>

            <td><code style="background: #f4f4f4; padding: 2px 6px; border-radius: 4px;">${asset.serialNumber || "N/A"}</code></td>

            <td>${asset.acquisitionDate || "-"}</td>

            <td>${formattedCost}</td>

            <td><small>📍 ${asset.location || "N/A"}</small></td>

            <td>
                <span class="status-badge ${(asset.condition || 'unknown').toLowerCase()}">
                    ${asset.condition || "Unknown"}
                </span>
            </td>
        </tr>
        `;
    });
}




/* ===============================
   UPDATE DASHBOARD STATS
================================ */
function updateDashboard() {
    // Update Asset Counter
    if (totalAssets) {
        totalAssets.textContent = assets.length;
    }

    // NEW: Update Loan Counter dynamically
    if (totalLoans) {
        totalLoans.textContent = loans.length;
    }
}


/* ===============================
   ASSET SEARCH (ALL FIELDS)
================================ */

if (assetSearch) {

    assetSearch.addEventListener("input", (event) => {

        const searchText = event.target.value.toLowerCase().trim();

        const filtered = assets.filter(asset => {
            
            // 1. Convert cost to string so it can be searched (e.g., "1299.99")
            const assetCost = asset.cost ? asset.cost.toString() : "";

            // 2. Check if the search text matches ANY of the backend fields
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

        // 3. Re-render the table with only the matching rows
        renderAssets(filtered);

    });

}





/* ===============================
   AI CHAT DEMO
================================ */


const chatBox =
    document.getElementById("chatBox");


const chatInput =
    document.querySelector(
        ".chat-input input"
    );


const sendBtn =
    document.querySelector(
        ".chat-input button"
    );


sendBtn.addEventListener("click", sendMessage);


chatInput.addEventListener(
    "keypress",
    (event) => {


    if(event.key === "Enter") {


        sendMessage();


    }


});




function sendMessage() {


    const message =
        chatInput.value.trim();


    if(!message) return;


    addMessage(
        "You",
        message
    );


    chatInput.value = "";


    setTimeout(() => {


        addMessage(
            "Asset IQ AI",
            generateAIResponse(message)
        );


    }, 700);


}





function addMessage(sender, text) {


    chatBox.innerHTML +=
    `
    <div class="ai-message">

        <strong>
        ${sender}
        </strong>

        <br>

        ${text}

    </div>
    `;


    chatBox.scrollTop =
        chatBox.scrollHeight;


}




function generateAIResponse(message) {


    message =
        message.toLowerCase();



    if(
        message.includes("laptop")
        ||
        message.includes("phone")
    ) {


        return `
        Consider requesting a company device,
        buying refurbished equipment,
        or prioritizing the device you need most.
        `;


    }


    if(
        message.includes("loan")
    ) {


        return `
        You can check your active loans
        under the My Loans section.
        `;


    }


    if(
        message.includes("asset")
    ) {


        return `
        Asset IQ helps you track assets,
        requests, returns, and reports.
        `;


    }


    return `
    I understand your request.
    A more advanced AI model can be
    connected later using an API.
    `;


}





/* ===============================
   INITIAL LOAD
================================ */


window.addEventListener("load", () => {


    // load dashboard data
    loadAssets();


});
