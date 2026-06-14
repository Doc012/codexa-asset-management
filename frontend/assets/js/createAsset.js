import { createAsset } from "../../services/assetService.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create-asset-form");
    const message = document.getElementById("message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // stop page reload

        // ✅ Collect form data
        const assetData = {
            title: document.getElementById("title").value,
            category: document.getElementById("category").value,
            serialNumber: document.getElementById("serialNumber").value,
            acquisitionDate: document.getElementById("acquisitionDate").value,
            cost: parseFloat(document.getElementById("cost").value),
            location: document.getElementById("location").value,
            condition: document.getElementById("condition").value,
            photoPath: document.getElementById("photoPath").value
        };

        try {
            // ✅ Call API
            const result = await createAsset(assetData);

            console.log("Asset created:", result);

            message.style.color = "green";
            message.textContent = "✅ Asset created successfully!";

            // ✅ Reset form
            form.reset();

            // ✅ Optional: Redirect back to assets list
            setTimeout(() => {
                window.location.href = "assets.html";
            }, 1500);

        } catch (error) {
            console.error("Error creating asset:", error);

            message.style.color = "red";
            message.textContent = `❌ Error: ${error.message}`;
        }
    });
});