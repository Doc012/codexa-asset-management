import {
    getAllAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    retireAsset,
} from "../../../services/assetService.js";

let allAssets     = [];
let pendingAction = null; 

const tableBody       = document.getElementById("assets-table-body");
const searchInput     = document.getElementById("asset-search-input");
const categoryFilter  = document.getElementById("filter-category-select");
const conditionFilter = document.getElementById("conditionFilter");

const modalOverlay  = document.getElementById("asset-modal-overlay");
const modalTitle    = document.getElementById("modal-form-title");
const openAddBtn    = document.getElementById("open-add-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cancelFormBtn = document.getElementById("cancel-form-btn");
const assetForm     = document.getElementById("asset-crud-form");

const formAssetId   = document.getElementById("form-asset-id");
const formTitle     = document.getElementById("form-title");
const formCategory  = document.getElementById("form-category");
const formSerial    = document.getElementById("form-serial");
const formDate      = document.getElementById("form-date");
const formCost      = document.getElementById("form-cost");
const formCondition = document.getElementById("form-condition");
const formLocation  = document.getElementById("form-location");
const formPhoto     = document.getElementById("form-photo");

const confirmModal   = document.getElementById("btnConfirmation");
const confirmBtn     = document.getElementById("confirmBtn");
const cancelBtn      = document.getElementById("cancelBtn");

const detailsModal   = document.getElementById("assetDetailsModal");
const detailsBody    = document.getElementById("assetDetailsBody");
const closeDetails   = document.getElementById("closeAssetModal");

const successMessage = document.getElementById("successMessage");

const field = {
    assetStatus: () => document.getElementById("form-asset-status"),
};

document.addEventListener("DOMContentLoaded", async () => {
    injectMissingFormFields();
    await loadAndRender();
    bindStaticEvents();
});

/**
 * Injects missing form fields into the DOM on page load.
 */
function injectMissingFormFields() {
    const conditionRow = document.getElementById("form-condition").closest(".form-row");

    const extraRow = document.createElement("div");
    extraRow.className = "form-row";
    extraRow.innerHTML = `
        <div class="form-field">
            <label>Asset Status</label>
            <select id="form-asset-status">
                <option value="">— None —</option>
                <option value="AVAILABLE">Available</option>
                <option value="LOANED">Loaned</option>
                <option value="RETIRED">Retired</option>
            </select>
        </div>
    `;

    conditionRow.insertAdjacentElement("afterend", extraRow);
}

/**
 * Fetches all assets from the service and renders them in the table.
 */
async function loadAndRender() {
    try {
        allAssets = await getAllAssets();
        renderTable(allAssets);
    } catch (err) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="color:red;text-align:center;padding:2rem;">
                    Failed to load assets: ${err.message}
                </td>
            </tr>`;
    }
}

/**
 * Renders the asset list rows and attaches event listeners to action buttons.
 * @param {Array} assets - The list of assets to display.
 */
function renderTable(assets) {
    if (!assets.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:#888;padding:2rem;">
                    No assets found.
                </td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = assets.map(asset => `
        <tr data-id="${asset.assetId}">
            <td>
                <div class="flex-meta-cell">
                    <button
                        class="cell-primary-title asset-view-link"
                        data-id="${asset.assetId}"
                        style="background:none;border:none;padding:0;cursor:pointer;color:inherit;font:inherit;text-align:left;text-decoration:underline dotted;"
                        title="View full details"
                    >${asset.title}</button>
                    <span class="cell-sub-label">Asset ID #${asset.assetId}</span>
                </div>
            </td>
            <td>
                <div class="table-img-frame">
                    <img
                        src="${asset.photoPath || ''}"
                        alt="Asset image"
                        onerror="this.onerror=null;this.src='https://placehold.co/60x60?text=No+Image';"
                    />
                </div>
            </td>
            <td>
                <span class="cell-tag-chip font-blue">${formatLabel(asset.category)}</span>
            </td>
            <td>
                <span class="status-badge ${statusClass(asset.assetStatus)}">
                    ${formatLabel(asset.assetStatus) || '—'}
                </span>
            </td>
            <td>
                <span class="cell-data-text">${formatLabel(asset.condition)}</span>
            </td>
            <td>
                <div class="row-actions-group">
                    <button class="row-action-btn view"   data-id="${asset.assetId}" title="View Details">View</button>
                    <button class="row-action-btn edit"   data-id="${asset.assetId}" title="Edit Asset">Edit</button>
                    <button class="row-action-btn retire" data-id="${asset.assetId}" title="Retire Asset">Retire</button>
                    <button class="row-action-btn delete" data-id="${asset.assetId}" title="Delete Asset">Delete</button>
                </div>
            </td>
        </tr>
    `).join("");

    tableBody.querySelectorAll(".row-action-btn.view, .asset-view-link").forEach(btn =>
        btn.addEventListener("click", () => openDetailsModal(+btn.dataset.id))
    );
    tableBody.querySelectorAll(".row-action-btn.edit").forEach(btn =>
        btn.addEventListener("click", () => openEditModal(+btn.dataset.id))
    );
    tableBody.querySelectorAll(".row-action-btn.retire").forEach(btn =>
        btn.addEventListener("click", () => requestConfirmation("retire", +btn.dataset.id))
    );
    tableBody.querySelectorAll(".row-action-btn.delete").forEach(btn =>
        btn.addEventListener("click", () => requestConfirmation("delete", +btn.dataset.id))
    );
}

/**
 * Displays the detailed view modal for a specific asset.
 * @param {number} id - The ID of the asset to view.
 */
function openDetailsModal(id) {
    const asset = allAssets.find(a => a.assetId === id);
    if (!asset) return;

    detailsBody.innerHTML = `
        <div class="asset-details-layout">
            <div class="asset-details-hero">
                <div class="asset-details-img-wrap">
                    <img
                        src="${asset.photoPath || ''}"
                        alt="${asset.title}"
                        onerror="this.onerror=null;this.src='https://placehold.co/200x160?text=No+Image';"
                    />
                </div>
                <div class="asset-details-hero-meta">
                    <h2 class="asset-details-title">${asset.title}</h2>
                    <p class="asset-details-id">Asset ID #${asset.assetId}</p>
                    <div class="asset-details-badges">
                        <span class="status-badge ${statusClass(asset.assetStatus)}">
                            ${formatLabel(asset.assetStatus) || 'No Status'}
                        </span>
                        <span class="cell-tag-chip font-blue">${formatLabel(asset.category)}</span>
                    </div>
                </div>
            </div>

            <div class="asset-details-grid">
                ${detailRow("Serial Number",    asset.serialNumber)}
                ${detailRow("Condition",        formatLabel(asset.condition))}
                ${detailRow("Asset Status",     formatLabel(asset.assetStatus) || '—')}
                ${detailRow("Acquisition Date", formatDate(asset.acquisitionDate))}
                ${detailRow("Cost",             formatCurrency(asset.cost))}
                ${detailRow("Location",         asset.location)}
            </div>

            <div class="asset-details-actions">
                <button class="portal-btn secondary" id="details-edit-btn" data-id="${asset.assetId}">
                    Edit Asset
                </button>
                <button
                    class="portal-btn primary"
                    id="details-retire-btn"
                    data-id="${asset.assetId}"
                    style="background:var(--color-warning, #e07b00);"
                >
                    Retire Asset
                </button>
            </div>
        </div>
    `;

    document.getElementById("details-edit-btn").addEventListener("click", () => {
        closeDetailsModal();
        openEditModal(id);
    });
    document.getElementById("details-retire-btn").addEventListener("click", () => {
        closeDetailsModal();
        requestConfirmation("retire", id);
    });

    detailsModal.style.display = "flex";
}

/**
 * Closes the asset details modal and clears its contents.
 */
function closeDetailsModal() {
    detailsModal.style.display = "none";
    detailsBody.innerHTML = "";
}

/**
 * Generates an HTML string for a single row in the details view.
 * @param {string} label - The label of the detail field.
 * @param {any} value - The value of the detail field.
 * @returns {string} The formatted detail row template string.
 */
function detailRow(label, value) {
    return `
        <div class="asset-detail-row">
            <span class="detail-label">${label}</span>
            <span class="detail-value">${value ?? '—'}</span>
        </div>
    `;
}

/**
 * Resets the form and configures it to display as the creation modal.
 */
function openAddModal() {
    modalTitle.textContent = "Add System Asset";
    assetForm.reset();
    formAssetId.value = "";
    field.assetStatus().value = "";
    syncFormButtons("add");
    showFormModal();
}

/**
 * Populates the form fields with existing asset data and displays it as an editor.
 * @param {number} id - The ID of the asset to edit.
 */
function openEditModal(id) {
    const asset = allAssets.find(a => a.assetId === id);
    if (!asset) return;

    modalTitle.textContent    = "Edit Asset";
    formAssetId.value         = asset.assetId;
    formTitle.value           = asset.title           || "";
    formCategory.value        = asset.category        || "";
    formSerial.value          = asset.serialNumber    || "";
    formDate.value            = asset.acquisitionDate || "";
    formCost.value            = asset.cost            ?? "";
    formCondition.value       = asset.condition       || "";
    formLocation.value        = asset.location        || "";
    field.assetStatus().value = asset.assetStatus     || "";

    syncFormButtons("edit");
    showFormModal();
}

/**
 * Displays the asset creation or editor modal form.
 */
function showFormModal()  { modalOverlay.classList.remove("modal-hidden"); }

/**
 * Closes the modal form and resets its fields.
 */
function closeFormModal() { modalOverlay.classList.add("modal-hidden"); assetForm.reset(); }

/**
 * Configures actions and text for the form submit buttons based on current operation mode.
 * @param {string} mode - The current form mode, either 'add' or 'edit'.
 */
function syncFormButtons(mode) {
    const [leftBtn, rightBtn] = document.querySelectorAll(".form-actions .portal-btn");

    leftBtn.textContent  = "Cancel";
    leftBtn.onclick      = closeFormModal;

    if (mode === "add") {
        rightBtn.textContent = "Save Asset";
        rightBtn.onclick     = handleSave;
    } else {
        rightBtn.textContent = "Update Asset";
        rightBtn.onclick     = handleUpdate;
    }
}

/**
 * Handles the creation of a new asset from the form data.
 */
async function handleSave() {
    if (!assetForm.reportValidity()) return;

    try {
        await createAsset(buildPayload());
        closeFormModal();
        showSuccess("Asset created successfully.");
        await loadAndRender();
    } catch (err) {
        alert(`Failed to create asset: ${err.message}`);
    }
}

/**
 * Handles the updates submitted through the asset editor form.
 */
async function handleUpdate() {
    if (!assetForm.reportValidity()) return;

    const id = +formAssetId.value;
    try {
        await updateAsset(id, buildPayload());
        closeFormModal();
        showSuccess("Asset updated successfully.");
        await loadAndRender();
    } catch (err) {
        alert(`Failed to update asset: ${err.message}`);
    }
}

/**
 * Opens a confirmation modal for a specific user action.
 * @param {string} type - The operation action type (e.g., 'retire', 'delete').
 * @param {number} id - The ID of the asset targeted by the action.
 */
function requestConfirmation(type, id) {
    pendingAction = { type, id };
    confirmModal.style.display = "flex";
}

/**
 * Performs the execution of a confirmed pending action.
 */
async function executeConfirmedAction() {
    if (!pendingAction) return;
    const { type, id } = pendingAction;

    try {
        if (type === "retire") {
            await retireAsset(id);
            showSuccess("Asset retired.");
        } else if (type === "delete") {
            await deleteAsset(id);
            showSuccess("Asset deleted.");
        }
        await loadAndRender();
    } catch (err) {
        alert(`Action failed: ${err.message}`);
    } finally {
        confirmModal.style.display = "none";
        pendingAction = null;
    }
}

/**
 * Constructs a structured data object from the current state of form fields.
 * @returns {Object} The constructed asset payload object.
 */
function buildPayload() {
    return {
        title:           formTitle.value.trim(),
        category:        formCategory.value,
        serialNumber:    formSerial.value.trim(),
        acquisitionDate: formDate.value,
        cost:            parseFloat(formCost.value),
        condition:       formCondition.value,
        location:        formLocation.value.trim(),
        assetStatus:     field.assetStatus().value || null,
    };
}

/**
 * Evaluates active filter values and refreshes the asset table display.
 */
function applyFilters() {
    const query     = searchInput.value.trim().toLowerCase();
    const category  = categoryFilter.value;
    const condition = conditionFilter.value;

    const filtered = allAssets.filter(asset => {
        const matchSearch =
            !query ||
            asset.title.toLowerCase().includes(query) ||
            (asset.serialNumber || "").toLowerCase().includes(query) ||
            (asset.location     || "").toLowerCase().includes(query);

        const matchCategory =
            category === "all" ||
            formatLabel(asset.category).toLowerCase() === category.toLowerCase();

        const matchCondition =
            !condition ||
            asset.condition === condition;

        return matchSearch && matchCategory && matchCondition;
    });

    renderTable(filtered);
}

/**
 * Attaches initial interactive event listeners to permanent DOM elements.
 */
function bindStaticEvents() {
    openAddBtn.addEventListener("click", openAddModal);

    closeModalBtn.addEventListener("click", closeFormModal);
    cancelFormBtn.addEventListener("click", closeFormModal);
    modalOverlay.addEventListener("click", e => {
        if (e.target === modalOverlay) closeFormModal();
    });

    closeDetails.addEventListener("click", closeDetailsModal);
    detailsModal.addEventListener("click", e => {
        if (e.target === detailsModal) closeDetailsModal();
    });

    confirmBtn.addEventListener("click", executeConfirmedAction);
    cancelBtn.addEventListener("click", () => {
        confirmModal.style.display = "none";
        pendingAction = null;
    });

    searchInput.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
    conditionFilter.addEventListener("change", applyFilters);
}

/**
 * Replaces system underscores with spaces and title cases text string values.
 * @param {string} value - The raw system string label.
 * @returns {string} The formatted user-friendly label string.
 */
function formatLabel(value) {
    if (!value) return "";
    return value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Formats an ISO date string into a standard localized DMY format.
 * @param {string} iso - The ISO structured date string (YYYY-MM-DD).
 * @returns {string} The converted date string (DD/MM/YYYY).
 */
function formatDate(iso) {
    if (!iso) return "—";
    const [year, month, day] = iso.split("-");
    return `${day}/${month}/${year}`;
}

/**
 * Converts a numeric value into South African Rand currency string structure.
 * @param {number} value - The raw financial number format.
 * @returns {string} The formatted currency string.
 */
function formatCurrency(value) {
    if (value == null) return "—";
    return new Intl.NumberFormat("en-ZA", {
        style: "currency", currency: "ZAR"
    }).format(value);
}

/**
 * Maps system status states to specific CSS utility class identifiers.
 * @param {string} status - The system status text state.
 * @returns {string} The matched CSS class name.
 */
function statusClass(status) {
    const map = {
        ACTIVE:   "good",
        INACTIVE: "warning",
        RETIRED:  "danger",
    };
    return map[status] ?? "";
}

/**
 * Handles presentation logic for displaying temporary success notification messages.
 * @param {string} message - The text content to display within notification element.
 */
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = "block";
    successMessage.classList.add("visible");
    setTimeout(() => {
        successMessage.classList.remove("visible");
        setTimeout(() => (successMessage.style.display = "none"), 400);
    }, 3000);
}