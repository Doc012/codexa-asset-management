import {
    getAllAssets,
    getAssetsByCategory,
    getAssetsByCondition
} from "../../../services/assetService.js";

import { createLoan } from "../../../services/loanService.js";

let currentCondition = "ALL";
let currentCategory = "ALL";


document.addEventListener("DOMContentLoaded", async () => {
    await viewAllAssets();
    setupFilters();
});


/**
 * Load all filters
 */
const viewAllAssets = async () => {
    try {
        const assets = await getAllAssets();
        renderAssets(assets);
    } catch (error) {
        console.error("Failed to load assets:", error);
    }
};


/**
 * Apply filters
 */
const applyFilters = async () => {
    try {
        let assets = await getAllAssets();

        if (currentCondition !== "ALL") {
            assets = assets.filter(a => a.condition === currentCondition);
        }

        if (currentCategory !== "ALL") {
            assets = assets.filter(a => a.category === currentCategory);
        }

        renderAssets(assets);
    } catch (error) {
        console.error("Filter error:", error);
    }
};

/**
 * Filters
 * @returns 
 */
const setupFilters = () => {
    const conditionDropDown = document.querySelector("#conditionFilter");
    const categoryDropDown = document.querySelector("#categoryFilter");

    if (!conditionDropDown || !categoryDropDown) {
        console.error("Filter dropdowns not found in DOM");
        return;
    }

    conditionDropDown.addEventListener("change", async (e) => {
        currentCondition = e.target.value;
        await applyFilters();
    });

    categoryDropDown.addEventListener("change", async (e) => {
        currentCategory = e.target.value;
        await applyFilters();
    });
};


/**
 * Populates the assets table
 * @param {} assets 
 * @returns 
 */
const renderAssets = (assets) => {
    const tableBody = document.getElementById("assets-table-body");

    if (!tableBody) {
        console.error("Table body not found");
        return;
    }

    tableBody.innerHTML = "";

    assets.forEach(asset => {
        const row = document.createElement("tr");

        const isLoaned = asset.assetStatus === "LOANED";

        if (isLoaned) {
            row.classList.add("row-disabled");
        }

        row.innerHTML = `
            <td>${asset.title}</td>
            <td>${asset.category}</td>
            <td>${asset.serialNumber}</td>
            <td>${asset.acquisitionDate}</td>
            <td>${asset.cost}</td>
            <td>${asset.location}</td>
            <td>${asset.condition}</td>
            <td>
                <img src="${asset.photoPath}" alt="Asset Image" style="width:80px;" />
            </td>
            <td>${asset.assetStatus}</td>
            <td>
                <button class="request-btn"
                    data-id="${asset.assetId}"
                    ${isLoaned ? "disabled" : ""}>
                    ${isLoaned ? "Unavailable" : "Request Loan"}
                </button>
            </td>
        `;

        const btn = row.querySelector(".request-btn");

        if (btn && !isLoaned) {
            btn.addEventListener("click", () => {
                showConfirmationModal(async () => {
                    await requestLoan(asset.assetId);
                    console.log("Loan requested");
                });
            });
        }

        tableBody.appendChild(row);
    });
};


/**
 * Allows a user to confirm a loan request
 * @param {} onConfirm 
 * @returns 
 */
function showConfirmationModal(onConfirm) {
    const modal = document.getElementById("btnConfirmation");

    if (!modal) {
        console.error("Modal not found");
        return;
    }

    modal.style.display = "flex";
    document.getElementById("confirmBtn").onclick = async () => {
        await onConfirm();
        modal.style.display = "none";
    };

    document.getElementById("cancelBtn").onclick = () => {
        modal.style.display = "none";
    };
}


/**
 * Requests a loan
 * @param {*} assetId 
 */
const requestLoan = async (assetId) => {
    try {
        await createLoan({
            userId: 4,
            assetId: assetId
        });
    } catch (error) {
        console.log("Error:", error);
    }
};