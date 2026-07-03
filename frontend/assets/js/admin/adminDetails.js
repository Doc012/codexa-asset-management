import { getUserById } from "../../../services/userService.js";
import { API_BASE_URL } from "../config.js";
import { updateUserProfile } from "../../../services/userService.js";
import { getUser } from "../authContext.js";
import { changePassword } from "../../../services/userService.js";


/**
 * GetUser by ID
 * We get user details using their ID for UI
 */
document.addEventListener("DOMContentLoaded", async () => {
    await userDetails();
    await updateDetails();
    await updatePassword();

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
                    await updateUserProfile(userId, userData);
                });

            } catch (error) {
                console.error(error);
            }
        });

    } catch (error) {
        console.error(error);
    }
};

/**
 * UPDATE User password on the settings
 */
const updatePassword = () => {
    const form = document.getElementById("security-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById("sec-current").value;
        const newPassword = document.getElementById("sec-new").value;
        const confirmPassword = document.getElementById("sec-confirm").value;

        let validationError = null;

        if (newPassword.length < 8) {
            validationError = "New password must be at least 8 characters.";
        } else if (newPassword !== confirmPassword) {
            validationError = "New password and confirmation do not match.";
        } else if (newPassword === currentPassword) {
            validationError = "New password must be different from the current password.";
        }

        if (validationError) {
            showValidationError(validationError);
            return;
        }

        const passwordRequest = {
            currentPassword,
            newPassword
        };

        showConfirmationModal(async () => {
            await changePassword(userId, passwordRequest);
            form.reset();
        }, {
            confirmTitle: "Update your password",
            confirmMessage: "Are you sure you want to change your password?",
            successMessage: "Your password has been updated successfully.",
            errorTitle: "Password Update Failed"
        });
    });
};

function showValidationError(errorMessage) {
    const modal = document.getElementById("updated-details");
    const title = modal.querySelector("h2");
    const message = modal.querySelector("p");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    modal.style.display = "flex";
    title.textContent = "Password Update Failed";
    message.textContent = errorMessage;
    confirmBtn.style.display = "none";
    cancelBtn.textContent = "Close";
    cancelBtn.onclick = () => {
        modal.style.display = "none";
    };
}

function showConfirmationModal(onConfirm, options = {}) {
    const {
        confirmTitle = "Update your details",
        confirmMessage = "Are you sure you want to update your details?",
        successMessage = "Your details have been updated successfully.",
        errorTitle = "Update Failed",
    } = options;

    const modal = document.getElementById("updated-details");
    const title = modal.querySelector("h2");
    const message = modal.querySelector("p");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    modal.style.display = "flex";
    title.textContent = confirmTitle;
    message.textContent = confirmMessage;
    confirmBtn.style.display = "inline-block";
    confirmBtn.textContent = "Confirm";
    confirmBtn.disabled = false;
    cancelBtn.textContent = "Cancel";

    const resetModal = () => {
        modal.style.display = "none";
    };

    confirmBtn.onclick = async () => {
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Processing...";

        try {
            await onConfirm();

            title.textContent = "Success";
            message.textContent = successMessage;
            confirmBtn.style.display = "none";
            cancelBtn.textContent = "Close";
            cancelBtn.onclick = resetModal;

        } catch (err) {
            console.error(err);

            title.textContent = errorTitle;
            message.textContent = err.message || "Something went wrong. Please try again.";
            confirmBtn.disabled = false;
            confirmBtn.style.display = "none";
            cancelBtn.textContent = "Close";
            cancelBtn.onclick = resetModal;
        }
    };

    cancelBtn.onclick = () => {
        modal.style.display = "none";
    };
}
