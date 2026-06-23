import { getUserById } from "../../../services/userService.js";
import { API_BASE_URL } from "../config.js";
import { updateAllUserDetails } from "../../../services/userService.js";


/**
 * GetUser by ID
 * We get user details using their ID for UI
 */
document.addEventListener("DOMContentLoaded", async () => {
    await userDetails();
    await updateDetails();

});

const userDetails = async () => {
    const userName = document.querySelector(".welcome-card h1")
    const profileImage = document.querySelector(".profile-image")
    const profileInitial = document.querySelector(".profile-initial")


    try {
        const userId = 8;
        const userData = await getUserById(userId);

        if (userData) {
            if (userName) {
                userName.textContent = `Welcome back, ${userData.firstName}`
            }
            if (profileImage && profileInitial) {
                if (userData.picUrl !== null) {
                    profileImage.src = userData.picUrl;
                } else {
                    profileInitial.textContent = `${userData.firstName[0].toUpperCase()}`;
                }
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


/**
 * UPDATE User details oin the settings
 */
const updateDetails = async() => {
    const userId = 3;
    try {

        const currentUser = await getUserById(userId);
        const form = document.querySelector("#profile-form");

        const submitForm = form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const userData = {
                "firstName": document.querySelector("#firstName").value,
                "lastName": document.querySelector("#lastName").value,
                "email": document.querySelector("#email").value,
                "department": currentUser.department,
                "picUrl": currentUser.picUrl
            }
            try {
                const updateUserDetails = await updateAllUserDetails(userId, userData);
            } catch (error) {
                console.log(error);
            }

        });

    } catch (error) {
        console.log(error);
    }

};

