import { getUserById, updateAllUserDetails, getAllUsers, } from "../../services/userService.js";
import { API_BASE_URL } from "./config.js";

// async function getAllUsers() {
//     const response = await fetch(`${API_BASE_URL}/users`);
//     if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return await response.json();
// }

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("user-table-body");

    try {
        const users = await getAllUsers();
        tableBody.innerHTML = ""; // Clear loader

        users.forEach(user => {
            const row = document.createElement("tr");

            // Explicitly map properties to your JSON response keys
            row.innerHTML = `
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.department}</td>
                <td><strong>${user.role}</strong></td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to render users:", error);
        tableBody.innerHTML = `<tr><td colspan="4" style="color: red;">Error: ${error.message}</td></tr>`;
    }
});


/**
 * Admin 
 */
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("userTableBody");

    try {
        const users = await getAllUsers();
        tableBody.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");

            const fullName = `${user.firstName} ${user.lastName}`;
            const initials = `${user.firstName[0]}${user.lastName[0]}`;

            row.innerHTML = `
                <td class="flex-meta-cell">
                    <div class="table-img-frame initial-avatar">
                        <span>${initials}</span>
                    </div>
                    <div>
                        <span class="cell-primary-title">${fullName}</span>
                        <span class="cell-sub-label">${user.email}</span>
                    </div>
                </td>

                <td>
                    <span class="role-badge ${user.role.toLowerCase()}">
                        ${user.role}
                    </span>
                </td>

                <td>
                    <span class="cell-primary-title">${user.department}</span>
                    <span class="cell-sub-label">No asset data</span>
                </td>

                <td>
                    <span class="status-indicator active-state">
                        Active Profile
                    </span>
                </td>

                <td>
                    <div class="row-actions-group">
                        <button class="row-action-btn edit" data-id=${user.id} title="Modify Permissions">
                            Edit
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load users:", error);
    }
});





/**
 * GetUser by ID
 */
document.addEventListener("DOMContentLoaded", async () => {
    const managerElement = document.querySelector(".card.welcome h2");
    const profileNameElement = document.querySelector(".profile_info h2");
    const profileRoleElement = document.querySelector(".role");
    const profileEmailElement = document.querySelector(".user_email");
    const userName = document.querySelector(".welcome-card h1")
    const profileImage = document.querySelector(".profile-image")
    const profileInitial = document.querySelector(".profile-initial")


    try {
        const managerId = 1;
        const userId = 4;
        const managerData = await getUserById(managerId);
        const userData = await getUserById(userId);

        if (managerData) {

            if (managerElement) {
                managerElement.textContent = `Welcome back, ${managerData.firstName}`;
            }

            if (profileNameElement) {
                profileNameElement.textContent = `${managerData.firstName} ${managerData.lastName}`;
            }

            if (profileRoleElement) {
                profileRoleElement.textContent = `Role: ${managerData.role}`;
            }

            if (profileEmailElement) {
                profileEmailElement.textContent = `Email: ${managerData.email}`;
            }

        }

        if (userData) {
            if (userName) {
                userName.textContent = `Welcome back, ${userData.firstName}`
            }
            if (profileImage && profileInitial) {
                if (userData.picUrl !== null) {
                    profileImage.src = userData.picUrl;
                } else {
                    profileInitial.textContent = `${userData.firstName[0].toUpperCase()}`;
                }
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
});


/**
 * UPDATE User details
 */

document.addEventListener("DOMContentLoaded", async () => {
    const userId = 3;
    try {

        const currentUser = await getUserById(userId);
        const form = document.querySelector("#profile-form");

        const submitForm = form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const userData = {
                "firstName": document.querySelector("#firstName").value,
                "lastName": document.querySelector("#lastName").value,
                "email": document.querySelector("#email").value,
                "department": currentUser.department,
                "picUrl": currentUser.picUrl
            }
            try {
                const updateUserDetails = await updateAllUserDetails(userId, userData);
            } catch (error) {
                console.log(error);
            }

        });

    } catch (error) {
        console.log(error);
    }

});

