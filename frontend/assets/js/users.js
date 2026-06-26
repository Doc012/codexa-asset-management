// import {
//   getUserById,
//   updateAllUserDetails,
//   getAllUsers,
// } from '../../services/userService.js';
// import { API_BASE_URL } from './config.js';

// // async function getAllUsers() {
// //     const response = await fetch(`${API_BASE_URL}/users`);
// //     if (!response.ok) {
// //         throw new Error(`HTTP error! Status: ${response.status}`);
// //     }
// //     return await response.json();
// // }

// // document.addEventListener('DOMContentLoaded', async () => {
// //   const tableBody = document.getElementById('user-table-body');

// //   console.log(getAllUsers());

// //   try {
// //     const users = await getAllUsers();
// //     tableBody.innerHTML = ''; // Clear loader

// //     users.forEach((user) => {
// //       const row = document.createElement('tr');

// //       // Explicitly map properties to your JSON response keys
// //       row.innerHTML = `
// //                 <td>${user.fullName}</td>
// //                 <td>${user.email}</td>
// //                 <td>${user.department}</td>
// //                 <td><strong>${user.role}</strong></td>
// //             `;

// //       tableBody.appendChild(row);
// //     });
// //   } catch (error) {
// //     console.error('Failed to render users:', error);
// //     tableBody.innerHTML = `<tr><td colspan="4" style="color: red;">Error: ${error.message}</td></tr>`;
// //   }
// // });

// /**
//  * Admin
//  */
// document.addEventListener('DOMContentLoaded', async () => {
//   const tableBody = document.getElementById('userTableBody');
//   console.log(getAllUsers());

//   try {
//     const users = await getAllUsers();
//     tableBody.innerHTML = '';

//     users.forEach((user) => {
//       const row = document.createElement('tr');

//       const fullName = `${user.firstName} ${user.lastName}`;
//       const initials = `${user.firstName[0]}${user.lastName[0]}`;

//       row.innerHTML = `
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
//                       ${user.status}
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

//       tableBody.appendChild(row);
//     });
//   } catch (error) {
//     console.error('Failed to load users:', error);
//   }
// });

// /**
//  * GetUser by ID
//  */
// document.addEventListener('DOMContentLoaded', async () => {
//   const managerElement = document.querySelector('.card.welcome h2');
//   const profileNameElement = document.querySelector('.profile_info h2');
//   const profileRoleElement = document.querySelector('.role');
//   const profileEmailElement = document.querySelector('.user_email');
//   const userName = document.querySelector('.welcome-card h1');
//   const profileImage = document.querySelector('.profile-image');
//   const profileInitial = document.querySelector('.profile-initial');

//   try {
//     const managerId = 1;
//     const userId = 4;
//     const managerData = await getUserById(managerId);
//     const userData = await getUserById(userId);

//     if (managerData) {
//       if (managerElement) {
//         managerElement.textContent = `Welcome back, ${managerData.firstName}`;
//       }

//       if (profileNameElement) {
//         profileNameElement.textContent = `${managerData.firstName} ${managerData.lastName}`;
//       }

//       if (profileRoleElement) {
//         profileRoleElement.textContent = `Role: ${managerData.role}`;
//       }

//       if (profileEmailElement) {
//         profileEmailElement.textContent = `Email: ${managerData.email}`;
//       }
//     }

//     if (userData) {
//       if (userName) {
//         userName.textContent = `Welcome back, ${userData.firstName}`;
//       }
//       if (profileImage && profileInitial) {
//         if (userData.picUrl !== null) {
//           profileImage.src = userData.picUrl;
//         } else {
//           profileInitial.textContent = `${userData.firstName[0].toUpperCase()}`;
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// });

// /**
//  * UPDATE User details
//  */
// document.addEventListener('DOMContentLoaded', async () => {
//   const userId = 3;
//   try {
//     const currentUser = await getUserById(userId);
//     const form = document.querySelector('#profile-form');

//     const submitForm = form.addEventListener('submit', async (e) => {
//       e.preventDefault();
//       const userData = {
//         firstName: document.querySelector('#firstName').value,
//         lastName: document.querySelector('#lastName').value,
//         email: document.querySelector('#email').value,
//         department: currentUser.department,
//         status: document.querySelector("#status").value,
//         picUrl: currentUser.picUrl,
//       };
//       try {
//         const updateUserDetails = await updateAllUserDetails(userId, userData);
//       } catch (error) {
//         console.log(error);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });


// /**
//  * Display and filter
//  */
// document.addEventListener('DOMContentLoaded', async () => {
//   const searchInput = document.getElementById('userSearchInput');
//   const roleSelect = document.getElementById('userRoleFilter');
//   const tableBody = document.getElementById('userTableBody');

//   let allUsers = [];

//   // ✅ Load users
//   try {
//     const response = await getAllUsers();
//     allUsers = response;

//     renderUsers(allUsers);
//   } catch (error) {
//     console.error('Error loading users', error);
//   }

//   // ✅ Filter function (same pattern as assets)
//   function filterUsers() {
//     const query = searchInput.value.toLowerCase();
//     const roleValue = roleSelect.value.toUpperCase();

//     const filtered = allUsers.filter((user) => {
//       const name =
//         `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
//       const email = (user.email || '').toLowerCase();
//       const role = (user.role || '').toUpperCase();

//       const matchesSearch = name.includes(query) || email.includes(query);
//       const matchesRole = roleValue === 'ALL' || role === roleValue;

//       return matchesSearch && matchesRole;
//     });

//     renderUsers(filtered);
//   }

//   // ✅ Attach listeners
//   if (searchInput) searchInput.addEventListener('input', filterUsers);
//   if (roleSelect) roleSelect.addEventListener('change', filterUsers);

//   // ✅ Render function
//   function renderUsers(users) {
//     tableBody.innerHTML = '';

//     if (users.length === 0) {
//       tableBody.innerHTML = `
//                 <tr>
//                     <td colspan="5" style="text-align:center;">
//                         No users found
//                     </td>
//                 </tr>
//             `;
//       return;
//     }

//     users.forEach((user) => {
//       // FIX 1: Change user.id to user.userId to match your API response
//       const currentId = user.userId;

//       const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
//       const initials =
//         `${(user.firstName || 'U')[0]}${(user.lastName || 'SR')[0]}`.toUpperCase();

//       tableBody.innerHTML += `
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
//                     ${user.status}
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
//     });
//   }
// });

// /**
//  * create user
//  */
// document.addEventListener('DOMContentLoaded', () => {
//   // ✅ ELEMENTS
//   const addUserModal = document.getElementById('add-user-modal-overlay');
//   const openAddUserBtn = document.getElementById('open-add-user-modal');
//   const closeAddUserBtn = document.getElementById('close-add-user-modal');
//   const cancelAddUserBtn = document.getElementById('cancel-add-user');
//   const addUserForm = document.getElementById('add-user-form');

//   const addFirstName = document.getElementById('add-firstName');
//   const addLastName = document.getElementById('add-lastName');
//   const addEmail = document.getElementById('add-email');
//   const addDepartment = document.getElementById('add-department');
//   const addPassword = document.getElementById('add-password');

//   // ✅ SAFETY CHECK
//   if (!addUserModal || !addUserForm) {
//     console.error('❌ Add User modal or form not found in DOM');
//     return;
//   }

//   // ✅ MODAL CONTROLS
//   const showAddUserModal = () => {
//     addUserModal.classList.remove('modal-hidden');
//   };

//   const hideAddUserModal = () => {
//     addUserModal.classList.add('modal-hidden');
//     addUserForm.reset();
//   };

//   openAddUserBtn?.addEventListener('click', showAddUserModal);
//   closeAddUserBtn?.addEventListener('click', hideAddUserModal);
//   cancelAddUserBtn?.addEventListener('click', hideAddUserModal);

//   // ✅ CREATE USER
//   addUserForm.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const payload = {
//       firstName: addFirstName.value.trim(),
//       lastName: addLastName.value.trim(),
//       email: addEmail.value.trim(),
//       password: addPassword.value.trim(),
//       department: addDepartment.value.trim(),
//       picUrl: null,
//     };

//     // ✅ VALIDATION
//     if (!payload.firstName || !payload.lastName || !payload.email) {
//       alert('Please fill all required fields');
//       return;
//     }

//     if (!payload.password) {
//       alert('Password is required');
//       return;
//     }

//     console.log('📤 Sending payload:', payload);

//     try {
//       const response = await fetch('http://localhost:8080/api/v1/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       console.log('📥 Response status:', response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Backend error:', errorText);
//         alert('❌ ' + errorText);
//         return;
//       }

//       const newUser = await response.json();
//       console.log('✅ User created:', newUser);

//       alert('✅ User created successfully');

//       hideAddUserModal();

//       // ✅ OPTION 1: Reload page (guaranteed update)
//       location.reload();

//       // ✅ OPTION 2 (if you have getAllUsers implemented)
//       // await reloadUsers();

//     } catch (err) {
//       console.error('❌ Network error:', err);
//       alert('Network error. Check backend.');
//     }
//   });

//   // ✅ OPTIONAL: DYNAMIC RELOAD SUPPORT
//   async function reloadUsers() {
//     try {
//       if (typeof getAllUsers !== 'function') {
//         console.warn('⚠️ getAllUsers() not defined, falling back to reload');
//         location.reload();
//         return;
//       }

//       const users = await getAllUsers();
//       renderUsers(users);
//     } catch (err) {
//       console.error('❌ Failed to reload users:', err);
//       location.reload();
//     }
//   }

//   // ✅ OPTIONAL: TABLE RENDER
//   function renderUsers(users) {
//     const tableBody = document.getElementById('userTableBody');
//     if (!tableBody) return;

//     tableBody.innerHTML = '';

//     users.forEach((user) => {
//       const fullName = `${user.firstName} ${user.lastName}`;
//       const initials = `${user.firstName[0]}${user.lastName[0]}`;

//       const statusClass = (user.status || '').toLowerCase();

//       console.log(user.status);

//       tableBody.innerHTML += `
//         <tr data-id="${user.userId}">
//           <td class="flex-meta-cell">
//             <div class="table-img-frame initial-avatar">
//               <span>${initials}</span>
//             </div>
//             <div>
//               <span class="cell-primary-title">${fullName}</span>
//               <span class="cell-sub-label">${user.email}</span>
//             </div>
//           </td>

//           <td>
//             <span class="role-badge ${(user.role || 'STAFF').toLowerCase()}">
//               ${user.role}
//             </span>
//           </td>

//           <td>
//             <span class="cell-primary-title">${user.department || 'General'}</span>
//             <span class="cell-sub-label">Managed Profile</span>
//           </td>

//           <td>
//             <span class="status-indicator ${statusClass}">
//             ${user.status}
//             </span>
//           </td>

//           <td>
//             <div class="row-actions-group">
//               <button class="row-action-btn edit">Edit</button>

//               ${(user.status || '').toUpperCase() === 'ACTIVE' ? 
//                 `<button class="row-action-btn deactivate-btn" data-id="${user.userId}">Deactivate</button>`
//                 : `<button class="row-action-btn activate-btn" data-id="${user.userId}">Activate</button>`
//               }
//             </div>
//           </td>

//         </tr>
//       `;
//     });
//   }

//   document.addEventListener('click', async (e) => {
//   // ✅ DEACTIVATE
//     if (e.target.classList.contains('deactivate-btn')) {
//       const userId = e.target.dataset.id;
//       const confirmAction = confirm('Deactivate this user?');
//       if (!confirmAction) return;
      
//       try {
//         const res = await fetch(
//           `http://localhost:8080/api/v1/users/${userId}/deactivate`,
//           { method: 'PATCH' }
//         );

//         if (!res.ok) throw new Error('Deactivate failed');

//         alert('✅ User deactivated');

//         location.reload(); // simple refresh

//       } catch (err) {
//         console.error(err);
//         alert('❌ Failed to deactivate user');
//       }
//     }

//     // ✅ ACTIVATE (optional but recommended)
//     if (e.target.classList.contains('activate-btn')) {
//       const userId = e.target.dataset.id;

//       try {
//         const res = await fetch(
//           `http://localhost:8080/api/v1/users/${userId}/activate`,
//           { method: 'PATCH' }
//         );

//         if (!res.ok) throw new Error('Activate failed');

//         alert('✅ User activated');

//         location.reload();

//       } catch (err) {
//         console.error(err);
//         alert('❌ Failed to activate user');
//       }
//     }
//   });

// });

// /**
//  * Edit User Modal Logic (Using Event Delegation)
//  */
// document.addEventListener('DOMContentLoaded', () => {
//   const tableBody = document.getElementById('userTableBody');
//   const modalOverlay = document.getElementById('user-modal-overlay');
//   const closeModalBtn = document.getElementById('close-user-modal');
//   const cancelModalBtn = document.getElementById('cancel-user-edit');
//   const editForm = document.getElementById('user-edit-form');

//   function openModal(rowElement) {
//     if (!modalOverlay) return;

//     const userId = rowElement.getAttribute('data-id');
//     const fullNameText = rowElement
//       .querySelector('.cell-primary-title')
//       .textContent.trim();
//     const email = rowElement
//       .querySelector('.cell-sub-label')
//       .textContent.trim();
//     const department = rowElement.cells[2]
//       .querySelector('.cell-primary-title')
//       .textContent.trim();
//     const role = rowElement.cells[1]
//       .querySelector('.role-badge')
//       .textContent.trim()
//       .toUpperCase();

//     const status = rowElement.cells[3]
//       .querySelector('.status-indicator')
//       .textContent.trim();

// document.getElementById('edit-status').value = status;

//     const nameParts = fullNameText.split(' ');
//     const firstName = nameParts[0] || '';
//     const lastName = nameParts.slice(1).join(' ') || '';

//     document.getElementById('user-id').value = userId;
//     document.getElementById('edit-firstName').value = firstName;
//     document.getElementById('edit-lastName').value = lastName;
//     document.getElementById('edit-email').value = email;
//     document.getElementById('edit-department').value = department;
//     document.getElementById('edit-status').value = status;
//     document.getElementById('edit-role').value = role;

//     modalOverlay.classList.remove('modal-hidden');
//   }

//   function closeModal() {
//     if (modalOverlay) modalOverlay.classList.add('modal-hidden');
//   }

//   if (tableBody) {
//     tableBody.addEventListener('click', (event) => {
//       const editButton = event.target.closest('.row-action-btn.edit');
//       if (editButton) {
//         const targetRow = editButton.closest('tr');
//         if (targetRow) openModal(targetRow);
//       }
//     });
//   }

//   if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
//   if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

//   if (editForm) {
//     editForm.addEventListener('submit', async (e) => {
//       e.preventDefault();

//       const userId = document.getElementById('user-id').value;
//       const rawDepartmentValue = document
//         .getElementById('edit-department')
//         .value.trim();

//       const formattedDepartment = rawDepartmentValue
//         .toLowerCase()
//         .endsWith('department')
//         ? rawDepartmentValue
//         : `${rawDepartmentValue} Department`;

//       // ✅ FIXED PAYLOAD: Explicitly match the backend's CreateUserRequest structural properties
//       const userData = {
//         firstName: document.getElementById('edit-firstName').value.trim(),
//         lastName: document.getElementById('edit-lastName').value.trim(),
//         email: document.getElementById('edit-email').value.trim(),
//         department: formattedDepartment,
//         role: document.getElementById('edit-role').value,
//         status: document.getElementById('edit-status').value,
//         picUrl: null, // ✅ Explicitly passes your expected schema parameter safely
//       };

//       try {
//         await updateAllUserDetails(userId, userData);
//         closeModal();
//         window.location.reload();
//       } catch (error) {
//         console.error('Failed to update user:', error);
//         alert('An error occurred while saving user updates.');
//       }
//     });
//   }
// });

/**
 * 
 */
import {
  getAllUsers,
  updateAllUserDetails,
} from '../../services/userService.js';

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
      const initials = `${user.firstName[0]}${user.lastName[0]}`;

      const statusClass = (user.status || '').toLowerCase();

      tableBody.innerHTML += `
        <tr data-id="${user.userId}">
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
            <span class="role-badge ${(user.role || '').toLowerCase()}">
              ${user.role}
            </span>
          </td>

          <td>
            <span class="cell-primary-title">${user.department || 'General'}</span>
            <span class="cell-sub-label">Managed Profile</span>
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