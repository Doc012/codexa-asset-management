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
   RENDER ASSET TABLE
================================ */


function renderAssets(assetList) {


    if(!assetTable) return;


    assetTable.innerHTML = "";


    assetList.forEach(asset => {


        assetTable.innerHTML +=
        `
        <tr>

            <td>
                ${asset.name || "Unknown"}
            </td>

            <td>
                ${asset.category || "N/A"}
            </td>

            <td>
                ${asset.status || "Unknown"}
            </td>

            <td>
                ${asset.dueDate || "-"}
            </td>

        </tr>
        `;


    });


}




/* ===============================
   UPDATE DASHBOARD STATS
================================ */


function updateDashboard() {


    totalAssets.textContent =
        assets.length;


}





/* ===============================
   ASSET SEARCH
================================ */


if(assetSearch) {


    assetSearch.addEventListener(
        "input",

        (event) => {


        const searchText =
            event.target.value
            .toLowerCase();


        const filtered =
            assets.filter(asset => {


            return (
                asset.name
                ?.toLowerCase()
                .includes(searchText)

                ||

                asset.category
                ?.toLowerCase()
                .includes(searchText)

            );


        });


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
