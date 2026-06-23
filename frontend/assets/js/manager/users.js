import { getUserById } from "../../../services/userService.js";
import { API_BASE_URL } from "../config.js";


/**
 * GetUser details by ID
 * Display all user details on the dashboard
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

            } else {
                profileInitial.textContent = `${managerData.firstName[0].toUpperCase()}`;
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
});


