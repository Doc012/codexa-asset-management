document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:8080/api/v1/assets";

    const tableBody = document.getElementById("assets-table-body");
    const assetModal = document.getElementById("asset-modal-overlay");
    const openModalBtn = document.getElementById("open-add-modal-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const cancelFormBtn = document.getElementById("cancel-form-btn");
    const crudForm = document.getElementById("asset-crud-form");
    const modalTitle = document.getElementById("modal-form-title");

    const formIdField = document.getElementById("form-asset-id");
    const formTitle = document.getElementById("form-title");
    const formCategory = document.getElementById("form-category");
    const formSerial = document.getElementById("form-serial");
    const formDate = document.getElementById("form-date");
    const formCost = document.getElementById("form-cost");
    const formCondition = document.getElementById("form-condition");
    const formPhoto = document.getElementById("form-photo");
    const formLocation = document.getElementById("form-location");

    const searchInput = document.getElementById("asset-search-input");
    const categorySelect = document.getElementById("filter-category-select");
    const conditionSelect = document.getElementById("conditionFilter");

    let assetWorkspaceData = [];

    /**
     * Fetches the complete list of assets from the backend server.
     * Updates the local cache array and triggers the table re-rendering.
     * @async
     * @function loadAssetsInventoryFromServer
     * @throws {Error} If the HTTP response status code is not ok.
     */
    async function loadAssetsInventoryFromServer() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch assets");
            assetWorkspaceData = await response.json();
            renderAssetsTableRows(assetWorkspaceData);
        } catch (error) {
            console.error("Error loading assets:", error);
        }
    }

    /**
     * Generates and inserts HTML table rows into the DOM based on the provided asset data array.
     * Handles style alterations for retired assets and falls back to default images on load failure.
     * @function renderAssetsTableRows
     * @param {Array<Object>} dataArray - Collection of asset entities to be displayed in the UI table.
     */
    function renderAssetsTableRows(dataArray) {
        tableBody.innerHTML = "";

        dataArray.forEach(asset => {
            const tr = document.createElement("tr");
            tr.dataset.id = asset.assetId;

            const isRetired = asset.status === "RETIRED";

            if (isRetired) {
                tr.style.opacity = "0.5";
                tr.style.backgroundColor = "#f5f5f566";
            }

            const completeImagePath = asset.photoPath ? `http://localhost:8080${asset.photoPath}` : "../../../assets/images/default_asset.jpg";

            tr.innerHTML = `
            <td>
              <div class="flex-meta-cell">
                <div>
                  <span class="cell-primary-title">${asset.title}</span>
                </div>
              </div>
            </td>

            <td>
                <div class="table-img-frame">
                  <img src="${completeImagePath}"
                    alt="${asset.title}"
                    onerror="this.onerror=null; this.src='../../../assets/images/default_asset.jpg';">
                </div>
            </td>

            <td>
              <div class="stacked-cell-labels">
                <span class="cell-tag-chip">${asset.category}</span>
              </div>
            </td>

            <td>
              <span class="cell-data-text"> ${asset.location} </span>
            </td>

            <td>
                <span class="status-chip ${
                    asset.status === "AVAILABLE" ? "chip-success" :
                    asset.status === "LOANED" ? "chip-warning" :
                    "chip-retired"
                }">
                    ${asset.assetStatus || asset.status}
                </span>
            </td>

            <td>
                <span class="cell-data-text">${asset.condition || "N/A"}</span>
            </td>

            <td>
              <div class="row-actions-group">
                <button class="row-action-btn edit">Edit</button>
                ${
                    isRetired
                    ? `<button class="row-action-btn restore">Restore</button>`
                    : `<button class="row-action-btn retire">Retire</button>`
                }
              </div>
            </td>
            `;

            tableBody.appendChild(tr);
        });
    }

    /**
     * Removes hidden CSS classes from the asset management modal component to display it.
     * @function showModal
     */
    const showModal = () => assetModal.classList.remove("modal-hidden");

    /**
     * Adds hidden CSS classes to the modal component, resets input values, and clears persistent identifier variables.
     * @function hideModal
     */
    const hideModal = () => {
        assetModal.classList.add("modal-hidden");
        crudForm.reset();
        formIdField.value = "";
    };

    openModalBtn?.addEventListener("click", () => {
        modalTitle.textContent = "Add Asset";
        showModal();
    });

    [closeModalBtn, cancelFormBtn].forEach(btn => btn?.addEventListener("click", hideModal));

    tableBody.addEventListener("click", async (e) => {
        const row = e.target.closest("tr");
        if (!row) return;

        const assetId = row.dataset.id;

        if (e.target.closest(".retire")) {
            if (confirm(`Retire Asset #${assetId}?`)) {
                try {
                    const res = await fetch(`${API_URL}/${assetId}/retire`, { method: "PUT" });
                    if (!res.ok) {
                        console.error("Retire failed:", res.status);
                        return;
                    }
                    loadAssetsInventoryFromServer();
                } catch (err) {
                    console.error("Retire error:", err);
                }
            }
        }

        if (e.target.closest(".restore")) {
            try {
                const res = await fetch(`${API_URL}/${assetId}/restore`, { method: "PUT" });
                if (!res.ok) {
                    console.error("Restore failed:", res.status);
                    return;
                }
                loadAssetsInventoryFromServer();
            } catch (err) {
                console.error("Restore error:", err);
            }
        }

        if (e.target.closest(".edit")) {
            const asset = assetWorkspaceData.find(a => a.assetId == assetId);

            formIdField.value = asset.assetId;
            formTitle.value = asset.title;
            formCategory.value = asset.category;
            formSerial.value = asset.serialNumber;
            formDate.value = asset.acquisitionDate;
            formCost.value = asset.cost;
            formCondition.value = asset.condition;
            formLocation.value = asset.location;

            modalTitle.textContent = `Edit Asset #${assetId}`;
            showModal();
        }
    });

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
                photoPath: null
            };

            const activeId = formIdField.value;

            try {
                if (activeId) {
                    const response = await fetch(`${API_URL}/${activeId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...payload, assetId: parseInt(activeId) })
                    });

                    if (response.ok) {
                        const updatedAsset = await response.json();
                        assetWorkspaceData = assetWorkspaceData.map(asset => 
                            asset.assetId == activeId ? updatedAsset : asset
                        );
                        renderAssetsTableRows(assetWorkspaceData);
                    }
                } else {
                    const formData = new FormData();
                    formData.append(
                        "asset",
                        new Blob([JSON.stringify(payload)], { type: "application/json" })
                    );
                    if (formPhoto.files[0]) {
                        formData.append("file", formPhoto.files[0]);
                    }
                    const response = await fetch(API_URL, {
                        method: "POST",
                        body: formData
                    });

                    if (response.ok) {
                        const newAsset = await response.json();
                        assetWorkspaceData.push(newAsset);
                        renderAssetsTableRows(assetWorkspaceData);
                    }
                }
                hideModal();
            } catch (err) { 
                console.error("Failed to commit form changes onto remote server:", err); 
            }
        });
    }

    /**
     * Filters the central workspace data array in real time matching parameters inside user input fields.
     * Evaluates full text string searches alongside standard dropdown parameters for category and physical health state properties.
     * @function executeLocalQueryFilters
     */
    function executeLocalQueryFilters() {
        const query = searchInput.value.toLowerCase();
        const cat = categorySelect.value.toLowerCase().replace(" ", "_");
        const cond = conditionSelect.value.toLowerCase();

        const filtered = assetWorkspaceData.filter(asset => {
            const matchesSearch = 
                (asset.title && asset.title.toLowerCase().includes(query)) ||
                (asset.serialNumber && asset.serialNumber.toLowerCase().includes(query)) ||
                (asset.location && asset.location.toLowerCase().includes(query));

            const assetCategoryNormalized = asset.category ? asset.category.toLowerCase() : ""; 
            const matchesCat = cat === "all" || assetCategoryNormalized === cat;

            const assetConditionNormalized = asset.condition ? asset.condition.toLowerCase() : "";
            const matchesCond = cond === "" || assetConditionNormalized === cond;

            return matchesSearch && matchesCat && matchesCond;
        });
        renderAssetsTableRows(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", executeLocalQueryFilters);
    if (categorySelect) categorySelect.addEventListener("change", executeLocalQueryFilters);
    if (conditionSelect) conditionSelect.addEventListener("change", executeLocalQueryFilters);

    loadAssetsInventoryFromServer();
});

/**
 * Allows a user to see the asset and its details
 * @param {*} asset 
 */
const openAssetModal = (asset) => {
    const modal = document.getElementById("assetDetailsModal");
    const body = document.getElementById("assetDetailsBody");

    body.innerHTML = `
        <div class="asset-details-card">

            <img src="${asset.photoPath}" alt="asset image"/>

            <h2>${asset.title}</h2>

            <p><strong>Category:</strong> ${asset.category}</p>
            <p><strong>Status:</strong> ${asset.assetStatus}</p>
            <p><strong>Condition:</strong> ${asset.condition}</p>
            <p><strong>Cost:</strong> ${asset.cost}</p>
            <p><strong>Serial Number:</strong> ${asset.serialNumber}</p>
            <p><strong>Location:</strong> ${asset.location}</p>

        </div>
    `;

    modal.style.display = "flex";
};

const modalCloseBtn = async () => {
    const modal = document.getElementById("assetDetailsModal");
    const closeBtn = document.getElementById("closeAssetModal");

    if (!closeBtn) return;

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

};