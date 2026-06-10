import { getUserById } from "../../services/userService.js";

// async function getAllUsers() {
//     const response = await fetch(`${API_BASE_URL}/users`);
//     if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return await response.json();
// }

// document.addEventListener("DOMContentLoaded", async () => {
//     const tableBody = document.getElementById("user-table-body");

//     try {
//         const users = await getAllUsers();
//         tableBody.innerHTML = ""; // Clear loader

//         users.forEach(user => {
//             const row = document.createElement("tr");
            
//             // Explicitly map properties to your JSON response keys
//             row.innerHTML = `
//                 <td>${user.fullName}</td>
//                 <td>${user.email}</td>
//                 <td>${user.department}</td>
//                 <td><strong>${user.role}</strong></td>
//             `;
            
//             tableBody.appendChild(row);
//         });

//     } catch (error) {
//         console.error("Failed to render users:", error);
//         tableBody.innerHTML = `<tr><td colspan="4" style="color: red;">Error: ${error.message}</td></tr>`;
//     }
// });




/**
 * GetUser by ID CRUD
 */
const managerElement = document.querySelector(".card.welcome h2");
const profileNameElement = document.querySelector(".profile_info h2");
const profileRoleElement = document.querySelector(".role");
const profileEmailElement = document.querySelector(".user_email");

const loadManagerDashboard = async () => {
    try {
        const managerId = 1;

        const managerData = await getUserById(managerId);

        if (managerData) {

            if (managerElement) {
                managerElement.textContent = `Welcome ${managerData.fullName}`;
            }

            if (profileNameElement) {
                profileNameElement.textContent = managerData.fullName;
            }

            if (profileRoleElement) {
                profileRoleElement.textContent = `Role: ${managerData.role}`;
            }

            if (profileEmailElement) {
                profileEmailElement.textContent = `Email: ${managerData.email}`;
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

loadManagerDashboard();


