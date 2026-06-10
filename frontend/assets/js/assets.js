import { getAllAssets } from "../../services/assetService.js";

// get all assets
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("asset-table-body");

    try {
        const { getAllAssets } = await import("../../services/assetService.js")
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
                <td>${asset.photoPath}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch(error) {
        console.error("Failed to render ASSETS", error);
        tableBody.innerHTML = `<tr><td colspan = "8" style="color: red";> Error: ${error.message}</td></tr>`;
    }
})



// create asset
import { createAsset } from "../../services/assetService.js";

const form = document.getElementById("create-asset-form");
form.addEventListener("submit", async(e) => {
    e.preventDefault;

    const formData = new FormData(form);

    const assetData = {
        title: formData.get("title"),
        category: formData.get("category"),
        serialNumber: formData.get("serialNumber"),
        acquisitionDate: formData.get("acquisitionDate"),
        cost: parseFloat(formData.get("cost")),
        location: formData.get("location"),
        condition: formData.get("condition"),
        photoPath: formData.get("photoPath"),
    };

    try {
        await createAsset(assetData);
        alert("Asset Created Successfully");

        window.location.href = "assets.html"
    } catch(error){
        alert(error.message)
    }
})