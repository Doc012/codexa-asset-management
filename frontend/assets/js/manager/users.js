import { getUserById } from "../../../services/userService.js";
import { API_BASE_URL } from "../config.js";
import { updateAllUserDetails } from "../../../services/userService.js";


/**
 * GetUser details by ID
 * Display all user details on the dashboard
 */
document.addEventListener("DOMContentLoaded", async () => {
    await userDetails();
    await updateUserDetails();
});

const userDetails = async()=> {
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
};


const updateUserDetails = async()=> {

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
                console.log("Hello There!")
            } catch (error) {
                console.log(error);
            }

        });

    } catch (error) {
        console.log(error);
    }

};



