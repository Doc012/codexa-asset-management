import { getUserById, updateAllUserDetails, getAllUsers, } from "../../../services/userService.js";
import { API_BASE_URL } from "../../js/config.js"
import { getUser } from "../authContext.js"


// document.addEventListener("DOMContentLoaded", async () => {
//     await userDetails();
//     await filters();
//     await editUser();
// });

// const users = async () => {
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
// };


/**
 * Admin 
 */
// const allUsers = async () => {
//     const tableBody = document.getElementById("userTableBody");

//     try {
//         const users = await getAllUsers();
//         tableBody.innerHTML = "";

//         users.forEach(user => {
//             const row = document.createElement("tr");

//             const fullName = `${user.firstName} ${user.lastName}`;
//             const initials = `${user.firstName[0]}${user.lastName[0]}`;

//             row.innerHTML = `
//                 <td class="flex-meta-cell">
//                     <div class="table-img-frame initial-avatar">
//                         <span>${initials}</span>
//                     </div>
//                     <div>
//                         <span class="cell-primary-title">${fullName}</span>
//                         <span class="cell-sub-label">${user.email}</span>
//                     </div>
//                 </td>

//                 <td>
//                     <span class="role-badge ${user.role.toLowerCase()}">
//                         ${user.role}
//                     </span>
//                 </td>

//                 <td>
//                     <span class="cell-primary-title">${user.department}</span>
//                     <span class="cell-sub-label">No asset data</span>
//                 </td>

//                 <td>
//                     <span class="status-indicator active-state">
//                         Active Profile
//                     </span>
//                 </td>

//                 <td>
//                     <div class="row-actions-group">
//                         <button class="row-action-btn edit" data-id=${user.id} title="Modify Permissions">
//                             Edit
//                         </button>
//                     </div>
//                 </td>
//             `;

//             tableBody.appendChild(row);
//         });

//     } catch (error) {
//         console.error("Failed to load users:", error);
//     }
// };



/**
 * GetUser by ID
 */
// const userDetails = async () => {
//     const profileImage = document.querySelector(".profile-image")
//     const profileInitial = document.querySelector(".profile-initial")


//     try {
//         const userId = 11;
//         const adminData = await getUserById(userId);
//         console.log(adminData)

//         if (adminData) {
//             if (profileImage && profileInitial) {
//                 if (adminData.picUrl !== null) {
//                     profileImage.src = adminData.picUrl;
//                 } else {
//                     profileInitial.textContent = adminData.firstName?.trim()?.[0]?.toUpperCase() || "U";
//                 }
//             }
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// };


// /**
//  * UPDATE User details
//  */

// const upDateUserDetails = async () => {
//     const userId = 7;
//     try {

//         const currentUser = await getUserById(userId);
//         const form = document.querySelector("#profile-form");

//         const submitForm = form.addEventListener("submit", async (e) => {
//             e.preventDefault();
//             const userData = {
//                 "firstName": document.querySelector("#firstName").value,
//                 "lastName": document.querySelector("#lastName").value,
//                 "email": document.querySelector("#email").value,
//                 "department": currentUser.department,
//                 "picUrl": currentUser.picUrl
//             }
//             try {
//                 await updateAllUserDetails(userId, userData);
//             } catch (error) {
//                 console.log(error);
//             }

//         });

//     } catch (error) {
//         console.log(error);
//     }

// };



// const filters = async () => {

//     const searchInput = document.getElementById("userSearchInput");
//     const roleSelect = document.getElementById("userRoleFilter");
//     const tableBody = document.getElementById("userTableBody");

//     let allUsers = [];

//     try {
//         const response = await getAllUsers();
//         allUsers = response;

//         renderUsers(allUsers);
//     } catch (error) {
//         console.error("Error loading users", error);
//     }

//     function filterUsers() {
//         const query = searchInput.value.toLowerCase();
//         const roleValue = roleSelect.value.toUpperCase();

//         const filtered = allUsers.filter(user => {
//             const name = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
//             const email = (user.email || "").toLowerCase();
//             const role = (user.role || "").toUpperCase();

//             const matchesSearch = name.includes(query) || email.includes(query);
//             const matchesRole = roleValue === "ALL" || role === roleValue;

//             return matchesSearch && matchesRole;
//         });

//         renderUsers(filtered);
//     }

//     if (searchInput) searchInput.addEventListener("input", filterUsers);
//     if (roleSelect) roleSelect.addEventListener("change", filterUsers);

//     function renderUsers(users) {
//         tableBody.innerHTML = "";

//         if (users.length === 0) {
//             tableBody.innerHTML = `
//                 <tr>
//                     <td colspan="5" style="text-align:center;">
//                         No users found
//                     </td>
//                 </tr>
//             `;
//             return;
//         }

//         users.forEach(user => {
           
//             const currentId = user.userId;

//             const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
//             const initials = `${(user.firstName || 'U')[0]}${(user.lastName || 'SR')[0]}`.toUpperCase();

//             tableBody.innerHTML += `
//         <tr data-id="${currentId}">
//             <td class="flex-meta-cell">
//                 <div class="table-img-frame initial-avatar">
//                     <span>${initials}</span>
//                 </div>
//                 <div>
//                     <span class="cell-primary-title user-name-target">${fullName}</span>
//                     <span class="cell-sub-label user-email-target">${user.email}</span>
//                 </div>
//             </td>

//             <td>
//                 <span class="role-badge ${(user.role || 'staff').toLowerCase()}">
//                     ${user.role}
//                 </span>
//             </td>

//             <td>
//                 <span class="cell-primary-title user-dept-target">${user.department || 'General'}</span>
//                 <span class="cell-sub-label">Managed Profile Asset Context</span>
//             </td>

//             <td>
//                 <span class="status-indicator active-state">
//                     Active Profile
//                 </span>
//             </td>

//             <td>
//                 <div class="row-actions-group">
//                     <button class="row-action-btn edit" title="Modify Permissions">
//                         Edit
//                     </button>
//                 </div>
//             </td>
//         </tr>
//     `;
//         });
//     }
// };



// /**
//  * Edit User Modal Logic (Using Event Delegation)
//  */
// const editUser = async()=> {
//     const tableBody = document.getElementById("userTableBody");
//     const modalOverlay = document.getElementById('user-modal-overlay');
//     const closeModalBtn = document.getElementById('close-user-modal');
//     const cancelModalBtn = document.getElementById('cancel-user-edit');
//     const editForm = document.getElementById('user-edit-form');

//     function openModal(rowElement) {
//         if (!modalOverlay) return;

//         const userId = rowElement.getAttribute('data-id');
//         const fullNameText = rowElement.querySelector('.cell-primary-title').textContent.trim();
//         const email = rowElement.querySelector('.cell-sub-label').textContent.trim();
//         const department = rowElement.cells[2].querySelector('.cell-primary-title').textContent.trim();
//         const role = rowElement.cells[1].querySelector('.role-badge').textContent.trim().toUpperCase();

//         const nameParts = fullNameText.split(" ");
//         const firstName = nameParts[0] || "";
//         const lastName = nameParts.slice(1).join(" ") || "";

//         document.getElementById('user-id').value = userId;
//         document.getElementById('edit-firstName').value = firstName;
//         document.getElementById('edit-lastName').value = lastName;
//         document.getElementById('edit-email').value = email;
//         document.getElementById('edit-department').value = department;
//         document.getElementById('edit-role').value = role;

//         modalOverlay.classList.remove('modal-hidden');
//     }

//     function closeModal() {
//         if (modalOverlay) modalOverlay.classList.add('modal-hidden');
//     }

//     if (tableBody) {
//         tableBody.addEventListener('click', (event) => {
//             const editButton = event.target.closest('.row-action-btn.edit');
//             if (editButton) {
//                 const targetRow = editButton.closest('tr');
//                 if (targetRow) openModal(targetRow);
//             }
//         });
//     }

//     if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
//     if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

//     if (editForm) {
//         editForm.addEventListener('submit', async (e) => {
//             e.preventDefault();

//             const userId = document.getElementById('user-id').value;
//             const rawDepartmentValue = document.getElementById('edit-department').value.trim();

//             const formattedDepartment = rawDepartmentValue.toLowerCase().endsWith('department')
//                 ? rawDepartmentValue
//                 : `${rawDepartmentValue} Department`;

//             const userData = {
//                 firstName: document.getElementById('edit-firstName').value.trim(),
//                 lastName: document.getElementById('edit-lastName').value.trim(),
//                 email: document.getElementById('edit-email').value.trim(),
//                 department: formattedDepartment,
//                 role: document.getElementById('edit-role').value,
//                 picUrl: null
//             };

//             try {
//                 await updateAllUserDetails(userId, userData);
//                 closeModal();
//                 window.location.reload();
//             } catch (error) {
//                 console.error("Failed to update user:", error);
//                 alert("An error occurred while saving user updates.");
//             }
//         });
//     }
// };


/**
 * ---------------------------------------------------------------------------------------------------
 */

/**
 * ✅ MAIN INIT
 */
document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('userTableBody');
  const searchInput = document.getElementById('userSearchInput');
  const roleSelect = document.getElementById('userRoleFilter');

  let allUsers = [];

  /**
   * ✅ LOAD USERS
   */
  async function loadUsers() {
    try {
      allUsers = await getAllUsers();
      renderUsers(allUsers);
    } catch (err) {
      console.error('❌ Failed to load users:', err);
    }
  }

  await loadUsers();

  /**
   * ✅ FILTER USERS
   */
  function filterUsers() {
    if (!searchInput || !roleSelect) return;

    const query = searchInput.value.toLowerCase();
    const roleValue = roleSelect.value.toUpperCase();

    const filtered = allUsers.filter((user) => {
      const name = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      const role = (user.role || '').toUpperCase();

      return (
        (name.includes(query) || email.includes(query)) &&
        (roleValue === 'ALL' || role === roleValue)
      );
    });

    renderUsers(filtered);
  }

  searchInput?.addEventListener('input', filterUsers);
  roleSelect?.addEventListener('change', filterUsers);

  /**
   * ✅ RENDER USERS
   */
  function renderUsers(users) {
    tableBody.innerHTML = '';

    if (!users.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">No users found</td>
        </tr>
      `;
      return;
    }

    users.forEach((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;

      const statusClass = (user.status || '').toLowerCase();

      tableBody.innerHTML += `
        <tr data-id="${user.userId}">
          <td class="flex-meta-cell">

            <div>
              <span class="cell-primary-title">${fullName}</span>
              <span class="cell-sub-label">${user.email}</span>
            </div>
          </td>

          <td>
            <span class="role-badge ${(user.role || '').toLowerCase()}">
              ${user.role}
            </span>
          </td>

          <td>
            <span class="cell-primary-title">${user.department || 'General'}</span>
          </td>

          <td>
            <!-- ✅ dynamic status styling -->
            <span class="status-indicator ${statusClass}">
              ${user.status}
            </span>
          </td>

          <td>
            <div class="row-actions-group">
              <!-- ✅ ONLY EDIT BUTTON (removed activate/deactivate) -->
              <button class="row-action-btn edit">Edit</button>
            </div>
          </td>
        </tr>
      `;
    });
  }

  /**
   * ✅ EDIT MODAL
   */
  const modalOverlay = document.getElementById('user-modal-overlay');
  const editForm = document.getElementById('user-edit-form');

  tableBody.addEventListener('click', (e) => {
    if (!e.target.classList.contains('edit')) return;

    const row = e.target.closest('tr');
    const userId = row.dataset.id;
    const user = allUsers.find(u => u.userId == userId);

    if (!user) return;

    // ✅ populate form
    document.getElementById('user-id').value = user.userId;
    document.getElementById('edit-firstName').value = user.firstName;
    document.getElementById('edit-lastName').value = user.lastName;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-department').value = user.department;
    document.getElementById('edit-role').value = user.role;

    // ✅ IMPORTANT FIX: status now loads
    document.getElementById('edit-status').value = user.status;

    modalOverlay.classList.remove('modal-hidden');
  });

  document.getElementById('close-user-modal')
    ?.addEventListener('click', () => modalOverlay.classList.add('modal-hidden'));

  document.getElementById('cancel-user-edit')
    ?.addEventListener('click', () => modalOverlay.classList.add('modal-hidden'));

  /**
   * ✅ UPDATE USER (STATUS INCLUDED)
   */
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = document.getElementById('user-id').value;

    const userData = {
      firstName: document.getElementById('edit-firstName').value.trim(),
      lastName: document.getElementById('edit-lastName').value.trim(),
      email: document.getElementById('edit-email').value.trim(),
      department: document.getElementById('edit-department').value.trim(),
      role: document.getElementById('edit-role').value,

      // ✅ ✅ CRITICAL FIX
      status: document.getElementById('edit-status').value,

      picUrl: null,
    };

    console.log("📤 Updating user:", userData);

    try {
      await updateAllUserDetails(userId, userData);

      modalOverlay.classList.add('modal-hidden');

      await loadUsers(); // ✅ refresh UI
    } catch (err) {
      console.error('❌ Update failed:', err);
      alert('Update failed');
    }
  });

  /**
   * ✅ CREATE USER MODAL
   */
  const addUserModal = document.getElementById('add-user-modal-overlay');
  const openAddUserBtn = document.getElementById('open-add-user-modal');
  const closeAddUserBtn = document.getElementById('close-add-user-modal');
  const cancelAddUserBtn = document.getElementById('cancel-add-user');
  const addUserForm = document.getElementById('add-user-form');

  function showAddUserModal() {
    addUserModal.classList.remove('modal-hidden');
  }

  function hideAddUserModal() {
    addUserModal.classList.add('modal-hidden');
    addUserForm.reset();
  }

  // ✅ FIX: ensure button works
  openAddUserBtn?.addEventListener('click', showAddUserModal);
  closeAddUserBtn?.addEventListener('click', hideAddUserModal);
  cancelAddUserBtn?.addEventListener('click', hideAddUserModal);

  addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      firstName: document.getElementById('add-firstName').value.trim(),
      lastName: document.getElementById('add-lastName').value.trim(),
      email: document.getElementById('add-email').value.trim(),
      password: document.getElementById('add-password').value.trim(),
      department: document.getElementById('add-department').value.trim(),
      picUrl: null,
    };

    console.log("📤 Creating user:", payload);

    try {
      const res = await fetch('http://localhost:8080/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      alert('✅ User created');

      hideAddUserModal();

      await loadUsers(); // ✅ refresh table

    } catch (err) {
      console.error('❌ Create failed:', err);
      alert('Create failed');
    }
  });

});