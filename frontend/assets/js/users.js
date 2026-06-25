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

document.addEventListener("DOMContentLoaded", async () => {

    const searchInput = document.getElementById("userSearchInput");
    const roleSelect = document.getElementById("userRoleFilter");
    const tableBody = document.getElementById("userTableBody");

    let allUsers = [];

    // ✅ Load users
    try {
        const response = await getAllUsers();
        allUsers = response;

        renderUsers(allUsers);
    } catch (error) {
        console.error("Error loading users", error);
    }

    // ✅ Filter function (same pattern as assets)
    function filterUsers() {
        const query = searchInput.value.toLowerCase();
        const roleValue = roleSelect.value.toUpperCase();

       const filtered = allUsers.filter(user => {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const role = (user.role || "").toUpperCase();

    const matchesSearch = name.includes(query) || email.includes(query);
    const matchesRole = roleValue === "ALL" || role === roleValue;

    return matchesSearch && matchesRole;
});

        renderUsers(filtered);
    }

    // ✅ Attach listeners
    if (searchInput) searchInput.addEventListener("input", filterUsers);
    if (roleSelect) roleSelect.addEventListener("change", filterUsers);

    // ✅ Render function
    function renderUsers(users) {
        tableBody.innerHTML = "";

        if (users.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        No users found
                    </td>
                </tr>
            `;
            return;
        }

       users.forEach(user => {
    // FIX 1: Change user.id to user.userId to match your API response
    const currentId = user.userId; 
    
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const initials = `${(user.firstName || 'U')[0]}${(user.lastName || 'SR')[0]}`.toUpperCase();

    tableBody.innerHTML += `
        <tr data-id="${currentId}">
            <td class="flex-meta-cell">
                <div class="table-img-frame initial-avatar">
                    <span>${initials}</span>
                </div>
                <div>
                    <span class="cell-primary-title user-name-target">${fullName}</span>
                    <span class="cell-sub-label user-email-target">${user.email}</span>
                </div>
            </td>

            <td>
                <span class="role-badge ${(user.role || 'staff').toLowerCase()}">
                    ${user.role}
                </span>
            </td>

            <td>
                <span class="cell-primary-title user-dept-target">${user.department || 'General'}</span>
                <span class="cell-sub-label">Managed Profile Asset Context</span>
            </td>

            <td>
                <span class="status-indicator active-state">
                    Active Profile
                </span>
            </td>

            <td>
                <div class="row-actions-group">
                    <button class="row-action-btn edit" title="Modify Permissions">
                        Edit
                    </button>
                </div>
            </td>
        </tr>
    `;
});
    }
});




/**
 * edit user
 */



/**
 * Edit User Modal Logic (Using Event Delegation)
 */
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById("userTableBody");
  const modalOverlay = document.getElementById('user-modal-overlay');
  const closeModalBtn = document.getElementById('close-user-modal');
  const cancelModalBtn = document.getElementById('cancel-user-edit');
  const editForm = document.getElementById('user-edit-form');

  function openModal(rowElement) {
    if (!modalOverlay) return;

    const userId = rowElement.getAttribute('data-id');
    const fullNameText = rowElement.querySelector('.cell-primary-title').textContent.trim();
    const email = rowElement.querySelector('.cell-sub-label').textContent.trim();
    const department = rowElement.cells[2].querySelector('.cell-primary-title').textContent.trim();
    const role = rowElement.cells[1].querySelector('.role-badge').textContent.trim().toUpperCase();

    const nameParts = fullNameText.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    document.getElementById('user-id').value = userId;
    document.getElementById('edit-firstName').value = firstName;
    document.getElementById('edit-lastName').value = lastName;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-department').value = department;
    document.getElementById('edit-role').value = role;

    modalOverlay.classList.remove('modal-hidden');
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.add('modal-hidden');
  }

  if (tableBody) {
    tableBody.addEventListener('click', (event) => {
      const editButton = event.target.closest('.row-action-btn.edit');
      if (editButton) {
        const targetRow = editButton.closest('tr');
        if (targetRow) openModal(targetRow);
      }
    });
  }
  
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = document.getElementById('user-id').value;
        const rawDepartmentValue = document.getElementById('edit-department').value.trim();

        const formattedDepartment = rawDepartmentValue.toLowerCase().endsWith('department') 
            ? rawDepartmentValue 
            : `${rawDepartmentValue} Department`;

        // ✅ FIXED PAYLOAD: Explicitly match the backend's CreateUserRequest structural properties
        const userData = {
            firstName: document.getElementById('edit-firstName').value.trim(),
            lastName: document.getElementById('edit-lastName').value.trim(),
            email: document.getElementById('edit-email').value.trim(),
            department: formattedDepartment,
            role: document.getElementById('edit-role').value,
            picUrl: null // ✅ Explicitly passes your expected schema parameter safely
        };

        try {
            await updateAllUserDetails(userId, userData);
            closeModal();
            window.location.reload(); 
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("An error occurred while saving user updates.");
        }
    });
}
});