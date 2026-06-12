import { getLoansByStatus } from "../../services/loanService.js";
import { getAllLoans } from "../../services/loanService.js";

<<<<<<< Updated upstream
/**
 * Displaying Pending loans on the loan requests
 */
=======
/* ===============================
   ELEMENT REFERENCES
================================ */


const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const content = document.getElementById("mainContent");
const navItems = document.querySelectorAll(".nav-item");
>>>>>>> Stashed changes

const loadPendingLoans = (async (status) => {
    const tableBody = document.querySelector("#pendingLoansTable tbody");

<<<<<<< Updated upstream
=======
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
const PROFILE_API_URL = "http://localhost:8080/api/v1/users";

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
>>>>>>> Stashed changes
    try {
        const pendingLoans = await getLoansByStatus(status);
        tableBody.innerHTML = "";

        pendingLoans.forEach((loan) => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${loan.assetId}</td>
            <td>${loan.userId}</td>
            <td>${loan.requestDate}</td>
            <td>${loan.loanId}</td>
             <td>
                <button class="approve_btn" data-id="${loan.loanId}">Approve</button>
                <button class="reject_btn" data-id="${loan.loanId}">Reject</button>
            </td>`;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.log(`Error: ` + error)
    }
})

/**
 * Displaying loans except the pending ones
 */

const requestLoanHistory = async () => {
    const tableBody = document.querySelector("#all_loans tbody");

    try {
        const allLoans = await getAllLoans();
        tableBody.innerHTML = "";

        const loans = allLoans.filter((loan) => loan.status !== "PENDING");

        loans.forEach((loan) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${loan.assetId}</td>
                <td>${loan.userId}</td>
                <td>${loan.requestDate}</td>
                <td>${loan.loanId}</td>
                <td>${loan.status}</td>`

            tableBody.appendChild(row);
        })
    }catch (error){
        console.log("Error: " + error)
    }
};

loadPendingLoans("PENDING");
requestLoanHistory();
