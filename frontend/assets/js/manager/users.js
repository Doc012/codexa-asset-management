import { getUserById } from "../../../services/userService.js";
import { API_BASE_URL } from "../config.js";
import { updateAllUserDetails } from "../../../services/userService.js";
import { getUser } from "../authContext.js"




/**
 * GetUser details by ID
 * Display all user details on the dashboard
 */
document.addEventListener("DOMContentLoaded", async () => {
    await userDetails();
});

const userId = getUser().id;

const userDetails = async()=> {
    const managerElement = document.querySelector(".ledger-title");
    const profileImage = document.querySelector(".profile-image")
    const profileInitial = document.querySelector(".profile-initial")

    try {
        const managerData = await getUserById(userId);

        if (managerData) {

            if (managerElement) {
                managerElement.textContent = `${managerData.firstName}'s Operational board`;
            }
        }

        if (profileImage && profileInitial) {
            if (managerData.picUrl !== null) {
                profileImage.src = managerData.picUrl;

            } else {
                profileInitial.textContent = `${managerData.firstName[0].toUpperCase()}${managerData.lastName[0].toUpperCase()}`;
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
};






