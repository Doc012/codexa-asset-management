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

    const formIdField = document.getElementById("form-asset-id");
    const formTitle = document.getElementById("form-title");
    const formCategory = document.getElementById("form-category");
    const formSerial = document.getElementById("form-serial");
    const formDate = document.getElementById("form-date");
    const formCost = document.getElementById("form-cost");
    const formCondition = document.getElementById("form-condition");
    const formPhoto = document.getElementById("form-photo");
    const formLocation = document.getElementById("form-location");

    // Dynamic Filter References
    const searchInput = document.getElementById("asset-search-input");
    const categorySelect = document.getElementById("filter-category-select");

    let assetWorkspaceData = [];


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


    function renderAssetsTableRows(dataArray) {
        tableBody.innerHTML = "";

        dataArray.forEach(asset => {
            const tr = document.createElement("tr");
            tr.dataset.id = asset.assetId;

            const isRetired = asset.status === "RETIRED";

            // Grey out retired
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
                    ${asset.assetStatus}
                </span>
            </td>

            <td>
              <div class="row-actions-group">

                <button class="row-action-btn edit">
                    Edit
                </button>

                ${
                    isRetired
                    ? `<button class="row-action-btn restore">
                        Retired
                       </button>`
                    : `<button class="row-action-btn retire">
                        Retire
                       </button>`
                }

              </div>
            </td>
            `;

            tableBody.appendChild(tr);
        });
    }


    // MODAL
    const showModal = () => assetModal.classList.remove("modal-hidden");
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


    // TABLE ACTIONS: RETIRE / RESTORE / EDIT
    tableBody.addEventListener("click", async (e) => {
        const row = e.target.closest("tr");
        if (!row) return;

        const assetId = row.dataset.id;

        // ✅ RETIRE
        if (e.target.closest(".retire")) {
            console.log("Retire clicked:", assetId); // DEBUG

            if (confirm(`Retire Asset #${assetId}?`)) {
                try {
                    const res = await fetch(`${API_URL}/${assetId}/retire`, { method: "PUT" });

                    if (!res.ok) {
                        console.error("Retire failed:", res.status);
                        return;
                    }

                    console.log("Retire successful");
                    loadAssetsInventoryFromServer();

                } catch (err) {
                console.error("Retire error:", err);
            }
    }
}

        // ✅ RESTORE
        if (e.target.closest(".restore")) {
            console.log("Restore clicked:", assetId);

            try {
                const res = await fetch(`${API_URL}/${assetId}/restore`, { method: "PUT" });

                if (!res.ok) {
                    console.error("Restore failed:", res.status);
                    return;
                }

                console.log("Restore successful");
                loadAssetsInventoryFromServer();

            } catch (err) {
                console.error("Restore error:", err);
            }
}

        // ✅ EDIT
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
                // photoPath: `/photos/default_path.jpg`
                photoPath: null
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
                    // const response = await fetch(API_URL, {
                    //     method: "POST",
                    //     headers: { "Content-Type": "application/json" },
                    //     body: JSON.stringify(payload)
                    // });
                    // if (response.ok) loadAssetsInventoryFromServer();
                    const formData = new FormData();
                    // JSON part
                    formData.append(
                        "asset",
                        new Blob([JSON.stringify(payload)], { type: "application/json" })
                    );
                    // File part
                    if (formPhoto.files[0]) {
                        formData.append("file", formPhoto.files[0]);
                    }
                    const response = await fetch(API_URL, {
                        method: "POST",
                        body: formData
                    });
                    /**
                     * 
                     */
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
