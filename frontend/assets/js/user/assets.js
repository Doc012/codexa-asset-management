import {
    getAllAssets,
} from "../../../services/assetService.js";

import { API_BASE_URL } from "../config.js";
import { createLoan } from "../../../services/loanService.js";





/**
 * This is for The User viewing assets in their dashboard
 * The user can also see the total number of assets
 */
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("user-asset-table-body");
    const assetCounter = document.getElementById("totalAssets");

    try {
        const assets = await getAllAssets();
        const slicedAssets = assets.slice(0, 4);
        tableBody.innerHTML = "";

        const totalAssets = assets.length;
        if (assetCounter) {
            assetCounter.textContent = totalAssets;
        }

        slicedAssets.forEach(asset => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${asset.title}</td>
                <td>${asset.category}</td>
                <td>${asset.condition}</td>
                <td>
                    <img src="${asset.photoPath} alt="Asset Image" style="width: 80px; height: auto;"/>
                </td>
            `;

            tableBody.appendChild(row);

        });

    } catch (error) {
        console.error("Failed to render ASSETS", error);
        tableBody.innerHTML = `<tr><td colspan = "4" style="color: red";> Error: ${error.message}</td></tr>`;
    }

});

/**
 * Assets page for Staff
 * Allows the user to view available assets and request a loan
 */
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("assetsTableBody");

    try {
        const assets = await getAllAssets();
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
                <td>${asset.condition}</td>
                <td>
                    <img src="${asset.photoPath}" alt="Asset Image" style="width: 80px; height: auto;"/>
                </td>
                <td>${asset.assetStatus}</td>
                <td>
                    <button class="request-btn" data-id="${asset.assetId}" ${isLoaned ? "disabled" : ""}>${isLoaned ? "Unavailable" : "Request Loan"}</button>
                </td>
            `;

            const requestButton = row.querySelector(".request-btn");

            if (requestButton && !isLoaned) {
                requestButton.addEventListener("click", () => {
                    showConfirmationModal(async () => {
                        await requestLoan(asset.assetId);
                    });
                });
            }


            tableBody.appendChild(row);

        });

    } catch (error) {
        console.error("Failed to render ASSETS", error);
        tableBody.innerHTML = `<tr><td colspan = "4" style="color: red";> Error: ${error.message}</td></tr>`;
    }

});

/**
 * This is for confirmation of a loan request
 */
function showConfirmationModal(onConfirm) {
    const modal = document.getElementById("btnConfirmation");

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
 * REQUEST A loan on an asset that is available
 */

const requestLoan = async (assetId) => {
    const userData = {
        userId: 4,
        assetId: assetId
    };

    try {
        createLoan(userData);
    } catch (error) {
        console.log("Error: " + error)
    }
};
