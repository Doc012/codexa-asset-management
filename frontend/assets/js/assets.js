import { getAllAssets } from "../../services/assetService.js";
import { getAllLoans } from "../../services/loanService.js";
import { API_BASE_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", async() => {
    const assetCounter = document.getElementById("totalAssetsCard");

    if (assetCounter) {
        try {
            const assets = await getAllAssets();
            const totalAssets = assets.length;
            
            assetCounter.textContent = totalAssets;

        } catch (error) {
            console.error("Failed to render ASSETS", error);
            assetCounter.textContent = "Error";
        }
    }
});
