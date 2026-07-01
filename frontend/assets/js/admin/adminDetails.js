import { getUserById } from "../../../services/userService.js";
import { API_BASE_URL } from "../config.js";
import { updateAllUserDetails } from "../../../services/userService.js";
import { getUser } from "../authContext.js";


/**
 * GetUser by ID
 * We get user details using their ID for UI
 */
document.addEventListener("DOMContentLoaded", async () => {
    await userDetails();
    await updateDetails();

});

const userId = getUser().id;

const userDetails = async () => {
    const profileImage = document.querySelector(".profile-image")
    const profileInitial = document.querySelector(".profile-initial")


    try {
        const userData = await getUserById(userId);

        if (userData) {
            if (profileImage && profileInitial) {
                if (userData.picUrl !== null) {
                    profileImage.src = userData.picUrl;
                } else {
                    profileInitial.textContent = `${userData.firstName[0].toUpperCase()}${userData.lastName[0].toUpperCase()}`;
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
const updateDetails = async () => {
    try {
        const currentUser = await getUserById(userId);

        document.getElementById("firstName").value = currentUser.firstName;
        document.getElementById("lastName").value = currentUser.lastName;
        document.getElementById("email").value = currentUser.email;
        document.getElementById("department").value = currentUser.department;

        const form = document.getElementById("profile-form");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const userData = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                email: document.getElementById("email").value,
                department: currentUser.department,
                picUrl: currentUser.picUrl
            };

            try {
                showConfirmationModal(async () => {
                    await updateAllUserDetails(userId, userData);
                });

            } catch (error) {
                console.error(error);
            }
        });

    } catch (error) {
        console.error(error);
    }
};

function showConfirmationModal(onConfirm) {
    const modal = document.getElementById("updated-details");
    const title = modal.querySelector("h2");
    const message = modal.querySelector("p");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    modal.style.display = "flex";

    confirmBtn.onclick = async () => {
        try {
            await onConfirm();

            title.textContent = "Success";
            message.textContent = "Your details have been updated successfully.";

            confirmBtn.style.display = "none";
            cancelBtn.textContent = "Close";

            cancelBtn.onclick = () => {
                modal.style.display = "none";
                title.textContent = "Update your details";
                message.textContent = "Are you sure you want update your details?";
                confirmBtn.style.display = "inline-block";
                cancelBtn.textContent = "Cancel";
            };

        } catch (err) {
            console.error(err);
        }
    };

    cancelBtn.onclick = () => {
        modal.style.display = "none";
    };
}
