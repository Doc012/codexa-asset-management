import {
    getAllAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    retireAsset,
} from "../../../services/assetService.js";

// ─── State ────────────────────────────────────────────────────────────────────
let allAssets     = [];
let pendingAction = null; // { type: 'retire'|'delete', id }

// ─── Static DOM refs (exist in HTML from page load) ───────────────────────────
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

// ─── Injected field accessors (elements added by injectMissingFormFields) ─────
// Always access via these helpers — the elements don't exist until DOMContentLoaded.
const field = {
    assetStatus: () => document.getElementById("form-asset-status"),
};

// ─── Bootstrap ────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
    injectMissingFormFields();
    await loadAndRender();
    bindStaticEvents();
});

/**
 * The HTML form has no assetStatus select or photo URL input.
 * We inject them after the Condition row so the script owns the full field set
 * without requiring HTML changes.
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

// ─── Data loading ─────────────────────────────────────────────────────────────
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

// ─── Table rendering ──────────────────────────────────────────────────────────
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

// ─── Asset Details Modal ──────────────────────────────────────────────────────
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

function closeDetailsModal() {
    detailsModal.style.display = "none";
    detailsBody.innerHTML = "";
}

function detailRow(label, value) {
    return `
        <div class="asset-detail-row">
            <span class="detail-label">${label}</span>
            <span class="detail-value">${value ?? '—'}</span>
        </div>
    `;
}

// ─── Add / Edit Form Modal ────────────────────────────────────────────────────
function openAddModal() {
    modalTitle.textContent = "Add System Asset";
    assetForm.reset();
    formAssetId.value = "";
    field.assetStatus().value = "";
    syncFormButtons("add");
    showFormModal();
}

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

function showFormModal()  { modalOverlay.classList.remove("modal-hidden"); }
function closeFormModal() { modalOverlay.classList.add("modal-hidden"); assetForm.reset(); }

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

// ─── CRUD handlers ────────────────────────────────────────────────────────────
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

function requestConfirmation(type, id) {
    pendingAction = { type, id };
    confirmModal.style.display = "flex";
}

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

// ─── Payload builder ──────────────────────────────────────────────────────────
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

// ─── Filtering / search ───────────────────────────────────────────────────────
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

// ─── Static event bindings ────────────────────────────────────────────────────
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

// ─── Utilities ────────────────────────────────────────────────────────────────
function formatLabel(value) {
    if (!value) return "";
    return value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
}

function formatDate(iso) {
    if (!iso) return "—";
    const [year, month, day] = iso.split("-");
    return `${day}/${month}/${year}`;
}

function formatCurrency(value) {
    if (value == null) return "—";
    return new Intl.NumberFormat("en-ZA", {
        style: "currency", currency: "ZAR"
    }).format(value);
}

function statusClass(status) {
    const map = {
        ACTIVE:   "good",
        INACTIVE: "warning",
        RETIRED:  "danger",
    };
    return map[status] ?? "";
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = "block";
    successMessage.classList.add("visible");
    setTimeout(() => {
        successMessage.classList.remove("visible");
        setTimeout(() => (successMessage.style.display = "none"), 400);
    }, 3000);
}