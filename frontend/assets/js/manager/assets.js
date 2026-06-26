import {
    getAllAssets,
    getAssetsByCategory,
    getAssetsByCondition
} from "../../../services/assetService.js";

import { createLoan } from "../../../services/loanService.js";
import { getUser } from "../authContext.js"

let currentCondition = "ALL";
let currentCategory = "ALL";
let searchQuery = "";


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

        if (searchQuery && searchQuery.length > 0) {
            assets = assets.filter(a => {
                return (
                    (a.title && a.title.toLowerCase().includes(searchQuery)) ||
                    (a.category && a.category.toLowerCase().includes(searchQuery)) ||
                    (a.serialNumber && a.serialNumber.toLowerCase().includes(searchQuery)) ||
                    (a.location && a.location.toLowerCase().includes(searchQuery))
                );
            });
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
    const searchInput = document.querySelector("#assetSearch");

    if (!conditionDropDown || !categoryDropDown || !searchInput) {
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

     searchInput.addEventListener("input", async (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
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
            <td>
                <div class="table-img-frame">
                    <img class="asset-img" src="${asset.photoPath}" alt="Asset Image" />
                </div>
            </td>
            <td>${asset.category}</td>
            <td>${asset.assetStatus}</td>
            <td>${asset.condition}</td>
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
            userId: getUser().id,
            assetId: assetId
        });
    } catch (error) {
        console.log("Error:", error);
    }
};