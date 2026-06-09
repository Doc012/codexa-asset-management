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
                <td>${asset.acquistionDate}</td>
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