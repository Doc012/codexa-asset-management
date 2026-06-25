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
                profileInitial.textContent = `${managerData.firstName[0].toUpperCase()}`;
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
};


document.addEventListener("DOMContentLoaded", async()=> {
    try {

        const currentUser = await getUserById(userId);
        console.log(currentUser);
        const form = document.querySelector("#profile-form");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const userData = {
                "firstName": document.querySelector("#firstName").value,
                "lastName": document.querySelector("#lastName").value,
                "email": document.querySelector("#email").value,
                "department": currentUser.department,
                "picUrl": currentUser.picUrl
            }

            console.log(userData);
            try {
                await updateAllUserDetails(userId, userData);
                console.log("Hello There!")
            } catch (error) {
                console.log(error);
            }

        });

    } catch (error) {
        console.log(error);
    }

});



