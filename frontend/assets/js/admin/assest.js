
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

            // const completeImagePath = `http://localhost:8080${asset.photoPath}`;
            const completeImagePath = asset.photoPath ? `http://localhost:8080${asset.photoPath}` : "../../../assets/images/default_asset.jpg";


            tr.innerHTML = `
            <td>
              <div class="flex-meta-cell">
                <div class="table-img-frame">
                  <img src="${completeImagePath}"
                    alt="${asset.title}" 
                    onerror="this.onerror=null; this.src='../../../assets/images/default_asset.jpg';">

                </div>
                <div>
                  <span class="cell-primary-title">${asset.title}</span>
                  
                </div>
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
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>

                ${
                    isRetired
                    ? `<button class="row-action-btn restore">
                        <i class="fa-solid fa-rotate-left"></i>
                       </button>`
                    : `<button class="row-action-btn retire">
                        <i class="fa-solid fa-box-archive"></i>
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

    // ========================================================
    // CREATE / UPDATE
    // ========================================================
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

        const id = formIdField.value;

        try {
            if (id) {
                await fetch(`${API_URL}/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                const formData = new FormData();
                formData.append("asset", new Blob([JSON.stringify(payload)], { type: "application/json" }));

                if (formPhoto.files[0]) {
                    formData.append("file", formPhoto.files[0]);
                }

                await fetch(API_URL, { method: "POST", body: formData });
            }

            hideModal();
            loadAssetsInventoryFromServer();

        } catch (err) {
            console.error("Save failed:", err);
        }
    });

    // ========================================================
    // SEARCH + FILTER
    // ========================================================
    function executeLocalQueryFilters() {
        const query = searchInput.value.toLowerCase();
        const cat = categorySelect.value.toLowerCase();

        const filtered = assetWorkspaceData.filter(asset => {
            const matchesSearch =
                asset.title?.toLowerCase().includes(query) ||
                asset.serialNumber?.toLowerCase().includes(query) ||
                asset.location?.toLowerCase().includes(query);

            const matchesCat =
                cat === "all" || asset.category?.toLowerCase() === cat;

            return matchesSearch && matchesCat;
        });

        renderAssetsTableRows(filtered);
    }

    searchInput?.addEventListener("input", executeLocalQueryFilters);
    categorySelect?.addEventListener("change", executeLocalQueryFilters);

    // ========================================================
    // INIT
    // ========================================================
    loadAssetsInventoryFromServer();

});