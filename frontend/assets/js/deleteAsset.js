import { deleteAsset } from "../../services/assetService";

document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;

        // const confirmDelete = confirm("Are you sure you want to delete this asset?");
        // if (!confirmDelete) return;

        try {
            await deleteAsset(id); // ✅ use your service

            // ✅ Remove row instantly (better UX)
            e.target.closest("tr").remove();

            alert("Asset deleted successfully!");
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete asset: " + error.message);
        }
    });
});