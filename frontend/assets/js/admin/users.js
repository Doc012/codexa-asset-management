import { getUserById, updateAllUserDetails, getAllUsers, } from "../../../services/userService.js";
import { API_BASE_URL } from "../../js/config.js"
import { getUser } from "../authContext.js"

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('userTableBody');
  const searchInput = document.getElementById('userSearchInput');
  const roleSelect = document.getElementById('userRoleFilter');

  let allUsers = [];

  /**
   * Fetches all users from the database and renders them in the table.
   */
  async function loadUsers() {
    try {
      allUsers = await getAllUsers();
      renderUsers(allUsers);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  }

  await loadUsers();

  /**
   * Filters the user dataset based on search queries and selected roles.
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
   * Generates markup for users and injects it into the table body element.
   * @param {Array} users - Array of filtered or unfiltered user objects.
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
            <span class="status-indicator ${statusClass}">
              ${user.status}
            </span>
          </td>
          <td>
            <div class="row-actions-group">
              <button class="row-action-btn edit">Edit</button>
            </div>
          </td>
        </tr>
      `;
    });
  }

  const modalOverlay = document.getElementById('user-modal-overlay');
  const editForm = document.getElementById('user-edit-form');

  tableBody.addEventListener('click', (e) => {
    if (!e.target.classList.contains('edit')) return;

    const row = e.target.closest('tr');
    const userId = row.dataset.id;
    const user = allUsers.find(u => u.userId == userId);

    if (!user) return;

    document.getElementById('user-id').value = user.userId;
    document.getElementById('edit-firstName').value = user.firstName;
    document.getElementById('edit-lastName').value = user.lastName;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-department').value = user.department;
    document.getElementById('edit-role').value = user.role;
    document.getElementById('edit-status').value = user.status;

    modalOverlay.classList.remove('modal-hidden');
  });

  document.getElementById('close-user-modal')
    ?.addEventListener('click', () => modalOverlay.classList.add('modal-hidden'));

  document.getElementById('cancel-user-edit')
    ?.addEventListener('click', () => modalOverlay.classList.add('modal-hidden'));

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = document.getElementById('user-id').value;

    const userData = {
      firstName: document.getElementById('edit-firstName').value.trim(),
      lastName: document.getElementById('edit-lastName').value.trim(),
      email: document.getElementById('edit-email').value.trim(),
      department: document.getElementById('edit-department').value.trim(),
      role: document.getElementById('edit-role').value,
      status: document.getElementById('edit-status').value,
      picUrl: null,
    };

    console.log("Updating user:", userData);

    try {
      await updateAllUserDetails(userId, userData);
      modalOverlay.classList.add('modal-hidden');
      await loadUsers(); 
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed');
    }
  });

  const addUserModal = document.getElementById('add-user-modal-overlay');
  const openAddUserBtn = document.getElementById('open-add-user-modal');
  const closeAddUserBtn = document.getElementById('close-add-user-modal');
  const cancelAddUserBtn = document.getElementById('cancel-add-user');
  const addUserForm = document.getElementById('add-user-form');

  /**
   * Displays the modal overlay for creating a new user profile.
   */
  function showAddUserModal() {
    addUserModal.classList.remove('modal-hidden');
  }

  /**
   * Dismisses and resets the modal entry fields for the user creation form.
   */
  function hideAddUserModal() {
    addUserModal.classList.add('modal-hidden');
    addUserForm.reset();
  }

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

    try {
      const res = await fetch('http://localhost:8080/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      hideAddUserModal();
      await loadUsers();
    } catch (err) {
      console.error('Create failed:', err);
      alert('Create failed');
    }
  });

});