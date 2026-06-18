import {
    getAllAssets,
    deleteAsset,
    createAsset,
} from "../../../services/assetService.js";

import { API_BASE_URL } from "../config.js";
import { createLoan } from "../../../services/loanService.js";

// get all assets
// document.addEventListener("DOMContentLoaded", async () => {
//     const tableBody = document.getElementById("asset-table-body");

//     try {
//         const assets = await getAllAssets();
//         tableBody.innerHTML = "";

//         assets.forEach(asset => {
//             const row = document.createElement("tr");

//             row.innerHTML = `
//                 <td>${asset.assetId}</td>
//                 <td>${asset.title}</td>
//                 <td>${asset.category}</td>
//                 <td>${asset.serialNumber}</td>
//                 <td>${asset.acquisitionDate}</td>
//                 <td>${asset.cost}</td>
//                 <td>${asset.location}</td>
//                 <td>${asset.condition}</td>
//                 <td>${asset.photoPath}</td>
//                 <td>
//                     <button class="delete-btn" data-id="${asset.assetId}">Delete</button>
//                 </td>
//             `;

//             // Attach event listener PER button
//             const deleteBtn = row.querySelector(".delete-btn");
//             deleteBtn.addEventListener("click", async () => {
//                 const id = deleteBtn.dataset.id;
//                 const confirmDelete = confirm("Are you sure you want to delete this asset?");
//                 if (!confirmDelete) return;
//                 try {
//                     await deleteAsset(id); // use your service
//                     alert("Asset deleted successfully");
//                     // Remove row instantly instead of reload
//                     row.remove();

//                 } catch (error) {
//                     alert("Failed to delete asset");
//                 }
//             });
//             tableBody.appendChild(row);
//         });

//     } catch (error) {
//         console.error("Failed to render ASSETS", error);
//         tableBody.innerHTML = `<tr><td colspan = "10" style="color: red";> Error: ${error.message}</td></tr>`;
//     }
// });



/**
 * This is for The User viewing assets
 */
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("asset-table-body");


    try {
        const assets = await getAllAssets();
        tableBody.innerHTML = "";

        assets.forEach(asset => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${asset.title}</td>
                <td>${asset.category}</td>
                <td>${asset.serialNumber}</td>
                <td>${asset.acquisitionDate}</td>
                <td>${asset.cost}</td>
                <td>${asset.location}</td>
                <td>${asset.condition}</td>
                <td>
                    <img src="${asset.photoPath}" alt="Asset Image" style="width: 80px; height: auto;"/>
                </td>
                <td>${asset.assetStatus}</td>
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
 */
// document.addEventListener("DOMContentLoaded", async () => {
//     const tableBody = document.getElementById("assetsTableBody");

//     try {
//         const assets = await getAllAssets();
//         tableBody.innerHTML = "";

//         assets.forEach(asset => {
//             const row = document.createElement("tr");

//             row.innerHTML = `
//                 <td>${asset.title}</td>
//                 <td>${asset.category}</td>
//                 <td>${asset.condition}</td>
//                 <td>
//                     <img src="${asset.photoPath} alt="Asset Image" style="width: 80px; height: auto;"/>
//                 </td>
//                 <td>
//                     <button class="request-btn" data-id="${asset.assetId}">Request Loan</button>
//                 </td>
//             `;

//             const requestButton = row.querySelector(".request-btn");
//             requestButton.addEventListener("click", async () => {
//                 await requestLoan(asset.assetId);
//             });

//             tableBody.appendChild(row);

//         });

//     } catch (error) {
//         console.error("Failed to render ASSETS", error);
//         tableBody.innerHTML = `<tr><td colspan = "4" style="color: red";> Error: ${error.message}</td></tr>`;
//     }

// });

// /**
//  * This is used to create an asset:
//  */
// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.getElementById("create-asset-form");
//     const message = document.getElementById("message");

//     form.addEventListener("submit", async (e) => {
//         e.preventDefault(); // stop page reload

//         // Collect form data
//         const assetData = {
//             title: document.getElementById("title").value,
//             category: document.getElementById("category").value,
//             serialNumber: document.getElementById("serialNumber").value,
//             acquisitionDate: document.getElementById("acquisitionDate").value,
//             cost: parseFloat(document.getElementById("cost").value),
//             location: document.getElementById("location").value,
//             condition: document.getElementById("condition").value,
//             photoPath: document.getElementById("photoPath").value
//         };

//         try {
//             // Call API
//             const result = await createAsset(assetData);

//             console.log("Asset created:", result);

//             message.style.color = "green";
//             message.textContent = "Asset created successfully!";

//             // Reset form
//             form.reset();

//             // Optional: Redirect back to assets list
//             setTimeout(() => {
//                 window.location.href = "assets.html";
//             }, 1500);

//         } catch (error) {
//             console.error("Error creating asset:", error);
//             message.style.color = "red";
//             message.textContent = `Error: ${error.message}`;
//         }
//     });
// });


// /**
//  * REQUEST A loan on an asset
//  */

// const requestLoan = async (assetId) => {
//     const userData = {
//         userId: 4,
//         assetId: assetId
//     };

//     try {
//         createLoan(userData);
//     } catch (error) {
//         console.log("Error: " + error)
//     }
// };
