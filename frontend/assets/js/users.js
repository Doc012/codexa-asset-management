import {
    getAllUsers,
    createUser,
    updateAllUserDetails,
    updateUserStatus
} from "../../../services/userService.js";

// ─── State ────────────────────────────────────────────────────────────────────
let allUsers = [];

// ─── Static DOM refs ──────────────────────────────────────────────────────────
const tableBody     = document.getElementById("userTableBody");
const searchInput   = document.getElementById("userSearchInput");
const roleFilter    = document.getElementById("userRoleFilter");

// Edit modal
const editOverlay   = document.getElementById("user-modal-overlay");
const editModalTitle= document.getElementById("user-modal-title");
const closeEditBtn  = document.getElementById("close-user-modal");
const cancelEditBtn = document.getElementById("cancel-user-edit");
const editForm      = document.getElementById("user-edit-form");
const editUserId    = document.getElementById("user-id");
const editFirstName = document.getElementById("edit-firstName");
const editLastName  = document.getElementById("edit-lastName");
const editEmail     = document.getElementById("edit-email");
const editDepartment= document.getElementById("edit-department");
const editRole      = document.getElementById("edit-role");
const editStatus    = document.getElementById("edit-status");

// Add modal
const addOverlay    = document.getElementById("add-user-modal-overlay");
const openAddBtn    = document.getElementById("open-add-user-modal");
const closeAddBtn   = document.getElementById("close-add-user-modal");
const cancelAddBtn  = document.getElementById("cancel-add-user");
const addForm       = document.getElementById("add-user-form");
const addFirstName  = document.getElementById("add-firstName");
const addLastName   = document.getElementById("add-lastName");
const addEmail      = document.getElementById("add-email");
const addDepartment = document.getElementById("add-department");
const addPassword   = document.getElementById("add-password");

// ─── Bootstrap ────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
    injectDetailsModal();
    await loadAndRender();
    bindStaticEvents();
});

// ─── Data loading ─────────────────────────────────────────────────────────────
async function loadAndRender() {
    try {
        allUsers = await getAllUsers();
        renderTable(allUsers);
    } catch (err) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="color:red;text-align:center;padding:2rem;">
                    Failed to load users: ${err.message}
                </td>
            </tr>`;
    }
}

// ─── Table rendering ──────────────────────────────────────────────────────────
function renderTable(users) {
    if (!users.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;color:#888;padding:2rem;">
                    No users found.
                </td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = users.map(user => `
        <tr data-id="${user.userId}">

            <!-- User Information -->
            <td>
                <div class="flex-meta-cell user-info-cell">
                    <div class="user-avatar" aria-hidden="true">
                        ${avatarHtml(user)}
                    </div>
                    <div>
                        <button
                            class="cell-primary-title user-view-link"
                            data-id="${user.userId}"
                            style="background:none;border:none;padding:0;cursor:pointer;color:inherit;font:inherit;text-align:left;text-decoration:underline dotted;"
                            title="View full details"
                        >${user.firstName} ${user.lastName}</button>
                        <span class="cell-sub-label">${user.email}</span>
                    </div>
                </div>
            </td>

            <!-- Role -->
            <td>
                <span class="cell-tag-chip ${roleChipClass(user.role)}">${formatLabel(user.role)}</span>
            </td>

            <!-- Department -->
            <td>
                <span class="cell-data-text">${user.department || '-'}</span>
            </td>

            <!-- Status -->
            <td>
                <span class="status-badge ${userStatusClass(user.status)}">
                    ${formatLabel(user.status) || '-'}
                </span>
            </td>

            <!-- Actions -->
            <td>
                <div class="row-actions-group">
                    <button class="row-action-btn view"   data-id="${user.userId}" title="View Details">View</button>
                    <button class="row-action-btn edit"   data-id="${user.userId}" title="Edit User">Edit</button>
                </div>
            </td>
        </tr>
    `).join("");

    tableBody.querySelectorAll(".row-action-btn.view, .user-view-link").forEach(btn =>
        btn.addEventListener("click", () => openDetailsModal(+btn.dataset.id))
    );
    tableBody.querySelectorAll(".row-action-btn.edit").forEach(btn =>
        btn.addEventListener("click", () => openEditModal(+btn.dataset.id))
    );
}

// ─── User Details Modal ───────────────────────────────────────────────────────
// Injected into the page at runtime - no HTML changes needed.
let detailsModal, detailsBody, closeDetails;

function injectDetailsModal() {
    const el = document.createElement("div");
    el.id = "user-details-modal";
    el.innerHTML = `
        <div class="modal-content asset-modal-content">
            <span id="close-user-details" style="float:right;cursor:pointer;font-size:20px;">&times;</span>
            <div id="user-details-body"></div>
        </div>
    `;
    el.style.cssText = `
        display:none;position:fixed;inset:0;
        background:rgba(0,0,0,0.45);z-index:1000;
        align-items:center;justify-content:center;padding:1rem;
    `;
    document.body.appendChild(el);

    detailsModal = el;
    detailsBody  = document.getElementById("user-details-body");
    closeDetails = document.getElementById("close-user-details");

    closeDetails.addEventListener("click", closeDetailsModal);
    detailsModal.addEventListener("click", e => {
        if (e.target === detailsModal) closeDetailsModal();
    });
}

function openDetailsModal(id) {
    const user = allUsers.find(u => u.userId === id);
    if (!user) return;

    detailsBody.innerHTML = `
        <div class="asset-details-layout">

            <!-- Hero -->
            <div class="asset-details-hero">
                <div class="asset-details-img-wrap" style="display:flex;align-items:center;justify-content:center;background:#f3f4f6;">
                    ${user.picUrl
                        ? `<img src="${user.picUrl}" alt="${user.firstName}" style="width:100%;height:100%;object-fit:cover;"
                               onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='flex';" />
                           <div class="avatar-fallback-lg" style="display:none;">${initials(user)}</div>`
                        : `<div class="avatar-fallback-lg">${initials(user)}</div>`
                    }
                </div>
                <div class="asset-details-hero-meta">
                    <h2 class="asset-details-title">${user.firstName} ${user.lastName}</h2>
                    <p class="asset-details-id">User ID #${user.userId}</p>
                    <div class="asset-details-badges">
                        <span class="status-badge ${userStatusClass(user.status)}">
                            ${formatLabel(user.status) || 'No Status'}
                        </span>
                        <span class="cell-tag-chip ${roleChipClass(user.role)}">${formatLabel(user.role)}</span>
                    </div>
                </div>
            </div>

            <!-- Detail grid -->
            <div class="asset-details-grid">
                ${detailRow("Email",      user.email)}
                ${detailRow("Department", user.department)}
                ${detailRow("Role",       formatLabel(user.role))}
                ${detailRow("Status",     formatLabel(user.status) || '-')}
            </div>

            <!-- Footer -->
            <div class="asset-details-actions">
                <button class="portal-btn secondary" id="details-user-edit-btn" data-id="${user.userId}">
                    Edit User
                </button>
            </div>
        </div>
    `;

    document.getElementById("details-user-edit-btn").addEventListener("click", () => {
        closeDetailsModal();
        openEditModal(id);
    });

    detailsModal.style.display = "flex";}

function closeDetailsModal() {
    detailsModal.style.display = "none";
    detailsBody.innerHTML = "";
}

function detailRow(label, value) {
    return `
        <div class="asset-detail-row">
            <span class="detail-label">${label}</span>
            <span class="detail-value">${value ?? '-'}</span>
        </div>
    `;
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function openEditModal(id) {
    const user = allUsers.find(u => u.userId === id);
    if (!user) return;

    editModalTitle.textContent = `Edit - ${user.firstName} ${user.lastName}`;
    editUserId.value           = user.userId;
    editFirstName.value        = user.firstName   || "";
    editLastName.value         = user.lastName    || "";
    editEmail.value            = user.email       || "";
    editDepartment.value       = user.department  || "";
    editRole.value             = user.role        || "STAFF";
    editStatus.value           = user.status      || "ACTIVE";

    editOverlay.classList.remove("modal-hidden");
}

function closeEditModal() {
    editOverlay.classList.add("modal-hidden");
    editForm.reset();
}

// ─── Add Modal ────────────────────────────────────────────────────────────────
function openAddModal() {
    addForm.reset();
    addOverlay.classList.remove("modal-hidden");
}

function closeAddModal() {
    addOverlay.classList.add("modal-hidden");
    addForm.reset();
}

// ─── CRUD handlers ────────────────────────────────────────────────────────────
async function handleUpdate(e) {
    e.preventDefault();
    if (!editForm.reportValidity()) return;

    const id = +editUserId.value;

    const user = allUsers.find(u => u.userId === id);

    const userPayload = {
        firstName:  editFirstName.value.trim(),
        lastName:   editLastName.value.trim(),
        email:      editEmail.value.trim(),
        department: editDepartment.value.trim(),
        role:       editRole.value
    };

    const newStatus = editStatus.value;

    try {
        await updateAllUserDetails(id, userPayload);

        if (user && user.status !== newStatus) {
            await updateUserStatus(id, newStatus);
        }

        closeEditModal();
        showSuccess("User updated successfully.");
        await loadAndRender();

    } catch (err) {
        alert(`Failed to update user: ${err.message}`);
    }
}

async function handleCreate(e) {
    e.preventDefault();
    if (!addForm.reportValidity()) return;

    const payload = {
        firstName:  addFirstName.value.trim(),
        lastName:   addLastName.value.trim(),
        email:      addEmail.value.trim(),
        department: addDepartment.value.trim(),
        password:   addPassword.value,
    };

    try {
        await createUser(payload);
        closeAddModal();
        showSuccess("User created successfully.");
        await loadAndRender();
    } catch (err) {
        alert(`Failed to create user: ${err.message}`);
    }
}

// ─── Filtering / search ───────────────────────────────────────────────────────
function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const role  = roleFilter.value;

    const filtered = allUsers.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

        const matchSearch =
            !query ||
            fullName.includes(query) ||
            (user.email      || "").toLowerCase().includes(query) ||
            (user.department || "").toLowerCase().includes(query);

        const matchRole =
            role === "all" ||
            user.role === role;

        return matchSearch && matchRole;
    });

    renderTable(filtered);
}

// ─── Static event bindings ────────────────────────────────────────────────────
function bindStaticEvents() {
    // Edit modal
    closeEditBtn.addEventListener("click", closeEditModal);
    cancelEditBtn.addEventListener("click", closeEditModal);
    editOverlay.addEventListener("click", e => {
        if (e.target === editOverlay) closeEditModal();
    });
    editForm.addEventListener("submit", handleUpdate);

    // Add modal
    openAddBtn.addEventListener("click", openAddModal);
    closeAddBtn.addEventListener("click", closeAddModal);
    cancelAddBtn.addEventListener("click", closeAddModal);
    addOverlay.addEventListener("click", e => {
        if (e.target === addOverlay) closeAddModal();
    });
    addForm.addEventListener("submit", handleCreate);

    // Filters
    searchInput.addEventListener("input", applyFilters);
    roleFilter.addEventListener("change", applyFilters);
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function formatLabel(value) {
    if (!value) return "";
    return value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
}

function initials(user) {
    return `${(user.firstName?.[0] || "").toUpperCase()}${(user.lastName?.[0] || "").toUpperCase()}`;
}

/** Inline avatar: photo if available, coloured initials fallback */
function avatarHtml(user) {
    if (user.picUrl) {
        return `<img
            src="${user.picUrl}"
            alt="${user.firstName}"
            class="user-avatar-img"
            onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='flex';"
        /><span class="user-avatar-initials" style="display:none;">${initials(user)}</span>`;
    }
    return `<span class="user-avatar-initials">${initials(user)}</span>`;
}

function roleChipClass(role) {
    const map = {
        ADMIN:   "font-red",
        MANAGER: "font-orange",
        STAFF:   "font-blue",
    };
    return map[role] ?? "font-blue";
}

function userStatusClass(status) {
    const map = {
        ACTIVE:               "good",
        INACTIVE:             "danger",
        PENDING_VERIFICATION: "warning",
        PENDING_APPROVAL:     "warning",
    };
    return map[status] ?? "";
}

// Reuses the shared #successMessage element
const successMessage = document.getElementById("successMessage");

function showSuccess(message) {
    if (!successMessage) return;
    successMessage.textContent = message;
    successMessage.style.display = "block";
    successMessage.classList.add("visible");
    setTimeout(() => {
        successMessage.classList.remove("visible");
        setTimeout(() => (successMessage.style.display = "none"), 400);
    }, 3000);
}