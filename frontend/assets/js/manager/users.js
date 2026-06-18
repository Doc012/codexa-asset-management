import { getUserById } from "../../../services/userService.js";
import { API_BASE_URL } from "../config.js";


/**
 * GetUser by ID
 */
document.addEventListener("DOMContentLoaded", async () => {
    const managerElement = document.querySelector(".ledger-title");
    const profileImage = document.querySelector(".profile-image")
    const profileInitial = document.querySelector(".profile-initial")

    try {
        const managerId = 8;
        const managerData = await getUserById(managerId);

        if (managerData) {

            if (managerElement) {
                managerElement.textContent = `${managerData.firstName}'s Operational board`;
            }

        }

        if (profileImage && profileInitial) {
            if (managerData.picUrl !== null) {
                profileImage.src = managerData.picUrl;
                // profileInitial.style.display = "none";
            } else {
                profileInitial.textContent = `${managerData.firstName[0].toUpperCase()}`;
                // profileImage.style.display = "none";
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
});


