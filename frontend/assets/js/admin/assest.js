// ========================================================
// ASSET MANAGEMENT DATABASE SYNC LAYER & EVENT DISPATCHER
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:8080/api/v1/assets";

    // UI Elements Selection
    const tableBody = document.getElementById("assets-table-body");
    const assetModal = document.getElementById("asset-modal-overlay");
    const openModalBtn = document.getElementById("open-add-modal-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const cancelFormBtn = document.getElementById("cancel-form-btn");
    const crudForm = document.getElementById("asset-crud-form");
    const modalTitle = document.getElementById("modal-form-title");

    // Form input references
    const formIdField = document.getElementById("form-asset-id");
    const formTitle = document.getElementById("form-title");
    const formCategory = document.getElementById("form-category");
    const formSerial = document.getElementById("form-serial");
    const formDate = document.getElementById("form-date");
    const formCost = document.getElementById("form-cost");
    const formCondition = document.getElementById("form-condition");
    const formLocation = document.getElementById("form-location");

    // Dynamic Filter References
    const searchInput = document.getElementById("asset-search-input");
    const categorySelect = document.getElementById("filter-category-select");

    let assetWorkspaceData = []; // Local cache copy holding rows array

    // 1. READ OPERATION: Fetch all assets array from Server
    async function loadAssetsInventoryFromServer() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to receive data");
            assetWorkspaceData = await response.json();
            renderAssetsTableRows(assetWorkspaceData);
        } catch (error) {
            console.error("Error reading backend array metrics:", error);
            // Table remains populated with HTML fallback rows if server is down
        }
    }

    // 2. RENDER MAP ENGINE: Generates Live Responsive Rows with Backend Images
    function renderAssetsTableRows(dataArray) {
        if (!tableBody) return;
        tableBody.innerHTML = ""; // Clear out stale data columns

        dataArray.forEach(asset => {
            const tr = document.createElement("tr");
            tr.dataset.id = asset.assetId;

            // Define clean fallback categorization chips
            let tagColor = "font-blue";
            if (asset.category === "Photography") tagColor = "font-purple";
            if (asset.category === "Furniture") tagColor = "font-green";

            // Match conditions cleanly
            let statusClass = "chip-success";
            if (asset.condition.toLowerCase() === "excellent") statusClass = "chip-excellent";
            if (asset.condition.toLowerCase() === "fair") statusClass = "chip-warning";
            if (asset.condition.toLowerCase() === "damaged") statusClass = "chip-danger";

            // IMPORTANT PATH SETUP: Build your server host absolute path for images
            const serverImageHost = "../../.."; // Adjust prefix folder levels as needed
            const completeImagePath = `${asset.photoPath}`;

            tr.innerHTML = `
            <td>
              <div class="flex-meta-cell">
                <!-- LIVE IMAGE FRAME CONTEXT HOOK -->
                <div class="table-img-frame">
                  <img src="${completeImagePath}" 
                       alt="${asset.title}" 
                       onerror="this.onerror=null; this.src='../../../assets/images/default_asset.jpg';">
                </div>
                <div>
                  <span class="cell-primary-title">${asset.title}</span>
                  <span class="cell-sub-label">Asset ID #${asset.assetId}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="stacked-cell-labels">
                <span class="cell-data-text"><i class="fa-solid fa-barcode"></i> ${asset.serialNumber}</span>
                <span class="cell-tag-chip ${tagColor}">${asset.category}</span>
              </div>
            </td>
            <td>
              <span class="cell-data-text"><i class="fa-solid fa-location-dot"></i> ${asset.location}</span>
            </td>
            <td>
              <div class="stacked-cell-labels">
                <span class="cell-primary-title">R${Number(asset.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <span class="cell-sub-label">Acq: ${asset.acquisitionDate}</span>
              </div>
            </td>
            <td>
              <span class="status-chip ${statusClass}">${asset.condition}</span>
            </td>
            <td>
              <div class="row-actions-group">
                <button class="row-action-btn edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="row-action-btn delete"><i class="fa-solid fa-trash-can"></i></button>
              </div>
            </td>
        `;
            tableBody.appendChild(tr);
        });
    }


    // Modal Display Triggers
    const showModal = () => assetModal.classList.remove("modal-hidden");
    const hideModal = () => {
        assetModal.classList.add("modal-hidden");
        crudForm.reset();
        formIdField.value = "";
    };

    if (openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            modalTitle.textContent = "Add System Asset";
            showModal();
        });
    }
    [closeModalBtn, cancelFormBtn].forEach(b => b?.addEventListener("click", hideModal));

    // 3. EVENT DELEGATION: Handle Inline Grid Click Actions
    if (tableBody) {
        tableBody.addEventListener("click", async (e) => {
            const row = e.target.closest("tr");
            if (!row) return;
            const assetId = row.dataset.id;

            // HANDLE INLINE LIVE REMOVAL (DELETE)
            if (e.target.closest(".delete")) {
                if (confirm(`Confirm permanent deletion of Asset Registry Record #${assetId}?`)) {
                    try {
                        const response = await fetch(`${API_URL}/${assetId}`, { method: "DELETE" });
                        if (response.ok) {
                            row.remove();
                            assetWorkspaceData = assetWorkspaceData.filter(a => a.assetId != assetId);
                        }
                    } catch (err) { console.error("Could not delete record on server:", err); }
                }
            }

            // HANDLE CONTEXT PRE-POPULATION (UPDATE/EDIT CLICK)
            if (e.target.closest(".edit")) {
                const targetObj = assetWorkspaceData.find(a => a.assetId == assetId);
                if (!targetObj) return;

                modalTitle.textContent = `Edit Asset Properties (#${assetId})`;
                formIdField.value = targetObj.assetId;
                formTitle.value = targetObj.title;
                formCategory.value = targetObj.category;
                formSerial.value = targetObj.serialNumber;
                formDate.value = targetObj.acquisitionDate;
                formCost.value = targetObj.cost;
                formCondition.value = targetObj.condition;
                formLocation.value = targetObj.location;

                showModal();
            }
        });
    }

    // 4. FORM SUBMISSION WORKFLOW: Execute POST or PUT methods
    if (crudForm) {
        crudForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const payload = {
                title: formTitle.value,
                category: formCategory.value,
                serialNumber: formSerial.value,
                acquisitionDate: formDate.value,
                cost: parseFloat(formCost.value),
                location: formLocation.value,
                condition: formCondition.value,
                photoPath: `/photos/default_path.jpg`
            };

            const activeId = formIdField.value;

            try {
                if (activeId) {
                    // Trigger PUT operation for existing asset updates
                    const response = await fetch(`${API_URL}/${activeId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...payload, assetId: parseInt(activeId) })
                    });
                    // if (response.ok) loadAssetsInventoryFromServer();

                    if (response.ok) {
                    // Extract the newly updated asset object returned from your API
                        const updatedAsset = await response.json();
                    // Update your local array cache instantly so your client-side filters stay in sync
                        assetWorkspaceData = assetWorkspaceData.map(asset => 
                            asset.assetId == activeId ? updatedAsset : asset
                        );
                    // Re-render the table with the modified local cache array
                        renderAssetsTableRows(assetWorkspaceData);
                    }
                } else {
                    // Trigger POST operation for new additions
                    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    // if (response.ok) loadAssetsInventoryFromServer();

                    if (response.ok) {
                    // If your API returns the newly created object, grab it
                        const newAsset = await response.json();
                        assetWorkspaceData.push(newAsset);
                        renderAssetsTableRows(assetWorkspaceData);
                    }
                }
                hideModal();
            } catch (err) { console.error("Failed to commit form changes onto remote server:", err); }
        });
    }

    
    // 5. CLIENT SIDE REALTIME LOOKUP (Search and filter logic)
    function executeLocalQueryFilters() {
        const query = searchInput.value.toLowerCase();
        const cat = categorySelect.value.toLowerCase(); //Convert selected dropdown index value to lowercase

        const filtered = assetWorkspaceData.filter(asset => {
            const matchesSearch = 
                (asset.title && asset.title.toLowerCase().includes(query) ||
                (asset.serialNumber && asset.serialNumber.toLowerCase().includes(query)) ||
                (asset.location && asset.location.toLowerCase().includes(query)));

            const assetCategoryNormalized = asset.category ? asset.category.toLowerCase() : ""; 
            const matchesCat = cat === "all" || assetCategoryNormalized === cat;
            return matchesSearch && matchesCat;
        });
        renderAssetsTableRows(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", executeLocalQueryFilters);
    if (categorySelect) categorySelect.addEventListener("change", executeLocalQueryFilters);

    // Initial load execution call on frame bootstrap mount
    loadAssetsInventoryFromServer();
});
