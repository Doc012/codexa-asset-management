import { getAllAssets } from "../../services/assetService.js";
import { getAllLoans } from "../../services/loanService.js";
import { API_BASE_URL } from "./config.js";

/**
 * Admin dashboard to view the total assets
 */
document.addEventListener("DOMContentLoaded", async() => {
    const assetCounter = document.getElementById("totalAssetsCard");

    if (assetCounter) {
        try {
            const assets = await getAllAssets();
            const totalAssets = assets.length;
            
            // 2. Set the text directly (no need to clear innerHTML first)
            assetCounter.textContent = totalAssets;

        } catch (error) {
            console.error("Failed to render ASSETS", error);
            assetCounter.textContent = "Error";
        }
    }
});
